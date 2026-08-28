package com.project.uvmp.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.uvmp.dto.AuthDtos.AuthResponse;
import com.project.uvmp.dto.AuthDtos.LoginRequest;
import com.project.uvmp.dto.AuthDtos.RegisterRequest;
import com.project.uvmp.entity.AppUser;
import com.project.uvmp.entity.Role;
import com.project.uvmp.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final com.project.uvmp.security.JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder encoder, AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService, com.project.uvmp.security.JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) throw new IllegalArgumentException("Email is already registered");
        Role role = request.role() == null ? Role.VOLUNTEER : request.role();
        if (role == Role.ADMIN) throw new IllegalArgumentException("Admin accounts cannot be self-registered");
        AppUser user = new AppUser();
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(encoder.encode(request.password()));
        user.setFirstName(request.firstName()); user.setLastName(request.lastName());
        user.setContactNumber(request.contactNumber()); user.setDistrict(request.district()); user.setRole(role);
        return response(users.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        AppUser user = users.findByEmailIgnoreCase(request.email()).orElseThrow();
        return response(user);
    }

    private AuthResponse response(AppUser user) {
        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        return new AuthResponse(jwtService.generateToken(details), user.getId(), user.getEmail(), user.getFirstName(), user.getRole());
    }
}