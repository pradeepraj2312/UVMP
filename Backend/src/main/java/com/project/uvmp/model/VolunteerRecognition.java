package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_recognitions")
public class VolunteerRecognition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "volunteer_id", nullable = false)
    private Long volunteerId;

    @Column(name = "ngo_id", nullable = false)
    private Long ngoId;

    @Column(name = "task_id")
    private Long taskId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "badge_type", nullable = false, length = 50)
    private String badgeType = "COMMUNITY_STAR"; // HERO, LIFESAVER, FIELD_MASTER, COMMUNITY_STAR

    @Column(name = "hours_recognized", nullable = false)
    private Double hoursRecognized = 0.0;

    @Column(name = "certificate_code", nullable = false, unique = true, length = 50)
    private String certificateCode;

    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    public VolunteerRecognition() {
    }

    public VolunteerRecognition(Long volunteerId, Long ngoId, Long taskId, String title,
                                String description, String badgeType, Double hoursRecognized, String certificateCode) {
        this.volunteerId = volunteerId;
        this.ngoId = ngoId;
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.badgeType = badgeType != null ? badgeType : "COMMUNITY_STAR";
        this.hoursRecognized = hoursRecognized != null ? hoursRecognized : 0.0;
        this.certificateCode = certificateCode;
    }

    @PrePersist
    protected void onCreate() {
        this.issuedAt = LocalDateTime.now();
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

    public Long getNgoId() {
        return ngoId;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
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
