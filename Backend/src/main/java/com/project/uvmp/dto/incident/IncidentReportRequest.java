package com.project.uvmp.dto.incident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IncidentReportRequest {

    @NotBlank(message = "Reporter name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String reporterName;

    @NotBlank(message = "Reporter phone number is required")
    @Size(min = 5, max = 20, message = "Phone must be valid")
    private String reporterPhone;

    private String reporterEmail;

    @NotBlank(message = "Incident type is required")
    private String incidentType;

    @NotBlank(message = "Severity level is required")
    private String severity = "HIGH";

    @NotBlank(message = "Description of the emergency is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    private String locationAddress;

    @NotNull(message = "Latitude coordinate is required")
    private Double latitude;

    @NotNull(message = "Longitude coordinate is required")
    private Double longitude;

    private Integer peopleAffected = 1;

    public IncidentReportRequest() {
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReporterPhone() {
        return reporterPhone;
    }

    public void setReporterPhone(String reporterPhone) {
        this.reporterPhone = reporterPhone;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
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

    public Integer getPeopleAffected() {
        return peopleAffected;
    }

    public void setPeopleAffected(Integer peopleAffected) {
        this.peopleAffected = peopleAffected;
    }
}
