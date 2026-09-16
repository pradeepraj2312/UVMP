package com.project.uvmp.dto.district;

import com.project.uvmp.dto.incident.IncidentResponse;
import com.project.uvmp.dto.task.TaskResponse;

import java.util.List;
import java.util.Map;

public class DistrictDashboardResponse {
    private String districtName;
    private String region;
    private long totalIncidents;
    private long pendingIncidents;
    private long verifiedIncidents;
    private long convertedTasks;
    private long activeTasks;
    private long totalNgos;
    private long totalVolunteers;
    private Map<String, Long> severityDistribution;
    private List<IncidentResponse> recentIncidents;
    private List<TaskResponse> recentTasks;

    public DistrictDashboardResponse() {
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

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public long getPendingIncidents() {
        return pendingIncidents;
    }

    public void setPendingIncidents(long pendingIncidents) {
        this.pendingIncidents = pendingIncidents;
    }

    public long getVerifiedIncidents() {
        return verifiedIncidents;
    }

    public void setVerifiedIncidents(long verifiedIncidents) {
        this.verifiedIncidents = verifiedIncidents;
    }

    public long getConvertedTasks() {
        return convertedTasks;
    }

    public void setConvertedTasks(long convertedTasks) {
        this.convertedTasks = convertedTasks;
    }

    public long getActiveTasks() {
        return activeTasks;
    }

    public void setActiveTasks(long activeTasks) {
        this.activeTasks = activeTasks;
    }

    public long getTotalNgos() {
        return totalNgos;
    }

    public void setTotalNgos(long totalNgos) {
        this.totalNgos = totalNgos;
    }

    public long getTotalVolunteers() {
        return totalVolunteers;
    }

    public void setTotalVolunteers(long totalVolunteers) {
        this.totalVolunteers = totalVolunteers;
    }

    public Map<String, Long> getSeverityDistribution() {
        return severityDistribution;
    }

    public void setSeverityDistribution(Map<String, Long> severityDistribution) {
        this.severityDistribution = severityDistribution;
    }

    public List<IncidentResponse> getRecentIncidents() {
        return recentIncidents;
    }

    public void setRecentIncidents(List<IncidentResponse> recentIncidents) {
        this.recentIncidents = recentIncidents;
    }

    public List<TaskResponse> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskResponse> recentTasks) {
        this.recentTasks = recentTasks;
    }
}
