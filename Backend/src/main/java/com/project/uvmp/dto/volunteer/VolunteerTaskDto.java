package com.project.uvmp.dto.volunteer;

import java.time.LocalDateTime;

public class VolunteerTaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String urgency;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer volunteersNeeded;
    private Integer volunteersAssigned;
    private String requiredSkills;
    private Long districtId;
    private String districtName;
    private Long ngoId;
    private String ngoName;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;

    // Volunteer-specific context
    private Boolean isAssignedToMe;
    private Long assignmentId;
    private String assignmentStatus; // NOT_ASSIGNED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    private LocalDateTime assignedAt;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Double hoursLogged;
    private Double matchScore;

    public VolunteerTaskDto() {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String skills) {
        this.requiredSkills = skills;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Boolean getIsAssignedToMe() {
        return isAssignedToMe;
    }

    public void setIsAssignedToMe(Boolean assignedToMe) {
        isAssignedToMe = assignedToMe;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(String assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public Double getHoursLogged() {
        return hoursLogged;
    }

    public void setHoursLogged(Double hoursLogged) {
        this.hoursLogged = hoursLogged;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }
}
