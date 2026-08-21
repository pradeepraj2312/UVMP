import React, { useState } from 'react';
import logo from '../assets/uvmp_logo.png';

function AssosiationRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Organization
    associationName: '',
    registrationNumber: '',
    associationType: '',
    establishmentDate: '',

    // Step 2: Contact
    fullName: '',
    designation: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',

    // Step 3: Services
    services: [],
    volunteerCapacity: '',
    missionStatement: '',

    // Step 4: Documents
    ngoCertificate: null,
    govApproval: null,
    orgLogo: null,
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Service Checkboxes
  const toggleService = (serviceName) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceName);
      if (exists) {
        return { ...prev, services: prev.services.filter((s) => s !== serviceName) };
      } else {
        return { ...prev, services: [...prev.services, serviceName] };
      }
    });
  };

  // Handle File Upload Simulation
  const handleFileChange = (e, fileKey) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fileKey]: e.target.files[0] }));
    }
  };

  // Navigation Buttons Handlers
  const handleNext = () => {
    if (currentStep < 5) {
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
    if (window.confirm('Are you sure you want to reset the current step data?')) {
      if (currentStep === 1) {
        setFormData((prev) => ({
          ...prev,
          associationName: '',
          registrationNumber: '',
          associationType: '',
          establishmentDate: '',
        }));
      } else if (currentStep === 2) {
        setFormData((prev) => ({
          ...prev,
          fullName: '',
          designation: '',
          email: '',
          mobile: '',
          address: '',
          city: '',
          state: '',
        }));
      } else if (currentStep === 3) {
        setFormData((prev) => ({
          ...prev,
          services: [],
          volunteerCapacity: '',
          missionStatement: '',
        }));
      } else if (currentStep === 4) {
        setFormData((prev) => ({
          ...prev,
          ngoCertificate: null,
          govApproval: null,
          orgLogo: null,
        }));
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel registration? All unsaved data will be lost.')) {
      window.location.hash = '#landing';
    }
  };

  return (
    <div className="association-reg-page">
      <style>{`
        /* Internal CSS matching UVMP Warm Cream & Maroon Theme with 5-step Stepper */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .association-reg-page {
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

        .association-reg-page * {
          box-sizing: border-box;
        }

        /* --- Header --- */
        .reg-header {
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

        .brand-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .brand-text-group {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #800000;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .brand-subtitle {
          font-size: 0.78rem;
          color: #6B7280;
          font-weight: 500;
        }

        .cancel-btn {
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

        .cancel-btn:hover {
          color: #800000;
        }

        /* --- Main Content Wrapper --- */
        .reg-main-content {
          flex: 1;
          max-width: 920px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 20px 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-section {
          text-align: center;
          margin-bottom: 32px;
          max-width: 660px;
        }

        .main-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .main-subtext {
          font-size: 0.92rem;
          color: #6B7280;
          line-height: 1.55;
          margin: 0;
        }

        /* --- Progress Stepper (5 Steps) --- */
        .stepper-container {
          width: 100%;
          max-width: 720px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-bottom: 36px;
        }

        .stepper-progress-line {
          position: absolute;
          top: 18px;
          left: 24px;
          right: 24px;
          height: 2px;
          background-color: #800000;
          z-index: 1;
        }

        .stepper-progress-active {
          position: absolute;
          top: 18px;
          left: 24px;
          height: 2px;
          background-color: #800000;
          z-index: 1;
          transition: width 0.35s ease;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 2;
          cursor: pointer;
        }

        .step-circle {
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

        .step-item.active .step-circle {
          background-color: #800000;
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.2);
        }

        .step-item.completed .step-circle {
          background-color: #800000;
          color: #ffffff;
        }

        .step-label {
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #6B7280;
          transition: color 0.3s ease;
        }

        .step-item.active .step-label,
        .step-item.completed .step-label {
          color: #800000;
        }

        /* --- Form Card Body --- */
        .reg-card {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
          width: 100%;
          padding: 36px 40px;
          margin-bottom: 28px;
        }

        .card-header-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
        }

        .card-header-icon {
          color: #800000;
          display: flex;
          align-items: center;
        }

        /* --- Form Elements --- */
        .form-grid-single {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
        }

        .required-star {
          color: #800000;
          margin-left: 2px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          color: #800000;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .form-input {
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

        .form-input.has-icon {
          padding-left: 44px;
        }

        .form-input:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.1);
        }

        .form-select {
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

        .form-select.has-icon {
          padding-left: 44px;
        }

        .form-select:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.1);
        }

        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #111827;
          outline: none;
          background-color: #ffffff;
          font-family: inherit;
          resize: vertical;
          min-height: 110px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-textarea:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.1);
        }

        .field-help-text {
          font-size: 0.78rem;
          color: #6B7280;
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
        }

        /* --- Nested Sub-sections (Step 2) --- */
        .sub-section-box {
          background-color: #FDF8F5;
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 24px;
          border: 1px solid #F3E8DF;
        }

        .sub-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #8B4513;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* --- Service Checkbox Cards Grid (Step 3) --- */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
        }

        .service-card {
          background-color: #FAFAFA;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .service-card:hover {
          border-color: #800000;
          background-color: #ffffff;
        }

        .service-card.selected {
          border-color: #800000;
          background-color: #FDF2F2;
          box-shadow: 0 2px 8px rgba(128, 0, 0, 0.08);
        }

        .service-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #800000;
          cursor: pointer;
        }

        .service-card-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .service-icon {
          color: #800000;
          display: flex;
          align-items: center;
        }

        /* --- Document Upload Boxes (Step 4) --- */
        .upload-zone {
          border: 2px dashed #E5E7EB;
          border-radius: 14px;
          padding: 28px 20px;
          text-align: center;
          background-color: #FAFAFA;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .upload-zone:hover {
          border-color: #800000;
          background-color: #FDF2F2;
        }

        .upload-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #FCE8E6;
          color: #800000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .upload-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #800000;
          margin-bottom: 4px;
        }

        .upload-subtitle {
          font-size: 0.78rem;
          color: #6B7280;
        }

        .hidden-file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-selected-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 4px 12px;
          background-color: #E6F4EA;
          color: #137333;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* --- Bottom Controls Bar --- */
        .bottom-actions-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .btn-reset {
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

        .btn-reset:hover {
          background-color: #F9FAFB;
          border-color: #9CA3AF;
        }

        .btn-back {
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

        .btn-back:hover {
          background-color: #F9FAFB;
          border-color: #9CA3AF;
        }

        .btn-next {
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

        .btn-next:hover {
          background-color: #660000;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(128, 0, 0, 0.35);
        }

        /* --- STEP 5: SUCCESS MODAL / CARD (Matching User Screenshot Layout) --- */
        .status-success-container {
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

        .status-left-panel {
          background-color: #FDF8F5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          border-right: 1px solid #F3E8DF;
        }

        .status-badge-circle {
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

        .status-right-panel {
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .status-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .status-subtitle {
          font-size: 0.9rem;
          color: #4B5563;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .status-notice-box {
          background-color: #FDF8F5;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          border: 1px solid #F3E8DF;
        }

        .status-pill-badge {
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

        .status-notice-text {
          font-size: 0.83rem;
          color: #4B5563;
          line-height: 1.5;
          margin: 0;
        }

        .btn-home-action {
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

        .btn-home-action:hover {
          background-color: #660000;
        }

        /* --- Responsive Breakpoints --- */
        @media (max-width: 768px) {
          .reg-header {
            padding: 14px 20px;
          }

          .reg-main-content {
            padding: 24px 16px 40px 16px;
          }

          .main-heading {
            font-size: 1.8rem;
          }

          .reg-card {
            padding: 24px 20px;
          }

          .form-grid-double {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .stepper-container {
            max-width: 100%;
          }

          .step-label {
            font-size: 0.68rem;
          }

          .step-circle {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }

          .status-success-container {
            grid-template-columns: 1fr;
          }

          .status-left-panel {
            padding: 24px;
            border-right: none;
            border-bottom: 1px solid #F3E8DF;
          }

          .status-right-panel {
            padding: 28px 20px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="reg-header">
        <a href="#landing" className="brand-wrapper">
          <img src={logo} alt="UVMP Logo" className="brand-logo-img" />
        </a>

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel Registration
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Main Container */}
      <main className="reg-main-content">
        {/* Title & Description */}
        <div className="title-section">
          <h1 className="main-heading">Association Registration</h1>
          <p className="main-subtext">
            {currentStep === 1 && "Complete the following information to register your association with the UVMP database. All fields marked with an asterisk (*) are required."}
            {currentStep === 2 && "Step 2 of 5: Provide primary contact details and official headquarters location."}
            {currentStep === 3 && "Step 3 of 5: Define your organization's core services and active capacity."}
            {currentStep === 4 && "Step 4 of 5: Provide necessary documentation to verify your association's legal identity."}
            {currentStep === 5 && "Step 5 of 5: Registration status and admin approval review."}
          </p>
        </div>

        {/* Stepper Progress Bar (5 Steps) */}
        <div className="stepper-container">
          <div className="stepper-progress-line"></div>
          <div
            className="stepper-progress-active"
            style={{ width: `calc((100% - 48px) * ${((currentStep - 1) / 4)})` }}
          ></div>

          {/* Step 1: Organization */}
          <div
            className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-circle">
              {currentStep > 1 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '1'}
            </div>
            <span className="step-label">Organization</span>
          </div>

          {/* Step 2: Contact */}
          <div
            className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <div className="step-circle">
              {currentStep > 2 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '2'}
            </div>
            <span className="step-label">Contact</span>
          </div>

          {/* Step 3: Services */}
          <div
            className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <div className="step-circle">
              {currentStep > 3 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '3'}
            </div>
            <span className="step-label">Services</span>
          </div>

          {/* Step 4: Documents */}
          <div
            className={`step-item ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(4)}
          >
            <div className="step-circle">
              {currentStep > 4 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '4'}
            </div>
            <span className="step-label">Documents</span>
          </div>

          {/* Step 5: Status */}
          <div
            className={`step-item ${currentStep === 5 ? 'active' : ''}`}
            onClick={() => setCurrentStep(5)}
          >
            <div className="step-circle">5</div>
            <span className="step-label">Status</span>
          </div>
        </div>

        {/* Steps 1 to 4: Form Cards */}
        {currentStep < 5 ? (
          <>
            <div className="reg-card">
              {/* STEP 1: ORGANIZATION DETAILS */}
              {currentStep === 1 && (
                <div>
                  <div className="card-header-title">
                    <span className="card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <path d="M9 22v-4h6v4"></path>
                        <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
                      </svg>
                    </span>
                    <span>Organization Details</span>
                  </div>

                  <div className="form-grid-single">
                    <div className="form-group">
                      <label className="field-label">
                        Association Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        name="associationName"
                        className="form-input"
                        placeholder="Enter full official name"
                        value={formData.associationName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-grid-double">
                      <div className="form-group">
                        <label className="field-label">
                          Registration Number <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          name="registrationNumber"
                          className="form-input"
                          placeholder="e.g. REG-12345"
                          value={formData.registrationNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          Association Type <span className="required-star">*</span>
                        </label>
                        <select
                          name="associationType"
                          className="form-select"
                          value={formData.associationType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Type</option>
                          <option value="Non-Profit">Non-Profit Organization</option>
                          <option value="Relief Agency">Relief Agency</option>
                          <option value="Community Association">Community Association</option>
                          <option value="Charitable Trust">Charitable Trust</option>
                          <option value="International NGO">International NGO</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ maxWidth: '50%' }}>
                      <label className="field-label">Date of Establishment</label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          name="establishmentDate"
                          className="form-input"
                          placeholder="dd-mm-yyyy"
                          value={formData.establishmentDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT INFORMATION */}
              {currentStep === 2 && (
                <div>
                  <div className="card-header-title">
                    <span className="card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <span>Contact Information</span>
                  </div>

                  {/* Primary Contact Person Box */}
                  <div className="sub-section-box">
                    <div className="sub-section-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Primary Contact Person</span>
                    </div>

                    <div className="form-grid-double" style={{ marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="field-label">
                          Full Name <span className="required-star">*</span>
                        </label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="fullName"
                            className="form-input has-icon"
                            placeholder="e.g. Jane Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="field-label">Designation</label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="designation"
                            className="form-input has-icon"
                            placeholder="e.g. Director"
                            value={formData.designation}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-grid-double">
                      <div className="form-group">
                        <label className="field-label">
                          Email Address <span className="required-star">*</span>
                        </label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                          </span>
                          <input
                            type="email"
                            name="email"
                            className="form-input has-icon"
                            placeholder="contact@association.org"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          Mobile Number <span className="required-star">*</span>
                        </label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                              <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                          </span>
                          <input
                            type="tel"
                            name="mobile"
                            className="form-input has-icon"
                            placeholder="+1 (555) 000-0000"
                            value={formData.mobile}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Official Address Box */}
                  <div className="sub-section-box">
                    <div className="sub-section-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>Official Address</span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="field-label">
                        Office Address (Line 1) <span className="required-star">*</span>
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon-left">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </span>
                        <input
                          type="text"
                          name="address"
                          className="form-input has-icon"
                          placeholder="Enter full street address..."
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-grid-double">
                      <div className="form-group">
                        <label className="field-label">
                          District / City <span className="required-star">*</span>
                        </label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="city"
                            className="form-input has-icon"
                            placeholder="City name"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          State / Province <span className="required-star">*</span>
                        </label>
                        <div className="input-wrapper">
                          <span className="input-icon-left">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </span>
                          <select
                            name="state"
                            className="form-select has-icon"
                            value={formData.state}
                            onChange={handleInputChange}
                          >
                            <option value="">Select State</option>
                            <option value="California">California</option>
                            <option value="New York">New York</option>
                            <option value="Texas">Texas</option>
                            <option value="Florida">Florida</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SERVICE CAPABILITIES */}
              {currentStep === 3 && (
                <div>
                  <div className="card-header-title">
                    <span className="card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </span>
                    <span>Service Capabilities</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="field-label">
                      Areas of Service <span className="required-star">*</span>
                    </label>
                    <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 12px 0' }}>
                      Select all primary operational areas where your association provides support.
                    </p>
                  </div>

                  <div className="services-grid">
                    {[
                      {
                        title: 'Disaster Response',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ),
                      },
                      {
                        title: 'Food Distribution',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                            <line x1="6" y1="1" x2="6" y2="4"></line>
                            <line x1="10" y1="1" x2="10" y2="4"></line>
                            <line x1="14" y1="1" x2="14" y2="4"></line>
                          </svg>
                        ),
                      },
                      {
                        title: 'Medical Aid',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                          </svg>
                        ),
                      },
                      {
                        title: 'Emergency Shelter',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          </svg>
                        ),
                      },
                      {
                        title: 'Water & Sanitation',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                          </svg>
                        ),
                      },
                      {
                        title: 'Community Support',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        ),
                      },
                    ].map((item) => {
                      const isSelected = formData.services.includes(item.title);
                      return (
                        <div
                          key={item.title}
                          className={`service-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleService(item.title)}
                        >
                          <input
                            type="checkbox"
                            className="service-checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <span className="service-card-label">
                            <span className="service-icon">{item.icon}</span>
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="field-label">
                      Active Volunteer Capacity <span className="required-star">*</span>
                    </label>
                    <select
                      name="volunteerCapacity"
                      className="form-select"
                      value={formData.volunteerCapacity}
                      onChange={handleInputChange}
                    >
                      <option value="">Select capacity range</option>
                      <option value="1-50">1 - 50 Active Volunteers</option>
                      <option value="50-200">50 - 200 Active Volunteers</option>
                      <option value="200-500">200 - 500 Active Volunteers</option>
                      <option value="500+">500+ Active Volunteers</option>
                    </select>
                    <span className="field-help-text">Estimate the number of volunteers available for mobilization.</span>
                  </div>

                  <div className="form-group">
                    <label className="field-label">
                      Mission Statement & Description <span className="required-star">*</span>
                    </label>
                    <textarea
                      name="missionStatement"
                      className="form-textarea"
                      placeholder="Describe your association's primary mission, recent impact, and specific capabilities..."
                      maxLength={500}
                      value={formData.missionStatement}
                      onChange={handleInputChange}
                    ></textarea>
                    <div className="field-help-text">
                      <span>Brief summary of operational focus.</span>
                      <span>{formData.missionStatement.length}/500</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: OFFICIAL DOCUMENTS */}
              {currentStep === 4 && (
                <div>
                  <div className="card-header-title">
                    <span className="card-header-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </span>
                    <span>Step 4: Official Documents</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '24px' }}>
                    Please provide the necessary documentation to verify your association's legal status and identity. Ensure all files are clear and legible.
                  </p>

                  <div className="form-grid-single">
                    {/* Document 1 */}
                    <div className="form-group">
                      <label className="field-label">
                        NGO Registration Certificate <span className="required-star">*</span>
                      </label>
                      <div className="upload-zone">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          className="hidden-file-input"
                          onChange={(e) => handleFileChange(e, 'ngoCertificate')}
                        />
                        <div className="upload-icon-circle">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div className="upload-title">Click to upload or drag and drop</div>
                        <div className="upload-subtitle">PDF, JPG, or PNG (Max. 10MB)</div>
                        {formData.ngoCertificate && (
                          <div className="file-selected-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {formData.ngoCertificate.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document 2 */}
                    <div className="form-group">
                      <label className="field-label">
                        Government Approval Document <span className="required-star">*</span>
                      </label>
                      <div className="upload-zone">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden-file-input"
                          onChange={(e) => handleFileChange(e, 'govApproval')}
                        />
                        <div className="upload-icon-circle">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="21" x2="21" y2="21"></line>
                            <line x1="6" y1="18" x2="6" y2="11"></line>
                            <line x1="10" y1="18" x2="10" y2="11"></line>
                            <line x1="14" y1="18" x2="14" y2="11"></line>
                            <line x1="18" y1="18" x2="18" y2="11"></line>
                            <polygon points="12 2 20 7 4 7 12 2"></polygon>
                          </svg>
                        </div>
                        <div className="upload-title">Click to upload or drag and drop</div>
                        <div className="upload-subtitle">PDF only (Max. 15MB)</div>
                        {formData.govApproval && (
                          <div className="file-selected-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {formData.govApproval.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document 3 */}
                    <div className="form-group">
                      <label className="field-label">Organization Logo (Optional)</label>
                      <div className="upload-zone">
                        <input
                          type="file"
                          accept=".png,.jpg"
                          className="hidden-file-input"
                          onChange={(e) => handleFileChange(e, 'orgLogo')}
                        />
                        <div className="upload-icon-circle">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                        <div className="upload-title">Click to upload logo</div>
                        <div className="upload-subtitle">High-res JPG or PNG (Min 400x400px)</div>
                        {formData.orgLogo && (
                          <div className="file-selected-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {formData.orgLogo.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="bottom-actions-row">
              {currentStep === 1 ? (
                <button className="btn-reset" onClick={handleReset}>
                  Reset Form
                </button>
              ) : (
                <button className="btn-back" onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              )}

              <button className="btn-next" onClick={handleNext}>
                {currentStep === 4 ? 'Submit Application' : 'Next Step'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* STEP 5: SUCCESS / PENDING ADMIN APPROVAL CARD (Matches Reference Screenshot 2) */
          <div className="status-success-container">
            {/* Left Panel with Circle Illustration */}
            <div className="status-left-panel">
              <div className="status-badge-circle">
                <svg width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Paper document sheet */}
                  <rect x="14" y="10" width="36" height="44" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <rect x="20" y="18" width="16" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="20" y="25" width="24" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="20" y="32" width="20" height="3" rx="1.5" fill="#E2E8F0" />
                  {/* Green check mark circle badge */}
                  <circle cx="44" cy="44" r="14" fill="#10B981" />
                  <path d="M37 44L42 49L51 39" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Right Panel with Status Info & Action */}
            <div className="status-right-panel">
              <h2 className="status-title">Success!</h2>
              <p className="status-subtitle">
                Your registration request has been submitted successfully.
              </p>

              {/* Status Notice Box */}
              <div className="status-notice-box">
                <div className="status-pill-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  PENDING ADMIN APPROVAL
                </div>
                <p className="status-notice-text">
                  Your association will be reviewed by the system administrator. You will receive login access after approval.
                </p>
              </div>

              {/* Action Button */}
              <button
                className="btn-home-action"
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

export default AssosiationRegistration;
