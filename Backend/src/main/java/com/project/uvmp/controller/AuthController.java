package com.project.uvmp.controller;

import com.project.uvmp.dto.auth.*;
import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.DistrictRepository;
import com.project.uvmp.repository.NgoRepository;
import com.project.uvmp.repository.UserRepository;
import com.project.uvmp.repository.VolunteerRepository;
import com.project.uvmp.security.JwtUtils;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final DistrictRepository districtRepository;
    private final NgoRepository ngoRepository;
    private final VolunteerRepository volunteerRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils,
                          DistrictRepository districtRepository,
                          NgoRepository ngoRepository,
                          VolunteerRepository volunteerRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.districtRepository = districtRepository;
        this.ngoRepository = ngoRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @GetMapping("/public/registration-options")
    public ResponseEntity<ApiResponse<RegistrationOptionsResponse>> getRegistrationOptions() {
        Map<Long, String> distMap = districtRepository.findAll().stream()
                .collect(Collectors.toMap(District::getId, District::getName, (a, b) -> a));

        List<RegistrationOptionsResponse.NgoOptionDto> ngos = ngoRepository.findAll().stream()
                .filter(n -> "APPROVED".equalsIgnoreCase(n.getRegistrationStatus()))
                .map(n -> new RegistrationOptionsResponse.NgoOptionDto(
                        n.getId(),
                        n.getName(),
                        n.getDistrictId(),
                        distMap.getOrDefault(n.getDistrictId(), "General Sector")
                ))
                .collect(Collectors.toList());

        List<RegistrationOptionsResponse.DistrictOptionDto> districts = districtRepository.findAll().stream()
                .filter(d -> !"PENDING".equalsIgnoreCase(d.getStatus()))
                .map(d -> new RegistrationOptionsResponse.DistrictOptionDto(
                        d.getId(),
                        d.getName(),
                        d.getRegion()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(new RegistrationOptionsResponse(ngos, districts)));
    }

    @GetMapping("/auth/districts")
    public ResponseEntity<?> getDistrictsForRegistration() {
        return ResponseEntity.ok(ApiResponse.success(districtRepository.findAll()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Login Gating Check
            if (user.getStatus() == UserStatus.PENDING) {
                String approver = "UVMP Platform Administration";
                String message = "Your account is awaiting approval from UVMP Platform Administration.";

                if (user.getRole() == Role.VOLUNTEER) {
                    Optional<Volunteer> volOpt = volunteerRepository.findByUserId(user.getId());
                    if (volOpt.isPresent()) {
                        Volunteer vol = volOpt.get();
                        if (vol.getNgoId() != null) {
                            Optional<Ngo> ngoOpt = ngoRepository.findById(vol.getNgoId());
                            if (ngoOpt.isPresent()) {
                                approver = ngoOpt.get().getName();
                                message = "Your registration is awaiting approval from " + approver + ".";
                            }
                        } else if (vol.getDistrictId() != null) {
                            Optional<District> distOpt = districtRepository.findById(vol.getDistrictId());
                            if (distOpt.isPresent()) {
                                approver = distOpt.get().getName() + " Authority";
                                message = "Your registration is awaiting approval from " + approver + ".";
                            }
                        } else {
                            approver = "UVMP Platform Administration (General Volunteer Pool)";
                            message = "Your registration is in the General Volunteer Pool, awaiting approval from UVMP Platform Administration.";
                        }
                    }
                } else if (user.getRole() == Role.NGO) {
                    approver = "UVMP Platform Administration";
                    message = "Your NGO accreditation request is awaiting approval from UVMP Platform Administration.";
                } else if (user.getRole() == Role.DISTRICT || user.getRole() == Role.DISTRICT_AUTHORITY) {
                    approver = "UVMP Platform Administration";
                    message = "Your District Authority jurisdiction request is awaiting approval from UVMP Platform Administration.";
                }

                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("code", "ACCOUNT_PENDING");
                err.put("approver", approver);
                err.put("message", message);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
            }

            if (user.getStatus() == UserStatus.REJECTED) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("code", "ACCOUNT_REJECTED");
                err.put("message", "Your registration was not approved.");
                err.put("reason", user.getRejectionReason() != null ? user.getRejectionReason() : "No specific reason provided.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
            }

            if (user.getStatus() == UserStatus.SUSPENDED) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("code", "ACCOUNT_SUSPENDED");
                err.put("message", "Your account has been suspended. Please contact platform administration.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateTokenFromEmail(userDetails.getEmail(), userDetails.getRole().name());

            return ResponseEntity.ok(ApiResponse.success(
                    "Login successful",
                    new AuthResponse(jwt, UserResponse.fromEntity(user))
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/auth/register/volunteer")
    public ResponseEntity<?> registerVolunteer(@Valid @RequestBody VolunteerRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error: Email is already registered!"));
        }

        // Mutual exclusion: volunteer cannot be registered to both NGO and District Authority
        if (req.getNgoId() != null && req.getDistrictId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error: Volunteer cannot register under both an NGO and a District Authority directly. Please select only one."));
        }

        String approverName;
        Long targetNgoId = null;
        Long targetDistrictId = null;

        if (req.getNgoId() != null) {
            Optional<Ngo> ngoOpt = ngoRepository.findById(req.getNgoId());
            if (ngoOpt.isEmpty() || !"APPROVED".equalsIgnoreCase(ngoOpt.get().getRegistrationStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Selected NGO does not exist or is not approved."));
            }
            targetNgoId = ngoOpt.get().getId();
            approverName = ngoOpt.get().getName();
        } else if (req.getDistrictId() != null) {
            Optional<District> distOpt = districtRepository.findById(req.getDistrictId());
            if (distOpt.isEmpty() || "PENDING".equalsIgnoreCase(distOpt.get().getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Selected District does not exist or is pending confirmation."));
            }
            targetDistrictId = distOpt.get().getId();
            approverName = distOpt.get().getName() + " Authority";
        } else {
            approverName = "UVMP Platform Administration (General Volunteer Pool)";
        }

        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                Role.VOLUNTEER
        );
        user.setStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        Volunteer volunteer = new Volunteer();
        volunteer.setUserId(savedUser.getId());
        volunteer.setName(savedUser.getName());
        volunteer.setEmail(savedUser.getEmail());
        volunteer.setPhone(req.getPhone() != null && !req.getPhone().isBlank() ? req.getPhone() : "+91 98000 22333");
        volunteer.setNgoId(targetNgoId);
        volunteer.setDistrictId(targetDistrictId);
        volunteer.setLatitude(req.getLatitude() != null ? req.getLatitude() : 18.5204);
        volunteer.setLongitude(req.getLongitude() != null ? req.getLongitude() : 73.8567);
        volunteer.setAvailability(req.getAvailability() != null ? req.getAvailability() : "AVAILABLE");
        volunteer.setReliabilityScore(85.0);
        volunteer.setSkills(req.getSkills() != null && !req.getSkills().isBlank() ? req.getSkills() : "First Aid, Emergency Relief");
        Volunteer savedVolunteer = volunteerRepository.save(volunteer);

        Map<String, Object> respData = new HashMap<>();
        respData.put("userId", savedUser.getId());
        respData.put("volunteerId", savedVolunteer.getId());
        respData.put("status", "PENDING");
        respData.put("approver", approverName);
        respData.put("message", "Registration submitted successfully. Your account is pending approval from " + approverName + ".");

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Volunteer registration submitted",
                respData
        ));
    }

    @PostMapping("/auth/register/ngo")
    public ResponseEntity<?> registerNgo(@Valid @RequestBody NgoRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error: Email is already registered!"));
        }

        if (!districtRepository.existsById(req.getDistrictId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Selected operating district does not exist."));
        }

        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                Role.NGO
        );
        user.setStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        Ngo ngo = new Ngo();
        ngo.setName(savedUser.getName());
        ngo.setDistrictId(req.getDistrictId());
        ngo.setUserId(savedUser.getId());
        ngo.setRegistrationStatus("PENDING");
        ngo.setEmail(savedUser.getEmail());
        ngo.setPhone(req.getPhone() != null && !req.getPhone().isBlank() ? req.getPhone() : "+91 98000 11222");
        ngo.setContactInfo(req.getContactInfo() != null && !req.getContactInfo().isBlank() ? req.getContactInfo() : savedUser.getName() + " (Accreditation Applicant)");
        ngoRepository.save(ngo);

        Map<String, Object> respData = new HashMap<>();
        respData.put("userId", savedUser.getId());
        respData.put("ngoId", ngo.getId());
        respData.put("status", "PENDING");
        respData.put("approver", "UVMP Platform Administration");
        respData.put("message", "Your NGO accreditation application has been submitted and is pending review by UVMP Platform Administration.");

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "NGO registration submitted",
                respData
        ));
    }

    @PostMapping("/auth/register/district-authority")
    public ResponseEntity<?> registerDistrictAuthority(@Valid @RequestBody DistrictAuthorityRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error: Email is already registered!"));
        }

        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                Role.DISTRICT_AUTHORITY
        );
        user.setStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        District district;
        if (req.getExistingDistrictId() != null && districtRepository.existsById(req.getExistingDistrictId())) {
            district = districtRepository.findById(req.getExistingDistrictId()).get();
            district.setAdminId(savedUser.getId());
            districtRepository.save(district);
        } else {
            district = new District(req.getDistrictName(), req.getRegion(), savedUser.getId(), "PENDING");
            district = districtRepository.save(district);
        }

        Map<String, Object> respData = new HashMap<>();
        respData.put("userId", savedUser.getId());
        respData.put("districtId", district.getId());
        respData.put("districtName", district.getName());
        respData.put("status", "PENDING");
        respData.put("approver", "UVMP Platform Administration");
        respData.put("message", "District Authority registration submitted. Your jurisdiction petition is awaiting confirmation from UVMP Platform Administration.");

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "District Authority registration submitted",
                respData
        ));
    }

    // Legacy Registration Endpoint (maintains backwards compatibility)
    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error: Email is already registered!"));
        }

        if (registerRequest.getRole() == Role.VOLUNTEER) {
            VolunteerRegisterRequest vr = new VolunteerRegisterRequest();
            vr.setName(registerRequest.getName());
            vr.setEmail(registerRequest.getEmail());
            vr.setPassword(registerRequest.getPassword());
            vr.setPhone(registerRequest.getPhone());
            vr.setDistrictId(registerRequest.getDistrictId());
            return registerVolunteer(vr);
        } else if (registerRequest.getRole() == Role.NGO) {
            NgoRegisterRequest nr = new NgoRegisterRequest();
            nr.setName(registerRequest.getName());
            nr.setEmail(registerRequest.getEmail());
            nr.setPassword(registerRequest.getPassword());
            nr.setPhone(registerRequest.getPhone());
            nr.setDistrictId(registerRequest.getDistrictId() != null ? registerRequest.getDistrictId() : 1L);
            return registerNgo(nr);
        } else if (registerRequest.getRole() == Role.DISTRICT_AUTHORITY || registerRequest.getRole() == Role.DISTRICT) {
            DistrictAuthorityRegisterRequest dr = new DistrictAuthorityRegisterRequest();
            dr.setName(registerRequest.getName());
            dr.setEmail(registerRequest.getEmail());
            dr.setPassword(registerRequest.getPassword());
            dr.setPhone(registerRequest.getPhone());
            dr.setExistingDistrictId(registerRequest.getDistrictId());
            dr.setDistrictName(registerRequest.getName().contains("District") ? registerRequest.getName() : registerRequest.getName() + " Sector");
            dr.setRegion("Regional Operational Zone");
            return registerDistrictAuthority(dr);
        }

        // Generic fallback for other internal roles
        User user = new User(
                registerRequest.getName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getRole()
        );
        user.setStatus(UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromEmail(savedUser.getEmail(), savedUser.getRole().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "User registered successfully",
                new AuthResponse(jwt, UserResponse.fromEntity(savedUser))
        ));
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ApiResponse.success(UserResponse.fromEntity(user)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestParam(defaultValue = "ADMIN") String role) {
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("activeTasks", 12);
        metrics.put("volunteers", 48);
        metrics.put("pendingApprovals", 5);
        metrics.put("responseRate", 94);

        data.put("metrics", metrics);
        data.put("attention", List.of(
                Map.of("id", 1, "title", "Emergency Relief Request", "description", "Flooding in North District Sector 4", "type", "urgent"),
                Map.of("id", 2, "title", "NGO Registration Review", "description", "Red Cross Youth Wing submitted documentation", "type", "review")
        ));
        data.put("tasks", List.of(
                Map.of("id", 1, "title", "Medical Supply Distribution", "location", "Central Hospital", "owner", "admin@uvmp.local", "status", "IN_PROGRESS", "dueDate", "Today, 4:00 PM"),
                Map.of("id", 2, "title", "Shelter Sanitation Setup", "location", "North Community Hall", "owner", "admin@uvmp.local", "status", "OPEN", "dueDate", "Tomorrow, 10:00 AM")
        ));

        return ResponseEntity.ok(data);
    }
}
