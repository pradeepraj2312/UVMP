package com.project.uvmp.dto.ngo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RecognitionAwardRequest {

    @NotNull(message = "Volunteer ID is required")
    private Long volunteerId;

    private Long taskId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String badgeType = "COMMUNITY_STAR"; // HERO, LIFESAVER, FIELD_MASTER, COMMUNITY_STAR

    private Double hoursRecognized = 8.0;

    public RecognitionAwardRequest() {
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
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
}
