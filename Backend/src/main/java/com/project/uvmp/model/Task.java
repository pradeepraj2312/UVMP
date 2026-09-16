package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "district_id", nullable = false)
    private Long districtId;

    @Column(name = "ngo_id")
    private Long ngoId;

    @Column(name = "incident_id")
    private Long incidentId;

    @Column(name = "required_skills", length = 500)
    private String requiredSkills; // comma-separated e.g. "First Aid, Logistics"

    @Column(name = "location_address", length = 255)
    private String locationAddress;

    @Column(name = "latitude")
    private Double latitude = 0.0;

    @Column(name = "longitude")
    private Double longitude = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Urgency urgency = Urgency.HIGH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TaskStatus status = TaskStatus.OPEN;

    @Column(name = "volunteers_needed", nullable = false)
    private Integer volunteersNeeded = 5;

    @Column(name = "volunteers_assigned", nullable = false)
    private Integer volunteersAssigned = 0;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Task() {
    }

    public Task(String title, String description, Long createdBy, Long districtId, Long ngoId, Long incidentId,
                String requiredSkills, String locationAddress, Double latitude, Double longitude,
                Urgency urgency, Integer volunteersNeeded, LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
        this.districtId = districtId;
        this.ngoId = ngoId;
        this.incidentId = incidentId;
        this.requiredSkills = requiredSkills;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.urgency = urgency != null ? urgency : Urgency.HIGH;
        this.status = TaskStatus.OPEN;
        this.volunteersNeeded = volunteersNeeded != null ? volunteersNeeded : 5;
        this.volunteersAssigned = 0;
        this.startTime = startTime != null ? startTime : LocalDateTime.now();
        this.endTime = endTime;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
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

    public Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Urgency urgency) {
        this.urgency = urgency;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Integer getVolunteersNeeded() {
        return volunteersNeeded;
    }

    public void setVolunteersNeeded(Integer volunteersNeeded) {
        this.volunteersNeeded = volunteersNeeded;
    }

    public Integer getVolunteersAssigned() {
        return volunteersAssigned;
    }

    public void setVolunteersAssigned(Integer volunteersAssigned) {
        this.volunteersAssigned = volunteersAssigned;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
