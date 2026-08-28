package com.project.uvmp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;

@Entity
public class VolunteerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    private AppUser user;
    @Lob
    private String profileData;

    public void setUser(AppUser user) { this.user = user; }
    public void setProfileData(String profileData) { this.profileData = profileData; }
}