package com.project.uvmp.dto.volunteer;

import java.time.LocalDateTime;

public class VolunteerDashboardResponse {
    private Long volunteerId;
    private String name;
    private String email;
    private String phone;
    private String availability;
    private Double reliabilityScore;
    private String skills;
    private Long ngoId;
    private String ngoName;
    private Long districtId;
    private String districtName;

    // Metrics
    private long totalAssignedTasks;
    private long activeTasks;
    private long completedTasks;
    private double totalHoursLogged;
    private long badgesCount;
    private String tierBadge; // BRONZE_RECRUIT, SILVER_VOLUNTEER, GOLD_RESPONDER, PLATINUM_HERO
    private double nextTierProgress; // 0-100%

    // Current on-duty assignment if checked in / assigned
    private ActiveAssignmentDto activeAssignment;

    public static class ActiveAssignmentDto {
        private Long taskId;
        private Long assignmentId;
        private String taskTitle;
        private String urgency;
        private String status; // ASSIGNED, IN_PROGRESS
        private LocalDateTime assignedAt;
        private LocalDateTime checkInTime;
        private String location;
        private Double latitude;
        private Double longitude;

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
        }

        public String getTaskTitle() {
            return taskTitle;
        }

        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }

        public String getUrgency() {
            return urgency;
        }

        public void setUrgency(String urgency) {
            this.urgency = urgency;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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
    }

    public VolunteerDashboardResponse() {
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Double getReliabilityScore() {
        return reliabilityScore;
    }

    public void setReliabilityScore(Double reliabilityScore) {
        this.reliabilityScore = reliabilityScore;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
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

    public long getTotalAssignedTasks() {
        return totalAssignedTasks;
    }

    public void setTotalAssignedTasks(long totalAssignedTasks) {
        this.totalAssignedTasks = totalAssignedTasks;
    }

    public long getActiveTasks() {
        return activeTasks;
    }

    public void setActiveTasks(long activeTasks) {
        this.activeTasks = activeTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public double getTotalHoursLogged() {
        return totalHoursLogged;
    }

    public void setTotalHoursLogged(double totalHoursLogged) {
        this.totalHoursLogged = totalHoursLogged;
    }

    public long getBadgesCount() {
        return badgesCount;
    }

    public void setBadgesCount(long badgesCount) {
        this.badgesCount = badgesCount;
    }

    public String getTierBadge() {
        return tierBadge;
    }

    public void setTierBadge(String tierBadge) {
        this.tierBadge = tierBadge;
    }

    public double getNextTierProgress() {
        return nextTierProgress;
    }

    public void setNextTierProgress(double nextTierProgress) {
        this.nextTierProgress = nextTierProgress;
    }

    public ActiveAssignmentDto getActiveAssignment() {
        return activeAssignment;
    }

    public void setActiveAssignment(ActiveAssignmentDto activeAssignment) {
        this.activeAssignment = activeAssignment;
    }
}
