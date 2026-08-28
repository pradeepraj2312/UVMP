package com.project.uvmp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.uvmp.dto.IncidentDtos.CreateIncidentRequest;
import com.project.uvmp.entity.IncidentReport;
import com.project.uvmp.entity.IncidentStatus;
import com.project.uvmp.repository.IncidentReportRepository;
import com.project.uvmp.service.IncidentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService incidentService;
    private final IncidentReportRepository incidents;

    public IncidentController(IncidentService incidentService, IncidentReportRepository incidents) {
        this.incidentService = incidentService; this.incidents = incidents;
    }

    @PostMapping
    public IncidentReport create(@RequestBody CreateIncidentRequest request) { return incidentService.create(request); }

    @GetMapping("/track/{referenceId}")
    public IncidentReport track(@PathVariable String referenceId) {
        return incidents.findByReferenceId(referenceId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident was not found"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISTRICT_AUTHORITY')")
    public List<IncidentReport> all() { return incidents.findAll(); }

    @PatchMapping("/{referenceId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISTRICT_AUTHORITY')")
    public IncidentReport updateStatus(@PathVariable String referenceId, @RequestBody StatusRequest request) {
        return incidentService.updateStatus(referenceId, request.status());
    }

    public record StatusRequest(IncidentStatus status) { }
}