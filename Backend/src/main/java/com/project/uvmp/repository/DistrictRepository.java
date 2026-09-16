package com.project.uvmp.repository;

import com.project.uvmp.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    java.util.List<District> findAllByAdminId(Long adminId);
    Optional<District> findFirstByAdminId(Long adminId);
    default Optional<District> findByAdminId(Long adminId) {
        return findFirstByAdminId(adminId);
    }
    Optional<District> findByName(String name);
    boolean existsByName(String name);
    java.util.List<District> findByStatus(String status);
}
