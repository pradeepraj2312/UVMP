package com.project.uvmp.dto.admin;

import java.time.LocalDateTime;

public class AdminDistrictDto {
    private Long id;
    private String name;
    private String region;
    private Long adminId;
    private String adminEmail;
    private long ngosCount;
    private long volunteersCount;
    private long tasksCount;
    private long activeTasksCount;
    private long incidentsCount;
    private LocalDateTime createdAt;

    public AdminDistrictDto() {
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

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public long getNgosCount() {
        return ngosCount;
    }

    public void setNgosCount(long ngosCount) {
        this.ngosCount = ngosCount;
    }

    public long getVolunteersCount() {
        return volunteersCount;
    }

    public void setVolunteersCount(long volunteersCount) {
        this.volunteersCount = volunteersCount;
    }

    public long getTasksCount() {
        return tasksCount;
    }

    public void setTasksCount(long tasksCount) {
        this.tasksCount = tasksCount;
    }

    public long getActiveTasksCount() {
        return activeTasksCount;
    }

    public void setActiveTasksCount(long activeTasksCount) {
        this.activeTasksCount = activeTasksCount;
    }

    public long getIncidentsCount() {
        return incidentsCount;
    }

    public void setIncidentsCount(long incidentsCount) {
        this.incidentsCount = incidentsCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
