package com.project.uvmp.dto.ngo;

import com.project.uvmp.dto.task.TaskResponse;
import java.util.List;

public class NgoDashboardResponse {
    private Long ngoId;
    private String ngoName;
    private String registrationStatus;
    private String contactInfo;
    private String email;
    private String phone;

    private long totalAssignedTasks;
    private long activeTasks;
    private long completedTasks;
    private long totalVolunteers;
    private long availableVolunteers;
    private long recognitionsAwarded;

    private List<TaskResponse> recentTasks;

    public NgoDashboardResponse() {
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

    public long getTotalAssignedTasks() {
        return totalAssignedTasks;
    }

    public void setTotalAssignedTasks(long totalAssignedTasks) {
        this.totalAssignedTasks = totalAssignedTasks;
    }

    public long getActiveTasks() {
        return activeTasks;
    }

    public void setActiveTasks(long activeTasks) {
        this.activeTasks = activeTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getTotalVolunteers() {
        return totalVolunteers;
    }

    public void setTotalVolunteers(long totalVolunteers) {
        this.totalVolunteers = totalVolunteers;
    }

    public long getAvailableVolunteers() {
        return availableVolunteers;
    }

    public void setAvailableVolunteers(long availableVolunteers) {
        this.availableVolunteers = availableVolunteers;
    }

    public long getRecognitionsAwarded() {
        return recognitionsAwarded;
    }

    public void setRecognitionsAwarded(long recognitionsAwarded) {
        this.recognitionsAwarded = recognitionsAwarded;
    }

    public List<TaskResponse> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskResponse> recentTasks) {
        this.recentTasks = recentTasks;
    }
}
