package com.project.uvmp.dto.volunteer;

import com.project.uvmp.model.Volunteer;
import java.time.LocalDateTime;

public class VolunteerResponse {
    private Long id;
    private Long userId;
    private Long ngoId;
    private String ngoName;
    private Long districtId;
    private String districtName;
    private String name;
    private String email;
    private String phone;
    private Double latitude;
    private Double longitude;
    private String availability;
    private Double reliabilityScore;
    private String skills;
    private String transport;
    private String status; // ACTIVE, PENDING, REJECTED
    private String rejectionReason;
    private LocalDateTime createdAt;

    public VolunteerResponse() {
    }

    public static VolunteerResponse fromEntity(Volunteer v, String ngoName) {
        return fromEntity(v, ngoName, null, null, null);
    }

    public static VolunteerResponse fromEntity(Volunteer v, String ngoName, String districtName) {
        return fromEntity(v, ngoName, districtName, null, null);
    }

    public static VolunteerResponse fromEntity(Volunteer v, String ngoName, String districtName, String status, String rejectionReason) {
        VolunteerResponse resp = new VolunteerResponse();
        resp.setId(v.getId());
        resp.setUserId(v.getUserId());
        resp.setNgoId(v.getNgoId());
        resp.setNgoName(ngoName);
        resp.setDistrictId(v.getDistrictId());
        resp.setDistrictName(districtName);
        resp.setName(v.getName());
        resp.setEmail(v.getEmail());
        resp.setPhone(v.getPhone());
        resp.setLatitude(v.getLatitude());
        resp.setLongitude(v.getLongitude());
        resp.setAvailability(v.getAvailability());
        resp.setReliabilityScore(v.getReliabilityScore());
        resp.setSkills(v.getSkills());
        resp.setTransport(v.getTransport());
        resp.setStatus(status);
        resp.setRejectionReason(rejectionReason);
        resp.setCreatedAt(v.getCreatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getTransport() {
        return transport;
    }

    public void setTransport(String transport) {
        this.transport = transport;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
