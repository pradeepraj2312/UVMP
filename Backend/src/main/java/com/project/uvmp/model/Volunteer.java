package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "ngo_id")
    private Long ngoId;

    @Column(name = "district_id")
    private Long districtId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String availability = "AVAILABLE"; // AVAILABLE, BUSY, OFFLINE

    @Column(name = "reliability_score", nullable = false)
    private Double reliabilityScore = 85.0; // 0.0 - 100.0

    @Column(name = "skills", length = 500)
    private String skills; // e.g. "First Aid, Search & Rescue, Medical, Driving"

    @Column(name = "transport", length = 60)
    private String transport;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Volunteer() {
    }

    public Volunteer(Long userId, Long ngoId, Long districtId, String name, String email, String phone,
                     Double latitude, Double longitude, String availability, Double reliabilityScore, String skills) {
        this.userId = userId;
        this.ngoId = ngoId;
        this.districtId = districtId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.availability = availability != null ? availability : "AVAILABLE";
        this.reliabilityScore = reliabilityScore != null ? reliabilityScore : 85.0;
        this.skills = skills;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
