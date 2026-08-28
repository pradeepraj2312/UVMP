package com.project.uvmp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.uvmp.entity.AppUser;
import com.project.uvmp.entity.Role;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    List<AppUser> findByRole(Role role);
    boolean existsByEmailIgnoreCase(String email);
}