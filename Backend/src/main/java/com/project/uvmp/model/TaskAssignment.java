package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"task_id", "volunteer_id"})
})
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "volunteer_id", nullable = false)
    private Long volunteerId;

    @Column(nullable = false, length = 30)
    private String status = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "match_score", nullable = false)
    private Double matchScore = 0.0;

    @Column(name = "hours_logged", nullable = false)
    private Double hoursLogged = 0.0;

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "proof_image_url", length = 255)
    private String proofImageUrl;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public TaskAssignment() {
    }

    public TaskAssignment(Long taskId, Long volunteerId, String status) {
        this(taskId, volunteerId, status, 0.0);
    }

    public TaskAssignment(Long taskId, Long volunteerId, String status, Double matchScore) {
        this.taskId = taskId;
        this.volunteerId = volunteerId;
        this.status = status != null ? status : "ASSIGNED";
        this.matchScore = matchScore != null ? matchScore : 0.0;
    }

    @PrePersist
    protected void onCreate() {
        if (this.assignedAt == null) {
            this.assignedAt = LocalDateTime.now();
        }
        if (this.matchScore == null) {
            this.matchScore = 0.0;
        }
        if (this.hoursLogged == null) {
            this.hoursLogged = 0.0;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
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

    public String getProofImageUrl() {
        return proofImageUrl;
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofImageUrl = proofImageUrl;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
