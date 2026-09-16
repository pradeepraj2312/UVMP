package com.project.uvmp.controller;

import com.project.uvmp.dto.auth.ApprovalDecisionRequest;
import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.ngo.NgoDashboardResponse;
import com.project.uvmp.dto.ngo.RecognitionAwardRequest;
import com.project.uvmp.dto.ngo.VolunteerRecognitionResponse;
import com.project.uvmp.dto.task.TaskDetailResponse;
import com.project.uvmp.dto.task.TaskResponse;
import com.project.uvmp.dto.volunteer.VolunteerResponse;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.*;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NgoController {

    private final NgoRepository ngoRepository;
    private final TaskRepository taskRepository;
    private final VolunteerRepository volunteerRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final VolunteerRecognitionRepository recognitionRepository;
    private final IncidentRepository incidentRepository;
    private final DistrictRepository districtRepository;
    private final UserRepository userRepository;

    public NgoController(NgoRepository ngoRepository,
                         TaskRepository taskRepository,
                         VolunteerRepository volunteerRepository,
                         TaskAssignmentRepository taskAssignmentRepository,
                         VolunteerRecognitionRepository recognitionRepository,
                         IncidentRepository incidentRepository,
                         DistrictRepository districtRepository,
                         UserRepository userRepository) {
        this.ngoRepository = ngoRepository;
        this.taskRepository = taskRepository;
        this.volunteerRepository = volunteerRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.recognitionRepository = recognitionRepository;
        this.incidentRepository = incidentRepository;
        this.districtRepository = districtRepository;
        this.userRepository = userRepository;
    }

    private Ngo resolveNgo(UserDetailsImpl userDetails, Long requestedNgoId) {
        if (requestedNgoId != null) {
            return ngoRepository.findById(requestedNgoId).orElse(null);
        }
        if (userDetails != null) {
            Optional<Ngo> byUser = ngoRepository.findByUserId(userDetails.getId());
            if (byUser.isPresent()) return byUser.get();
        }
        return ngoRepository.findAll().stream().findFirst().orElse(null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<NgoDashboardResponse>> getNgoDashboard(
            @RequestParam(required = false) Long ngoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("NGO profile not registered or found."));
        }

        List<Task> assignedTasks = taskRepository.findByNgoIdOrderByCreatedAtDesc(ngo.getId());
        List<Volunteer> ngoVolunteers = volunteerRepository.findByNgoId(ngo.getId());
        if (ngoVolunteers.isEmpty()) {
            ngoVolunteers = volunteerRepository.findAll();
        }

        long activeTasks = assignedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.OPEN || t.getStatus() == TaskStatus.ASSIGNED || t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();

        long completedTasks = assignedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();

        long availableVols = ngoVolunteers.stream()
                .filter(v -> "AVAILABLE".equalsIgnoreCase(v.getAvailability()))
                .count();

        long recognitionsCount = recognitionRepository.countByNgoId(ngo.getId());

        List<TaskResponse> recentTasks = assignedTasks.stream()
                .limit(5)
                .map(t -> TaskResponse.fromEntity(t, ngo.getName()))
                .collect(Collectors.toList());

        NgoDashboardResponse resp = new NgoDashboardResponse();
        resp.setNgoId(ngo.getId());
        resp.setNgoName(ngo.getName());
        resp.setRegistrationStatus(ngo.getRegistrationStatus());
        resp.setContactInfo(ngo.getContactInfo());
        resp.setEmail(ngo.getEmail());
        resp.setPhone(ngo.getPhone());
        resp.setTotalAssignedTasks(assignedTasks.size());
        resp.setActiveTasks(activeTasks);
        resp.setCompletedTasks(completedTasks);
        resp.setTotalVolunteers(ngoVolunteers.size());
        resp.setAvailableVolunteers(availableVols);
        resp.setRecognitionsAwarded(recognitionsCount);
        resp.setRecentTasks(recentTasks);

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getNgoTasks(
            @RequestParam(required = false) Long ngoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        List<Task> tasks;
        if (ngo != null) {
            tasks = taskRepository.findByNgoIdOrderByCreatedAtDesc(ngo.getId());
            if (tasks.isEmpty()) {
                tasks = taskRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));

        List<TaskResponse> responseList = tasks.stream()
                .map(t -> TaskResponse.fromEntity(t, t.getNgoId() != null ? ngoNames.get(t.getNgoId()) : "Direct District Coordination"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseList));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskDetailResponse>> getTaskDetail(@PathVariable Long taskId) {
        return taskRepository.findById(taskId).map(task -> {
            String ngoName = task.getNgoId() != null
                    ? ngoRepository.findById(task.getNgoId()).map(Ngo::getName).orElse("Direct District Coordination")
                    : "Direct District Coordination";

            Incident inc = task.getIncidentId() != null
                    ? incidentRepository.findById(task.getIncidentId()).orElse(null)
                    : null;

            List<TaskAssignment> assignments = taskAssignmentRepository.findByTaskId(taskId);
            Map<Long, Volunteer> volMap = volunteerRepository.findAllById(
                    assignments.stream().map(TaskAssignment::getVolunteerId).collect(Collectors.toList())
            ).stream().collect(Collectors.toMap(Volunteer::getId, v -> v));

            List<TaskDetailResponse.AssignedVolunteerDto> assignedVolunteers = assignments.stream().map(a -> {
                Volunteer v = volMap.get(a.getVolunteerId());
                TaskDetailResponse.AssignedVolunteerDto dto = new TaskDetailResponse.AssignedVolunteerDto();
                dto.setAssignmentId(a.getId());
                dto.setVolunteerId(a.getVolunteerId());
                dto.setAssignmentStatus(a.getStatus());
                dto.setHoursLogged(a.getHoursLogged());
                dto.setAssignedAt(a.getAssignedAt());
                if (v != null) {
                    dto.setName(v.getName());
                    dto.setEmail(v.getEmail());
                    dto.setPhone(v.getPhone());
                    dto.setSkills(v.getSkills());
                    dto.setReliabilityScore(v.getReliabilityScore());
                }
                return dto;
            }).collect(Collectors.toList());

            TaskDetailResponse resp = TaskDetailResponse.fromEntity(task, ngoName, inc, assignedVolunteers);
            return ResponseEntity.ok(ApiResponse.success(resp));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Task not found with ID: " + taskId)));
    }

    @PostMapping("/tasks/{taskId}/assign")
    @Transactional
    public ResponseEntity<ApiResponse<TaskDetailResponse>> assignVolunteerToTask(
            @PathVariable Long taskId,
            @RequestParam Long volunteerId) {

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found with ID: " + taskId));
        }

        Volunteer volunteer = volunteerRepository.findById(volunteerId).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer not found with ID: " + volunteerId));
        }

        if (taskAssignmentRepository.existsByTaskIdAndVolunteerId(taskId, volunteerId)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Volunteer is already assigned to this mission."));
        }

        TaskAssignment assignment = new TaskAssignment(taskId, volunteerId, "ASSIGNED");
        taskAssignmentRepository.save(assignment);

        task.setVolunteersAssigned(task.getVolunteersAssigned() + 1);
        if (task.getStatus() == TaskStatus.OPEN) {
            task.setStatus(TaskStatus.ASSIGNED);
        }
        taskRepository.save(task);

        volunteer.setAvailability("BUSY");
        volunteerRepository.save(volunteer);

        return getTaskDetail(taskId);
    }

    @DeleteMapping("/tasks/{taskId}/unassign/{volunteerId}")
    @Transactional
    public ResponseEntity<ApiResponse<TaskDetailResponse>> unassignVolunteerFromTask(
            @PathVariable Long taskId,
            @PathVariable Long volunteerId) {

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found with ID: " + taskId));
        }

        Optional<TaskAssignment> assignment = taskAssignmentRepository.findByTaskIdAndVolunteerId(taskId, volunteerId);
        if (assignment.isPresent()) {
            taskAssignmentRepository.delete(assignment.get());
            task.setVolunteersAssigned(Math.max(0, task.getVolunteersAssigned() - 1));
            if (task.getVolunteersAssigned() == 0 && task.getStatus() == TaskStatus.ASSIGNED) {
                task.setStatus(TaskStatus.OPEN);
            }
            taskRepository.save(task);

            volunteerRepository.findById(volunteerId).ifPresent(v -> {
                v.setAvailability("AVAILABLE");
                volunteerRepository.save(v);
            });
        }

        return getTaskDetail(taskId);
    }

    @PatchMapping("/tasks/{taskId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {

        return taskRepository.findById(taskId).map(task -> {
            try {
                TaskStatus newStatus = TaskStatus.valueOf(status.toUpperCase());
                task.setStatus(newStatus);
                if (newStatus == TaskStatus.COMPLETED) {
                    task.setEndTime(LocalDateTime.now());
                    // Mark assignments completed and free volunteers
                    List<TaskAssignment> assignments = taskAssignmentRepository.findByTaskId(taskId);
                    for (TaskAssignment a : assignments) {
                        a.setStatus("COMPLETED");
                        a.setCompletedAt(LocalDateTime.now());
                        if (a.getHoursLogged() == null || a.getHoursLogged() == 0.0) {
                            a.setHoursLogged(6.0); // Standard relief shift hours
                        }
                        taskAssignmentRepository.save(a);

                        volunteerRepository.findById(a.getVolunteerId()).ifPresent(v -> {
                            v.setAvailability("AVAILABLE");
                            volunteerRepository.save(v);
                        });
                    }
                }
                Task saved = taskRepository.save(task);

                String ngoName = saved.getNgoId() != null
                        ? ngoRepository.findById(saved.getNgoId()).map(Ngo::getName).orElse(null)
                        : null;

                return ResponseEntity.ok(ApiResponse.success("Task status updated to " + newStatus,
                        TaskResponse.fromEntity(saved, ngoName)));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<TaskResponse>error("Invalid task status: " + status));
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Task not found with ID: " + taskId)));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<VolunteerResponse>>> getNgoVolunteers(
            @RequestParam(required = false) Long ngoId,
            @RequestParam(required = false) String scope,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        List<Volunteer> volunteers;

        if ("all".equalsIgnoreCase(scope)) {
            volunteers = volunteerRepository.findAll();
        } else if (ngo != null) {
            Set<Long> seenIds = new HashSet<>();
            volunteers = new ArrayList<>();
            // Volunteers associated with this NGO
            for (Volunteer v : volunteerRepository.findByNgoId(ngo.getId())) {
                if (seenIds.add(v.getId())) {
                    volunteers.add(v);
                }
            }
            // Volunteers residing in the NGO's operating district
            if (ngo.getDistrictId() != null) {
                for (Volunteer v : volunteerRepository.findByDistrictId(ngo.getDistrictId())) {
                    if (seenIds.add(v.getId())) {
                        volunteers.add(v);
                    }
                }
            }
            if (volunteers.isEmpty()) {
                volunteers = volunteerRepository.findAll();
            }
        } else {
            volunteers = volunteerRepository.findAll();
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));
        Map<Long, String> districtNames = districtRepository.findAll().stream()
                .collect(Collectors.toMap(District::getId, District::getName, (a, b) -> a));

        List<VolunteerResponse> responseList = volunteers.stream()
                .map(v -> VolunteerResponse.fromEntity(
                        v,
                        v.getNgoId() != null ? ngoNames.get(v.getNgoId()) : "Independent / Direct",
                        v.getDistrictId() != null ? districtNames.get(v.getDistrictId()) : "Unassigned Sector"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseList));
    }

    @PatchMapping("/volunteers/{id}/availability")
    public ResponseEntity<ApiResponse<VolunteerResponse>> updateVolunteerAvailability(
            @PathVariable Long id,
            @RequestParam String availability) {

        return volunteerRepository.findById(id).map(vol -> {
            vol.setAvailability(availability.toUpperCase());
            Volunteer saved = volunteerRepository.save(vol);
            String ngoName = saved.getNgoId() != null
                    ? ngoRepository.findById(saved.getNgoId()).map(Ngo::getName).orElse("Independent / Direct")
                    : "Independent / Direct";
            String districtName = saved.getDistrictId() != null
                    ? districtRepository.findById(saved.getDistrictId()).map(District::getName).orElse("Unassigned Sector")
                    : "Unassigned Sector";
            return ResponseEntity.ok(ApiResponse.success("Availability updated to " + availability,
                    VolunteerResponse.fromEntity(saved, ngoName, districtName)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Volunteer not found with ID: " + id)));
    }

    @GetMapping("/volunteers/pending")
    public ResponseEntity<ApiResponse<List<VolunteerResponse>>> getPendingVolunteers(
            @RequestParam(required = false) Long ngoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("NGO entity not recognized."));
        }

        List<Volunteer> allNgoVols = volunteerRepository.findByNgoId(ngo.getId());
        Map<Long, User> userMap = userRepository.findAllById(
                allNgoVols.stream().map(Volunteer::getUserId).filter(Objects::nonNull).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(User::getId, u -> u));

        String districtName = ngo.getDistrictId() != null
                ? districtRepository.findById(ngo.getDistrictId()).map(District::getName).orElse("General Sector")
                : "General Sector";

        List<VolunteerResponse> pending = allNgoVols.stream()
                .filter(v -> {
                    User u = userMap.get(v.getUserId());
                    return u != null && u.getStatus() == UserStatus.PENDING;
                })
                .map(v -> VolunteerResponse.fromEntity(
                        v,
                        ngo.getName(),
                        districtName,
                        "PENDING",
                        null
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PatchMapping("/volunteers/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> approveVolunteer(
            @PathVariable Long id,
            @RequestParam(required = false) Long ngoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("NGO entity not recognized."));
        }

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer record not found."));
        }

        // Strict ownership check: Must belong to this NGO
        if (!Objects.equals(volunteer.getNgoId(), ngo.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: You may only approve volunteer applications submitted to your own NGO."));
        }

        User user = userRepository.findById(volunteer.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User account for volunteer not found."));
        }

        user.setStatus(UserStatus.ACTIVE);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(null);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(
                "Volunteer registration approved successfully",
                VolunteerResponse.fromEntity(volunteer, ngo.getName(), null, "ACTIVE", null)
        ));
    }

    @PatchMapping("/volunteers/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> rejectVolunteer(
            @PathVariable Long id,
            @RequestParam(required = false) Long ngoId,
            @RequestBody(required = false) ApprovalDecisionRequest decisionReq,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("NGO entity not recognized."));
        }

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer record not found."));
        }

        // Strict ownership check
        if (!Objects.equals(volunteer.getNgoId(), ngo.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: You may only reject volunteer applications submitted to your own NGO."));
        }

        User user = userRepository.findById(volunteer.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User account for volunteer not found."));
        }

        String reason = (decisionReq != null && decisionReq.getReason() != null && !decisionReq.getReason().isBlank())
                ? decisionReq.getReason()
                : "Application declined by NGO coordinator.";

        user.setStatus(UserStatus.REJECTED);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(reason);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(
                "Volunteer registration rejected",
                VolunteerResponse.fromEntity(volunteer, ngo.getName(), null, "REJECTED", reason)
        ));
    }

    @GetMapping("/recognition")
    public ResponseEntity<ApiResponse<List<VolunteerRecognitionResponse>>> getRecognitions(
            @RequestParam(required = false) Long ngoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = resolveNgo(userDetails, ngoId);
        Long queryNgoId = ngo != null ? ngo.getId() : 1L;

        List<VolunteerRecognition> recognitions = recognitionRepository.findByNgoIdOrderByIssuedAtDesc(queryNgoId);
        if (recognitions.isEmpty()) {
            recognitions = recognitionRepository.findAll();
        }

        Map<Long, Volunteer> volMap = volunteerRepository.findAll().stream()
                .collect(Collectors.toMap(Volunteer::getId, v -> v, (a, b) -> a));
        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));

        List<VolunteerRecognitionResponse> responseList = recognitions.stream().map(r -> {
            Volunteer v = volMap.get(r.getVolunteerId());
            String vName = v != null ? v.getName() : "Volunteer #" + r.getVolunteerId();
            String vEmail = v != null ? v.getEmail() : "N/A";
            String nName = ngoNames.getOrDefault(r.getNgoId(), "Hope Relief Network");
            return VolunteerRecognitionResponse.fromEntity(r, vName, vEmail, nName);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseList));
    }

    @PostMapping("/recognition/award")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerRecognitionResponse>> awardRecognition(
            @Valid @RequestBody RecognitionAwardRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = volunteerRepository.findById(req.getVolunteerId()).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer not found with ID: " + req.getVolunteerId()));
        }

        Ngo ngo = resolveNgo(userDetails, null);
        Long ngoId = ngo != null ? ngo.getId() : (volunteer.getNgoId() != null ? volunteer.getNgoId() : 1L);
        String ngoName = ngo != null ? ngo.getName() : "Hope Relief Network";

        String certCode = "UVMP-CERT-" + (System.currentTimeMillis() % 1000000) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        VolunteerRecognition recognition = new VolunteerRecognition(
                req.getVolunteerId(),
                ngoId,
                req.getTaskId(),
                req.getTitle(),
                req.getDescription(),
                req.getBadgeType(),
                req.getHoursRecognized(),
                certCode
        );

        VolunteerRecognition saved = recognitionRepository.save(recognition);

        // Increase volunteer reliability as merit reward (+2%, capped at 100)
        double currentScore = volunteer.getReliabilityScore() != null ? volunteer.getReliabilityScore() : 85.0;
        volunteer.setReliabilityScore(Math.min(100.0, currentScore + 2.0));
        volunteerRepository.save(volunteer);

        VolunteerRecognitionResponse resp = VolunteerRecognitionResponse.fromEntity(
                saved, volunteer.getName(), volunteer.getEmail(), ngoName
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Volunteer recognition awarded successfully", resp));
    }
}
