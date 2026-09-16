package com.project.uvmp.dto.task;

import com.project.uvmp.dto.volunteer.VolunteerResponse;
import com.project.uvmp.model.Incident;
import com.project.uvmp.model.Task;

import java.time.LocalDateTime;
import java.util.List;

public class TaskDetailResponse {
    private Long id;
    private String title;
    private String description;
    private Long districtId;
    private Long ngoId;
    private String ngoName;
    private Long incidentId;
    private String incidentReference;
    private String incidentType;
    private String incidentSeverity;
    private String requiredSkills;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private String urgency;
    private String status;
    private Integer volunteersNeeded;
    private Integer volunteersAssigned;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<AssignedVolunteerDto> assignedVolunteers;

    public static class AssignedVolunteerDto {
        private Long assignmentId;
        private Long volunteerId;
        private String name;
        private String email;
        private String phone;
        private String skills;
        private Double reliabilityScore;
        private String assignmentStatus;
        private Double hoursLogged;
        private LocalDateTime assignedAt;

        public AssignedVolunteerDto() {
        }

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
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

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public Double getReliabilityScore() {
            return reliabilityScore;
        }

        public void setReliabilityScore(Double reliabilityScore) {
            this.reliabilityScore = reliabilityScore;
        }

        public String getAssignmentStatus() {
            return assignmentStatus;
        }

        public void setAssignmentStatus(String assignmentStatus) {
            this.assignmentStatus = assignmentStatus;
        }

        public Double getHoursLogged() {
            return hoursLogged;
        }

        public void setHoursLogged(Double hoursLogged) {
            this.hoursLogged = hoursLogged;
        }

        public LocalDateTime getAssignedAt() {
            return assignedAt;
        }

        public void setAssignedAt(LocalDateTime assignedAt) {
            this.assignedAt = assignedAt;
        }
    }

    public TaskDetailResponse() {
    }

    public static TaskDetailResponse fromEntity(Task t, String ngoName, Incident inc, List<AssignedVolunteerDto> volunteers) {
        TaskDetailResponse resp = new TaskDetailResponse();
        resp.setId(t.getId());
        resp.setTitle(t.getTitle());
        resp.setDescription(t.getDescription());
        resp.setDistrictId(t.getDistrictId());
        resp.setNgoId(t.getNgoId());
        resp.setNgoName(ngoName);
        resp.setIncidentId(t.getIncidentId());
        if (inc != null) {
            resp.setIncidentReference("INC-" + String.format("%05d", inc.getId()));
            resp.setIncidentType(inc.getIncidentType());
            resp.setIncidentSeverity(inc.getSeverity());
        }
        resp.setRequiredSkills(t.getRequiredSkills());
        resp.setLocationAddress(t.getLocationAddress());
        resp.setLatitude(t.getLatitude());
        resp.setLongitude(t.getLongitude());
        resp.setUrgency(t.getUrgency().name());
        resp.setStatus(t.getStatus().name());
        resp.setVolunteersNeeded(t.getVolunteersNeeded());
        resp.setVolunteersAssigned(t.getVolunteersAssigned());
        resp.setStartTime(t.getStartTime());
        resp.setEndTime(t.getEndTime());
        resp.setCreatedAt(t.getCreatedAt());
        resp.setUpdatedAt(t.getUpdatedAt());
        resp.setAssignedVolunteers(volunteers);
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

    public String getIncidentReference() {
        return incidentReference;
    }

    public void setIncidentReference(String incidentReference) {
        this.incidentReference = incidentReference;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }

    public String getIncidentSeverity() {
        return incidentSeverity;
    }

    public void setIncidentSeverity(String incidentSeverity) {
        this.incidentSeverity = incidentSeverity;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<AssignedVolunteerDto> getAssignedVolunteers() {
        return assignedVolunteers;
    }

    public void setAssignedVolunteers(List<AssignedVolunteerDto> assignedVolunteers) {
        this.assignedVolunteers = assignedVolunteers;
    }
}
