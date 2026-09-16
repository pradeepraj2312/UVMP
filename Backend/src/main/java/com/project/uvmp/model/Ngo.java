package com.project.uvmp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ngos")
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "district_id", nullable = false)
    private Long districtId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "registration_status", nullable = false, length = 30)
    private String registrationStatus = "APPROVED"; // APPROVED, PENDING, REJECTED

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @Column(length = 120)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Ngo() {
    }

    public Ngo(String name, Long districtId, Long userId, String registrationStatus, String contactInfo, String email, String phone) {
        this.name = name;
        this.districtId = districtId;
        this.userId = userId;
        this.registrationStatus = registrationStatus != null ? registrationStatus : "APPROVED";
        this.contactInfo = contactInfo;
        this.email = email;
        this.phone = phone;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(String registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
