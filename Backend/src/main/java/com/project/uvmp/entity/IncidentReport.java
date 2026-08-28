package com.project.uvmp.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class IncidentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String referenceId;
    private String disasterType;
    private String severity;
    private String district;
    private String taluk;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer trappedCount;
    private Integer injuredCount;
    private String description;
    private String assistanceNeeded;
    private String reporterName;
    private String reporterPhone;
    private boolean anonymous;
    @Enumerated(EnumType.STRING)
    private IncidentStatus status = IncidentStatus.SUBMITTED;
    private Instant submittedAt = Instant.now();

    public Long getId() { return id; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getTaluk() { return taluk; }
    public void setTaluk(String taluk) { this.taluk = taluk; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getTrappedCount() { return trappedCount; }
    public void setTrappedCount(Integer trappedCount) { this.trappedCount = trappedCount; }
    public Integer getInjuredCount() { return injuredCount; }
    public void setInjuredCount(Integer injuredCount) { this.injuredCount = injuredCount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAssistanceNeeded() { return assistanceNeeded; }
    public void setAssistanceNeeded(String assistanceNeeded) { this.assistanceNeeded = assistanceNeeded; }
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public Instant getSubmittedAt() { return submittedAt; }
}