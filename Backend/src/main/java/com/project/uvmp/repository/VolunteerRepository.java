package com.project.uvmp.repository;

import com.project.uvmp.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    List<Volunteer> findByDistrictId(Long districtId);
    List<Volunteer> findByNgoId(Long ngoId);
    Optional<Volunteer> findByUserId(Long userId);
    Optional<Volunteer> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Volunteer> findByAvailability(String availability);
    List<Volunteer> findByNgoIdIsNullAndDistrictIdIsNull();
    List<Volunteer> findByDistrictIdAndNgoIdIsNull(Long districtId);
    long countByDistrictId(Long districtId);
}
