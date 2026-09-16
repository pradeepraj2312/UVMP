package com.project.uvmp.dto.volunteer;

import jakarta.validation.constraints.Size;

public class VolunteerProfileUpdateRequest {

    @Size(max = 30, message = "Phone must be at most 30 characters")
    private String phone;

    private String availability; // AVAILABLE, BUSY, OFFLINE

    @Size(max = 500, message = "Skills string must be at most 500 characters")
    private String skills;

    private Double latitude;
    private Double longitude;

    public VolunteerProfileUpdateRequest() {
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

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
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
