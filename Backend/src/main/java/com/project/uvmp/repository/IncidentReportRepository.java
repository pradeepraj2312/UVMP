package com.project.uvmp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.uvmp.entity.IncidentReport;

public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {
    Optional<IncidentReport> findByReferenceId(String referenceId);
    List<IncidentReport> findByDistrictIgnoreCaseOrderBySubmittedAtDesc(String district);
}