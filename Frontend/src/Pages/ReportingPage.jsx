import React, { useState, useEffect } from 'react';
import logo from '../assets/uvmp_logo.png';

function ReportingPage() {
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'sos', 'track', 'contacts'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Quick SOS state
  const [sosCategory, setSosCategory] = useState('Trapped / Immediate Rescue Needed');
  const [sosPeopleCount, setSosPeopleCount] = useState('1-5');
  const [sosLocation, setSosLocation] = useState('');
  const [sosLocating, setSosLocating] = useState(false);
  const [sosSubmitted, setSosSubmitted] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);

  // Form State for Detailed Incident Report
  const [step, setStep] = useState(1);
  const [disasterType, setDisasterType] = useState('Flood');
  const [severity, setSeverity] = useState('High');
  
  // Location
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [address, setAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState({ lat: null, lng: null });
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  
  // Impact & Needs
  const [trappedCount, setTrappedCount] = useState(0);
  const [injuredCount, setInjuredCount] = useState(0);
  const [description, setDescription] = useState('');
  const [assistanceNeeded, setAssistanceNeeded] = useState({
    medical: false,
    rescueBoat: false,
    foodWater: false,
    shelter: false,
    searchRescue: false,
    heavyMachinery: false,
    powerBackup: false,
    fireExtinguisher: false,
  });

  // Media
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);

  // Reporter Info
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Tracking state
  const [trackSearchId, setTrackSearchId] = useState('');
  const [searchedReport, setSearchedReport] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Modal Guides
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState('flood');

  // Sample districts list
  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod', 'Other State / District'
  ];

  // Sample recent community alerts
  const sampleAlerts = [
    {
      id: 'REP-2026-9041',
      type: 'Flood & Inundation',
      severity: 'Critical',
      location: 'Meppadi, Wayanad District',
      time: '12 mins ago',
      status: 'Volunteers Dispatched',
      victims: '12 trapped',
      verified: true
    },
    {
      id: 'REP-2026-8982',
      type: 'Landslide Hazard',
      severity: 'High',
      location: 'Munnar Gap Road, Idukki',
      time: '35 mins ago',
      status: 'Under Verification',
      victims: 'Road Blocked',
      verified: true
    },
    {
      id: 'REP-2026-8710',
      type: 'Structural Collapse',
      severity: 'Medium',
      location: 'Aluva Market Area, Ernakulam',
      time: '2 hours ago',
      status: 'Rescue Ops Active',
      victims: '3 injured',
      verified: true
    }
  ];

  // Auto toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // GPS Location Handler
  const handleGetLocation = (forSos = false) => {
    if (forSos) setSosLocating(true);
    else setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const acc = Math.round(position.coords.accuracy);

          if (forSos) {
            setSosLocation(`Lat: ${lat}, Lng: ${lng} (Accuracy ~${acc}m)`);
            setSosLocating(false);
          } else {
            setGpsCoords({ lat, lng });
            setLocationAccuracy(acc);
            setIsLocating(false);
            setToastMessage(`GPS Geotag Captured: ${lat}, ${lng}`);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          if (forSos) {
            setSosLocation('Latitude: 10.8505, Longitude: 76.2711 (Estimated)');
            setSosLocating(false);
          } else {
            setGpsCoords({ lat: '10.8505', lng: '76.2711' });
            setLocationAccuracy(45);
            setIsLocating(false);
            setToastMessage('GPS estimated via local network.');
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      if (forSos) setSosLocating(false);
      else setIsLocating(false);
      setToastMessage('Geolocation is not supported by your browser.');
    }
  };

  // Checkbox toggle
  const handleNeedToggle = (key) => {
    setAssistanceNeeded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Media file upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      preview: URL.createObjectURL(file)
    }));
    setMediaFiles(prev => [...prev, ...newMedia]);
    setToastMessage(`${files.length} photo(s) attached successfully.`);
  };

  // Quick SOS Submission
  const handleSosSubmit = (e) => {
    e.preventDefault();
    const sosId = 'SOS-' + Math.floor(100000 + Math.random() * 900000);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSosDetails({
      id: sosId,
      category: sosCategory,
      people: sosPeopleCount,
      location: sosLocation || 'Current Device Geotag',
      time: timeNow
    });
    setSosSubmitted(true);
    setToastMessage('🚨 EMERGENCY SOS BEACON ACTIVATED! CONTROL ROOM NOTIFIED.');
  };

  // Form Submit Handler
  const handleSubmitReport = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = 'REP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      const newReport = {
        id: generatedId,
        type: disasterType,
        severity: severity,
        district: district || 'Not Specified',
        taluk: taluk || 'Local Ward',
        address: address || 'Coordinates Geotagged',
        coords: gpsCoords.lat ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Auto-Geotagged',
        trapped: trappedCount,
        injured: injuredCount,
        description: description || 'Immediate rescue assistance requested by citizen.',
        needs: Object.keys(assistanceNeeded).filter(k => assistanceNeeded[k]),
        mediaCount: mediaFiles.length,
        reporter: isAnonymous ? 'Anonymous Citizen' : (reporterName || 'Resident Witness'),
        phone: isAnonymous ? 'Hidden' : (reporterPhone || 'Saved on File'),
        timestamp: new Date().toLocaleString(),
        status: 'Submitted',
        timeline: [
          { status: 'Report Submitted', time: 'Just now', done: true },
          { status: 'District Authority Verification', time: 'Pending Review', done: false },
          { status: 'Volunteers & Relief Assigned', time: 'Queued', done: false },
          { status: 'Rescue Operation Active', time: 'Queued', done: false },
          { status: 'Resolved / Safe', time: 'Pending', done: false },
        ]
      };

      setSubmittedReport(newReport);
      setIsSubmitting(false);
      setToastMessage(`Report Submitted Successfully! ID: ${generatedId}`);
    }, 1200);
  };

  // Track Search Handler
  const handleTrackSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    const query = trackSearchId.trim().toUpperCase();

    if (!query) {
      setSearchError('Please enter a Report Reference ID or Mobile Number.');
      return;
    }

    if (submittedReport && (submittedReport.id === query || query === 'MY')) {
      setSearchedReport(submittedReport);
      return;
    }

    const matchedSample = sampleAlerts.find(a => a.id.toUpperCase() === query);
    if (matchedSample) {
      setSearchedReport({
        id: matchedSample.id,
        type: matchedSample.type,
        severity: matchedSample.severity,
        district: matchedSample.location.split(',')[1] || 'District Control',
        address: matchedSample.location,
        trapped: matchedSample.victims,
        injured: '0',
        description: 'Verified emergency alert logged by community members.',
        needs: ['Search & Rescue', 'Medical Care', 'Evacuation'],
        reporter: 'Verified Citizen Field Report',
        timestamp: matchedSample.time,
        status: matchedSample.status,
        timeline: [
          { status: 'Report Submitted', time: '1 hr ago', done: true },
          { status: 'District Authority Verification', time: '45 mins ago', done: true },
          { status: 'Volunteers & Relief Assigned', time: '30 mins ago', done: true },
          { status: 'Rescue Operation Active', time: 'In Progress', done: matchedSample.status.includes('Active') || matchedSample.status.includes('Dispatched') },
          { status: 'Resolved / Safe', time: 'Pending', done: false },
        ]
      });
    } else {
      setSearchedReport({
        id: query.startsWith('REP') ? query : `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Flash Flood & Inundation',
        severity: 'Critical',
        district: 'Ernakulam',
        address: 'North Paravur, Near River Bank',
        trapped: '4 people',
        injured: '1 elderly person',
        description: 'Water level rising quickly in residential neighborhood. Need emergency boat evacuation.',
        needs: ['rescueBoat', 'medical', 'foodWater'],
        reporter: 'Citizen Alert User',
        timestamp: 'Today at 10:15 AM',
        status: 'Under Verification',
        timeline: [
          { status: 'Report Submitted', time: '10:15 AM', done: true },
          { status: 'District Authority Verification', time: 'In Progress', done: true },
          { status: 'Volunteers & Relief Assigned', time: 'Assigned to Local NGO Team', done: false },
          { status: 'Rescue Operation Active', time: 'Standby', done: false },
          { status: 'Resolved / Safe', time: 'Pending', done: false },
        ]
      });
    }
  };

  return (
    <div className="uvmp-reporting-page">
      <style>{`
        /* Redefining Theme: Vibrant High-Impact Red & Flame Orange Premium UI */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .uvmp-reporting-page {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          background: #FAF6F0;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(220, 38, 38, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(234, 88, 12, 0.08) 0%, transparent 40%);
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .uvmp-reporting-page * {
          box-sizing: border-box;
        }

        /* --- Top Emergency Announcement Ticker --- */
        .emergency-banner-ticker {
          background: linear-gradient(90deg, #990000 0%, #dc2626 35%, #ea580c 75%, #f97316 100%);
          color: #ffffff;
          padding: 10px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 3px 12px rgba(220, 38, 38, 0.3);
        }

        .ticker-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sos-pulse-badge {
          background: #ffffff;
          color: #dc2626;
          padding: 4px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          animation: pulse-glow 1.5s infinite;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }

        .helpline-link {
          color: #fef08a;
          text-decoration: none;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .helpline-link:hover {
          text-decoration: underline;
        }

        /* --- Header Navigation --- */
        .v-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 6%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(234, 88, 12, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.04);
        }

        .v-brand-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .v-brand-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(220, 38, 38, 0.15));
          transition: transform 0.2s ease;
        }
        .v-brand-wrapper:hover .v-brand-logo-img {
          transform: scale(1.05);
        }

        .v-brand-title {
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .v-brand-subtitle {
          font-size: 0.78rem;
          color: #ea580c;
          font-weight: 700;
        }

        /* Nav Pills in Gradient Red & Flame Orange */
        .rep-nav-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFE4D6;
          padding: 5px;
          border-radius: 50px;
          box-shadow: inset 0 2px 4px rgba(234, 88, 12, 0.08);
        }

        .nav-tab-btn {
          border: none;
          background: transparent;
          padding: 10px 22px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #c2410c;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .nav-tab-btn.active {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
        }

        .nav-tab-btn.sos-btn-tab {
          background: #ea580c;
          color: white;
        }
        .nav-tab-btn.sos-btn-tab:hover {
          background: #dc2626;
        }

        /* Mobile Hamburger Button */
        .hamburger-btn {
          display: none;
          background: #FFE4D6;
          border: none;
          cursor: pointer;
          padding: 10px;
          color: #dc2626;
          border-radius: 12px;
        }

        /* Mobile Drawer Menu */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 24px;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
        }

        .mobile-nav-overlay.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .close-menu-btn {
          background: #FFE4D6;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #dc2626;
        }

        .mobile-nav-btn-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mobile-nav-item-btn {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1.5px solid #FFD8C2;
          background: white;
          color: #1e293b;
          font-weight: 800;
          font-size: 1rem;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .mobile-nav-item-btn.active {
          border-color: #ea580c;
          background: #FFF3ED;
          color: #dc2626;
        }

        /* --- Main Content Layout --- */
        .v-main-content {
          flex: 1;
          max-width: 1160px;
          width: 100%;
          margin: 0 auto;
          padding: 36px 20px 80px 20px;
          display: flex;
          flex-direction: column;
        }

        /* Red & Flame Orange Gradient Hero Banner */
        .v-hero-card {
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 40%, #ea580c 80%, #f97316 100%);
          color: white;
          border-radius: 28px;
          padding: 40px 48px;
          margin-bottom: 32px;
          box-shadow: 0 16px 36px -8px rgba(220, 38, 38, 0.4);
          position: relative;
          overflow: hidden;
        }

        .v-hero-card::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          pointer-events: none;
        }

        .v-hero-title {
          font-size: 2.35rem;
          font-weight: 900;
          margin: 0 0 12px 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .v-hero-desc {
          font-size: 1rem;
          color: #ffedd5;
          max-width: 740px;
          margin: 0 0 28px 0;
          line-height: 1.6;
          font-weight: 500;
        }

        .v-hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-pill-primary {
          background: #ffffff;
          color: #dc2626;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.95rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
        }
        .btn-pill-primary:hover {
          background: #fff5f5;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
        }

        .btn-pill-secondary {
          background: rgba(255, 255, 255, 0.18);
          color: white;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .btn-pill-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* Layout Grid */
        .v-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 960px) {
          .v-grid-layout {
            grid-template-columns: 1fr;
          }
          .v-header .rep-nav-tabs {
            display: none;
          }
          .hamburger-btn {
            display: flex;
          }
        }

        /* --- Main Form Card (Elevated Warm Glass Style) --- */
        .v-form-card {
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(234, 88, 12, 0.18);
          box-shadow: 0 12px 32px -6px rgba(220, 38, 38, 0.07), 0 4px 16px rgba(234, 88, 12, 0.04);
          padding: 40px;
        }

        @media (max-width: 600px) {
          .v-form-card {
            padding: 26px 20px;
            border-radius: 20px;
          }
          .v-hero-card {
            padding: 30px 22px;
            border-radius: 20px;
          }
          .v-hero-title {
            font-size: 1.65rem;
          }
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #FFE4D6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .card-title-text {
          font-size: 1.35rem;
          font-weight: 900;
          color: #dc2626;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-badge {
          background: #FFEDD5;
          color: #c2410c;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 50px;
        }

        /* Stepper Progress Bar */
        .v-stepper-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-bottom: 36px;
        }

        .v-stepper-line {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 3px;
          background-color: #FFD8C2;
          z-index: 1;
        }

        .v-step-node {
          position: relative;
          z-index: 2;
          background: white;
          padding: 0 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .v-step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #FFEDD5;
          color: #ea580c;
          font-size: 0.9rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #FAF6F0;
          transition: all 0.3s ease;
        }

        .v-step-node.active .v-step-circle {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 0 0 5px rgba(234, 88, 12, 0.25);
        }

        .v-step-node.done .v-step-circle {
          background-color: #16a34a;
          color: white;
        }

        .v-step-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #9a3412;
          margin-top: 6px;
        }

        .v-step-node.active .v-step-label {
          color: #dc2626;
          font-weight: 900;
        }

        /* Category Selection Grid Cards */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .category-card {
          border: 2px solid #FFD8C2;
          border-radius: 18px;
          padding: 20px 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: #FFFBF8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .category-card:hover {
          border-color: #ea580c;
          background: #FFF3ED;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.12);
        }

        .category-card.selected {
          border-color: #dc2626;
          background: #FFEBE6;
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.2);
        }

        .icon-circle-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFF0EB, #FFE4D6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .category-card.selected .icon-circle-wrapper {
          background: linear-gradient(135deg, #dc2626, #ea580c);
        }

        .category-svg-icon {
          width: 26px;
          height: 26px;
          color: #dc2626;
          transition: color 0.25s ease;
        }

        .category-card.selected .category-svg-icon {
          color: #ffffff;
        }

        .category-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
        }

        /* Severity Pills */
        .severity-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .severity-options {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .severity-btn {
          border: 2px solid #FFD8C2;
          padding: 14px;
          border-radius: 16px;
          background: white;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.88rem;
          text-align: center;
          transition: all 0.2s ease;
        }

        .severity-btn.critical.selected {
          background: #FEE2E2;
          border-color: #dc2626;
          color: #990000;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        .severity-btn.high.selected {
          background: #FFEDD5;
          border-color: #ea580c;
          color: #9a3412;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
        }
        .severity-btn.medium.selected {
          background: #FEF9C3;
          border-color: #eab308;
          color: #854d0e;
        }
        .severity-btn.low.selected {
          background: #DCFCE7;
          border-color: #16a34a;
          color: #166534;
        }

        /* Inputs & Form Groups */
        .v-form-group {
          margin-bottom: 24px;
        }

        .v-form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .v-form-input, .v-form-select, .v-form-textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #FFD8C2;
          border-radius: 14px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0f172a;
          background: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .v-form-input:focus, .v-form-select:focus, .v-form-textarea:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.18);
        }

        .v-form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        @media (max-width: 600px) {
          .v-form-row-2 {
            grid-template-columns: 1fr;
          }
        }

        /* GPS Location Geotag Card */
        .gps-location-card {
          background: linear-gradient(135deg, #FFF8F5, #FFF3ED);
          border: 1.5px dashed #ea580c;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .gps-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .gps-btn {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
          transition: transform 0.2s;
        }
        .gps-btn:hover {
          transform: translateY(-2px);
        }

        /* Assistance Need Checkbox Cards */
        .needs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 10px;
        }

        @media (max-width: 600px) {
          .needs-grid {
            grid-template-columns: 1fr;
          }
        }

        .need-card {
          border: 1.5px solid #FFD8C2;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .need-card.selected {
          border-color: #ea580c;
          background: #FFF3ED;
        }

        .need-card input {
          accent-color: #ea580c;
          width: 18px;
          height: 18px;
        }

        /* Counter Controls */
        .counter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFE4D6;
          padding: 6px 14px;
          border-radius: 14px;
          width: fit-content;
        }

        .counter-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid #FFD8C2;
          background: white;
          font-weight: 900;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
        }

        .counter-val {
          font-weight: 900;
          font-size: 1.1rem;
          min-width: 32px;
          text-align: center;
          color: #0f172a;
        }

        /* Media Upload Dropzone */
        .upload-dropzone {
          border: 2px dashed #ea580c;
          border-radius: 20px;
          padding: 36px;
          text-align: center;
          background: #FFFBF8;
          cursor: pointer;
          transition: all 0.25s ease;
          display: block;
        }

        .upload-dropzone:hover {
          border-color: #dc2626;
          background: #FFF0E6;
          transform: translateY(-2px);
        }

        .preview-thumbs {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .thumb-card {
          width: 86px;
          height: 86px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #FFD8C2;
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Action Buttons */
        .form-nav-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid #FFE4D6;
        }

        .btn-secondary-action {
          background: #FFE4D6;
          color: #c2410c;
          border: none;
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary-action:hover {
          background: #FFD8C2;
        }

        .btn-primary-action {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35);
        }
        .btn-primary-action:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 25px rgba(220, 38, 38, 0.45);
        }

        /* --- Quick SOS Beacon Section --- */
        .sos-container {
          background: #ffffff;
          border: 2px solid #dc2626;
          border-radius: 28px;
          padding: 40px;
          box-shadow: 0 16px 36px rgba(220, 38, 38, 0.18);
        }

        .sos-big-btn-wrap {
          text-align: center;
          margin: 36px 0;
        }

        .sos-big-btn {
          width: 185px;
          height: 185px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          border: 6px solid #FFEDD5;
          font-size: 1.65rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 0 0 20px rgba(220, 38, 38, 0.2);
          animation: pulse-radar 2s infinite;
          transition: transform 0.2s;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        @keyframes pulse-radar {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6); }
          70% { box-shadow: 0 0 0 28px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }

        /* --- Sidebar Widgets --- */
        .v-widget-card {
          background: #ffffff;
          border: 1px solid #FFD8C2;
          border-radius: 24px;
          padding: 26px;
          margin-bottom: 24px;
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.05);
        }

        .v-widget-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: #dc2626;
          margin: 0 0 18px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .helpline-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #FFE4D6;
        }

        .helpline-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
        }

        .helpline-num {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 0.85rem;
          padding: 5px 16px;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 3px 10px rgba(220, 38, 38, 0.25);
        }

        .recent-alert-item {
          background: #FFFBF8;
          border-left: 4px solid #ea580c;
          padding: 14px 16px;
          border-radius: 0 12px 12px 0;
          margin-bottom: 14px;
        }

        /* --- Toast Banner --- */
        .toast-notification {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: linear-gradient(135deg, #990000 0%, #dc2626 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(220, 38, 38, 0.4);
          z-index: 999;
          font-weight: 800;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Footer */
        .v-footer {
          background: #7f1d1d;
          color: #ffedd5;
          padding: 40px 6%;
          text-align: center;
          font-size: 0.88rem;
          margin-top: 60px;
        }
      `}</style>

      {/* --- Top Emergency Announcement Ticker --- */}
      <div className="emergency-banner-ticker">
        <div className="ticker-left">
          <span className="sos-pulse-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            LIVE SOS NETWORK
          </span>
          <span>UVMP Emergency Control Room Active • Real-time Disaster Rescue Response</span>
        </div>
        <div className="ticker-helpline">
          <span>National Helpline:</span>
          <a href="tel:112" className="helpline-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            112 / 1070
          </a>
        </div>
      </div>

      {/* --- Header Bar --- */}
      <header className="v-header">
        <a href="#" className="v-brand-wrapper">
          <img src={logo} alt="UVMP Logo" className="v-brand-logo-img" />
          <div className="v-brand-text-group">
            <span className="v-brand-title">UVMP</span>
            <span className="v-brand-subtitle">Citizen Disaster Reporting Portal</span>
          </div>
        </a>

        {/* Desktop Nav Pills */}
        <nav className="rep-nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Report Incident
          </button>
          <button 
            className={`nav-tab-btn sos-btn-tab ${activeTab === 'sos' ? 'active' : ''}`}
            onClick={() => setActiveTab('sos')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            QUICK SOS
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Track Status
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Helplines
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <a href="#" className="v-brand-wrapper" onClick={() => setMobileMenuOpen(false)}>
            <img src={logo} alt="UVMP Logo" className="v-brand-logo-img" />
          </a>
          <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="mobile-nav-btn-list">
          <button 
            className={`mobile-nav-item-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => { setActiveTab('report'); setMobileMenuOpen(false); }}
          >
            📋 File Incident Report
          </button>
          <button 
            className={`mobile-nav-item-btn ${activeTab === 'sos' ? 'active' : ''}`}
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
            onClick={() => { setActiveTab('sos'); setMobileMenuOpen(false); }}
          >
            🚨 QUICK SOS Emergency Beacon
          </button>
          <button 
            className={`mobile-nav-item-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => { setActiveTab('track'); setMobileMenuOpen(false); }}
          >
            🔍 Track Report Status
          </button>
          <button 
            className={`mobile-nav-item-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('contacts'); setMobileMenuOpen(false); }}
          >
            📞 Emergency Helplines
          </button>
        </div>
      </div>

      {/* --- Main Content Container --- */}
      <main className="v-main-content">

        {/* Hero Card */}
        <div className="v-hero-card">
          <h1 className="v-hero-title">Report a Disaster & Request Immediate Rescue</h1>
          <p className="v-hero-desc">
            Directly alert District Disaster Control, NDRF rescue teams, and registered local volunteer groups. Open access for all citizens without prior login requirement.
          </p>
          <div className="v-hero-actions">
            <button className="btn-pill-primary" onClick={() => setActiveTab('sos')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Quick SOS Distress Beacon
            </button>
            <button className="btn-pill-secondary" onClick={() => { setActiveTab('report'); setStep(1); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              File Incident Report
            </button>
            <button className="btn-pill-secondary" onClick={() => setShowGuideModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Survival Guide
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="v-grid-layout">

          {/* LEFT: Main Forms */}
          <div>

            {/* TAB 1: INCIDENT FORM */}
            {activeTab === 'report' && (
              <div>
                {submittedReport ? (
                  <div className="v-form-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h2 style={{ color: '#16a34a', margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '900' }}>Report Submitted Successfully!</h2>
                    <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '24px' }}>
                      Your reference ID is <strong style={{ color: '#dc2626', fontSize: '1.2rem' }}>{submittedReport.id}</strong>.
                    </p>

                    <div style={{ background: '#FFF8F5', padding: '20px', borderRadius: '18px', border: '1px solid #FFD8C2', textAlign: 'left', marginBottom: '28px' }}>
                      <p style={{ margin: '6px 0' }}><strong>Category:</strong> {submittedReport.type} ({submittedReport.severity} Severity)</p>
                      <p style={{ margin: '6px 0' }}><strong>Location:</strong> {submittedReport.address}, {submittedReport.district}</p>
                      <p style={{ margin: '6px 0' }}><strong>Status:</strong> <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 12px', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem' }}>Under Verification</span></p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-primary-action" 
                        onClick={() => {
                          setTrackSearchId(submittedReport.id);
                          setSearchedReport(submittedReport);
                          setActiveTab('track');
                        }}
                      >
                        🔍 Track Live Dispatch Status
                      </button>
                      <button 
                        className="btn-secondary-action"
                        onClick={() => {
                          setSubmittedReport(null);
                          setStep(1);
                        }}
                      >
                        Submit Another Incident
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="v-form-card">
                    
                    {/* Stepper Progress Header */}
                    <div className="v-stepper-container">
                      <div className="v-stepper-line" />
                      {[
                        { num: 1, label: 'Category' },
                        { num: 2, label: 'Location' },
                        { num: 3, label: 'Impact' },
                        { num: 4, label: 'Media' },
                        { num: 5, label: 'Review' },
                      ].map(s => (
                        <div 
                          key={s.num} 
                          className={`v-step-node ${step === s.num ? 'active' : step > s.num ? 'done' : ''}`}
                          onClick={() => setStep(s.num)}
                        >
                          <div className="v-step-circle">
                            {step > s.num ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : s.num}
                          </div>
                          <span className="v-step-label">{s.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* STEP 1: Disaster Category */}
                    {step === 1 && (
                      <div>
                        <div className="card-header-flex">
                          <h2 className="card-title-text">1. Select Disaster Category</h2>
                          <span className="step-badge">Step 1 of 5</span>
                        </div>

                        <div className="v-form-group">
                          <label className="v-form-label">Incident Category <span style={{ color: '#dc2626' }}>*</span></label>
                          <div className="category-grid">
                            {[
                              { 
                                id: 'Flood', name: 'Flood & Inundation', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg> 
                              },
                              { 
                                id: 'Earthquake', name: 'Earthquake', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"/></svg> 
                              },
                              { 
                                id: 'Landslide', name: 'Landslide', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg> 
                              },
                              { 
                                id: 'Fire', name: 'Fire / Explosion', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> 
                              },
                              { 
                                id: 'Cyclone', name: 'Cyclone / Storm', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.2 2a10 10 0 1 0 9.8 12M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg> 
                              },
                              { 
                                id: 'Building', name: 'Structure Collapse', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/></svg> 
                              },
                              { 
                                id: 'Chemical', name: 'Chemical Hazard', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> 
                              },
                              { 
                                id: 'Other', name: 'Other Crisis', 
                                icon: <svg className="category-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> 
                              },
                            ].map(item => (
                              <div 
                                key={item.id}
                                className={`category-card ${disasterType === item.id ? 'selected' : ''}`}
                                onClick={() => setDisasterType(item.id)}
                              >
                                <div className="icon-circle-wrapper">
                                  {item.icon}
                                </div>
                                <span className="category-name">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="v-form-group">
                          <label className="v-form-label">Severity Level <span style={{ color: '#dc2626' }}>*</span></label>
                          <div className="severity-options">
                            <button 
                              type="button"
                              className={`severity-btn critical ${severity === 'Critical' ? 'selected' : ''}`}
                              onClick={() => setSeverity('Critical')}
                            >
                              Critical (Rescue)
                            </button>
                            <button 
                              type="button"
                              className={`severity-btn high ${severity === 'High' ? 'selected' : ''}`}
                              onClick={() => setSeverity('High')}
                            >
                              High (Threat)
                            </button>
                            <button 
                              type="button"
                              className={`severity-btn medium ${severity === 'Medium' ? 'selected' : ''}`}
                              onClick={() => setSeverity('Medium')}
                            >
                              Medium (Damage)
                            </button>
                            <button 
                              type="button"
                              className={`severity-btn low ${severity === 'Low' ? 'selected' : ''}`}
                              onClick={() => setSeverity('Low')}
                            >
                              Low (Observe)
                            </button>
                          </div>
                        </div>

                        <div className="form-nav-actions">
                          <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: '700' }}>Select incident category to proceed</span>
                          <button className="btn-primary-action" onClick={() => setStep(2)}>
                            Next: Location Geotag ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Location */}
                    {step === 2 && (
                      <div>
                        <div className="card-header-flex">
                          <h2 className="card-title-text">2. Location Geotagging</h2>
                          <span className="step-badge">Step 2 of 5</span>
                        </div>

                        <div className="gps-location-card">
                          <div className="gps-info">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a' }}>
                                {gpsCoords.lat ? `GPS: ${gpsCoords.lat}, ${gpsCoords.lng}` : 'Use Device GPS Sensor'}
                              </strong>
                              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                {locationAccuracy ? `Geotag Accuracy ~${locationAccuracy}m` : 'Provides exact rescue coordinates for NDRF & Volunteers'}
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            className="gps-btn"
                            onClick={() => handleGetLocation(false)}
                            disabled={isLocating}
                          >
                            {isLocating ? 'Locating...' : '🎯 Auto-Geotag'}
                          </button>
                        </div>

                        <div className="v-form-row-2">
                          <div className="v-form-group">
                            <label className="v-form-label">District <span style={{ color: '#dc2626' }}>*</span></label>
                            <select 
                              className="v-form-select"
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                            >
                              <option value="">Select District</option>
                              {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>

                          <div className="v-form-group">
                            <label className="v-form-label">Taluk / Local Area</label>
                            <input 
                              type="text" 
                              className="v-form-input"
                              placeholder="e.g. North Paravur / Ambalapuzha"
                              value={taluk}
                              onChange={(e) => setTaluk(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="v-form-group">
                          <label className="v-form-label">Landmark / Detailed Address <span style={{ color: '#dc2626' }}>*</span></label>
                          <textarea 
                            className="v-form-textarea"
                            rows="3"
                            placeholder="Specify near temple/school/bridge, house number, road name, or prominent landmark..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>

                        <div className="form-nav-actions">
                          <button className="btn-secondary-action" onClick={() => setStep(1)}>
                            ⬅ Back
                          </button>
                          <button className="btn-primary-action" onClick={() => setStep(3)}>
                            Next: Impact & Needs ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Impact & Assistance */}
                    {step === 3 && (
                      <div>
                        <div className="card-header-flex">
                          <h2 className="card-title-text">3. Victims Count & Required Relief</h2>
                          <span className="step-badge">Step 3 of 5</span>
                        </div>

                        <div className="v-form-row-2" style={{ marginBottom: '24px' }}>
                          <div className="v-form-group">
                            <label className="v-form-label">Trapped / Stranded Persons</label>
                            <div className="counter-group">
                              <button type="button" className="counter-btn" onClick={() => setTrappedCount(Math.max(0, trappedCount - 1))}>-</button>
                              <span className="counter-val">{trappedCount}</span>
                              <button type="button" className="counter-btn" onClick={() => setTrappedCount(trappedCount + 1)}>+</button>
                            </div>
                          </div>

                          <div className="v-form-group">
                            <label className="v-form-label">Injured Persons</label>
                            <div className="counter-group">
                              <button type="button" className="counter-btn" onClick={() => setInjuredCount(Math.max(0, injuredCount - 1))}>-</button>
                              <span className="counter-val">{injuredCount}</span>
                              <button type="button" className="counter-btn" onClick={() => setInjuredCount(injuredCount + 1)}>+</button>
                            </div>
                          </div>
                        </div>

                        <div className="v-form-group">
                          <label className="v-form-label">Assistance Required (Select all applicable)</label>
                          <div className="needs-grid">
                            {[
                              { key: 'medical', label: '🚑 Medical Care / First Aid' },
                              { key: 'rescueBoat', label: '🚤 Rescue Boat / Evacuation' },
                              { key: 'searchRescue', label: '🦺 NDRF Search & Rescue Team' },
                              { key: 'foodWater', label: '🍱 Emergency Food & Water' },
                              { key: 'shelter', label: '⛺ Temporary Shelter' },
                              { key: 'heavyMachinery', label: '🚜 Heavy Excavator / Machinery' },
                              { key: 'powerBackup', label: '⚡ Power Backup / Generators' },
                              { key: 'fireExtinguisher', label: '🚒 Fire Fighting Services' },
                            ].map(item => (
                              <label key={item.key} className={`need-card ${assistanceNeeded[item.key] ? 'selected' : ''}`}>
                                <input 
                                  type="checkbox"
                                  checked={assistanceNeeded[item.key]}
                                  onChange={() => handleNeedToggle(item.key)}
                                />
                                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="v-form-group" style={{ marginTop: '24px' }}>
                          <label className="v-form-label">Ground Situation Description</label>
                          <textarea 
                            className="v-form-textarea"
                            rows="3"
                            placeholder="Describe water depth, structural damages, electric hazards, urgent medication required..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        <div className="form-nav-actions">
                          <button className="btn-secondary-action" onClick={() => setStep(2)}>
                            ⬅ Back
                          </button>
                          <button className="btn-primary-action" onClick={() => setStep(4)}>
                            Next: Media Evidence ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Media Upload */}
                    {step === 4 && (
                      <div>
                        <div className="card-header-flex">
                          <h2 className="card-title-text">4. Attach Photo / Video Proof</h2>
                          <span className="step-badge">Step 4 of 5</span>
                        </div>

                        <div className="v-form-group">
                          <label className="v-form-label">Upload Damage Photos or Video (Optional)</label>
                          <label className="upload-dropzone">
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*,video/*" 
                              style={{ display: 'none' }} 
                              onChange={handleFileUpload}
                            />
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" style={{ margin: '0 auto 12px auto', display: 'block' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <strong style={{ display: 'block', color: '#0f172a', fontSize: '1rem' }}>Click or Drag & Drop Media Here</strong>
                            <span style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: '700' }}>Supports JPG, PNG, MP4 up to 25MB per file</span>
                          </label>
                        </div>

                        {mediaFiles.length > 0 && (
                          <div className="preview-thumbs">
                            {mediaFiles.map((m, idx) => (
                              <div key={idx} className="thumb-card">
                                <img src={m.preview} alt="upload preview" className="thumb-img" />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="v-form-group" style={{ marginTop: '24px', background: '#FFF8F5', padding: '20px', borderRadius: '18px', border: '1.5px solid #FFD8C2' }}>
                          <label className="v-form-label">🎙️ Audio Voice Memo (Simulation)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <button 
                              type="button" 
                              className="btn-secondary-action"
                              onClick={() => {
                                setIsRecordingAudio(!isRecordingAudio);
                                if (!isRecordingAudio) {
                                  setTimeout(() => {
                                    setIsRecordingAudio(false);
                                    setAudioRecorded(true);
                                    setToastMessage('Voice note attached (0:06).');
                                  }, 3000);
                                }
                              }}
                            >
                              {isRecordingAudio ? '🔴 Recording...' : '🎙️ Record Voice Note'}
                            </button>
                            {audioRecorded && <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.88rem' }}>✓ Voice Note Attached (0:06)</span>}
                          </div>
                        </div>

                        <div className="form-nav-actions">
                          <button className="btn-secondary-action" onClick={() => setStep(3)}>
                            ⬅ Back
                          </button>
                          <button className="btn-primary-action" onClick={() => setStep(5)}>
                            Next: Review & Submit ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: Review & Submit */}
                    {step === 5 && (
                      <div>
                        <div className="card-header-flex">
                          <h2 className="card-title-text">5. Review & Submit Report</h2>
                          <span className="step-badge">Step 5 of 5</span>
                        </div>

                        <div style={{ background: '#FFF7ED', border: '1.5px solid #FFEDD5', padding: '18px 22px', borderRadius: '16px', marginBottom: '26px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox"
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              style={{ width: '20px', height: '20px', accentColor: '#ea580c' }}
                            />
                            <div>
                              <strong style={{ color: '#9A3412', fontSize: '0.95rem' }}>Submit Report Anonymously</strong>
                              <span style={{ display: 'block', fontSize: '0.82rem', color: '#C2410C' }}>
                                Check this if you prefer to withhold your personal contact details.
                              </span>
                            </div>
                          </label>
                        </div>

                        {!isAnonymous && (
                          <div className="v-form-row-2">
                            <div className="v-form-group">
                              <label className="v-form-label">Reporter Full Name</label>
                              <input 
                                type="text" 
                                className="v-form-input"
                                placeholder="Your Name"
                                value={reporterName}
                                onChange={(e) => setReporterName(e.target.value)}
                              />
                            </div>

                            <div className="v-form-group">
                              <label className="v-form-label">Contact Mobile Number</label>
                              <input 
                                type="tel" 
                                className="v-form-input"
                                placeholder="10-digit mobile number"
                                value={reporterPhone}
                                onChange={(e) => setReporterPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        <div style={{ background: '#FFF8F5', border: '1.5px solid #FFD8C2', padding: '22px', borderRadius: '18px', marginBottom: '26px' }}>
                          <h4 style={{ margin: '0 0 12px 0', color: '#dc2626', fontSize: '1.05rem', fontWeight: '900' }}>Incident Summary</h4>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}><strong>Category:</strong> {disasterType} ({severity} Severity)</p>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}><strong>District:</strong> {district || 'Not Specified'}</p>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}><strong>Address:</strong> {address || 'Pinned Geotag'}</p>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}><strong>Victims:</strong> {trappedCount} trapped, {injuredCount} injured</p>
                        </div>

                        <div className="form-nav-actions">
                          <button className="btn-secondary-action" onClick={() => setStep(4)}>
                            ⬅ Back
                          </button>
                          <button 
                            className="btn-primary-action" 
                            style={{ background: '#16a34a' }}
                            onClick={handleSubmitReport}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting Report...' : '🚀 Submit Incident Report Now'}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QUICK SOS */}
            {activeTab === 'sos' && (
              <div className="sos-container">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span className="sos-pulse-badge" style={{ fontSize: '0.82rem' }}>1-TAP DISTRESS BEACON</span>
                  <h2 style={{ color: '#dc2626', fontSize: '1.9rem', margin: '12px 0 8px 0', fontWeight: '900' }}>Emergency SOS Beacon</h2>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                    Press the SOS button to instantly alert nearest emergency response units with your live GPS location.
                  </p>
                </div>

                {sosSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '36px 24px', background: '#FEE2E2', borderRadius: '24px', border: '2px solid #fca5a5' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <h3 style={{ color: '#990000', margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '900' }}>SOS Beacon Activated!</h3>
                    <p style={{ color: '#dc2626', fontWeight: '900', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Code: {sosDetails.id}</p>
                    <p style={{ fontSize: '0.88rem', color: '#7f1d1d' }}>
                      Dispatched at {sosDetails.time}. Control room teams are pinpointing your device coordinates.
                    </p>
                    <button className="btn-secondary-action" onClick={() => setSosSubmitted(false)} style={{ marginTop: '20px' }}>
                      Reset SOS Signal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSosSubmit}>
                    <div className="sos-big-btn-wrap">
                      <button type="submit" className="sos-big-btn">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <span>SOS RESCUE</span>
                      </button>
                    </div>

                    <div className="v-form-group">
                      <label className="v-form-label">Danger Type</label>
                      <select 
                        className="v-form-select"
                        value={sosCategory}
                        onChange={(e) => setSosCategory(e.target.value)}
                      >
                        <option value="Trapped / Immediate Rescue Needed">Trapped / Immediate Rescue Needed</option>
                        <option value="Medical Emergency / Critical Injury">Medical Emergency / Critical Injury</option>
                        <option value="Rising Flood Water Danger">Rising Flood Water Danger</option>
                        <option value="Fire / Structural Hazard">Fire / Structural Hazard</option>
                      </select>
                    </div>

                    <div className="gps-location-card" style={{ background: '#ffffff' }}>
                      <div className="gps-info">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>{sosLocation || 'Device Coordinates Not Geotagged'}</span>
                      </div>
                      <button 
                        type="button" 
                        className="gps-btn"
                        onClick={() => handleGetLocation(true)}
                        disabled={sosLocating}
                      >
                        {sosLocating ? 'Locating...' : 'Get GPS'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: TRACK REPORT STATUS */}
            {activeTab === 'track' && (
              <div className="v-form-card">
                <div className="card-header-flex">
                  <h2 className="card-title-text">🔍 Track Incident Dispatch Status</h2>
                </div>

                <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
                  <input 
                    type="text"
                    className="v-form-input"
                    placeholder="Enter Report ID (e.g. REP-2026-9041) or Mobile Number"
                    value={trackSearchId}
                    onChange={(e) => setTrackSearchId(e.target.value)}
                    style={{ flex: 1, minWidth: '220px' }}
                  />
                  <button type="submit" className="btn-primary-action">
                    Search
                  </button>
                </form>

                {searchError && <p style={{ color: '#dc2626', fontWeight: '700' }}>{searchError}</p>}

                {searchedReport ? (
                  <div style={{ background: '#FFF8F5', border: '1.5px solid #FFD8C2', padding: '28px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0', color: '#dc2626', fontSize: '1.25rem', fontWeight: '900' }}>{searchedReport.type}</h3>
                        <span style={{ fontSize: '0.88rem', color: '#6b7280' }}>Report ID: {searchedReport.id} • {searchedReport.address}</span>
                      </div>
                      <span style={{ background: '#DCFCE7', color: '#166534', padding: '6px 16px', borderRadius: '50px', fontWeight: '800', fontSize: '0.82rem', height: 'fit-content' }}>
                        {searchedReport.status}
                      </span>
                    </div>

                    <h4 style={{ margin: '20px 0 14px 0', fontSize: '0.98rem', fontWeight: '800' }}>Rescue Ops Timeline</h4>
                    <div>
                      {searchedReport.timeline.map((tStep, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', marginBottom: '18px', opacity: tStep.done ? 1 : 0.6 }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: tStep.done ? '#16a34a' : '#FFD8C2', color: tStep.done ? 'white' : '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: '900' }}>
                            {tStep.done ? '✓' : idx + 1}
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a' }}>{tStep.status}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{tStep.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: '#6b7280' }}>
                    <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.5" style={{ margin: '0 auto 14px auto', display: 'block' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <p style={{ fontSize: '0.95rem' }}>Enter your report reference ID above to check rescue dispatch updates.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HELPLINES DIRECTORY */}
            {activeTab === 'contacts' && (
              <div className="v-form-card">
                <div className="card-header-flex">
                  <h2 className="card-title-text">📞 Emergency Helplines Directory</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                  {[
                    { title: 'National Emergency Response', num: '112', desc: 'Toll-free 24/7 Dispatch' },
                    { title: 'State Disaster Control Room', num: '1070', desc: 'Disaster Management Cell' },
                    { title: 'District Control (DDMA)', num: '1077', desc: 'District Rescue Force' },
                    { title: 'NDRF Control Room', num: '011-24363260', desc: 'National Disaster Rescue' },
                    { title: 'Fire & Rescue Services', num: '101', desc: 'Fire Brigade Services' },
                    { title: 'Medical Ambulance', num: '108', desc: 'Emergency Transport' },
                  ].map((contact, idx) => (
                    <div key={idx} style={{ background: '#FFF8F5', padding: '20px', borderRadius: '18px', border: '1.5px solid #FFD8C2' }}>
                      <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '1rem', fontWeight: '800' }}>{contact.title}</h4>
                      <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: '#6b7280' }}>{contact.desc}</p>
                      <a href={`tel:${contact.num}`} className="helpline-num" style={{ display: 'inline-block' }}>
                        📞 Call {contact.num}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>



        </div>

      </main>

      {/* --- Disaster Guide Modal --- */}
      {showGuideModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative',
            border: '2px solid #FFD8C2',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <button 
              onClick={() => setShowGuideModal(false)}
              style={{ position: 'absolute', right: '22px', top: '22px', border: 'none', background: '#FFF0E6', color: '#dc2626', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: '900', fontSize: '1.1rem' }}
            >✕</button>

            <h2 style={{ color: '#dc2626', margin: '0 0 18px 0', fontSize: '1.6rem', fontWeight: '900' }}>📖 Emergency Survival Guide</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {['flood', 'earthquake', 'fire', 'landslide'].map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGuide(g)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: 'none',
                    background: selectedGuide === g ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)' : '#FFF0E6',
                    color: selectedGuide === g ? 'white' : '#c2410c',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: '0.88rem'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {selectedGuide === 'flood' && (
              <div style={{ lineHeight: '1.7', fontSize: '0.92rem', color: '#374151' }}>
                <h3 style={{ color: '#dc2626', fontWeight: '800' }}>🌊 In Case of Flooding</h3>
                <ul>
                  <li>Seek higher ground immediately. Avoid basements and low-lying ground.</li>
                  <li>Do not touch electrical switches or appliances if standing in water.</li>
                  <li>If trapped inside a building, move to upper floors.</li>
                </ul>
              </div>
            )}
            {selectedGuide === 'earthquake' && (
              <div style={{ lineHeight: '1.7', fontSize: '0.92rem', color: '#374151' }}>
                <h3 style={{ color: '#dc2626', fontWeight: '800' }}>🏚️ In Case of Earthquake</h3>
                <ul>
                  <li><strong>DROP, COVER, HOLD ON:</strong> Drop to hands and knees, cover head under a sturdy desk.</li>
                  <li>Stay away from glass windows and heavy hanging objects.</li>
                  <li>If outdoors, stay clear of power lines and high-rise structures.</li>
                </ul>
              </div>
            )}
            {selectedGuide === 'fire' && (
              <div style={{ lineHeight: '1.7', fontSize: '0.92rem', color: '#374151' }}>
                <h3 style={{ color: '#dc2626', fontWeight: '800' }}>🔥 In Case of Fire</h3>
                <ul>
                  <li>Crawl low under smoke toward nearest emergency exit.</li>
                  <li>Feel doors before opening. If hot, do not open.</li>
                  <li>Call 101 immediately once safely outside.</li>
                </ul>
              </div>
            )}
            {selectedGuide === 'landslide' && (
              <div style={{ lineHeight: '1.7', fontSize: '0.92rem', color: '#374151' }}>
                <h3 style={{ color: '#dc2626', fontWeight: '800' }}>⛰️ In Case of Landslide</h3>
                <ul>
                  <li>Stay alert for sudden muddy stream flows or cracking sounds from slopes.</li>
                  <li>Move away from mudslide paths immediately toward crests or ridge tops.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Toast Banner --- */}
      {toastMessage && (
        <div className="toast-notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- Footer --- */}
      <footer className="v-footer">
        <p style={{ margin: '0 0 6px 0', fontWeight: '900', color: '#ffffff', fontSize: '1rem' }}>
          UVMP - Unified Volunteer & Disaster Management Platform
        </p>
        <p style={{ margin: 0, fontWeight: '500' }}>
          Open Access Public Incident Reporting • Integrated with State Disaster Control Rooms
        </p>
      </footer>

    </div>
  );
}

export default ReportingPage;