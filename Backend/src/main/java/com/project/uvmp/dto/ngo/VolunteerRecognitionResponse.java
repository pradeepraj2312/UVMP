package com.project.uvmp.dto.ngo;

import com.project.uvmp.model.VolunteerRecognition;
import java.time.LocalDateTime;

public class VolunteerRecognitionResponse {
    private Long id;
    private Long volunteerId;
    private String volunteerName;
    private String volunteerEmail;
    private Long ngoId;
    private String ngoName;
    private Long taskId;
    private String title;
    private String description;
    private String badgeType;
    private Double hoursRecognized;
    private String certificateCode;
    private LocalDateTime issuedAt;

    public VolunteerRecognitionResponse() {
    }

    public static VolunteerRecognitionResponse fromEntity(VolunteerRecognition r, String volunteerName, String volunteerEmail, String ngoName) {
        VolunteerRecognitionResponse resp = new VolunteerRecognitionResponse();
        resp.setId(r.getId());
        resp.setVolunteerId(r.getVolunteerId());
        resp.setVolunteerName(volunteerName);
        resp.setVolunteerEmail(volunteerEmail);
        resp.setNgoId(r.getNgoId());
        resp.setNgoName(ngoName);
        resp.setTaskId(r.getTaskId());
        resp.setTitle(r.getTitle());
        resp.setDescription(r.getDescription());
        resp.setBadgeType(r.getBadgeType());
        resp.setHoursRecognized(r.getHoursRecognized());
        resp.setCertificateCode(r.getCertificateCode());
        resp.setIssuedAt(r.getIssuedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerEmail() {
        return volunteerEmail;
    }

    public void setVolunteerEmail(String volunteerEmail) {
        this.volunteerEmail = volunteerEmail;
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

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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

    public String getBadgeType() {
        return badgeType;
    }

    public void setBadgeType(String badgeType) {
        this.badgeType = badgeType;
    }

    public Double getHoursRecognized() {
        return hoursRecognized;
    }

    public void setHoursRecognized(Double hoursRecognized) {
        this.hoursRecognized = hoursRecognized;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}
