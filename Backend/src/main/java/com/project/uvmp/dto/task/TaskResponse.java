package com.project.uvmp.dto.task;

import com.project.uvmp.model.Task;
import com.project.uvmp.model.TaskStatus;
import com.project.uvmp.model.Urgency;

import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Long createdBy;
    private Long districtId;
    private Long ngoId;
    private String ngoName;
    private Long incidentId;
    private String requiredSkills;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private Urgency urgency;
    private TaskStatus status;
    private Integer volunteersNeeded;
    private Integer volunteersAssigned;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public TaskResponse() {
    }

    public static TaskResponse fromEntity(Task task, String ngoName) {
        TaskResponse resp = new TaskResponse();
        resp.setId(task.getId());
        resp.setTitle(task.getTitle());
        resp.setDescription(task.getDescription());
        resp.setCreatedBy(task.getCreatedBy());
        resp.setDistrictId(task.getDistrictId());
        resp.setNgoId(task.getNgoId());
        resp.setNgoName(ngoName);
        resp.setIncidentId(task.getIncidentId());
        resp.setRequiredSkills(task.getRequiredSkills());
        resp.setLocationAddress(task.getLocationAddress());
        resp.setLatitude(task.getLatitude());
        resp.setLongitude(task.getLongitude());
        resp.setUrgency(task.getUrgency());
        resp.setStatus(task.getStatus());
        resp.setVolunteersNeeded(task.getVolunteersNeeded());
        resp.setVolunteersAssigned(task.getVolunteersAssigned());
        resp.setStartTime(task.getStartTime());
        resp.setEndTime(task.getEndTime());
        resp.setCreatedAt(task.getCreatedAt());
        return resp;
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

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
