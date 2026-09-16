package com.project.uvmp.repository;

import com.project.uvmp.model.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    List<Ngo> findByDistrictId(Long districtId);
    List<Ngo> findByRegistrationStatus(String registrationStatus);
    Optional<Ngo> findByUserId(Long userId);
    Optional<Ngo> findByName(String name);
    boolean existsByName(String name);
    long countByDistrictId(Long districtId);
}
