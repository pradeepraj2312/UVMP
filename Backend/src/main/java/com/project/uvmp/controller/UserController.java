package com.project.uvmp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.uvmp.entity.AppUser;
import com.project.uvmp.entity.Role;
import com.project.uvmp.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;

    public UserController(UserRepository users) { this.users = users; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISTRICT_AUTHORITY', 'NGO')")
    public List<AppUser> list(@RequestParam(required = false) Role role) {
        return role == null ? users.findAll() : users.findByRole(role);
    }
}