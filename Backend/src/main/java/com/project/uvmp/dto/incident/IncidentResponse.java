package com.project.uvmp.dto.incident;

import com.project.uvmp.model.Incident;
import com.project.uvmp.model.IncidentStatus;

import java.time.LocalDateTime;

public class IncidentResponse {
    private Long id;
    private String referenceCode;
    private String reporterName;
    private String reporterPhone;
    private String reporterEmail;
    private String incidentType;
    private String severity;
    private String description;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private Integer peopleAffected;
    private IncidentStatus status;
    private Long verifiedBy;
    private Long convertedTaskId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentResponse() {
    }

    public static IncidentResponse fromEntity(Incident incident) {
        IncidentResponse resp = new IncidentResponse();
        resp.setId(incident.getId());
        resp.setReferenceCode("INC-" + String.format("%05d", incident.getId()));
        resp.setReporterName(incident.getReporterName());
        resp.setReporterPhone(incident.getReporterPhone());
        resp.setReporterEmail(incident.getReporterEmail());
        resp.setIncidentType(incident.getIncidentType());
        resp.setSeverity(incident.getSeverity());
        resp.setDescription(incident.getDescription());
        resp.setLocationAddress(incident.getLocationAddress());
        resp.setLatitude(incident.getLatitude());
        resp.setLongitude(incident.getLongitude());
        resp.setPeopleAffected(incident.getPeopleAffected());
        resp.setStatus(incident.getStatus());
        resp.setVerifiedBy(incident.getVerifiedBy());
        resp.setConvertedTaskId(incident.getConvertedTaskId());
        resp.setCreatedAt(incident.getCreatedAt());
        resp.setUpdatedAt(incident.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReporterPhone() {
        return reporterPhone;
    }

    public void setReporterPhone(String reporterPhone) {
        this.reporterPhone = reporterPhone;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getPeopleAffected() {
        return peopleAffected;
    }

    public void setPeopleAffected(Integer peopleAffected) {
        this.peopleAffected = peopleAffected;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public Long getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(Long verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public Long getConvertedTaskId() {
        return convertedTaskId;
    }

    public void setConvertedTaskId(Long convertedTaskId) {
        this.convertedTaskId = convertedTaskId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
