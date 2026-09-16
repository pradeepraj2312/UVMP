package com.project.uvmp.repository;

import com.project.uvmp.model.Incident;
import com.project.uvmp.model.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
    List<Incident> findAllByOrderByCreatedAtDesc();
    boolean existsByDescription(String description);
    long countByStatus(IncidentStatus status);
}
