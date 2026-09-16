package com.project.uvmp.dto.admin;

import java.util.List;
import java.util.Map;

public class AdminReportsResponse {
    private Map<String, Long> incidentSeverityBreakdown;
    private Map<String, Long> taskStatusBreakdown;
    private Map<String, Long> taskUrgencyBreakdown;
    private Map<String, Long> volunteerAvailabilityBreakdown;
    private double totalHoursLogged;
    private double averageReliabilityScore;
    private long totalRecognitionsIssued;
    private List<DistrictReportRowDto> districtBreakdown;

    public static class DistrictReportRowDto {
        private Long districtId;
        private String districtName;
        private String region;
        private long totalIncidents;
        private long resolvedIncidents;
        private long totalTasks;
        private long completedTasks;
        private long totalVolunteers;
        private double responseEfficiencyScore; // 0-100%

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

        public long getResolvedIncidents() {
            return resolvedIncidents;
        }

        public void setResolvedIncidents(long resolvedIncidents) {
            this.resolvedIncidents = resolvedIncidents;
        }

        public long getTotalTasks() {
            return totalTasks;
        }

        public void setTotalTasks(long totalTasks) {
            this.totalTasks = totalTasks;
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

        public double getResponseEfficiencyScore() {
            return responseEfficiencyScore;
        }

        public void setResponseEfficiencyScore(double responseEfficiencyScore) {
            this.responseEfficiencyScore = responseEfficiencyScore;
        }
    }

    public AdminReportsResponse() {
    }

    public Map<String, Long> getIncidentSeverityBreakdown() {
        return incidentSeverityBreakdown;
    }

    public void setIncidentSeverityBreakdown(Map<String, Long> incidentSeverityBreakdown) {
        this.incidentSeverityBreakdown = incidentSeverityBreakdown;
    }

    public Map<String, Long> getTaskStatusBreakdown() {
        return taskStatusBreakdown;
    }

    public void setTaskStatusBreakdown(Map<String, Long> taskStatusBreakdown) {
        this.taskStatusBreakdown = taskStatusBreakdown;
    }

    public Map<String, Long> getTaskUrgencyBreakdown() {
        return taskUrgencyBreakdown;
    }

    public void setTaskUrgencyBreakdown(Map<String, Long> taskUrgencyBreakdown) {
        this.taskUrgencyBreakdown = taskUrgencyBreakdown;
    }

    public Map<String, Long> getVolunteerAvailabilityBreakdown() {
        return volunteerAvailabilityBreakdown;
    }

    public void setVolunteerAvailabilityBreakdown(Map<String, Long> volunteerAvailabilityBreakdown) {
        this.volunteerAvailabilityBreakdown = volunteerAvailabilityBreakdown;
    }

    public double getTotalHoursLogged() {
        return totalHoursLogged;
    }

    public void setTotalHoursLogged(double totalHoursLogged) {
        this.totalHoursLogged = totalHoursLogged;
    }

    public double getAverageReliabilityScore() {
        return averageReliabilityScore;
    }

    public void setAverageReliabilityScore(double averageReliabilityScore) {
        this.averageReliabilityScore = averageReliabilityScore;
    }

    public long getTotalRecognitionsIssued() {
        return totalRecognitionsIssued;
    }

    public void setTotalRecognitionsIssued(long totalRecognitionsIssued) {
        this.totalRecognitionsIssued = totalRecognitionsIssued;
    }

    public List<DistrictReportRowDto> getDistrictBreakdown() {
        return districtBreakdown;
    }

    public void setDistrictBreakdown(List<DistrictReportRowDto> districtBreakdown) {
        this.districtBreakdown = districtBreakdown;
    }
}
