package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_name", nullable = false, length = 100)
    private String reporterName;

    @Column(name = "reporter_phone", nullable = false, length = 20)
    private String reporterPhone;

    @Column(name = "reporter_email", length = 120)
    private String reporterEmail;

    @Column(name = "incident_type", nullable = false, length = 60)
    private String incidentType;

    @Column(nullable = false, length = 20)
    private String severity = "HIGH";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_address", length = 255)
    private String locationAddress;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "people_affected")
    private Integer peopleAffected = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "converted_task_id")
    private Long convertedTaskId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Incident() {
    }

    public Incident(String reporterName, String reporterPhone, String reporterEmail, String incidentType,
                    String severity, String description, String locationAddress, Double latitude,
                    Double longitude, Integer peopleAffected) {
        this.reporterName = reporterName;
        this.reporterPhone = reporterPhone;
        this.reporterEmail = reporterEmail;
        this.incidentType = incidentType;
        this.severity = severity;
        this.description = description;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.peopleAffected = peopleAffected != null ? peopleAffected : 1;
        this.status = IncidentStatus.REPORTED;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
