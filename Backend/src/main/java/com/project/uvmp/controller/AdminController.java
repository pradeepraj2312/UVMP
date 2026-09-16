package com.project.uvmp.controller;

import com.project.uvmp.dto.admin.*;
import com.project.uvmp.dto.auth.ApprovalDecisionRequest;
import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.incident.IncidentResponse;
import com.project.uvmp.dto.task.TaskResponse;
import com.project.uvmp.dto.volunteer.VolunteerResponse;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.*;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DistrictRepository districtRepository;
    private final NgoRepository ngoRepository;
    private final VolunteerRepository volunteerRepository;
    private final IncidentRepository incidentRepository;
    private final TaskRepository taskRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final VolunteerRecognitionRepository recognitionRepository;
    private final UserRepository userRepository;

    public AdminController(DistrictRepository districtRepository,
                           NgoRepository ngoRepository,
                           VolunteerRepository volunteerRepository,
                           IncidentRepository incidentRepository,
                           TaskRepository taskRepository,
                           TaskAssignmentRepository taskAssignmentRepository,
                           VolunteerRecognitionRepository recognitionRepository,
                           UserRepository userRepository) {
        this.districtRepository = districtRepository;
        this.ngoRepository = ngoRepository;
        this.volunteerRepository = volunteerRepository;
        this.incidentRepository = incidentRepository;
        this.taskRepository = taskRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.recognitionRepository = recognitionRepository;
        this.userRepository = userRepository;
    }

    // Step 12: Admin Command Center
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        List<District> districts = districtRepository.findAll();
        List<Ngo> ngos = ngoRepository.findAll();
        List<Volunteer> volunteers = volunteerRepository.findAll();
        List<Incident> incidents = incidentRepository.findAll();
        List<Task> tasks = taskRepository.findAll();

        AdminDashboardResponse resp = new AdminDashboardResponse();
        resp.setTotalDistricts(districts.size());
        resp.setTotalNgos(ngos.size());
        resp.setApprovedNgos(ngos.stream().filter(n -> "APPROVED".equalsIgnoreCase(n.getRegistrationStatus())).count());
        resp.setPendingNgos(ngos.stream().filter(n -> "PENDING".equalsIgnoreCase(n.getRegistrationStatus())).count());

        resp.setTotalVolunteers(volunteers.size());
        resp.setAvailableVolunteers(volunteers.stream().filter(v -> "AVAILABLE".equalsIgnoreCase(v.getAvailability())).count());

        resp.setTotalIncidents(incidents.size());
        resp.setPendingIncidents(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.REPORTED).count());

        resp.setTotalTasks(tasks.size());
        resp.setActiveTasks(tasks.stream().filter(t -> t.getStatus() == TaskStatus.OPEN || t.getStatus() == TaskStatus.IN_PROGRESS || t.getStatus() == TaskStatus.ASSIGNED).count());
        resp.setCompletedTasks(tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count());

        // Severity breakdown
        Map<String, Long> severityDist = new HashMap<>();
        for (Incident inc : incidents) {
            String sev = inc.getSeverity() != null ? inc.getSeverity().toUpperCase() : "MEDIUM";
            severityDist.put(sev, severityDist.getOrDefault(sev, 0L) + 1);
        }
        resp.setSeverityDistribution(severityDist);

        // Per-district summary
        List<AdminDashboardResponse.DistrictStatDto> districtStats = new ArrayList<>();
        for (District d : districts) {
            AdminDashboardResponse.DistrictStatDto ds = new AdminDashboardResponse.DistrictStatDto();
            ds.setDistrictId(d.getId());
            ds.setDistrictName(d.getName());
            ds.setRegion(d.getRegion());
            ds.setNgosCount(ngos.stream().filter(n -> Objects.equals(n.getDistrictId(), d.getId())).count());
            ds.setVolunteersCount(volunteers.stream().filter(v -> Objects.equals(v.getDistrictId(), d.getId())).count());
            ds.setActiveTasksCount(tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getStatus() != TaskStatus.COMPLETED).count());
            ds.setIncidentsCount(tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getIncidentId() != null).count());
            districtStats.add(ds);
        }
        resp.setDistrictStats(districtStats);

        // Recent Incidents
        resp.setRecentIncidents(
                incidents.stream()
                        .sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
                        .limit(5)
                        .map(IncidentResponse::fromEntity)
                        .collect(Collectors.toList())
        );

        // Critical / High tasks
        Map<Long, String> ngoNames = ngos.stream().collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));
        resp.setCriticalTasks(
                tasks.stream()
                        .filter(t -> t.getUrgency() == Urgency.CRITICAL || t.getUrgency() == Urgency.HIGH)
                        .sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
                        .limit(5)
                        .map(t -> TaskResponse.fromEntity(t, t.getNgoId() != null ? ngoNames.get(t.getNgoId()) : null))
                        .collect(Collectors.toList())
        );

        resp.setAdmins(fetchAdminsList());
        resp.setVolunteers(fetchVolunteersList());
        resp.setDistrictAuthorities(fetchDistrictAuthoritiesList());

        return ResponseEntity.ok(ApiResponse.success(resp));
    }

    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> getAdmins() {
        return ResponseEntity.ok(ApiResponse.success(fetchAdminsList()));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<AdminVolunteerDto>>> getVolunteers() {
        return ResponseEntity.ok(ApiResponse.success(fetchVolunteersList()));
    }

    @GetMapping("/district-authorities")
    public ResponseEntity<ApiResponse<List<AdminDistrictAuthorityDto>>> getDistrictAuthorities() {
        return ResponseEntity.ok(ApiResponse.success(fetchDistrictAuthoritiesList()));
    }

    private List<AdminUserDto> fetchAdminsList() {
        return userRepository.findByRole(Role.ADMIN).stream()
                .map(u -> new AdminUserDto(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole() != null ? u.getRole().name() : "ADMIN",
                        u.getStatus() != null ? u.getStatus().name() : "ACTIVE",
                        u.getCreatedAt()
                ))
                .sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
                .collect(Collectors.toList());
    }

    private List<AdminVolunteerDto> fetchVolunteersList() {
        List<Volunteer> volunteers = volunteerRepository.findAll();
        Map<Long, User> userMap = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, u -> u, (a, b) -> a));
        Map<Long, String> ngoMap = ngoRepository.findAll().stream()
                .collect(Collectors.toMap(Ngo::getId, Ngo::getName, (a, b) -> a));
        Map<Long, String> districtMap = districtRepository.findAll().stream()
                .collect(Collectors.toMap(District::getId, District::getName, (a, b) -> a));

        return volunteers.stream().map(v -> {
            AdminVolunteerDto dto = new AdminVolunteerDto();
            dto.setId(v.getId());
            dto.setUserId(v.getUserId());
            dto.setName(v.getName());
            dto.setEmail(v.getEmail());
            dto.setPhone(v.getPhone());
            dto.setSkills(v.getSkills());
            dto.setAvailability(v.getAvailability() != null ? v.getAvailability() : "AVAILABLE");
            dto.setReliabilityScore(v.getReliabilityScore() != null ? v.getReliabilityScore() : 85.0);
            dto.setTransport(v.getTransport());
            dto.setNgoId(v.getNgoId());
            dto.setDistrictId(v.getDistrictId());
            dto.setCreatedAt(v.getCreatedAt());

            if (v.getNgoId() != null) {
                dto.setNgoName(ngoMap.getOrDefault(v.getNgoId(), "NGO #" + v.getNgoId()));
                dto.setAffiliationType("NGO");
            } else if (v.getDistrictId() != null) {
                dto.setDistrictName(districtMap.getOrDefault(v.getDistrictId(), "District #" + v.getDistrictId()));
                dto.setAffiliationType("DISTRICT");
            } else {
                dto.setAffiliationType("GENERAL_POOL");
                dto.setDistrictName("General Volunteer Pool");
            }

            if (v.getUserId() != null && userMap.containsKey(v.getUserId())) {
                User u = userMap.get(v.getUserId());
                dto.setStatus(u.getStatus() != null ? u.getStatus().name() : "ACTIVE");
                if (dto.getCreatedAt() == null) {
                    dto.setCreatedAt(u.getCreatedAt());
                }
            } else {
                dto.setStatus("ACTIVE");
            }
            return dto;
        }).sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
        .collect(Collectors.toList());
    }

    private List<AdminDistrictAuthorityDto> fetchDistrictAuthoritiesList() {
        List<User> districtOfficers = new ArrayList<>();
        districtOfficers.addAll(userRepository.findByRole(Role.DISTRICT_AUTHORITY));
        districtOfficers.addAll(userRepository.findByRole(Role.DISTRICT));

        Map<Long, User> uniqueOfficers = districtOfficers.stream()
                .collect(Collectors.toMap(User::getId, u -> u, (a, b) -> a));

        List<District> allDistricts = districtRepository.findAll();

        return uniqueOfficers.values().stream().map(u -> {
            AdminDistrictAuthorityDto dto = new AdminDistrictAuthorityDto();
            dto.setId(u.getId());
            dto.setUserId(u.getId());
            dto.setName(u.getName());
            dto.setEmail(u.getEmail());
            dto.setRole(u.getRole() != null ? u.getRole().name() : "DISTRICT_AUTHORITY");
            dto.setStatus(u.getStatus() != null ? u.getStatus().name() : "ACTIVE");
            dto.setCreatedAt(u.getCreatedAt());

            District dist = allDistricts.stream()
                    .filter(d -> Objects.equals(d.getAdminId(), u.getId()))
                    .findFirst()
                    .orElse(null);

            if (dist != null) {
                dto.setDistrictId(dist.getId());
                dto.setDistrictName(dist.getName());
                dto.setRegion(dist.getRegion());
                dto.setDistrictStatus(dist.getStatus() != null ? dist.getStatus() : "ACTIVE");
            } else {
                dto.setDistrictName("Unclaimed Command Desk");
                dto.setRegion("Regional Desk");
                dto.setDistrictStatus("PENDING");
            }
            return dto;
        }).sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
        .collect(Collectors.toList());
    }

    // Step 13: Districts Management
    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<AdminDistrictDto>>> getDistricts() {
        List<District> districts = districtRepository.findAll();
        List<Ngo> ngos = ngoRepository.findAll();
        List<Volunteer> volunteers = volunteerRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<Incident> incidents = incidentRepository.findAll();

        Map<Long, String> userEmails = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getEmail, (a, b) -> a));

        List<AdminDistrictDto> result = new ArrayList<>();
        for (District d : districts) {
            AdminDistrictDto dto = new AdminDistrictDto();
            dto.setId(d.getId());
            dto.setName(d.getName());
            dto.setRegion(d.getRegion());
            dto.setAdminId(d.getAdminId());
            dto.setAdminEmail(d.getAdminId() != null ? userEmails.get(d.getAdminId()) : "district@uvmp.local");
            dto.setNgosCount(ngos.stream().filter(n -> Objects.equals(n.getDistrictId(), d.getId())).count());
            dto.setVolunteersCount(volunteers.stream().filter(v -> Objects.equals(v.getDistrictId(), d.getId())).count());
            dto.setTasksCount(tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId())).count());
            dto.setActiveTasksCount(tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getStatus() != TaskStatus.COMPLETED).count());
            dto.setIncidentsCount(tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getIncidentId() != null).count());
            dto.setCreatedAt(d.getCreatedAt());
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/districts")
    @Transactional
    public ResponseEntity<ApiResponse<AdminDistrictDto>> createDistrict(
            @Valid @RequestBody DistrictCreateRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (districtRepository.existsByName(req.getName())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("A district with this name already exists."));
        }

        District district = new District(req.getName(), req.getRegion(), userDetails != null ? userDetails.getId() : null);
        District saved = districtRepository.save(district);

        AdminDistrictDto dto = new AdminDistrictDto();
        dto.setId(saved.getId());
        dto.setName(saved.getName());
        dto.setRegion(saved.getRegion());
        dto.setAdminId(saved.getAdminId());
        dto.setAdminEmail(userDetails != null ? userDetails.getEmail() : "admin@uvmp.local");
        dto.setNgosCount(0);
        dto.setVolunteersCount(0);
        dto.setTasksCount(0);
        dto.setActiveTasksCount(0);
        dto.setIncidentsCount(0);
        dto.setCreatedAt(saved.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("District established successfully", dto));
    }

    // Step 13: NGO Oversight & Audit
    @GetMapping("/ngos")
    public ResponseEntity<ApiResponse<List<Ngo>>> getNgos() {
        return ResponseEntity.ok(ApiResponse.success(ngoRepository.findAll()));
    }

    @PatchMapping("/ngos/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<Ngo>> updateNgoStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Optional<Ngo> opt = ngoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NGO not found"));
        }

        Ngo ngo = opt.get();
        ngo.setRegistrationStatus(status.toUpperCase());
        Ngo saved = ngoRepository.save(ngo);

        if (saved.getUserId() != null) {
            userRepository.findById(saved.getUserId()).ifPresent(u -> {
                if ("APPROVED".equalsIgnoreCase(status)) {
                    u.setStatus(UserStatus.ACTIVE);
                    u.setApprovedBy(userDetails != null ? userDetails.getId() : null);
                    u.setApprovedAt(LocalDateTime.now());
                    u.setRejectionReason(null);
                } else if ("REJECTED".equalsIgnoreCase(status)) {
                    u.setStatus(UserStatus.REJECTED);
                    u.setApprovedBy(userDetails != null ? userDetails.getId() : null);
                    u.setApprovedAt(LocalDateTime.now());
                } else if ("SUSPENDED".equalsIgnoreCase(status)) {
                    u.setStatus(UserStatus.SUSPENDED);
                }
                userRepository.save(u);
            });
        }

        return ResponseEntity.ok(ApiResponse.success("NGO status updated to " + status.toUpperCase(), saved));
    }

    // -------------------------------------------------------------
    // MULTI-TIER APPROVAL WORKFLOW ENDPOINTS (Admin Jurisdiction)
    // -------------------------------------------------------------

    // A. NGO Accreditations
    @GetMapping("/ngos/pending")
    public ResponseEntity<ApiResponse<List<Ngo>>> getPendingNgos() {
        List<Ngo> pending = ngoRepository.findByRegistrationStatus("PENDING");
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PatchMapping("/ngos/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<Ngo>> approveNgo(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = ngoRepository.findById(id).orElse(null);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NGO not found"));
        }

        ngo.setRegistrationStatus("APPROVED");
        Ngo saved = ngoRepository.save(ngo);

        if (saved.getUserId() != null) {
            userRepository.findById(saved.getUserId()).ifPresent(u -> {
                u.setStatus(UserStatus.ACTIVE);
                u.setApprovedBy(userDetails != null ? userDetails.getId() : null);
                u.setApprovedAt(LocalDateTime.now());
                u.setRejectionReason(null);
                userRepository.save(u);
            });
        }

        return ResponseEntity.ok(ApiResponse.success("NGO accreditation approved successfully", saved));
    }

    @PatchMapping("/ngos/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<Ngo>> rejectNgo(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Ngo ngo = ngoRepository.findById(id).orElse(null);
        if (ngo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("NGO not found"));
        }

        String reason = (req != null && req.getReason() != null && !req.getReason().isBlank())
                ? req.getReason()
                : "Accreditation criteria not satisfied.";

        ngo.setRegistrationStatus("REJECTED");
        Ngo saved = ngoRepository.save(ngo);

        if (saved.getUserId() != null) {
            userRepository.findById(saved.getUserId()).ifPresent(u -> {
                u.setStatus(UserStatus.REJECTED);
                u.setApprovedBy(userDetails != null ? userDetails.getId() : null);
                u.setApprovedAt(LocalDateTime.now());
                u.setRejectionReason(reason);
                userRepository.save(u);
            });
        }

        return ResponseEntity.ok(ApiResponse.success("NGO accreditation rejected", saved));
    }

    // B. Common Pool Volunteers (no NGO, no District Authority)
    @GetMapping("/volunteers/pending")
    public ResponseEntity<ApiResponse<List<VolunteerResponse>>> getPendingCommonPoolVolunteers() {
        List<Volunteer> commonVols = volunteerRepository.findByNgoIdIsNullAndDistrictIdIsNull();
        Map<Long, User> userMap = userRepository.findAllById(
                commonVols.stream().map(Volunteer::getUserId).filter(Objects::nonNull).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(User::getId, u -> u));

        List<VolunteerResponse> pending = commonVols.stream()
                .filter(v -> {
                    User u = userMap.get(v.getUserId());
                    return u != null && u.getStatus() == UserStatus.PENDING;
                })
                .map(v -> VolunteerResponse.fromEntity(
                        v,
                        "General Volunteer Pool",
                        "Platform Central Oversight",
                        "PENDING",
                        null
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PatchMapping("/volunteers/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> approveCommonVolunteer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Volunteer not found"));
        }

        if (volunteer.getNgoId() != null || volunteer.getDistrictId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Volunteer belongs to a specific NGO or District Authority; they must be reviewed by their designated approver."));
        }

        User user = userRepository.findById(volunteer.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User account not found"));
        }

        user.setStatus(UserStatus.ACTIVE);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(null);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(
                "Volunteer approved into General Volunteer Pool",
                VolunteerResponse.fromEntity(volunteer, "General Volunteer Pool", "Platform Central Oversight", "ACTIVE", null)
        ));
    }

    @PatchMapping("/volunteers/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<VolunteerResponse>> rejectCommonVolunteer(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Volunteer volunteer = volunteerRepository.findById(id).orElse(null);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Volunteer not found"));
        }

        if (volunteer.getNgoId() != null || volunteer.getDistrictId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Volunteer belongs to a specific NGO or District Authority; they must be reviewed by their designated approver."));
        }

        User user = userRepository.findById(volunteer.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User account not found"));
        }

        String reason = (req != null && req.getReason() != null && !req.getReason().isBlank())
                ? req.getReason()
                : "Application declined by Platform Administration.";

        user.setStatus(UserStatus.REJECTED);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(reason);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(
                "Volunteer registration rejected",
                VolunteerResponse.fromEntity(volunteer, "General Volunteer Pool", "Platform Central Oversight", "REJECTED", reason)
        ));
    }

    // C. District Authority Jurisdiction Petitions
    @GetMapping("/district-authorities/pending")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPendingDistrictAuthorities() {
        List<User> pendingUsers = userRepository.findByRole(Role.DISTRICT_AUTHORITY).stream()
                .filter(u -> u.getStatus() == UserStatus.PENDING)
                .collect(Collectors.toList());

        List<District> allDistricts = districtRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : pendingUsers) {
            District dist = allDistricts.stream()
                    .filter(d -> Objects.equals(d.getAdminId(), u.getId()))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> item = new HashMap<>();
            item.put("id", dist != null ? dist.getId() : u.getId());
            item.put("userId", u.getId());
            item.put("name", u.getName());
            item.put("email", u.getEmail());
            item.put("status", u.getStatus().name());
            item.put("createdAt", u.getCreatedAt());
            if (dist != null) {
                item.put("districtId", dist.getId());
                item.put("districtName", dist.getName());
                item.put("region", dist.getRegion());
                item.put("districtStatus", dist.getStatus());
            } else {
                item.put("districtName", "Unclaimed Command Desk");
                item.put("region", "Regional Zone");
                item.put("districtStatus", "PENDING");
            }
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/district-authorities/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<String>> approveDistrictAuthority(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getRole() != Role.DISTRICT_AUTHORITY) {
            District dist = districtRepository.findById(id).orElse(null);
            if (dist != null && dist.getAdminId() != null) {
                user = userRepository.findById(dist.getAdminId()).orElse(null);
            }
        }

        if (user == null || user.getRole() != Role.DISTRICT_AUTHORITY) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("District authority officer or jurisdiction not found"));
        }

        user.setStatus(UserStatus.ACTIVE);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(null);
        userRepository.save(user);

        // Also activate the district record
        districtRepository.findByAdminId(user.getId()).ifPresent(d -> {
            d.setStatus("ACTIVE");
            districtRepository.save(d);
        });

        return ResponseEntity.ok(ApiResponse.success("District Authority credential and sector jurisdiction confirmed successfully."));
    }

    @PatchMapping("/district-authorities/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<String>> rejectDistrictAuthority(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDecisionRequest req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getRole() != Role.DISTRICT_AUTHORITY) {
            District dist = districtRepository.findById(id).orElse(null);
            if (dist != null && dist.getAdminId() != null) {
                user = userRepository.findById(dist.getAdminId()).orElse(null);
            }
        }

        if (user == null || user.getRole() != Role.DISTRICT_AUTHORITY) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("District authority officer or jurisdiction not found"));
        }

        String reason = (req != null && req.getReason() != null && !req.getReason().isBlank())
                ? req.getReason()
                : "District authority petition declined by UVMP Platform Administration.";

        user.setStatus(UserStatus.REJECTED);
        user.setApprovedBy(userDetails != null ? userDetails.getId() : null);
        user.setApprovedAt(LocalDateTime.now());
        user.setRejectionReason(reason);
        userRepository.save(user);

        districtRepository.findByAdminId(user.getId()).ifPresent(d -> {
            if ("PENDING".equalsIgnoreCase(d.getStatus())) {
                d.setStatus("REJECTED");
                districtRepository.save(d);
            }
        });

        return ResponseEntity.ok(ApiResponse.success("District Authority registration rejected."));
    }

    // Step 14: Disaster Reports & Analytics
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<AdminReportsResponse>> getReports() {
        List<Incident> incidents = incidentRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<Volunteer> volunteers = volunteerRepository.findAll();
        List<District> districts = districtRepository.findAll();
        List<TaskAssignment> assignments = taskAssignmentRepository.findAll();

        AdminReportsResponse resp = new AdminReportsResponse();

        // Incident severity
        Map<String, Long> sevMap = new HashMap<>();
        for (Incident i : incidents) {
            String s = i.getSeverity() != null ? i.getSeverity().toUpperCase() : "MEDIUM";
            sevMap.put(s, sevMap.getOrDefault(s, 0L) + 1);
        }
        resp.setIncidentSeverityBreakdown(sevMap);

        // Task status
        Map<String, Long> statusMap = new HashMap<>();
        for (Task t : tasks) {
            String s = t.getStatus() != null ? t.getStatus().name() : "OPEN";
            statusMap.put(s, statusMap.getOrDefault(s, 0L) + 1);
        }
        resp.setTaskStatusBreakdown(statusMap);

        // Task urgency
        Map<String, Long> urgMap = new HashMap<>();
        for (Task t : tasks) {
            String u = t.getUrgency() != null ? t.getUrgency().name() : "MEDIUM";
            urgMap.put(u, urgMap.getOrDefault(u, 0L) + 1);
        }
        resp.setTaskUrgencyBreakdown(urgMap);

        // Volunteer availability
        Map<String, Long> availMap = new HashMap<>();
        for (Volunteer v : volunteers) {
            String a = v.getAvailability() != null ? v.getAvailability().toUpperCase() : "AVAILABLE";
            availMap.put(a, availMap.getOrDefault(a, 0L) + 1);
        }
        resp.setVolunteerAvailabilityBreakdown(availMap);

        // Total hours logged
        double totalHours = assignments.stream()
                .mapToDouble(a -> a.getHoursLogged() != null ? a.getHoursLogged() : 0.0)
                .sum();
        resp.setTotalHoursLogged(Math.round(totalHours * 10.0) / 10.0);

        // Average reliability
        double avgRel = volunteers.stream()
                .mapToDouble(v -> v.getReliabilityScore() != null ? v.getReliabilityScore() : 85.0)
                .average()
                .orElse(85.0);
        resp.setAverageReliabilityScore(Math.round(avgRel * 10.0) / 10.0);

        resp.setTotalRecognitionsIssued(recognitionRepository.count());

        // District Breakdown
        List<AdminReportsResponse.DistrictReportRowDto> districtBreakdown = new ArrayList<>();
        for (District d : districts) {
            AdminReportsResponse.DistrictReportRowDto row = new AdminReportsResponse.DistrictReportRowDto();
            row.setDistrictId(d.getId());
            row.setDistrictName(d.getName());
            row.setRegion(d.getRegion());

            long dIncidents = tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getIncidentId() != null).count();
            long dResolvedIncidents = tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getStatus() == TaskStatus.COMPLETED).count();
            long dTasks = tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId())).count();
            long dCompletedTasks = tasks.stream().filter(t -> Objects.equals(t.getDistrictId(), d.getId()) && t.getStatus() == TaskStatus.COMPLETED).count();
            long dVolunteers = volunteers.stream().filter(v -> Objects.equals(v.getDistrictId(), d.getId())).count();

            row.setTotalIncidents(dIncidents);
            row.setResolvedIncidents(dResolvedIncidents);
            row.setTotalTasks(dTasks);
            row.setCompletedTasks(dCompletedTasks);
            row.setTotalVolunteers(dVolunteers);

            double eff = 100.0;
            if (dTasks > 0) {
                eff = Math.round(((double) dCompletedTasks / dTasks) * 100.0);
            }
            row.setResponseEfficiencyScore(eff);
            districtBreakdown.add(row);
        }
        resp.setDistrictBreakdown(districtBreakdown);

        return ResponseEntity.ok(ApiResponse.success(resp));
    }
}
