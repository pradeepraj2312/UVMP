package com.project.uvmp.dto;

import com.project.uvmp.entity.Role;

public final class AuthDtos {
    private AuthDtos() { }
    public record LoginRequest(String email, String password) { }
    public record RegisterRequest(String email, String password, String firstName, String lastName,
                                  String contactNumber, String district, Role role) { }
    public record AuthResponse(String token, Long id, String email, String firstName, Role role) { }
}