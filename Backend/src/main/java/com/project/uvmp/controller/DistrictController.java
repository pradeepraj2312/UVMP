package com.project.uvmp.controller;

import com.project.uvmp.dto.auth.ApprovalDecisionRequest;
import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.district.DistrictDashboardResponse;
import com.project.uvmp.dto.incident.IncidentResponse;
import com.project.uvmp.dto.task.TaskResponse;
import com.project.uvmp.dto.volunteer.VolunteerResponse;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.*;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/district")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DistrictController {

    private final DistrictRepository districtRepository;
    private final IncidentRepository incidentRepository;
    private final TaskRepository taskRepository;
    private final NgoRepository ngoRepository;
    private final VolunteerRepository volunteerRepository;
    private final UserRepository userRepository;

    public DistrictController(DistrictRepository districtRepository,
                              IncidentRepository incidentRepository,
                              TaskRepository taskRepository,
                              NgoRepository ngoRepository,
                              VolunteerRepository volunteerRepository,
                              UserRepository userRepository) {
        this.districtRepository = districtRepository;
        this.incidentRepository = incidentRepository;
        this.taskRepository = taskRepository;
        this.ngoRepository = ngoRepository;
        this.volunteerRepository = volunteerRepository;
        this.userRepository = userRepository;
    }

    private District resolveDistrict(UserDetailsImpl userDetails, Long districtId) {
        if (districtId != null && districtId > 0) {
            return districtRepository.findById(districtId).orElse(null);
        }
        if (userDetails != null) {
            Optional<District> byAdmin = districtRepository.findByAdminId(userDetails.getId());
            if (byAdmin.isPresent()) return byAdmin.get();
        }
        return districtRepository.findAll().stream().findFirst().orElse(null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DistrictDashboardResponse>> getDistrictDashboard(
            @RequestParam(required = false) Long districtId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        District district = null;
        if (districtId != null && districtId > 0) {
            district = districtRepository.findById(districtId).orElse(null);
        }
        if (district == null && userDetails != null) {
            district = districtRepository.findByAdminId(userDetails.getId()).orElse(null);
        }
        if (district == null) {
            district = districtRepository.findAll().stream().findFirst().orElse(null);
        }

        List<Incident> allIncidents = incidentRepository.findAllByOrderByCreatedAtDesc();
        List<Task> allTasks = district != null
                ? taskRepository.findByDistrictIdOrderByCreatedAtDesc(district.getId())
                : taskRepository.findAllByOrderByCreatedAtDesc();

        long pendingIncidents = allIncidents.stream().filter(i -> i.getStatus() == IncidentStatus.REPORTED).count();
        long verifiedIncidents = allIncidents.stream().filter(i -> i.getStatus() == IncidentStatus.VERIFIED).count();
        long convertedIncidents = allIncidents.stream().filter(i -> i.getStatus() == IncidentStatus.CONVERTED_TO_TASK).count();
        long activeTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.OPEN || t.getStatus() == TaskStatus.IN_PROGRESS || t.getStatus() == TaskStatus.ASSIGNED).count();

        long totalNgos = district != null ? ngoRepository.countByDistrictId(district.getId()) : ngoRepository.count();
        long totalVolunteers = district != null ? volunteerRepository.countByDistrictId(district.getId()) : volunteerRepository.count();

        Map<String, Long> severityDist = new HashMap<>();
        for (Incident inc : allIncidents) {
            severityDist.put(inc.getSeverity(), severityDist.getOrDefault(inc.getSeverity(), 0L) + 1);
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));

        List<IncidentResponse> recentIncidents = allIncidents.stream()
                .limit(6)
                .map(IncidentResponse::fromEntity)
                .collect(Collectors.toList());

        List<TaskResponse> recentTasks = allTasks.stream()
                .limit(6)
                .map(t -> TaskResponse.fromEntity(t, t.getNgoId() != null ? ngoNames.get(t.getNgoId()) : null))
                .collect(Collectors.toList());

        DistrictDashboardResponse resp = new DistrictDashboardResponse();
        resp.setDistrictName(district != null ? district.getName() : "Central Response District");
        resp.setRegion(district != null ? district.getRegion() : "National Capital Region");
        resp.setTotalIncidents(allIncidents.size());
        resp.setPendingIncidents(pendingIncidents);
        resp.setVerifiedIncidents(verifiedIncidents);
        resp.setConvertedTasks(convertedIncidents);
        resp.setActiveTasks(activeTasks);
        resp.setTotalNgos(totalNgos);
        resp.setTotalVolunteers(totalVolunteers);
        resp.setSeverityDistribution(severityDist);
        resp.setRecentIncidents(recentIncidents);
        resp.setRecentTasks(recentTasks);

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @GetMapping("/ngos")
    public ResponseEntity<ApiResponse<List<Ngo>>> getDistrictNgos(
            @RequestParam(required = false) Long districtId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Ngo> ngos;
        if (districtId != null && districtId > 0) {
            ngos = ngoRepository.findByDistrictId(districtId);
        } else {
            ngos = ngoRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.success(ngos));
    }

    @PatchMapping("/ngos/{id}/status")
    public ResponseEntity<ApiResponse<Ngo>> updateNgoStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ngoRepository.findById(id).map(ngo -> {
            ngo.setRegistrationStatus(status.toUpperCase());
            Ngo saved = ngoRepository.save(ngo);
            return ResponseEntity.ok(ApiResponse.success("NGO status updated to " + status, saved));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("NGO not found with ID: " + id)));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<com.project.uvmp.dto.volunteer.VolunteerResponse>>> getDistrictVolunteers(
            @RequestParam(required = false) Long districtId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Volunteer> volunteers;
        if (districtId != null && districtId > 0) {
            volunteers = volunteerRepository.findByDistrictId(districtId);
        } else {
            volunteers = volunteerRepository.findAll();
        }

        Map<Long, String> ngoNames = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));
        Map<Long, String> districtNames = districtRepository.findAll().stream()
                .collect(Collectors.toMap(District::getId, District::getName, (a, b) -> a));

        List<com.project.uvmp.dto.volunteer.VolunteerResponse> responseList = volunteers.stream()
                .map(v -> com.project.uvmp.dto.volunteer.VolunteerResponse.fromEntity(
                        v,
                        v.getNgoId() != null ? ngoNames.get(v.getNgoId()) : "Independent / Direct",
                        v.getDistrictId() != null ? districtNames.get(v.getDistrictId()) : "Unassigned Sector"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseList));
    }

    @PatchMapping("/volunteers/{id}/availability")
    public ResponseEntity<ApiResponse<com.project.uvmp.dto.volunteer.VolunteerResponse>> updateVolunteerAvailability(
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
            return ResponseEntity.ok(ApiResponse.success("Volunteer availability updated to " + availability,
                    com.project.uvmp.dto.volunteer.VolunteerResponse.fromEntity(saved, ngoName, districtName)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Volunteer not found with ID: " + id)));
    }

    @GetMapping("/volunteers/pending")
    public ResponseEntity<ApiResponse<List<VolunteerResponse>>> getPendingVolunteers(
            @RequestParam(required = false) Long districtId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        District district = resolveDistrict(userDetails, districtId);
        if (district == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("District authority record not found."));
        }

        List<Volunteer> directVols = volunteerRepository.findByDistrictIdAndNgoIdIsNull(district.getId());
        Map<Long, User> userMap = userRepository.findAllById(
                directVols.stream().map(Volunteer::getUserId).filter(Objects::nonNull).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(User::getId, u -> u));

        List<VolunteerResponse> pending = directVols.stream()
                .filter(v -> {
                    User u = userMap.get(v.getUserId());
                    return u != null && u.getStatus() == UserStatus.PENDING;
                })
                .map(v -> VolunteerResponse.fromEntity(
                        v,
                        "Direct District Authority",
                        district.getName(),
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
            @RequestParam(required = false) Long districtId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        District district = resolveDistrict(userDetails, districtId);
        if (district == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("District authority record not found."));
        }

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer record not found."));
        }

        // Strict ownership check: Must be directly assigned to this district
        if (!Objects.equals(volunteer.getDistrictId(), district.getId()) || volunteer.getNgoId() != null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: You may only approve volunteers registered directly under your district authority."));
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
                "Volunteer approved into district operational roster",
                VolunteerResponse.fromEntity(volunteer, "Direct District Authority", district.getName(), "ACTIVE", null)
        ));
    }

    @PatchMapping("/volunteers/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> rejectVolunteer(
            @PathVariable Long id,
            @RequestParam(required = false) Long districtId,
            @RequestBody(required = false) ApprovalDecisionRequest decisionReq,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        District district = resolveDistrict(userDetails, districtId);
        if (district == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("District authority record not found."));
        }

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer record not found."));
        }

        // Strict ownership check
        if (!Objects.equals(volunteer.getDistrictId(), district.getId()) || volunteer.getNgoId() != null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: You may only reject volunteers registered directly under your district authority."));
        }

        User user = userRepository.findById(volunteer.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User account for volunteer not found."));
        }

        String reason = (decisionReq != null && decisionReq.getReason() != null && !decisionReq.getReason().isBlank())
                ? decisionReq.getReason()
                : "Application declined by District Authority.";

        user.setStatus(UserStatus.REJECTED);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(reason);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(
                "Volunteer registration rejected",
                VolunteerResponse.fromEntity(volunteer, "Direct District Authority", district.getName(), "REJECTED", reason)
        ));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<District>>> getDistricts() {
        return ResponseEntity.ok(ApiResponse.success(districtRepository.findAll()));
    }
}
