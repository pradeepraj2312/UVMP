package com.project.uvmp.dto;

public final class IncidentDtos {
    private IncidentDtos() { }
    public record CreateIncidentRequest(String disasterType, String severity, String district, String taluk,
            String address, Double latitude, Double longitude, Integer trappedCount, Integer injuredCount,
            String description, String assistanceNeeded, String reporterName, String reporterPhone, boolean anonymous) { }
}