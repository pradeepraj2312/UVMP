package com.project.uvmp.dto.admin;

import com.project.uvmp.dto.incident.IncidentResponse;
import com.project.uvmp.dto.task.TaskResponse;

import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private long totalDistricts;
    private long totalNgos;
    private long approvedNgos;
    private long pendingNgos;
    private long totalVolunteers;
    private long availableVolunteers;
    private long totalIncidents;
    private long pendingIncidents;
    private long totalTasks;
    private long activeTasks;
    private long completedTasks;

    private List<DistrictStatDto> districtStats;
    private List<IncidentResponse> recentIncidents;
    private List<TaskResponse> criticalTasks;
    private Map<String, Long> severityDistribution;

    private List<AdminUserDto> admins;
    private List<AdminVolunteerDto> volunteers;
    private List<AdminDistrictAuthorityDto> districtAuthorities;

    public static class DistrictStatDto {
        private Long districtId;
        private String districtName;
        private String region;
        private long ngosCount;
        private long volunteersCount;
        private long activeTasksCount;
        private long incidentsCount;

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
    }

    public AdminDashboardResponse() {
    }

    public long getTotalDistricts() {
        return totalDistricts;
    }

    public void setTotalDistricts(long totalDistricts) {
        this.totalDistricts = totalDistricts;
    }

    public long getTotalNgos() {
        return totalNgos;
    }

    public void setTotalNgos(long totalNgos) {
        this.totalNgos = totalNgos;
    }

    public long getApprovedNgos() {
        return approvedNgos;
    }

    public void setApprovedNgos(long approvedNgos) {
        this.approvedNgos = approvedNgos;
    }

    public long getPendingNgos() {
        return pendingNgos;
    }

    public void setPendingNgos(long pendingNgos) {
        this.pendingNgos = pendingNgos;
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

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
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

    public List<DistrictStatDto> getDistrictStats() {
        return districtStats;
    }

    public void setDistrictStats(List<DistrictStatDto> districtStats) {
        this.districtStats = districtStats;
    }

    public List<IncidentResponse> getRecentIncidents() {
        return recentIncidents;
    }

    public void setRecentIncidents(List<IncidentResponse> recentIncidents) {
        this.recentIncidents = recentIncidents;
    }

    public List<TaskResponse> getCriticalTasks() {
        return criticalTasks;
    }

    public void setCriticalTasks(List<TaskResponse> criticalTasks) {
        this.criticalTasks = criticalTasks;
    }

    public Map<String, Long> getSeverityDistribution() {
        return severityDistribution;
    }

    public void setSeverityDistribution(Map<String, Long> severityDistribution) {
        this.severityDistribution = severityDistribution;
    }

    public List<AdminUserDto> getAdmins() {
        return admins;
    }

    public void setAdmins(List<AdminUserDto> admins) {
        this.admins = admins;
    }

    public List<AdminVolunteerDto> getVolunteers() {
        return volunteers;
    }

    public void setVolunteers(List<AdminVolunteerDto> volunteers) {
        this.volunteers = volunteers;
    }

    public List<AdminDistrictAuthorityDto> getDistrictAuthorities() {
        return districtAuthorities;
    }

    public void setDistrictAuthorities(List<AdminDistrictAuthorityDto> districtAuthorities) {
        this.districtAuthorities = districtAuthorities;
    }
}
