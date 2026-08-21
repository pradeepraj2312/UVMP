import React, { useState } from 'react';
import logo from '../assets/uvmp_logo.png';

function VolunteerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    // 1. Personal Information
    fullName: '',
    profilePhoto: null,
    dob: '',
    gender: '',
    bloodGroup: '',
    mobile: '',
    email: '',
    address: '',
    district: '',
    state: '',
    pinCode: '',

    // 2. Association Details
    association: '',
    membershipId: '',

    // 3. Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyMobile: '',

    // 4. Skills (Multi-select)
    skills: [],
    otherSkill: '',

    // 5. Availability & Status
    availability: [],
    currentStatus: 'Available',

    // 6. Transport Availability
    vehicleType: '',
    hasLicense: 'No',
    licenseNumber: '',

    // 7. Languages Known
    languages: [],
    otherLanguage: '',

    // 8. Experience
    hasVolunteerExp: 'No',
    expOrganization: '',
    expYears: '',
    hasDisasterExp: 'No',
    eventsParticipated: '',

    // 9. Certifications
    certifications: [],
    certificateFile: null,

    // 10. Medical Information
    medicalConditions: '',
    allergies: '',
    physicalDisabilities: '',

    // 11. Identity Verification
    govtIdFile: null,
    studentIdFile: null,

    // 12. Consent
    agreeActivities: false,
    agreeTerms: false,
    agreeDataUse: false,
  });

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Toggle multi-select array items
  const toggleArrayItem = (fieldKey, itemValue) => {
    setFormData((prev) => {
      const currentList = prev[fieldKey] || [];
      const exists = currentList.includes(itemValue);
      if (exists) {
        return { ...prev, [fieldKey]: currentList.filter((i) => i !== itemValue) };
      } else {
        return { ...prev, [fieldKey]: [...currentList, itemValue] };
      }
    });
  };

  // File upload simulation handler
  const handleFileChange = (e, fileKey) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fileKey]: e.target.files[0] }));
    }
  };

  // Step navigation
  const handleNext = () => {
    if (currentStep === 5) {
      if (!formData.agreeActivities || !formData.agreeTerms || !formData.agreeDataUse) {
        alert('Please accept all consent checkboxes before submitting.');
        return;
      }
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      window.location.reload();
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel registration? All unsaved data will be lost.')) {
      window.location.hash = '#landing';
    }
  };

  const skillsList = [
    'First Aid',
    'Medical Assistance',
    'Search & Rescue',
    'Fire Safety',
    'Food Distribution',
    'Crowd Management',
    'Traffic Control',
    'Logistics & Supply',
    'Child Care',
    'Elderly Care',
    'Disaster Relief',
    'Communication',
    'Psychological Support',
    'Technical Support',
    'Event Management',
    'Other',
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Anytime',
    'Morning',
    'Afternoon',
    'Evening',
    'Emergency Calls Only',
  ];

  const languagesList = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Other'];

  const certificationsList = [
    'First Aid Certified',
    'CPR Certified',
    'Disaster Response Training',
    'Fire Safety Training',
    'Medical Training',
    'NSS',
    'NCC',
  ];

  return (
    <div className="volunteer-reg-page">
      <style>{`
        /* Internal CSS matching UVMP Warm Cream (#FBF8F5) & Deep Maroon (#800000) Theme */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .volunteer-reg-page {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
          background-color: #FBF8F5;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .volunteer-reg-page * {
          box-sizing: border-box;
        }

        /* --- Header --- */
        .v-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 5%;
          background-color: #ffffff;
          border-bottom: 1px solid #F0F0F0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .v-brand-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .v-brand-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .v-brand-text-group {
          display: flex;
          flex-direction: column;
        }

        .v-brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #800000;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .v-brand-subtitle {
          font-size: 0.78rem;
          color: #6B7280;
          font-weight: 500;
        }

        .v-cancel-btn {
          background: transparent;
          border: none;
          color: #4B5563;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .v-cancel-btn:hover {
          color: #800000;
        }

        /* --- Main Content Wrapper --- */
        .v-main-content {
          flex: 1;
          max-width: 940px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 20px 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .v-title-section {
          text-align: center;
          margin-bottom: 32px;
          max-width: 680px;
        }

        .v-main-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .v-main-subtext {
          font-size: 0.92rem;
          color: #6B7280;
          line-height: 1.55;
          margin: 0;
        }

        /* --- Progress Stepper (6 Steps) --- */
        .v-stepper-container {
          width: 100%;
          max-width: 840px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-bottom: 36px;
        }

        .v-stepper-progress-line {
          position: absolute;
          top: 18px;
          left: 24px;
          right: 24px;
          height: 2px;
          background-color: #800000;
          z-index: 1;
        }

        .v-stepper-progress-active {
          position: absolute;
          top: 18px;
          left: 24px;
          height: 2px;
          background-color: #800000;
          z-index: 1;
          transition: width 0.35s ease;
        }

        .v-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 2;
          cursor: pointer;
        }

        .v-step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #E5E7EB;
          color: #6B7280;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #FBF8F5;
          transition: all 0.3s ease;
        }

        .v-step-item.active .v-step-circle {
          background-color: #800000;
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.2);
        }

        .v-step-item.completed .v-step-circle {
          background-color: #800000;
          color: #ffffff;
        }

        .v-step-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #6B7280;
          transition: color 0.3s ease;
        }

        .v-step-item.active .v-step-label,
        .v-step-item.completed .v-step-label {
          color: #800000;
        }

        /* --- Form Card --- */
        .v-card {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
          width: 100%;
          padding: 36px 40px;
          margin-bottom: 28px;
        }

        .v-card-header-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F3F4F6;
        }

        .v-card-header-icon {
          color: #800000;
          display: flex;
          align-items: center;
        }

        /* --- Section Container --- */
        .v-section-block {
          background-color: #FDF8F5;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid #F3E8DF;
        }

        .v-section-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: #8B4513;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .v-section-icon {
          color: #800000;
          display: flex;
          align-items: center;
        }

        /* --- Form Fields --- */
        .v-form-grid-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .v-form-grid-triple {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .v-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .v-field-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
        }

        .v-required {
          color: #800000;
          margin-left: 2px;
        }

        .v-form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #111827;
          outline: none;
          background-color: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }

        .v-form-input:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.1);
        }

        .v-form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #111827;
          outline: none;
          background-color: #ffffff;
          appearance: none;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .v-form-select:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.1);
        }

        .v-help-text {
          font-size: 0.78rem;
          color: #6B7280;
          margin-top: 4px;
        }

        /* --- Multi-Select Cards Grid --- */
        .v-pill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
          margin-top: 8px;
        }

        .v-pill-card {
          background-color: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .v-pill-card:hover {
          border-color: #800000;
          background-color: #FFFDFD;
        }

        .v-pill-card.selected {
          border-color: #800000;
          background-color: #FDF2F2;
          box-shadow: 0 2px 6px rgba(128, 0, 0, 0.08);
        }

        .v-pill-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #800000;
          cursor: pointer;
        }

        .v-pill-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #111827;
        }

        /* --- Radio Button Groups --- */
        .v-radio-group {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-top: 6px;
        }

        .v-radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }

        .v-radio-input {
          width: 18px;
          height: 18px;
          accent-color: #800000;
          cursor: pointer;
        }

        /* --- Upload Dropzone --- */
        .v-upload-zone {
          border: 2px dashed #E5E7EB;
          border-radius: 12px;
          padding: 24px 18px;
          text-align: center;
          background-color: #ffffff;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .v-upload-zone:hover {
          border-color: #800000;
          background-color: #FDF2F2;
        }

        .v-upload-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #FCE8E6;
          color: #800000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .v-upload-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #800000;
          margin-bottom: 2px;
        }

        .v-upload-subtitle {
          font-size: 0.76rem;
          color: #6B7280;
        }

        .v-hidden-file {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .v-file-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 4px 12px;
          background-color: #E6F4EA;
          color: #137333;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
        }

        /* --- Consent Checkbox Box --- */
        .v-consent-box {
          background-color: #FDF8F5;
          border-radius: 12px;
          padding: 20px 24px;
          border: 1px solid #F3E8DF;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .v-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }

        .v-checkbox-row input {
          width: 18px;
          height: 18px;
          accent-color: #800000;
          margin-top: 2px;
          cursor: pointer;
        }

        .v-checkbox-row span {
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          line-height: 1.4;
        }

        /* --- Bottom Actions --- */
        .v-bottom-actions {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .v-btn-reset {
          background-color: #ffffff;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 12px 28px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .v-btn-reset:hover {
          background-color: #F9FAFB;
          border-color: #9CA3AF;
        }

        .v-btn-back {
          background-color: #ffffff;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 12px 28px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .v-btn-back:hover {
          background-color: #F9FAFB;
          border-color: #9CA3AF;
        }

        .v-btn-next {
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 12px 32px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(128, 0, 0, 0.25);
        }

        .v-btn-next:hover {
          background-color: #660000;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(128, 0, 0, 0.35);
        }

        /* --- STEP 6: SUCCESS CARD / SUBMISSION STATUS --- */
        .v-status-success-container {
          background-color: #ffffff;
          border-radius: 18px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 720px;
          display: grid;
          grid-template-columns: 240px 1fr;
          overflow: hidden;
        }

        .v-status-left-panel {
          background-color: #FDF8F5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          border-right: 1px solid #F3E8DF;
        }

        .v-status-badge-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(128, 0, 0, 0.06);
          border: 1px solid #F3E8DF;
        }

        .v-status-right-panel {
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .v-status-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }

        .v-status-subtitle {
          font-size: 0.9rem;
          color: #4B5563;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .v-status-notice-box {
          background-color: #FDF8F5;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          border: 1px solid #F3E8DF;
        }

        .v-status-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FDF3E7;
          color: #B45309;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .v-status-notice-text {
          font-size: 0.83rem;
          color: #4B5563;
          line-height: 1.5;
          margin: 0;
        }

        .v-btn-home-action {
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          align-self: flex-start;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(128, 0, 0, 0.2);
        }

        .v-btn-home-action:hover {
          background-color: #660000;
        }

        /* --- Responsive Breakpoints --- */
        @media (max-width: 768px) {
          .v-header {
            padding: 14px 20px;
          }

          .v-main-content {
            padding: 24px 16px 40px 16px;
          }

          .v-main-heading {
            font-size: 1.8rem;
          }

          .v-card {
            padding: 24px 20px;
          }

          .v-form-grid-double,
          .v-form-grid-triple {
            grid-template-columns: 1fr;
          }

          .v-stepper-container {
            max-width: 100%;
          }

          .v-step-label {
            font-size: 0.64rem;
          }

          .v-step-circle {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }

          .v-status-success-container {
            grid-template-columns: 1fr;
          }

          .v-status-left-panel {
            padding: 24px;
            border-right: none;
            border-bottom: 1px solid #F3E8DF;
          }

          .v-status-right-panel {
            padding: 28px 20px;
          }
        }
      `}</style>

      {/* Header Bar */}
      <header className="v-header">
        <a href="#landing" className="v-brand-wrapper">
          <img src={logo} alt="UVMP Logo" className="v-brand-logo-img" />
        </a>

        <button className="v-cancel-btn" onClick={handleCancel}>
          Cancel Registration
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="v-main-content">
        {/* Title */}
        <div className="v-title-section">
          <h1 className="v-main-heading">Volunteer Registration</h1>
          <p className="v-main-subtext">
            {currentStep === 1 && "Step 1 of 6: Personal details and primary contact information."}
            {currentStep === 2 && "Step 2 of 6: Association affiliation, transport availability, and languages."}
            {currentStep === 3 && "Step 3 of 6: Specialized skills, active availability, and mobilization status."}
            {currentStep === 4 && "Step 4 of 6: Previous volunteer experience, certifications, and medical info."}
            {currentStep === 5 && "Step 5 of 6: Identity verification and final consent declaration."}
            {currentStep === 6 && "Step 6 of 6: Registration status and admin approval review."}
          </p>
        </div>

        {/* Stepper Progress Bar (6 Steps) */}
        <div className="v-stepper-container">
          <div className="v-stepper-progress-line"></div>
          <div
            className="v-stepper-progress-active"
            style={{ width: `calc((100% - 48px) * ${((currentStep - 1) / 5)})` }}
          ></div>

          {[
            { step: 1, label: 'Personal' },
            { step: 2, label: 'Association' },
            { step: 3, label: 'Skills' },
            { step: 4, label: 'Experience' },
            { step: 5, label: 'Verification' },
            { step: 6, label: 'Status' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isActive = currentStep === item.step;
            return (
              <div
                key={item.step}
                className={`v-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setCurrentStep(item.step)}
              >
                <div className="v-step-circle">
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    item.step
                  )}
                </div>
                <span className="v-step-label">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Form Container (Steps 1 to 5) */}
        {currentStep < 6 ? (
          <>
            <div className="v-card">
              {/* STEP 1: PERSONAL INFORMATION & EMERGENCY CONTACT */}
              {currentStep === 1 && (
                <div>
                  <div className="v-card-header-title">
                    <span className="v-card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <span>1. Personal Information</span>
                  </div>

                  <div className="v-form-grid-double">
                    <div className="v-form-group">
                      <label className="v-field-label">
                        Full Name <span className="v-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="v-form-input"
                        placeholder="e.g. John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">Profile Photo (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="v-form-input"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      />
                    </div>
                  </div>

                  <div className="v-form-grid-triple">
                    <div className="v-form-group">
                      <label className="v-field-label">
                        Date of Birth <span className="v-required">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        className="v-form-input"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">
                        Gender <span className="v-required">*</span>
                      </label>
                      <select
                        name="gender"
                        className="v-form-select"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">
                        Blood Group <span className="v-required">*</span>
                      </label>
                      <select
                        name="bloodGroup"
                        className="v-form-select"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="v-form-grid-double">
                    <div className="v-form-group">
                      <label className="v-field-label">
                        Mobile Number <span className="v-required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        className="v-form-input"
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">
                        Email Address <span className="v-required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="v-form-input"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="v-form-group">
                    <label className="v-field-label">
                      Address <span className="v-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="v-form-input"
                      placeholder="Door No., Street Name, Area..."
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="v-form-grid-triple">
                    <div className="v-form-group">
                      <label className="v-field-label">
                        District <span className="v-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        className="v-form-input"
                        placeholder="e.g. Chennai"
                        value={formData.district}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">
                        State <span className="v-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="v-form-input"
                        placeholder="e.g. Tamil Nadu"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="v-form-group">
                      <label className="v-field-label">
                        PIN Code <span className="v-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        className="v-form-input"
                        placeholder="600001"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* 3. Emergency Contact */}
                  <div className="v-section-block" style={{ marginTop: '24px' }}>
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </span>
                      <span>3. Emergency Contact Details</span>
                    </div>

                    <div className="v-form-grid-triple">
                      <div className="v-form-group">
                        <label className="v-field-label">
                          Contact Name <span className="v-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="emergencyName"
                          className="v-form-input"
                          placeholder="Contact Person Name"
                          value={formData.emergencyName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">
                          Relationship <span className="v-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="emergencyRelationship"
                          className="v-form-input"
                          placeholder="e.g. Father, Spouse"
                          value={formData.emergencyRelationship}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">
                          Mobile Number <span className="v-required">*</span>
                        </label>
                        <input
                          type="tel"
                          name="emergencyMobile"
                          className="v-form-input"
                          placeholder="+91 98765 00000"
                          value={formData.emergencyMobile}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ASSOCIATION & TRANSPORT & LANGUAGES */}
              {currentStep === 2 && (
                <div>
                  <div className="v-card-header-title">
                    <span className="v-card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <path d="M9 22v-4h6v4"></path>
                      </svg>
                    </span>
                    <span>2. Association Details & Transport</span>
                  </div>

                  {/* Association Selection */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                        </svg>
                      </span>
                      <span>Approved Association Selection</span>
                    </div>
                    <div className="v-form-grid-double">
                      <div className="v-form-group">
                        <label className="v-field-label">
                          Association <span className="v-required">*</span>
                        </label>
                        <select
                          name="association"
                          className="v-form-select"
                          value={formData.association}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Approved Association</option>
                          <option value="Red Cross Volunteer Wing">Red Cross Volunteer Wing</option>
                          <option value="National Relief Corps">National Relief Corps</option>
                          <option value="Disaster Action Team">Disaster Action Team</option>
                          <option value="Community Response Foundation">Community Response Foundation</option>
                          <option value="Youth Volunteer Network">Youth Volunteer Network</option>
                        </select>
                        <span className="v-help-text">Only approved associations are listed.</span>
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">Membership ID (Optional)</label>
                        <input
                          type="text"
                          name="membershipId"
                          className="v-form-input"
                          placeholder="If already registered with Association"
                          value={formData.membershipId}
                          onChange={handleInputChange}
                        />
                        <span className="v-help-text">Date of Joining auto-generated upon approval.</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Transport Availability */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                      </span>
                      <span>6. Transport Availability</span>
                    </div>
                    <div className="v-form-grid-triple">
                      <div className="v-form-group">
                        <label className="v-field-label">Vehicle Type</label>
                        <select
                          name="vehicleType"
                          className="v-form-select"
                          value={formData.vehicleType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Vehicle Option</option>
                          <option value="Bike">Bike / Two Wheeler</option>
                          <option value="Car">Car / Four Wheeler</option>
                          <option value="Bicycle">Bicycle</option>
                          <option value="Public Transport">Public Transport</option>
                          <option value="No Vehicle">No Vehicle</option>
                        </select>
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">Driving License?</label>
                        <div className="v-radio-group">
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasLicense"
                              value="Yes"
                              className="v-radio-input"
                              checked={formData.hasLicense === 'Yes'}
                              onChange={handleInputChange}
                            />
                            Yes
                          </label>
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasLicense"
                              value="No"
                              className="v-radio-input"
                              checked={formData.hasLicense === 'No'}
                              onChange={handleInputChange}
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {formData.hasLicense === 'Yes' && (
                        <div className="v-form-group">
                          <label className="v-field-label">License Number (Optional)</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            className="v-form-input"
                            placeholder="DL-1234567890"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 7. Languages Known */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </span>
                      <span>7. Languages Known</span>
                    </div>
                    <p className="v-help-text" style={{ marginBottom: '10px' }}>
                      Select all languages you can fluently speak or communicate in.
                    </p>
                    <div className="v-pill-grid">
                      {languagesList.map((lang) => {
                        const isSelected = formData.languages.includes(lang);
                        return (
                          <div
                            key={lang}
                            className={`v-pill-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('languages', lang)}
                          >
                            <input
                              type="checkbox"
                              className="v-pill-checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span className="v-pill-label">{lang}</span>
                          </div>
                        );
                      })}
                    </div>
                    {formData.languages.includes('Other') && (
                      <div className="v-form-group" style={{ marginTop: '14px' }}>
                        <input
                          type="text"
                          name="otherLanguage"
                          className="v-form-input"
                          placeholder="Specify other languages..."
                          value={formData.otherLanguage}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: SKILLS & AVAILABILITY */}
              {currentStep === 3 && (
                <div>
                  <div className="v-card-header-title">
                    <span className="v-card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </span>
                    <span>3. Skills & Availability</span>
                  </div>

                  {/* 4. Skills (Multi-select) */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                        </svg>
                      </span>
                      <span>4. Specialized Skills (Select Multiple)</span>
                    </div>
                    <div className="v-pill-grid">
                      {skillsList.map((skill) => {
                        const isSelected = formData.skills.includes(skill);
                        return (
                          <div
                            key={skill}
                            className={`v-pill-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('skills', skill)}
                          >
                            <input
                              type="checkbox"
                              className="v-pill-checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span className="v-pill-label">{skill}</span>
                          </div>
                        );
                      })}
                    </div>
                    {formData.skills.includes('Other') && (
                      <div className="v-form-group" style={{ marginTop: '14px' }}>
                        <input
                          type="text"
                          name="otherSkill"
                          className="v-form-input"
                          placeholder="Specify additional skills..."
                          value={formData.otherSkill}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* 5. Availability & Current Status */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </span>
                      <span>5. Availability & Status</span>
                    </div>
                    
                    <div className="v-form-group">
                      <label className="v-field-label">Availability Schedule (Multi-select)</label>
                      <div className="v-pill-grid">
                        {availabilityOptions.map((opt) => {
                          const isSelected = formData.availability.includes(opt);
                          return (
                            <div
                              key={opt}
                              className={`v-pill-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleArrayItem('availability', opt)}
                            >
                              <input
                                type="checkbox"
                                className="v-pill-checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                              />
                              <span className="v-pill-label">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="v-form-group" style={{ marginTop: '20px' }}>
                      <label className="v-field-label">Current Mobilization Status</label>
                      <div className="v-radio-group">
                        {['Available', 'Busy', 'Unavailable'].map((st) => (
                          <label key={st} className="v-radio-label">
                            <input
                              type="radio"
                              name="currentStatus"
                              value={st}
                              className="v-radio-input"
                              checked={formData.currentStatus === st}
                              onChange={handleInputChange}
                            />
                            {st}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: EXPERIENCE & CERTIFICATIONS & MEDICAL */}
              {currentStep === 4 && (
                <div>
                  <div className="v-card-header-title">
                    <span className="v-card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </span>
                    <span>4. Experience, Certifications & Health</span>
                  </div>

                  {/* 8. Experience */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                      </span>
                      <span>8. Volunteer Experience</span>
                    </div>
                    <div className="v-form-grid-double">
                      <div className="v-form-group">
                        <label className="v-field-label">Previous Volunteer Experience?</label>
                        <div className="v-radio-group">
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasVolunteerExp"
                              value="Yes"
                              className="v-radio-input"
                              checked={formData.hasVolunteerExp === 'Yes'}
                              onChange={handleInputChange}
                            />
                            Yes
                          </label>
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasVolunteerExp"
                              value="No"
                              className="v-radio-input"
                              checked={formData.hasVolunteerExp === 'No'}
                              onChange={handleInputChange}
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {formData.hasVolunteerExp === 'Yes' && (
                        <>
                          <div className="v-form-group">
                            <label className="v-field-label">Organization Name</label>
                            <input
                              type="text"
                              name="expOrganization"
                              className="v-form-input"
                              placeholder="Name of previous NGO / Org"
                              value={formData.expOrganization}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="v-form-group">
                            <label className="v-field-label">Years of Experience</label>
                            <input
                              type="text"
                              name="expYears"
                              className="v-form-input"
                              placeholder="e.g. 2 Years"
                              value={formData.expYears}
                              onChange={handleInputChange}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="v-form-grid-double" style={{ marginTop: '14px' }}>
                      <div className="v-form-group">
                        <label className="v-field-label">Previous Disaster Response Experience?</label>
                        <div className="v-radio-group">
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasDisasterExp"
                              value="Yes"
                              className="v-radio-input"
                              checked={formData.hasDisasterExp === 'Yes'}
                              onChange={handleInputChange}
                            />
                            Yes
                          </label>
                          <label className="v-radio-label">
                            <input
                              type="radio"
                              name="hasDisasterExp"
                              value="No"
                              className="v-radio-input"
                              checked={formData.hasDisasterExp === 'No'}
                              onChange={handleInputChange}
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {formData.hasDisasterExp === 'Yes' && (
                        <div className="v-form-group">
                          <label className="v-field-label">Number of Events Participated</label>
                          <input
                            type="number"
                            name="eventsParticipated"
                            className="v-form-input"
                            placeholder="e.g. 5"
                            value={formData.eventsParticipated}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 9. Certifications */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 15l-2 5l3 -1.5l3 1.5l-2 -5"></path>
                          <circle cx="12" cy="9" r="6"></circle>
                        </svg>
                      </span>
                      <span>9. Certifications & Training</span>
                    </div>
                    <div className="v-pill-grid">
                      {certificationsList.map((cert) => {
                        const isSelected = formData.certifications.includes(cert);
                        return (
                          <div
                            key={cert}
                            className={`v-pill-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('certifications', cert)}
                          >
                            <input
                              type="checkbox"
                              className="v-pill-checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span className="v-pill-label">{cert}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="v-form-group" style={{ marginTop: '18px' }}>
                      <label className="v-field-label">Upload Certificate (Optional)</label>
                      <div className="v-upload-zone">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          className="v-hidden-file"
                          onChange={(e) => handleFileChange(e, 'certificateFile')}
                        />
                        <div className="v-upload-circle">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div className="v-upload-title">Click to upload training certificate</div>
                        <div className="v-upload-subtitle">PDF, JPG or PNG (Max 10MB)</div>
                        {formData.certificateFile && (
                          <div className="v-file-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {formData.certificateFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 10. Medical Information */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        </svg>
                      </span>
                      <span>10. Medical Information</span>
                    </div>
                    <p className="v-help-text" style={{ marginBottom: '14px' }}>
                      This information helps assign suitable tasks safely during field operations.
                    </p>
                    <div className="v-form-grid-triple">
                      <div className="v-form-group">
                        <label className="v-field-label">Medical Conditions</label>
                        <input
                          type="text"
                          name="medicalConditions"
                          className="v-form-input"
                          placeholder="e.g. Asthma, None"
                          value={formData.medicalConditions}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">Allergies</label>
                        <input
                          type="text"
                          name="allergies"
                          className="v-form-input"
                          placeholder="e.g. Dust, Food, None"
                          value={formData.allergies}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">Physical Disabilities (if any)</label>
                        <input
                          type="text"
                          name="physicalDisabilities"
                          className="v-form-input"
                          placeholder="Details or None"
                          value={formData.physicalDisabilities}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: IDENTITY VERIFICATION & CONSENT */}
              {currentStep === 5 && (
                <div>
                  <div className="v-card-header-title">
                    <span className="v-card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </span>
                    <span>5. Identity Verification & Consent</span>
                  </div>

                  {/* 11. Identity Verification */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                          <circle cx="9" cy="10" r="2"></circle>
                          <line x1="15" y1="8" x2="17" y2="8"></line>
                          <line x1="15" y1="12" x2="17" y2="12"></line>
                          <line x1="7" y1="16" x2="17" y2="16"></line>
                        </svg>
                      </span>
                      <span>11. Identity Verification Documents</span>
                    </div>
                    <div className="v-form-grid-double">
                      <div className="v-form-group">
                        <label className="v-field-label">
                          Aadhaar Card / Government ID <span className="v-required">*</span>
                        </label>
                        <div className="v-upload-zone">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            className="v-hidden-file"
                            onChange={(e) => handleFileChange(e, 'govtIdFile')}
                          />
                          <div className="v-upload-circle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                              <circle cx="9" cy="10" r="2"></circle>
                            </svg>
                          </div>
                          <div className="v-upload-title">Upload Aadhaar / Govt ID</div>
                          <div className="v-upload-subtitle">PDF, JPG or PNG (Max 10MB)</div>
                          {formData.govtIdFile && (
                            <div className="v-file-badge">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {formData.govtIdFile.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="v-form-group">
                        <label className="v-field-label">Student ID (Optional)</label>
                        <div className="v-upload-zone">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            className="v-hidden-file"
                            onChange={(e) => handleFileChange(e, 'studentIdFile')}
                          />
                          <div className="v-upload-circle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                          </div>
                          <div className="v-upload-title">Upload Student ID Card</div>
                          <div className="v-upload-subtitle">PDF, JPG or PNG (Max 10MB)</div>
                          {formData.studentIdFile && (
                            <div className="v-file-badge">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {formData.studentIdFile.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 12. Consent */}
                  <div className="v-section-block">
                    <div className="v-section-heading">
                      <span className="v-section-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                      </span>
                      <span>12. Declaration & Consent</span>
                    </div>
                    <div className="v-consent-box">
                      <label className="v-checkbox-row">
                        <input
                          type="checkbox"
                          name="agreeActivities"
                          checked={formData.agreeActivities}
                          onChange={handleInputChange}
                        />
                        <span>I agree to participate in volunteer activities and emergency response deployments.</span>
                      </label>

                      <label className="v-checkbox-row">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                        />
                        <span>I agree to the Terms & Conditions and UVMP Volunteer Code of Conduct.</span>
                      </label>

                      <label className="v-checkbox-row">
                        <input
                          type="checkbox"
                          name="agreeDataUse"
                          checked={formData.agreeDataUse}
                          onChange={handleInputChange}
                        />
                        <span>I consent to my data being used for official volunteer coordination and disaster response.</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="v-bottom-actions">
              {currentStep === 1 ? (
                <button className="v-btn-reset" onClick={handleReset}>
                  Reset Form
                </button>
              ) : (
                <button className="v-btn-back" onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              )}

              <button className="v-btn-next" onClick={handleNext}>
                {currentStep === 5 ? 'Submit Application' : 'Next Step'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* STEP 6: SUBMISSION SUCCESS CARD (Matches Reference Screenshot Layout) */
          <div className="v-status-success-container">
            <div className="v-status-left-panel">
              <div className="v-status-badge-circle">
                <svg width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="14" y="10" width="36" height="44" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <rect x="20" y="18" width="16" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="20" y="25" width="24" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="20" y="32" width="20" height="3" rx="1.5" fill="#E2E8F0" />
                  <circle cx="44" cy="44" r="14" fill="#10B981" />
                  <path d="M37 44L42 49L51 39" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="v-status-right-panel">
              <h2 className="v-status-title">Success!</h2>
              <p className="v-status-subtitle">
                Your volunteer registration request has been submitted successfully.
              </p>

              <div className="v-status-notice-box">
                <div className="v-status-pill-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  PENDING ASSOCIATION APPROVAL
                </div>
                <p className="v-status-notice-text">
                  Your application will be reviewed by the selected association administrator. You will receive notification upon approval.
                </p>
              </div>

              <button
                className="v-btn-home-action"
                onClick={() => (window.location.hash = '#landing')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default VolunteerRegistration;
