package com.project.uvmp.controller;

import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.ngo.VolunteerRecognitionResponse;
import com.project.uvmp.dto.volunteer.VolunteerDashboardResponse;
import com.project.uvmp.dto.volunteer.VolunteerProfileUpdateRequest;
import com.project.uvmp.dto.volunteer.VolunteerResponse;
import com.project.uvmp.dto.volunteer.VolunteerTaskDto;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.*;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;
    private final TaskRepository taskRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final VolunteerRecognitionRepository recognitionRepository;
    private final NgoRepository ngoRepository;
    private final DistrictRepository districtRepository;

    public VolunteerController(VolunteerRepository volunteerRepository,
                               TaskRepository taskRepository,
                               TaskAssignmentRepository taskAssignmentRepository,
                               VolunteerRecognitionRepository recognitionRepository,
                               NgoRepository ngoRepository,
                               DistrictRepository districtRepository) {
        this.volunteerRepository = volunteerRepository;
        this.taskRepository = taskRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.recognitionRepository = recognitionRepository;
        this.ngoRepository = ngoRepository;
        this.districtRepository = districtRepository;
    }

    private Volunteer resolveVolunteer(UserDetailsImpl userDetails) {
        if (userDetails != null) {
            Optional<Volunteer> byUser = volunteerRepository.findByUserId(userDetails.getId());
            if (byUser.isPresent()) return byUser.get();

            Optional<Volunteer> byEmail = volunteerRepository.findByEmail(userDetails.getEmail());
            if (byEmail.isPresent()) return byEmail.get();
        }
        return volunteerRepository.findAll().stream().findFirst().orElse(null);
    }

    // Step 9: Volunteer Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<VolunteerDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        VolunteerDashboardResponse resp = new VolunteerDashboardResponse();
        resp.setVolunteerId(volunteer.getId());
        resp.setName(volunteer.getName());
        resp.setEmail(volunteer.getEmail());
        resp.setPhone(volunteer.getPhone());
        resp.setAvailability(volunteer.getAvailability());
        resp.setReliabilityScore(volunteer.getReliabilityScore());
        resp.setSkills(volunteer.getSkills());
        resp.setNgoId(volunteer.getNgoId());
        resp.setDistrictId(volunteer.getDistrictId());

        if (volunteer.getNgoId() != null) {
            ngoRepository.findById(volunteer.getNgoId())
                    .ifPresent(ngo -> resp.setNgoName(ngo.getName()));
        }
        if (volunteer.getDistrictId() != null) {
            districtRepository.findById(volunteer.getDistrictId())
                    .ifPresent(d -> resp.setDistrictName(d.getName()));
        }

        List<TaskAssignment> assignments = taskAssignmentRepository.findByVolunteerId(volunteer.getId());
        resp.setTotalAssignedTasks(assignments.size());

        long activeCount = assignments.stream()
                .filter(a -> "ASSIGNED".equalsIgnoreCase(a.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(a.getStatus()))
                .count();
        resp.setActiveTasks(activeCount);

        long completedCount = assignments.stream()
                .filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus()))
                .count();
        resp.setCompletedTasks(completedCount);

        double totalHours = assignments.stream()
                .mapToDouble(a -> a.getHoursLogged() != null ? a.getHoursLogged() : 0.0)
                .sum();
        resp.setTotalHoursLogged(Math.round(totalHours * 10.0) / 10.0);

        List<VolunteerRecognition> recognitions = recognitionRepository.findByVolunteerIdOrderByIssuedAtDesc(volunteer.getId());
        resp.setBadgesCount(recognitions.size());

        // Gamification Tier logic
        double reliability = volunteer.getReliabilityScore() != null ? volunteer.getReliabilityScore() : 80.0;
        if (totalHours >= 40.0 && reliability >= 90.0) {
            resp.setTierBadge("PLATINUM_HERO");
            resp.setNextTierProgress(100.0);
        } else if (totalHours >= 20.0 && reliability >= 80.0) {
            resp.setTierBadge("GOLD_RESPONDER");
            resp.setNextTierProgress(Math.min(100.0, Math.round(((totalHours - 20.0) / 20.0) * 100.0)));
        } else if (totalHours >= 8.0) {
            resp.setTierBadge("SILVER_VOLUNTEER");
            resp.setNextTierProgress(Math.min(100.0, Math.round(((totalHours - 8.0) / 12.0) * 100.0)));
        } else {
            resp.setTierBadge("BRONZE_RECRUIT");
            resp.setNextTierProgress(Math.min(100.0, Math.round((totalHours / 8.0) * 100.0)));
        }

        // Check for active on-duty shift
        assignments.stream()
                .filter(a -> "IN_PROGRESS".equalsIgnoreCase(a.getStatus()) || "ASSIGNED".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .ifPresent(active -> {
                    taskRepository.findById(active.getTaskId()).ifPresent(task -> {
                        VolunteerDashboardResponse.ActiveAssignmentDto activeDto = new VolunteerDashboardResponse.ActiveAssignmentDto();
                        activeDto.setAssignmentId(active.getId());
                        activeDto.setTaskId(task.getId());
                        activeDto.setTaskTitle(task.getTitle());
                        activeDto.setUrgency(task.getUrgency() != null ? task.getUrgency().name() : "MEDIUM");
                        activeDto.setStatus(active.getStatus());
                        activeDto.setAssignedAt(active.getAssignedAt());
                        activeDto.setCheckInTime(active.getCheckInTime());
                        activeDto.setLocation(task.getLocationAddress());
                        activeDto.setLatitude(task.getLatitude());
                        activeDto.setLongitude(task.getLongitude());
                        resp.setActiveAssignment(activeDto);
                    });
                });

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    // Step 10: Task Discovery & Self-Assignment
    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<VolunteerTaskDto>>> getTasks(
            @RequestParam(value = "filter", defaultValue = "all") String filter,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        List<TaskAssignment> myAssignments = taskAssignmentRepository.findByVolunteerId(volunteer.getId());
        Map<Long, TaskAssignment> assignmentMap = myAssignments.stream()
                .collect(Collectors.toMap(TaskAssignment::getTaskId, a -> a, (a1, a2) -> a1));

        Map<Long, String> districtNames = districtRepository.findAll().stream()
                .collect(Collectors.toMap(District::getId, District::getName));
        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName));

        List<Task> allTasks = taskRepository.findAll();
        List<VolunteerTaskDto> result = new ArrayList<>();

        for (Task t : allTasks) {
            boolean isAssigned = assignmentMap.containsKey(t.getId());
            TaskAssignment ta = assignmentMap.get(t.getId());

            if ("assigned".equalsIgnoreCase(filter) && !isAssigned) {
                continue;
            }
            if ("completed".equalsIgnoreCase(filter) && (!isAssigned || !"COMPLETED".equalsIgnoreCase(ta.getStatus()))) {
                continue;
            }
            if ("available".equalsIgnoreCase(filter)) {
                // Not assigned to me, and task still needs volunteers and not completed
                if (isAssigned || t.getStatus() == TaskStatus.COMPLETED) {
                    continue;
                }
            }

            VolunteerTaskDto dto = new VolunteerTaskDto();
            dto.setId(t.getId());
            dto.setTitle(t.getTitle());
            dto.setDescription(t.getDescription());
            dto.setStatus(t.getStatus() != null ? t.getStatus().name() : "OPEN");
            dto.setUrgency(t.getUrgency() != null ? t.getUrgency().name() : "MEDIUM");
            dto.setLocation(t.getLocationAddress());
            dto.setLatitude(t.getLatitude());
            dto.setLongitude(t.getLongitude());
            dto.setVolunteersNeeded(t.getVolunteersNeeded());
            dto.setVolunteersAssigned(t.getVolunteersAssigned());
            dto.setRequiredSkills(t.getRequiredSkills());
            dto.setDistrictId(t.getDistrictId());
            dto.setDistrictName(districtNames.getOrDefault(t.getDistrictId(), "General District"));
            dto.setNgoId(t.getNgoId());
            dto.setNgoName(ngoNames.getOrDefault(t.getNgoId(), "Coordinating NGO"));
            dto.setCreatedAt(t.getCreatedAt());
            dto.setDeadline(t.getEndTime() != null ? t.getEndTime() : t.getStartTime());

            dto.setIsAssignedToMe(isAssigned);
            if (isAssigned && ta != null) {
                dto.setAssignmentId(ta.getId());
                dto.setAssignmentStatus(ta.getStatus());
                dto.setAssignedAt(ta.getAssignedAt());
                dto.setCheckInTime(ta.getCheckInTime());
                dto.setCheckOutTime(ta.getCheckOutTime());
                dto.setHoursLogged(ta.getHoursLogged());
                dto.setMatchScore(ta.getMatchScore());
            } else {
                dto.setAssignmentStatus("NOT_ASSIGNED");
            }

            result.add(dto);
        }

        // Sort: assigned active first, then urgency
        result.sort((a, b) -> {
            boolean aActive = Boolean.TRUE.equals(a.getIsAssignedToMe()) && !"COMPLETED".equalsIgnoreCase(a.getAssignmentStatus());
            boolean bActive = Boolean.TRUE.equals(b.getIsAssignedToMe()) && !"COMPLETED".equalsIgnoreCase(b.getAssignmentStatus());
            if (aActive != bActive) return aActive ? -1 : 1;
            return b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0;
        });

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<VolunteerTaskDto>> getTaskDetail(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }

        Optional<TaskAssignment> assignment = taskAssignmentRepository.findByTaskIdAndVolunteerId(taskId, volunteer.getId());

        VolunteerTaskDto dto = new VolunteerTaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus() != null ? task.getStatus().name() : "OPEN");
        dto.setUrgency(task.getUrgency() != null ? task.getUrgency().name() : "MEDIUM");
        dto.setLocation(task.getLocationAddress());
        dto.setLatitude(task.getLatitude());
        dto.setLongitude(task.getLongitude());
        dto.setVolunteersNeeded(task.getVolunteersNeeded());
        dto.setVolunteersAssigned(task.getVolunteersAssigned());
        dto.setRequiredSkills(task.getRequiredSkills());
        dto.setDistrictId(task.getDistrictId());
        dto.setNgoId(task.getNgoId());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setDeadline(task.getEndTime() != null ? task.getEndTime() : task.getStartTime());

        districtRepository.findById(task.getDistrictId())
                .ifPresent(d -> dto.setDistrictName(d.getName()));
        if (task.getNgoId() != null) {
            ngoRepository.findById(task.getNgoId())
                    .ifPresent(n -> dto.setNgoName(n.getName()));
        }

        if (assignment.isPresent()) {
            TaskAssignment ta = assignment.get();
            dto.setIsAssignedToMe(true);
            dto.setAssignmentId(ta.getId());
            dto.setAssignmentStatus(ta.getStatus());
            dto.setAssignedAt(ta.getAssignedAt());
            dto.setCheckInTime(ta.getCheckInTime());
            dto.setCheckOutTime(ta.getCheckOutTime());
            dto.setHoursLogged(ta.getHoursLogged());
            dto.setMatchScore(ta.getMatchScore());
        } else {
            dto.setIsAssignedToMe(false);
            dto.setAssignmentStatus("NOT_ASSIGNED");
        }

        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // 1-Click Self Assignment to Task
    @PostMapping("/tasks/{taskId}/accept")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerTaskDto>> acceptTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }

        if (taskAssignmentRepository.existsByTaskIdAndVolunteerId(taskId, volunteer.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You are already assigned to this mission"));
        }

        if (task.getStatus() == TaskStatus.COMPLETED || task.getStatus() == TaskStatus.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("This mission is no longer accepting volunteers"));
        }

        TaskAssignment assignment = new TaskAssignment(taskId, volunteer.getId(), "ASSIGNED", 85.0);
        taskAssignmentRepository.save(assignment);

        int currentAssigned = task.getVolunteersAssigned() != null ? task.getVolunteersAssigned() : 0;
        task.setVolunteersAssigned(currentAssigned + 1);
        if (task.getStatus() == TaskStatus.OPEN) {
            task.setStatus(TaskStatus.ASSIGNED);
        }
        taskRepository.save(task);

        volunteer.setAvailability("BUSY");
        volunteerRepository.save(volunteer);

        return getTaskDetail(taskId, userDetails);
    }

    // Step 10: Field Check-In
    @PostMapping("/tasks/{taskId}/check-in")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerTaskDto>> checkIn(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        TaskAssignment assignment = taskAssignmentRepository.findByTaskIdAndVolunteerId(taskId, volunteer.getId())
                .orElse(null);
        if (assignment == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You are not assigned to this mission"));
        }

        if (assignment.getCheckInTime() != null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Already checked in to this mission"));
        }

        LocalDateTime now = LocalDateTime.now();
        assignment.setCheckInTime(now);
        assignment.setStatus("IN_PROGRESS");
        taskAssignmentRepository.save(assignment);

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null && task.getStatus() != TaskStatus.COMPLETED) {
            task.setStatus(TaskStatus.IN_PROGRESS);
            taskRepository.save(task);
        }

        volunteer.setAvailability("BUSY");
        volunteerRepository.save(volunteer);

        return getTaskDetail(taskId, userDetails);
    }

    // Step 10: Field Check-Out & Hour Logging
    @PostMapping("/tasks/{taskId}/check-out")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerTaskDto>> checkOut(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        TaskAssignment assignment = taskAssignmentRepository.findByTaskIdAndVolunteerId(taskId, volunteer.getId())
                .orElse(null);
        if (assignment == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You are not assigned to this mission"));
        }

        if ("COMPLETED".equalsIgnoreCase(assignment.getStatus())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Already checked out of this mission"));
        }

        LocalDateTime now = LocalDateTime.now();
        assignment.setCheckOutTime(now);
        assignment.setStatus("COMPLETED");
        assignment.setCompletedAt(now);

        double hours = 2.0; // default realistic deployment shift if immediate checkout
        if (assignment.getCheckInTime() != null) {
            long minutes = Duration.between(assignment.getCheckInTime(), now).toMinutes();
            if (minutes > 15) {
                hours = Math.round((minutes / 60.0) * 10.0) / 10.0;
            }
        }
        assignment.setHoursLogged(hours);
        taskAssignmentRepository.save(assignment);

        // Update volunteer availability and reliability boost
        volunteer.setAvailability("AVAILABLE");
        double currentRel = volunteer.getReliabilityScore() != null ? volunteer.getReliabilityScore() : 85.0;
        volunteer.setReliabilityScore(Math.min(100.0, currentRel + 0.5));
        volunteerRepository.save(volunteer);

        // Update task if all volunteers finished
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            long completedAssignments = taskAssignmentRepository.findByTaskId(taskId).stream()
                    .filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus()))
                    .count();
            if (completedAssignments >= task.getVolunteersNeeded()) {
                task.setStatus(TaskStatus.COMPLETED);
                taskRepository.save(task);
            }
        }

        return getTaskDetail(taskId, userDetails);
    }

    // Step 11: Profile & Skills
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<VolunteerResponse>> getProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        String ngoName = "General Volunteers Pool";
        if (volunteer.getNgoId() != null) {
            ngoName = ngoRepository.findById(volunteer.getNgoId())
                    .map(Ngo::getName)
                    .orElse("General Volunteers Pool");
        }

        return ResponseEntity.ok(ApiResponse.success(VolunteerResponse.fromEntity(volunteer, ngoName)));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> updateProfile(
            @Valid @RequestBody VolunteerProfileUpdateRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        if (req.getPhone() != null) {
            volunteer.setPhone(req.getPhone());
        }
        if (req.getAvailability() != null) {
            volunteer.setAvailability(req.getAvailability().toUpperCase());
        }
        if (req.getSkills() != null) {
            volunteer.setSkills(req.getSkills());
        }
        if (req.getLatitude() != null) {
            volunteer.setLatitude(req.getLatitude());
        }
        if (req.getLongitude() != null) {
            volunteer.setLongitude(req.getLongitude());
        }

        volunteerRepository.save(volunteer);

        String ngoName = "General Volunteers Pool";
        if (volunteer.getNgoId() != null) {
            ngoName = ngoRepository.findById(volunteer.getNgoId())
                    .map(Ngo::getName)
                    .orElse("General Volunteers Pool");
        }

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", VolunteerResponse.fromEntity(volunteer, ngoName)));
    }

    // Step 11: Verifiable Certificates & Recognition
    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<List<VolunteerRecognitionResponse>>> getCertificates(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = resolveVolunteer(userDetails);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer profile not found"));
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName));

        List<VolunteerRecognition> recognitions = recognitionRepository.findByVolunteerIdOrderByIssuedAtDesc(volunteer.getId());
        List<VolunteerRecognitionResponse> responses = recognitions.stream()
                .map(r -> VolunteerRecognitionResponse.fromEntity(
                        r,
                        volunteer.getName(),
                        volunteer.getEmail(),
                        ngoNames.getOrDefault(r.getNgoId(), "Crisis Response Authority")
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
