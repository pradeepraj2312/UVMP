package com.project.uvmp.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.project.uvmp.dto.IncidentDtos.CreateIncidentRequest;
import com.project.uvmp.entity.IncidentReport;
import com.project.uvmp.entity.IncidentStatus;
import com.project.uvmp.repository.IncidentReportRepository;

@Service
public class IncidentService {
    private final IncidentReportRepository incidents;

    public IncidentService(IncidentReportRepository incidents) { this.incidents = incidents; }

    public IncidentReport create(CreateIncidentRequest request) {
        IncidentReport incident = new IncidentReport();
        incident.setReferenceId("REP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        incident.setDisasterType(request.disasterType()); incident.setSeverity(request.severity());
        incident.setDistrict(request.district()); incident.setTaluk(request.taluk()); incident.setAddress(request.address());
        incident.setLatitude(request.latitude()); incident.setLongitude(request.longitude());
        incident.setTrappedCount(request.trappedCount()); incident.setInjuredCount(request.injuredCount());
        incident.setDescription(request.description()); incident.setAssistanceNeeded(request.assistanceNeeded());
        incident.setReporterName(request.anonymous() ? null : request.reporterName());
        incident.setReporterPhone(request.anonymous() ? null : request.reporterPhone()); incident.setAnonymous(request.anonymous());
        return incidents.save(incident);
    }

    public IncidentReport updateStatus(String referenceId, IncidentStatus status) {
        IncidentReport incident = incidents.findByReferenceId(referenceId).orElseThrow();
        incident.setStatus(status); return incidents.save(incident);
    }
}