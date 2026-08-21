import React, { useState, useEffect } from 'react';
import logo from '../assets/uvmp_logo.png';

function NGO_Dashboard() {
  // Active Sidebar Tab State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'create-event', 'volunteers', 'progress', 'analytics', 'communication', 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Global Filter / Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEventForProgress, setSelectedEventForProgress] = useState(1);

  // --- Sample Events Data ---
  const [eventsList, setEventsList] = useState([
    {
      id: 1,
      name: 'Wayanad Landslide Emergency Relief',
      category: 'Landslide Rescue',
      location: 'Meppadi, Wayanad District',
      district: 'Wayanad',
      status: 'Critical',
      severity: 'Critical',
      volunteersAssigned: 45,
      volunteersNeeded: 50,
      progress: 78,
      startDate: '2026-08-01',
      endDate: '2026-08-15',
      tasksCompleted: 14,
      totalTasks: 18,
      description: 'Emergency search, medical aid, and ration distribution following heavy rainfall and landslide.'
    },
    {
      id: 2,
      name: 'Aluva Flood Rescue & Shelter Support',
      category: 'Flood Relief',
      location: 'North Paravur, Ernakulam',
      district: 'Ernakulam',
      status: 'Active',
      severity: 'High',
      volunteersAssigned: 32,
      volunteersNeeded: 40,
      progress: 62,
      startDate: '2026-08-05',
      endDate: '2026-08-20',
      tasksCompleted: 10,
      totalTasks: 16,
      description: 'Deploying rescue boats, setting up relief camps, and providing clean drinking water.'
    },
    {
      id: 3,
      name: 'Munnar Hill Road Clearance Campaign',
      category: 'Community Clean-up',
      location: 'Gap Road, Idukki',
      district: 'Idukki',
      status: 'Planning',
      severity: 'Medium',
      volunteersAssigned: 12,
      volunteersNeeded: 25,
      progress: 25,
      startDate: '2026-08-12',
      endDate: '2026-08-25',
      tasksCompleted: 3,
      totalTasks: 12,
      description: 'Clearing debris and assisting local public works department in restoring vehicular traffic.'
    },
    {
      id: 4,
      name: 'Kuttanad Medical & Epidemic Control',
      category: 'Medical Camp',
      location: 'Ambalapuzha, Alappuzha',
      district: 'Alappuzha',
      status: 'Active',
      severity: 'High',
      volunteersAssigned: 28,
      volunteersNeeded: 30,
      progress: 90,
      startDate: '2026-07-28',
      endDate: '2026-08-14',
      tasksCompleted: 18,
      totalTasks: 20,
      description: 'Medical health check-ups, waterborne disease prevention, and essential medicine distribution.'
    }
  ]);

  // --- Sample Volunteers Data ---
  const [volunteersList, setVolunteersList] = useState([
    {
      id: 'VOL-101',
      name: 'Rahul Varma',
      phone: '+91 98765 43210',
      skills: ['First Aid', 'Boat Rescue', 'Logistics'],
      district: 'Wayanad',
      status: 'Available',
      matchScore: 96,
      rating: 4.9,
      assignedEvent: null
    },
    {
      id: 'VOL-102',
      name: 'Dr. Ananya Nair',
      phone: '+91 94471 23456',
      skills: ['Medical Care', 'First Aid', 'Epidemic Control'],
      district: 'Ernakulam',
      status: 'On Duty',
      matchScore: 92,
      rating: 5.0,
      assignedEvent: 'Aluva Flood Rescue'
    },
    {
      id: 'VOL-103',
      name: 'Kiran Joseph',
      phone: '+91 91234 56789',
      skills: ['Heavy Machinery', 'Search & Rescue', 'Driver'],
      district: 'Idukki',
      status: 'Available',
      matchScore: 88,
      rating: 4.8,
      assignedEvent: null
    },
    {
      id: 'VOL-104',
      name: 'Sneha Menon',
      phone: '+91 98950 11223',
      skills: ['Food Preparation', 'Child Care', 'Counseling'],
      district: 'Alappuzha',
      status: 'On Duty',
      matchScore: 94,
      rating: 4.95,
      assignedEvent: 'Kuttanad Medical Camp'
    },
    {
      id: 'VOL-105',
      name: 'Arjun Das',
      phone: '+91 97455 88990',
      skills: ['Boat Rescue', 'Diving', 'First Aid'],
      district: 'Wayanad',
      status: 'Available',
      matchScore: 98,
      rating: 5.0,
      assignedEvent: null
    }
  ]);

  // --- Interactive Tasks Checklist for Progress View ---
  const [tasksChecklist, setTasksChecklist] = useState([
    { id: 101, title: 'Establish emergency base camp & medical tent', completed: true },
    { id: 102, title: 'Deploy 4 rescue motorboats to marooned houses', completed: true },
    { id: 103, title: 'Distribute 500 food & dry ration packets', completed: true },
    { id: 104, title: 'Provide first aid and medical triage to 85 victims', completed: true },
    { id: 105, title: 'Coordinate NDRF heavy excavator for mud clearance', completed: false },
    { id: 106, title: 'Setup solar power generators for night lighting', completed: false }
  ]);

  // --- Field Evidence Gallery ---
  const [fieldPhotos, setFieldPhotos] = useState([
    { id: 1, caption: 'Rescue boat deployment at Meppadi river bank', time: '10 mins ago', author: 'Rahul Varma' },
    { id: 2, caption: 'Ration packet distribution in relief camp', time: '45 mins ago', author: 'Sneha Menon' },
    { id: 3, caption: 'First-aid triage station setup', time: '2 hours ago', author: 'Dr. Ananya Nair' }
  ]);

  // --- New Event Form State ---
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: 'Flood Relief',
    severity: 'High',
    district: 'Wayanad',
    location: '',
    volunteersNeeded: 25,
    startDate: '',
    endDate: '',
    description: '',
    skills: {
      firstAid: true,
      boatRescue: false,
      heavyMachinery: false,
      foodPrep: true,
      logistics: false
    }
  });

  // --- Notifications Data ---
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Volunteer Joined', text: 'Arjun Das accepted Wayanad Landslide mission.', time: '5m ago', read: false },
    { id: 2, title: 'District Alert Updated', text: 'Control Room raised alert level to CRITICAL for Idukki.', time: '15m ago', read: false },
    { id: 3, title: 'Task Completed', text: 'Ration kit distribution task marked 100% complete.', time: '1h ago', read: true }
  ]);

  // Current signed-in user (replace with real auth data as available)
  const currentUser = {
    id: 'USR-001',
    name: 'Ananya S.',
    role: 'Operations Manager',
    email: 'operations@keralarelief.org',
    phone: '+91 94471 23456',
    ngo: 'Kerala Relief Alliance NGO',
    district: 'Ernakulam',
    joined: '2023-05-12',
    bio: 'Operations lead coordinating field teams, logistics and volunteer mobilisation for disaster response across Kerala.'
  };

  // Auto toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  // Assign Volunteer Handler
  const handleAssignVolunteer = (volId, volName) => {
    setVolunteersList(prev => prev.map(v => {
      if (v.id === volId) {
        return { ...v, status: 'On Duty', assignedEvent: 'Wayanad Landslide Emergency Relief' };
      }
      return v;
    }));
    triggerToast(`✅ ${volName} assigned to Wayanad Relief Mission!`);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId) => {
    setTasksChecklist(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    triggerToast('📋 Task status updated!');
  };

  // Create Event Form Submit
  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.location) {
      triggerToast('⚠️ Please enter event title and detailed location.');
      return;
    }

    const created = {
      id: eventsList.length + 1,
      name: newEvent.name,
      category: newEvent.category,
      location: `${newEvent.location}, ${newEvent.district}`,
      district: newEvent.district,
      status: 'Active',
      severity: newEvent.severity,
      volunteersAssigned: 0,
      volunteersNeeded: Number(newEvent.volunteersNeeded) || 20,
      progress: 10,
      startDate: newEvent.startDate || new Date().toISOString().split('T')[0],
      endDate: newEvent.endDate || '2026-08-30',
      tasksCompleted: 1,
      totalTasks: 10,
      description: newEvent.description || 'Newly published community disaster relief event.'
    };

    setEventsList([created, ...eventsList]);
    setNewEvent({
      name: '',
      category: 'Flood Relief',
      severity: 'High',
      district: 'Wayanad',
      location: '',
      volunteersNeeded: 25,
      startDate: '',
      endDate: '',
      description: '',
      skills: { firstAid: true, boatRescue: false, heavyMachinery: false, foodPrep: true, logistics: false }
    });

    setActiveTab('overview');
    triggerToast(`🎉 Event "${created.name}" created and broadcasted to volunteers!`);
  };

  // Export handlers
  const handleExportPDF = () => {
    triggerToast('📄 Exporting NGO Operations Report (PDF)... Download starting.');
  };

  const handleExportExcel = () => {
    triggerToast('📊 Exporting Volunteers & Events Analytics (Excel)... Download starting.');
  };

  // Filtered Events
  const filteredEvents = eventsList.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ev.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ngo-dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .ngo-dashboard-container {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          background-color: #FBF8F5;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ngo-dashboard-container * {
          box-sizing: border-box;
        }

        /* --- HEADER (Top Navigation) --- */
        .ngo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          background: #ffffff;
          border-bottom: 1px solid #E5E7EB;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        .header-brand-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ngo-logo-img {
          height: 46px;
          width: auto;
          object-fit: contain;
        }

        .brand-text-block {
          display: flex;
          flex-direction: column;
        }

        .brand-ngo-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #800000;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .brand-ngo-subtitle {
          font-size: 0.76rem;
          color: #800000;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .header-search-bar {
          display: flex;
          align-items: center;
          background: #F5F5F5;
          border: 1px solid #E5E7EB;
          border-radius: 50px;
          padding: 8px 18px;
          width: 320px;
          transition: all 0.2s ease;
        }

        .header-search-bar:focus-within {
          background: #ffffff;
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.15);
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.88rem;
          margin-left: 8px;
          color: #333;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .btn-create-event-header {
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(128, 0, 0, 0.25);
        }

        .btn-create-event-header:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(128, 0, 0, 0.35);
        }

        .icon-btn {
          background: #F5F5F5;
          border: 1px solid #E5E7EB;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          color: #333333;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background: #FCE8E6;
          color: #800000;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #800000;
          color: white;
          font-size: 0.68rem;
          font-weight: 900;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .profile-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F5F5F5;
          padding: 6px 14px 6px 8px;
          border-radius: 50px;
          cursor: pointer;
          border: 1px solid #E5E7EB;
          position: relative;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: white;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        /* Profile modal styles (global) */
        .profile-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20000;
          padding: 20px;
        }

        .profile-modal {
          width: 720px;
          max-width: 96%;
          background: #fff;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          color: #111827;
        }

        .profile-modal-header {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .profile-avatar-large {
          width: 84px;
          height: 84px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--uvmp-primary) 0%, var(--uvmp-primary-dark) 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.4rem;
        }

        .profile-modal-title { margin: 0; font-size: 1.25rem; }
        .profile-modal-sub { color: var(--uvmp-muted); margin-top: 6px; font-size: 0.95rem }

        .profile-modal-actions { display:flex; gap:8px }

        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 18px }
        .profile-grid h4 { margin: 0 0 8px 0 }
        .profile-field { color: #374151; margin-bottom: 6px }

        .profile-about { margin-top: 16px; color: #374151 }

        @media (max-width: 520px) {
          .profile-modal { padding: 16px }
          .profile-modal-header { gap: 12px }
          .profile-avatar-large { width: 64px; height: 64px; font-size: 1.1rem }
          .profile-grid { grid-template-columns: 1fr }
        }

        /* --- LAYOUT WRAPPER (Sidebar + Content) --- */
        .ngo-layout-body {
          display: flex;
          flex: 1;
        }

        /* --- SIDEBAR (Left Menu) --- */
        .ngo-sidebar {
          width: 250px;
          background: #ffffff;
          border-right: 1px solid #E5E7EB;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: calc(100vh - 75px);
        }

        .sidebar-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 14px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #555555;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-menu-item:hover {
          background: #FCE8E6;
          color: #800000;
        }

        .sidebar-menu-item.active {
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(128, 0, 0, 0.3);
        }

        .sidebar-menu-item.active svg {
          stroke: #ffffff;
        }

        .sidebar-status-card {
          background: #FBF8F5;
          border: 1px solid #F3DDD8;
          padding: 14px;
          border-radius: 14px;
          margin-top: 20px;
        }

        .status-dot-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #800000;
          margin-bottom: 4px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
        }

        .status-subtext {
          font-size: 0.72rem;
          color: #666;
          line-height: 1.4;
        }

        /* --- MAIN CONTENT AREA --- */
        .ngo-main-content {
          flex: 1;
          padding: 28px 36px;
          overflow-y: auto;
        }

        /* Center and constrain main content for readability */
        .content-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .view-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .page-subtitle {
          font-size: 0.85rem;
          color: #6B7280;
          margin: 4px 0 0 0;
        }

        /* --- OVERVIEW CARDS (Top Row) --- */
        .overview-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .metric-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 22px 20px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(128, 0, 0, 0.12);
          border-color: #F3DDD8;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #800000 0%, #800000 100%);
        }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: #111827;
          margin: 6px 0 2px 0;
        }

        .metric-trend {
          font-size: 0.75rem;
          font-weight: 700;
          color: #16a34a;
        }

        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FCE8E6 0%, #FCE8E6 100%);
          color: #800000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* --- DASHBOARD SECTION CARDS --- */
        .dash-card-box {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .card-header-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* --- TABLE STYLING --- */
        .custom-table-container {
          width: 100%;
          overflow-x: auto;
        }

        .ngo-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }

        .ngo-table th {
          background: #F9FAFB;
          color: #4B5563;
          font-weight: 700;
          padding: 12px 16px;
          border-bottom: 2px solid #E5E7EB;
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.04em;
        }

        .ngo-table td {
          padding: 16px;
          border-bottom: 1px solid #F3F4F6;
          vertical-align: middle;
        }

        .ngo-table tr:hover {
          background: #FFFBF8;
        }

        .badge-status {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          display: inline-block;
        }

        .badge-status.critical {
          background: #FEE2E2;
          color: #DC2626;
        }

        .badge-status.active {
          background: #DCFCE7;
          color: #15803D;
        }

        .badge-status.planning {
          background: #FEF3C7;
          color: #B45309;
        }

        .progress-bar-bg {
          width: 100px;
          height: 8px;
          background: #E5E7EB;
          border-radius: 50px;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #800000 0%, #800000 100%);
          border-radius: 50px;
        }

        .btn-table-action {
          border: none;
          background: #F3F4F6;
          color: #374151;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          margin-right: 6px;
          transition: all 0.2s ease;
        }

        .btn-table-action:hover {
          background: #800000;
          color: white;
        }

        /* --- AI SUGGESTION BANNER --- */
        .ai-recommendation-box {
          background: linear-gradient(135deg, #FBF8F5 0%, #FCE8E6 100%);
          border: 1.5px solid #F3DDD8;
          border-radius: 16px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .ai-box-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ai-sparkle-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #800000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(128, 0, 0, 0.3);
        }

        .ai-box-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #800000;
          margin: 0 0 2px 0;
        }

        .ai-box-desc {
          font-size: 0.82rem;
          color: #555;
          margin: 0;
        }

        /* --- FORM STYLING --- */
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1px solid #D1D5DB;
          font-size: 0.88rem;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.15);
        }

        .checkbox-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .checkbox-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }

        .checkbox-pill input {
          accent-color: #800000;
        }

        .btn-submit-main {
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(128, 0, 0, 0.3);
          transition: all 0.25s ease;
        }

        .btn-submit-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(128, 0, 0, 0.4);
        }

        /* --- VOLUNTEER CARDS GRID --- */
        .volunteers-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .volunteer-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }

        .volunteer-card:hover {
          border-color: #F3DDD8;
          box-shadow: 0 8px 20px rgba(128, 0, 0, 0.1);
        }

        .vol-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .vol-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: white;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .vol-name {
          font-size: 0.98rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .vol-location {
          font-size: 0.78rem;
          color: #6B7280;
        }

        .tag-skill {
          background: #FCE8E6;
          color: #C2410C;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          display: inline-block;
          margin: 3px 3px 3px 0;
        }

        /* --- TOAST --- */
        .toast-notification {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #111827;
          color: white;
          padding: 14px 24px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid #800000;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .hamburger-menu-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #111;
          padding: 8px;
        }

        .mobile-overlay {
          display: none;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 860px) {
          .hamburger-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .mobile-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }
          .ngo-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 10000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .ngo-sidebar.mobile-open {
            transform: translateX(0);
          }
          .header-search-bar {
            display: none;
          }
          .ngo-main-content {
            padding: 20px;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .overview-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .custom-table-container {
            overflow-x: auto;
            max-width: 100%;
          }
          .btn-create-event-header {
            padding: 8px;
            font-size: 0;
          }
          .brand-ngo-subtitle, .profile-name {
            display: none;
          }

          
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="ngo-header">
        <div className="header-brand-group">
          <button className="hamburger-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src={logo} alt="UVMP Logo" className="ngo-logo-img" />
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="header-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search events, volunteers, tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button className="btn-create-event-header" onClick={() => setActiveTab('create-event')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Event
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifications.some(n => !n.read) && <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute', right: 0, top: '48px', width: '320px', background: 'white',
                border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: '16px', zIndex: 1000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#111' }}>Notifications</strong>
                  <span style={{ fontSize: '0.75rem', color: '#800000', cursor: 'pointer', fontWeight: '700' }} onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #F3F4F6', opacity: n.read ? 0.6 : 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#111' }}>{n.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#555' }}>{n.text}</div>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="profile-pill" onClick={() => setShowProfileModal(true)}>
            <div className="profile-avatar">AS</div>
            <span className="profile-name">Ananya S.</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </header>

      {/* --- BODY WRAPPER --- */}
      <div className="ngo-layout-body">

        {/* Profile Details Modal */}
        {showProfileModal && (
          <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="profile-modal-header">
                <div className="profile-avatar-large">{currentUser.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div style={{ flex: 1 }}>
                  <h2 className="profile-modal-title">{currentUser.name}</h2>
                  <div className="profile-modal-sub">{currentUser.role} — {currentUser.ngo}</div>
                </div>
                <div className="profile-modal-actions">
                  <button className="btn-table-action" style={{ background: 'transparent', border: '1px solid #E5E7EB', color: '#374151' }} onClick={() => setShowProfileModal(false)}>Close</button>
                  <button className="btn-table-action" style={{ background: 'var(--uvmp-primary)', color: '#fff' }} onClick={() => { setShowProfileModal(false); window.location.hash = '#ngo-profile' }}>Open Profile Page</button>
                </div>
              </div>

              <div className="profile-grid">
                <div>
                  <h4>Contact</h4>
                  <div className="profile-field"><strong>Email:</strong> {currentUser.email}</div>
                  <div className="profile-field"><strong>Phone:</strong> {currentUser.phone}</div>
                  <div className="profile-field"><strong>District:</strong> {currentUser.district}</div>
                </div>
                <div>
                  <h4>Account</h4>
                  <div className="profile-field"><strong>User ID:</strong> {currentUser.id}</div>
                  <div className="profile-field"><strong>Joined:</strong> {currentUser.joined}</div>
                  <div className="profile-field"><strong>Role:</strong> {currentUser.role}</div>
                </div>
              </div>

              <div className="profile-about">
                <h4>About</h4>
                <p style={{ margin: 0 }}>{currentUser.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        <div className={`mobile-overlay ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)}></div>

        {/* --- SIDEBAR --- */}
        <aside className={`ngo-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <ul className="sidebar-menu-list">
            <li className={`sidebar-menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </li>
            {/* <li className={`sidebar-menu-item ${activeTab === 'create-event' ? 'active' : ''}`} onClick={() => setActiveTab('create-event')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create Event
            </li> */}
            <li className={`sidebar-menu-item ${activeTab === 'volunteers' ? 'active' : ''}`} onClick={() => { setActiveTab('volunteers'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Manage Volunteers
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => { setActiveTab('progress'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Event Progress
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Reports & Analytics
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'communication' ? 'active' : ''}`} onClick={() => { setActiveTab('communication'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Communication Hub
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </li>
          </ul>

          <div className="sidebar-status-card">
            <div className="status-dot-title">
              <div className="pulse-dot"></div>
              <span>Verified Active NGO</span>
            </div>
            <div className="status-subtext">Integrated with State Disaster Control Room Node #42</div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="ngo-main-content">
          <div className="content-inner">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">NGO Command Dashboard</h1>
                  <p className="page-subtitle">Real-time overview of active events, volunteers, and disaster relief ops.</p>
                </div>
              </div>

              {/* OVERVIEW CARDS */}
              <div className="overview-cards-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Ongoing Events</span>
                    <span className="metric-value">14</span>
                    <span className="metric-trend">↑ +2 this week</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="12 6 12 12 16 14"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Volunteers Available</span>
                    <span className="metric-value">1,280</span>
                    <span className="metric-trend">↑ 842 On Active Duty</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Tasks Assigned</span>
                    <span className="metric-value">342</span>
                    <span className="metric-trend">↑ 88% Completion Rate</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Event Reports</span>
                    <span className="metric-value">94</span>
                    <span className="metric-trend">100% Verified Reports</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
              </div>

              {/* AI MATCH BANNER removed */}

              {/* EVENT MANAGEMENT TABLE */}
              <div className="dash-card-box">
                <div className="card-header-actions">
                  <h3 className="card-heading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Active Events & Disaster Relief Operations
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Critical', 'Active', 'Planning'].map(st => (
                      <button 
                        key={st}
                        className="btn-table-action" 
                        style={{ background: statusFilter === st ? '#800000' : '#F3F4F6', color: statusFilter === st ? 'white' : '#555' }}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="custom-table-container">
                  <table className="ngo-table">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Volunteers</th>
                        <th>Progress (%)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map(ev => (
                        <tr key={ev.id}>
                          <td>
                            <strong style={{ color: '#111', fontSize: '0.92rem', display: 'block' }}>{ev.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{ev.category}</span>
                          </td>
                          <td>📍 {ev.location}</td>
                          <td>
                            <span className={`badge-status ${ev.status.toLowerCase()}`}>
                              {ev.status}
                            </span>
                          </td>
                          <td>
                            <strong>{ev.volunteersAssigned}</strong> / {ev.volunteersNeeded} Assigned
                          </td>
                          <td>
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${ev.progress}%` }}></div>
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '0.8rem' }}>{ev.progress}%</span>
                          </td>
                          <td>
                            <button className="btn-table-action" onClick={() => { setSelectedEventForProgress(ev.id); setActiveTab('progress'); }}>View</button>
                            <button className="btn-table-action" onClick={() => triggerToast(`Editing event "${ev.name}"`)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE EVENT */}
          {activeTab === 'create-event' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Create New Relief Event</h1>
                  <p className="page-subtitle">Publish mission details to mobilize volunteers and request resources.</p>
                </div>
              </div>

              <div className="dash-card-box">
                <form onSubmit={handleCreateEventSubmit}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Event Title <span style={{ color: '#800000' }}>*</span></label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="e.g. Wayanad Relief Phase II"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Disaster / Event Category</label>
                      <select 
                        className="form-select"
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      >
                        <option value="Flood Relief">Flood Relief & Inundation</option>
                        <option value="Landslide Rescue">Landslide Rescue</option>
                        <option value="Medical Camp">Medical Camp & First Aid</option>
                        <option value="Food & Water Supply">Food & Water Supply</option>
                        <option value="Community Clean-up">Community Rehabilitation</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">District <span style={{ color: '#800000' }}>*</span></label>
                      <select 
                        className="form-select"
                        value={newEvent.district}
                        onChange={(e) => setNewEvent({ ...newEvent, district: e.target.value })}
                      >
                        {['Wayanad', 'Ernakulam', 'Idukki', 'Alappuzha', 'Kozhikode', 'Thrissur', 'Palakkad', 'Kottayam'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detailed Location / Landmark <span style={{ color: '#800000' }}>*</span></label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="e.g. Meppadi Town School Relief Center"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Target Volunteers Needed</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={newEvent.volunteersNeeded}
                        onChange={(e) => setNewEvent({ ...newEvent, volunteersNeeded: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Severity Level</label>
                      <select 
                        className="form-select"
                        value={newEvent.severity}
                        onChange={(e) => setNewEvent({ ...newEvent, severity: e.target.value })}
                      >
                        <option value="Critical">Critical (Immediate Evacuation)</option>
                        <option value="High">High (Relief Operations)</option>
                        <option value="Medium">Medium (Support & Clean-up)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Required Volunteer Skills</label>
                    <div className="checkbox-group">
                      <label className="checkbox-pill">
                        <input type="checkbox" checked={newEvent.skills.firstAid} onChange={(e) => setNewEvent({ ...newEvent, skills: { ...newEvent.skills, firstAid: e.target.checked } })} />
                        🚑 First Aid / Medical
                      </label>
                      <label className="checkbox-pill">
                        <input type="checkbox" checked={newEvent.skills.boatRescue} onChange={(e) => setNewEvent({ ...newEvent, skills: { ...newEvent.skills, boatRescue: e.target.checked } })} />
                        🚤 Motorboat Rescue
                      </label>
                      <label className="checkbox-pill">
                        <input type="checkbox" checked={newEvent.skills.heavyMachinery} onChange={(e) => setNewEvent({ ...newEvent, skills: { ...newEvent.skills, heavyMachinery: e.target.checked } })} />
                        🚜 Heavy Machinery
                      </label>
                      <label className="checkbox-pill">
                        <input type="checkbox" checked={newEvent.skills.foodPrep} onChange={(e) => setNewEvent({ ...newEvent, skills: { ...newEvent.skills, foodPrep: e.target.checked } })} />
                        🍱 Food Prep & Logistics
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Description & Field Directives</label>
                    <textarea 
                      className="form-textarea" 
                      rows="4" 
                      placeholder="Outline mission objectives, meeting points, safety equipment required, and contact person..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-submit-main">
                    🚀 Publish Event & Alert Volunteers
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Manage Volunteers & AI Matching</h1>
                  <p className="page-subtitle">Filter registered volunteers, check skill profiles, and assign active tasks.</p>
                </div>
              </div>

              {/* AI SUGGESTION PANEL */}
              <div className="ai-recommendation-box">
                <div className="ai-box-left">
                  <div className="ai-sparkle-icon">✨</div>
                  <div>
                    <h4 className="ai-box-title">AI Recommendation Engine</h4>
                    <p className="ai-box-desc">Top matched volunteers calculated based on skill similarity and GPS proximity score.</p>
                  </div>
                </div>
              </div>

              <div className="volunteers-cards-grid">
                {volunteersList.map(vol => (
                  <div key={vol.id} className="volunteer-card">
                    <div>
                      <div className="vol-card-top">
                        <div className="vol-avatar">{vol.name.substring(0, 2).toUpperCase()}</div>
                        <div>
                          <h4 className="vol-name">{vol.name}</h4>
                          <span className="vol-location">📍 {vol.district} District</span>
                        </div>
                      </div>

                      <div style={{ margin: '10px 0' }}>
                        {vol.skills.map((sk, i) => <span key={i} className="tag-skill">{sk}</span>)}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#555', margin: '8px 0' }}>
                        <div>Match Score: <strong style={{ color: '#800000' }}>{vol.matchScore}%</strong></div>
                        <div>Rating: <strong>{vol.rating} ⭐</strong></div>
                        <div>Status: <span style={{ fontWeight: '800', color: vol.status === 'Available' ? '#15803D' : '#B45309' }}>{vol.status}</span></div>
                      </div>
                    </div>

                    <button 
                      className="btn-submit-main" 
                      style={{ padding: '8px 16px', fontSize: '0.82rem', width: '100%', marginTop: '12px' }}
                      disabled={vol.status === 'On Duty'}
                      onClick={() => handleAssignVolunteer(vol.id, vol.name)}
                    >
                      {vol.status === 'On Duty' ? 'Currently Assigned' : 'Assign to Wayanad Relief'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EVENT PROGRESS TRACKER */}
          {activeTab === 'progress' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Event Progress & Field Operations</h1>
                  <p className="page-subtitle">Track completion metrics, checklist items, and photo proof from field teams.</p>
                </div>

                <select 
                  className="form-select" 
                  style={{ width: 'auto', fontWeight: '700' }}
                  value={selectedEventForProgress}
                  onChange={(e) => setSelectedEventForProgress(Number(e.target.value))}
                >
                  {eventsList.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              {/* PROGRESS BAR GAUGE */}
              <div className="dash-card-box" style={{ background: 'linear-gradient(135deg, #800000 0%, #800000 100%)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Active Mission Tracker</span>
                    <h2 style={{ margin: '4px 0 8px 0', fontSize: '1.5rem', fontWeight: '900' }}>
                      {eventsList.find(e => e.id === selectedEventForProgress)?.name}
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.9 }}>📍 {eventsList.find(e => e.id === selectedEventForProgress)?.location}</p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>
                      {eventsList.find(e => e.id === selectedEventForProgress)?.progress}%
                    </div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Overall Mission Completed</span>
                  </div>
                </div>
              </div>

              {/* SUB-PANELS: TASKS CHECKLIST & RESOURCE USAGE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                {/* Checklist Panel */}
                <div className="dash-card-box" style={{ marginBottom: 0 }}>
                  <h3 className="card-heading" style={{ marginBottom: '16px' }}>📋 Field Tasks Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasksChecklist.map(t => (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={t.completed} 
                          onChange={() => handleToggleTask(t.id)}
                          style={{ width: '18px', height: '18px', accentColor: '#800000' }}
                        />
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none', opacity: t.completed ? 0.6 : 1 }}>
                          {t.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resource Panel */}
                <div className="dash-card-box" style={{ marginBottom: 0 }}>
                  <h3 className="card-heading" style={{ marginBottom: '16px' }}>📦 Resource Utilization</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span>🍱 Food & Water Packets</span>
                        <span>420 / 500 Used (84%)</span>
                      </div>
                      <div className="progress-bar-bg" style={{ width: '100%' }}>
                        <div className="progress-bar-fill" style={{ width: '84%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span>🚑 First Aid Medical Kits</span>
                        <span>85 / 100 Used (85%)</span>
                      </div>
                      <div className="progress-bar-bg" style={{ width: '100%' }}>
                        <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span>🚤 Rescue Boats Active</span>
                        <span>12 / 15 Dispatched (80%)</span>
                      </div>
                      <div className="progress-bar-bg" style={{ width: '100%' }}>
                        <div className="progress-bar-fill" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIELD EVIDENCE GALLERY */}
              <div className="dash-card-box">
                <div className="card-header-actions">
                  <h3 className="card-heading">📸 Field Proof & Media Gallery</h3>
                  <button className="btn-table-action" onClick={() => triggerToast('📷 Photo upload modal simulated.')}>+ Upload Photo Proof</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {fieldPhotos.map(p => (
                    <div key={p.id} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ height: '120px', background: 'linear-gradient(135deg, #800000 0%, #800000 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
                        FIELD PROOF #{p.id}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111', marginTop: '8px' }}>{p.caption}</div>
                      <div style={{ fontSize: '0.72rem', color: '#777', marginTop: '2px' }}>By {p.author} • {p.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Reports & Operational Analytics</h1>
                  <p className="page-subtitle">Comprehensive data visualization of volunteer engagement and impact metrics.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-table-action" style={{ background: '#800000', color: 'white', padding: '9px 16px' }} onClick={handleExportPDF}>
                    📄 Export PDF
                  </button>
                  <button className="btn-table-action" style={{ background: '#800000', color: 'white', padding: '9px 16px' }} onClick={handleExportExcel}>
                    📊 Export Excel
                  </button>
                </div>
              </div>

              {/* KPI STATS CARDS */}
              <div className="overview-cards-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Volunteer Hours Logged</span>
                    <span className="metric-value">12,450 hrs</span>
                    <span className="metric-trend">↑ 92% Efficiency</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Lives Impacted / Rescued</span>
                    <span className="metric-value">34,200+</span>
                    <span className="metric-trend">Verified across 4 Districts</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Resource Utilization</span>
                    <span className="metric-value">94.8%</span>
                    <span className="metric-trend">Optimal Allocation</span>
                  </div>
                </div>
              </div>

              {/* SVG CHARTS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div className="dash-card-box">
                  <h3 className="card-heading" style={{ marginBottom: '20px' }}>📈 Volunteer Participation Rate</h3>
                  <svg viewBox="0 0 400 180" style={{ width: '100%', height: 'auto' }}>
                    <line x1="40" y1="150" x2="380" y2="150" stroke="#E5E7EB" strokeWidth="2" />
                    <line x1="40" y1="100" x2="380" y2="100" stroke="#E5E7EB" strokeDasharray="4" />
                    <line x1="40" y1="50" x2="380" y2="50" stroke="#E5E7EB" strokeDasharray="4" />

                    <rect x="60" y="80" width="30" height="70" fill="#800000" rx="4" />
                    <rect x="120" y="50" width="30" height="100" fill="#800000" rx="4" />
                    <rect x="180" y="65" width="30" height="85" fill="#800000" rx="4" />
                    <rect x="240" y="40" width="30" height="110" fill="#800000" rx="4" />
                    <rect x="300" y="30" width="30" height="120" fill="#800000" rx="4" />

                    <text x="65" y="170" fontSize="10" fill="#666">Week 1</text>
                    <text x="125" y="170" fontSize="10" fill="#666">Week 2</text>
                    <text x="185" y="170" fontSize="10" fill="#666">Week 3</text>
                    <text x="245" y="170" fontSize="10" fill="#666">Week 4</text>
                    <text x="305" y="170" fontSize="10" fill="#666">Week 5</text>
                  </svg>
                </div>

                <div className="dash-card-box">
                  <h3 className="card-heading" style={{ marginBottom: '20px' }}>📊 Mission Success Ratio</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
                    <svg width="160" height="160" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FFE4D6" strokeWidth="3.8" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#800000" strokeWidth="3.8" strokeDasharray="94, 100" />
                      <text x="18" y="20.35" className="percentage" fontSize="8" textAnchor="middle" fontWeight="900" fill="#800000">96.2%</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMMUNICATION HUB */}
          {activeTab === 'communication' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Communication Hub & Broadcasts</h1>
                  <p className="page-subtitle">Send instant SMS/Push emergency alerts to volunteers and field teams.</p>
                </div>
              </div>

              <div className="dash-card-box">
                <h3 className="card-heading" style={{ marginBottom: '16px' }}>📢 Send Emergency Broadcast Alert</h3>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select className="form-select">
                    <option>All Registered Volunteers (1,280)</option>
                    <option>Volunteers in Wayanad District (340)</option>
                    <option>First Aid & Medical Specialists (180)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Broadcast Message Title</label>
                  <input type="text" className="form-input" defaultValue="🚨 URGENT: Additional Medical Volunteers Needed at Meppadi Base Camp" />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Body</label>
                  <textarea className="form-textarea" rows="3" defaultValue="All available first-aid trained volunteers are requested to report to Meppadi Primary Health Center by 08:00 AM." />
                </div>

                <button className="btn-submit-main" onClick={() => triggerToast('📢 Emergency Broadcast Alert sent to 1,280 volunteers!')}>
                  Broadcast Alert Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">NGO Profile & Settings</h1>
                  <p className="page-subtitle">Manage organization credentials, API integrations, and alert preferences.</p>
                </div>
              </div>

              <div className="dash-card-box">
                <h3 className="card-heading" style={{ marginBottom: '16px' }}>🏢 Organization Details</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">NGO Registered Name</label>
                    <input type="text" className="form-input" defaultValue="Kerala Relief Alliance NGO" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration ID</label>
                    <input type="text" className="form-input" defaultValue="REG-NGO-2024-8841" readOnly style={{ background: '#F5F5F5' }} />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Emergency Operations Contact</label>
                    <input type="text" className="form-input" defaultValue="+91 94470 00000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Official Email Address</label>
                    <input type="email" className="form-input" defaultValue="operations@keralarelief.org" />
                  </div>
                </div>

                <button className="btn-submit-main" onClick={() => triggerToast('⚙️ NGO Profile Settings saved successfully!')}>
                  Save Settings
                </button>
              </div>
            </div>
          )}

          </div>
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default NGO_Dashboard;
