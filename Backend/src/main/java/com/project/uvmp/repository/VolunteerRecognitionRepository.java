package com.project.uvmp.repository;

import com.project.uvmp.model.VolunteerRecognition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerRecognitionRepository extends JpaRepository<VolunteerRecognition, Long> {
    List<VolunteerRecognition> findByNgoIdOrderByIssuedAtDesc(Long ngoId);
    List<VolunteerRecognition> findByVolunteerIdOrderByIssuedAtDesc(Long volunteerId);
    boolean existsByCertificateCode(String certificateCode);
    long countByNgoId(Long ngoId);
}
