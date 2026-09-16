package com.project.uvmp.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DistrictAuthorityRegisterRequest {

    @NotBlank(message = "Officer name is required")
    private String name;

    @NotBlank(message = "Official email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    @NotBlank(message = "District name is required")
    private String districtName;

    @NotBlank(message = "Region or operational zone is required")
    private String region;

    private Long existingDistrictId;

    public DistrictAuthorityRegisterRequest() {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Long getExistingDistrictId() {
        return existingDistrictId;
    }

    public void setExistingDistrictId(Long existingDistrictId) {
        this.existingDistrictId = existingDistrictId;
    }
}
