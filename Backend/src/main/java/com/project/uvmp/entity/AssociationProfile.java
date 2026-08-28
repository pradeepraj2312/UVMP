package com.project.uvmp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;

@Entity
public class AssociationProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    private AppUser user;
    private String associationName;
    private String registrationNumber;
    @Lob
    private String profileData;

    public void setUser(AppUser user) { this.user = user; }
    public void setAssociationName(String associationName) { this.associationName = associationName; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public void setProfileData(String profileData) { this.profileData = profileData; }
}