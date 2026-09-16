package com.project.uvmp.controller;

import com.project.uvmp.dto.common.ApiResponse;
import com.project.uvmp.dto.incident.IncidentReportRequest;
import com.project.uvmp.dto.incident.IncidentResponse;
import com.project.uvmp.dto.task.TaskCreateRequest;
import com.project.uvmp.dto.task.TaskResponse;
import com.project.uvmp.model.*;
import com.project.uvmp.repository.IncidentRepository;
import com.project.uvmp.repository.NgoRepository;
import com.project.uvmp.repository.TaskRepository;
import com.project.uvmp.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final TaskRepository taskRepository;
    private final NgoRepository ngoRepository;

    public IncidentController(IncidentRepository incidentRepository,
                              TaskRepository taskRepository,
                              NgoRepository ngoRepository) {
        this.incidentRepository = incidentRepository;
        this.taskRepository = taskRepository;
        this.ngoRepository = ngoRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentResponse>> reportIncident(@Valid @RequestBody IncidentReportRequest request) {
        Incident incident = new Incident(
                request.getReporterName(),
                request.getReporterPhone(),
                request.getReporterEmail(),
                request.getIncidentType(),
                request.getSeverity() != null ? request.getSeverity() : "HIGH",
                request.getDescription(),
                request.getLocationAddress(),
                request.getLatitude(),
                request.getLongitude(),
                request.getPeopleAffected()
        );

        Incident saved = incidentRepository.save(incident);
        IncidentResponse response = IncidentResponse.fromEntity(saved);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Emergency incident report received. Response units have been alerted.", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncidentResponse>>> getAllIncidents(
            @RequestParam(required = false) IncidentStatus status) {
        List<Incident> incidents;
        if (status != null) {
            incidents = incidentRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            incidents = incidentRepository.findAllByOrderByCreatedAtDesc();
        }

        List<IncidentResponse> responses = incidents.stream()
                .map(IncidentResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentResponse>> getIncidentById(@PathVariable Long id) {
        return incidentRepository.findById(id)
                .map(incident -> ResponseEntity.ok(ApiResponse.success(IncidentResponse.fromEntity(incident))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Incident not found with ID: " + id)));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<IncidentResponse>> verifyIncident(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return incidentRepository.findById(id).map(incident -> {
            incident.setStatus(IncidentStatus.VERIFIED);
            if (userDetails != null) {
                incident.setVerifiedBy(userDetails.getId());
            }
            Incident saved = incidentRepository.save(incident);
            return ResponseEntity.ok(ApiResponse.success("Incident marked as VERIFIED.", IncidentResponse.fromEntity(saved)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Incident not found with ID: " + id)));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<IncidentResponse>> rejectIncident(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return incidentRepository.findById(id).map(incident -> {
            incident.setStatus(IncidentStatus.REJECTED);
            if (userDetails != null) {
                incident.setVerifiedBy(userDetails.getId());
            }
            Incident saved = incidentRepository.save(incident);
            return ResponseEntity.ok(ApiResponse.success("Incident marked as REJECTED.", IncidentResponse.fromEntity(saved)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Incident not found with ID: " + id)));
    }

    @PostMapping("/{id}/convert-to-task")
    public ResponseEntity<ApiResponse<TaskResponse>> convertIncidentToTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskCreateRequest taskRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Incident not found with ID: " + id));
        }

        Long creatorId = userDetails != null ? userDetails.getId() : 1L;

        Task task = new Task(
                taskRequest.getTitle(),
                taskRequest.getDescription(),
                creatorId,
                taskRequest.getDistrictId() != null ? taskRequest.getDistrictId() : 1L,
                taskRequest.getNgoId(),
                incident.getId(),
                taskRequest.getRequiredSkills(),
                taskRequest.getLocationAddress() != null ? taskRequest.getLocationAddress() : incident.getLocationAddress(),
                taskRequest.getLatitude() != null ? taskRequest.getLatitude() : incident.getLatitude(),
                taskRequest.getLongitude() != null ? taskRequest.getLongitude() : incident.getLongitude(),
                taskRequest.getUrgency() != null ? taskRequest.getUrgency() : Urgency.HIGH,
                taskRequest.getVolunteersNeeded() != null ? taskRequest.getVolunteersNeeded() : 5,
                taskRequest.getStartTime(),
                taskRequest.getEndTime()
        );

        Task savedTask = taskRepository.save(task);

        // Update source incident state
        incident.setStatus(IncidentStatus.CONVERTED_TO_TASK);
        incident.setConvertedTaskId(savedTask.getId());
        if (userDetails != null) {
            incident.setVerifiedBy(userDetails.getId());
        }
        incidentRepository.save(incident);

        String ngoName = null;
        if (savedTask.getNgoId() != null) {
            ngoName = ngoRepository.findById(savedTask.getNgoId()).map(Ngo::getName).orElse(null);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Incident successfully converted to response task #" + savedTask.getId(),
                        TaskResponse.fromEntity(savedTask, ngoName))
        );
    }
}
