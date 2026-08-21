import React, { useState, useEffect } from 'react';
import logo from '../assets/uvmp_logo.png'; // Assuming same logo

function DistrictAuthorityDashboard() {
  // Active Sidebar Tab State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'incidents', 'resources', 'volunteers', 'analytics', 'recognition', 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Global Filter / Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // --- Sample Data ---
  const [incidentsList, setIncidentsList] = useState([
    { id: 'INC-001', title: 'Wayanad Landslide', category: 'Landslide', location: 'Meppadi, Wayanad', status: 'Verified', severity: 'Critical', reportedAt: '2026-08-01', ngosInvolved: 3 },
    { id: 'INC-002', title: 'Aluva River Overflow', category: 'Flood', location: 'North Paravur, Ernakulam', status: 'In Review', severity: 'High', reportedAt: '2026-08-05', ngosInvolved: 2 },
    { id: 'INC-003', title: 'Factory Fire', category: 'Fire', location: 'Kalamassery, Ernakulam', status: 'Resolved', severity: 'Medium', reportedAt: '2026-08-10', ngosInvolved: 1 },
  ]);

  const [resourcesList, setResourcesList] = useState([
    { id: 'RES-101', type: 'Medical Team', location: 'Wayanad Base Camp', status: 'Allocated', unit: '3 Teams' },
    { id: 'RES-102', type: 'Rescue Vehicles', location: 'Aluva North', status: 'In Transit', unit: '5 Boats' },
    { id: 'RES-103', type: 'Relief Supplies', location: 'Central Godown', status: 'Available', unit: '1000 Ration Kits' },
    { id: 'RES-104', type: 'Heavy Machinery', location: 'Meppadi', status: 'Allocated', unit: '2 Excavators' },
  ]);

  const [recognitionList, setRecognitionList] = useState([
    { id: 'REC-01', volunteerName: 'Rahul Varma', ngo: 'Kerala Relief Alliance', award: 'Bravery Badge', status: 'Pending Approval' },
    { id: 'REC-02', volunteerName: 'Dr. Ananya Nair', ngo: 'Medical Front', award: 'Medical Excellence', status: 'Approved' },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Incident Reported', text: 'SOS alert from Kalamassery requires verification.', time: '2m ago', read: false },
    { id: 2, title: 'Resource Request', text: 'Kerala Relief Alliance requested 500 ration kits.', time: '12m ago', read: false },
  ]);

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

  const handleApproveRecognition = (id) => {
    setRecognitionList(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    triggerToast(`✅ Recognition certificate approved successfully!`);
  };

  const handleUpdateIncidentStatus = (id, newStatus) => {
    setIncidentsList(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    triggerToast(`Incident status updated to ${newStatus}.`);
  };

  const filteredIncidents = incidentsList.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="authority-dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .authority-dashboard-container {
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

        .authority-dashboard-container * {
          box-sizing: border-box;
        }

        /* --- HEADER --- */
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          background: #ffffff;
          border-bottom: 1px solid #D1D5DB;
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

        .brand-text-block {
          display: flex;
          flex-direction: column;
        }

        .brand-auth-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .brand-auth-subtitle {
          font-size: 0.76rem;
          color: #800000;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .header-search-bar {
          display: flex;
          align-items: center;
          background: #EFEFEF;
          border: 1px solid #D1D5DB;
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

        .icon-btn {
          background: #EFEFEF;
          border: 1px solid #D1D5DB;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          color: #334155;
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
          background: #EFEFEF;
          padding: 6px 14px 6px 8px;
          border-radius: 50px;
          cursor: pointer;
          border: 1px solid #D1D5DB;
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
          color: #0F172A;
        }

        /* --- LAYOUT WRAPPER --- */
        .auth-layout-body {
          display: flex;
          flex: 1;
        }

        /* --- SIDEBAR --- */
        .auth-sidebar {
          width: 250px;
          background: #ffffff;
          border-right: 1px solid #D1D5DB;
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
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-menu-item:hover {
          background: #FBF8F5;
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
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
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
          color: #166534;
          margin-bottom: 4px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
        }

        /* --- MAIN CONTENT AREA --- */
        .auth-main-content {
          flex: 1;
          padding: 28px 36px;
          overflow-y: auto;
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
          color: #0F172A;
          margin: 0;
        }

        .page-subtitle {
          font-size: 0.85rem;
          color: #64748B;
          margin: 4px 0 0 0;
        }

        /* --- OVERVIEW CARDS --- */
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
          border: 1px solid #D1D5DB;
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
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0F172A;
          margin: 6px 0 2px 0;
        }

        .metric-trend {
          font-size: 0.75rem;
          font-weight: 700;
          color: #16A34A;
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

        /* --- SECTION CARDS --- */
        .dash-card-box {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #D1D5DB;
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
          color: #0F172A;
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

        .auth-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }

        .auth-table th {
          background: #FBF8F5;
          color: #475569;
          font-weight: 700;
          padding: 12px 16px;
          border-bottom: 2px solid #D1D5DB;
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.04em;
        }

        .auth-table td {
          padding: 16px;
          border-bottom: 1px solid #EFEFEF;
          vertical-align: middle;
        }

        .auth-table tr:hover {
          background: #FBF8F5;
        }

        .badge-status {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          display: inline-block;
        }

        .badge-status.verified, .badge-status.approved {
          background: #DCFCE7;
          color: #15803D;
        }

        .badge-status.in.review, .badge-status.pending {
          background: #FEF3C7;
          color: #B45309;
        }

        .badge-status.resolved {
          background: #E0E7FF;
          color: #3730A3;
        }

        .badge-status.allocated {
          background: #FCE8E6;
          color: #800000;
        }

        .btn-table-action {
          border: none;
          background: #EFEFEF;
          color: #334155;
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
        
        /* --- TOAST --- */
        .toast-notification {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #0F172A;
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
          .auth-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 10000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .auth-sidebar.mobile-open {
            transform: translateX(0);
          }
          .header-search-bar {
            display: none;
          }
          .auth-main-content {
            padding: 20px;
          }
          .overview-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .custom-table-container {
            overflow-x: auto;
            max-width: 100%;
          }
          .brand-auth-subtitle, .profile-name {
            display: none;
          }
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="auth-header">
        <div className="header-brand-group">
          <button className="hamburger-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            {/* If the image isn't rendering properly, we can fallback to an icon or text */}
            <div style={{ width: '40px', height: '40px', background: '#800000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>UV</div>
            <div className="brand-text-block">
              <span className="brand-auth-title">District Disaster Authority</span>
              <span className="brand-auth-subtitle">Command & Control Center</span>
            </div>
          </a>
        </div>

        <div className="header-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search incidents, resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifications.some(n => !n.read) && <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute', right: 0, top: '48px', width: '320px', background: 'white',
                border: '1px solid #D1D5DB', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: '16px', zIndex: 1000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#111' }}>Alerts</strong>
                  <span style={{ fontSize: '0.75rem', color: '#800000', cursor: 'pointer', fontWeight: '700' }} onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #EFEFEF', opacity: n.read ? 0.6 : 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#111' }}>{n.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#555' }}>{n.text}</div>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-pill" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="profile-avatar">DA</div>
            <span className="profile-name">Admin Office</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>

            {showProfileMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '48px', width: '200px', background: 'white',
                border: '1px solid #D1D5DB', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                padding: '8px 0', zIndex: 1000
              }}>
                <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#888', borderBottom: '1px solid #eee' }}>District Collectorate</div>
                <div style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }} onClick={() => (window.location.hash = '#landing')}>Return to Landing</div>
                <div style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: '700', color: '#800000', cursor: 'pointer' }} onClick={() => (window.location.hash = '#login')}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- BODY WRAPPER --- */}
      <div className="auth-layout-body">
        
        {/* Mobile Overlay */}
        <div className={`mobile-overlay ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)}></div>

        {/* --- SIDEBAR --- */}
        <aside className={`auth-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <ul className="sidebar-menu-list">
            <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => { setActiveTab('incidents'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Incident Management
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => { setActiveTab('resources'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Resource Allocation
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'volunteers' ? 'active' : ''}`} onClick={() => { setActiveTab('volunteers'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
              Volunteer Monitoring
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Performance Analytics
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'recognition' ? 'active' : ''}`} onClick={() => { setActiveTab('recognition'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              Recognition
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </li>
          </ul>

          <div className="sidebar-status-card">
            <div className="status-dot-title">
              <div className="pulse-dot"></div>
              <span>Authority Network Active</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>Connected to State Disaster Response Framework.</div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="auth-main-content">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">District Authority Dashboard</h1>
                  <p className="page-subtitle">Centralized view of incidents, resource deployment, and NGO coordination.</p>
                </div>
              </div>

              {/* OVERVIEW CARDS */}
              <div className="overview-cards-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">NGOs in District</span>
                    <span className="metric-value">12</span>
                    <span className="metric-trend" style={{ color: '#800000' }}>Active Coordination</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Active Incidents</span>
                    <span className="metric-value">3</span>
                    <span className="metric-trend" style={{ color: '#800000' }}>2 Critical Alerts</span>
                  </div>
                  <div className="metric-icon-box" style={{ background: '#FCE8E6', color: '#800000' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Volunteers Deployed</span>
                    <span className="metric-value">450</span>
                    <span className="metric-trend">Across 3 Zones</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Resources Allocated</span>
                    <span className="metric-value">75%</span>
                    <span className="metric-trend">Utilization Rate</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  </div>
                </div>
              </div>

              {/* INCIDENTS QUICK VIEW */}
              <div className="dash-card-box">
                <div className="card-header-actions">
                  <h3 className="card-heading">
                    🚨 Recent Verified Incidents
                  </h3>
                  <button className="btn-table-action" onClick={() => setActiveTab('incidents')}>View All Incidents</button>
                </div>
                <div className="custom-table-container">
                  <table className="auth-table">
                    <thead>
                      <tr>
                        <th>Incident ID & Title</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Severity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidentsList.slice(0, 3).map(inc => (
                        <tr key={inc.id}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block' }}>{inc.title}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{inc.id}</span>
                          </td>
                          <td>📍 {inc.location}</td>
                          <td><span className={`badge-status ${inc.status.toLowerCase().replace(' ', '-')}`}>{inc.status}</span></td>
                          <td style={{ color: inc.severity === 'Critical' ? '#800000' : '#F59E0B', fontWeight: 'bold' }}>{inc.severity}</td>
                          <td>
                            <button className="btn-table-action" onClick={() => setActiveTab('incidents')}>Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INCIDENT MANAGEMENT */}
          {activeTab === 'incidents' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Incident Management</h1>
                  <p className="page-subtitle">Review reported incidents, verify SOS signals, and declare emergencies.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['All', 'Verified', 'In Review', 'Resolved'].map(st => (
                    <button 
                      key={st}
                      className="btn-table-action" 
                      style={{ background: statusFilter === st ? '#800000' : '#EFEFEF', color: statusFilter === st ? 'white' : '#334155' }}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dash-card-box">
                <div className="custom-table-container">
                  <table className="auth-table">
                    <thead>
                      <tr>
                        <th>Incident</th>
                        <th>Category</th>
                        <th>Reported Date</th>
                        <th>NGOs Assigned</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.map(inc => (
                        <tr key={inc.id}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block' }}>{inc.title}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>📍 {inc.location}</span>
                          </td>
                          <td>{inc.category}</td>
                          <td>{inc.reportedAt}</td>
                          <td>{inc.ngosInvolved} Active</td>
                          <td><span className={`badge-status ${inc.status.toLowerCase().replace(' ', '-')}`}>{inc.status}</span></td>
                          <td>
                            <select 
                              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
                              value={inc.status}
                              onChange={(e) => handleUpdateIncidentStatus(inc.id, e.target.value)}
                            >
                              <option value="In Review">In Review</option>
                              <option value="Verified">Verified</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESOURCE ALLOCATION */}
          {activeTab === 'resources' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Resource Allocation</h1>
                  <p className="page-subtitle">Track and deploy supplies, vehicles, and specialized teams across districts.</p>
                </div>
                <button className="btn-table-action" style={{ background: '#800000', color: 'white' }} onClick={() => triggerToast('Modal: Deploy New Resource')}>+ Deploy Resource</button>
              </div>

              <div className="dash-card-box">
                <div className="custom-table-container">
                  <table className="auth-table">
                    <thead>
                      <tr>
                        <th>Resource ID</th>
                        <th>Type & Quantity</th>
                        <th>Current Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resourcesList.map(res => (
                        <tr key={res.id}>
                          <td><strong style={{ color: '#64748B' }}>{res.id}</strong></td>
                          <td>
                            <strong style={{ display: 'block' }}>{res.type}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#800000', fontWeight: 'bold' }}>{res.unit}</span>
                          </td>
                          <td>📍 {res.location}</td>
                          <td><span className={`badge-status ${res.status.toLowerCase().replace(' ', '-')}`}>{res.status}</span></td>
                          <td>
                            <button className="btn-table-action" onClick={() => triggerToast(`Re-routing ${res.type}...`)}>Re-route</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VOLUNTEER MONITORING */}
          {activeTab === 'volunteers' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Volunteer Monitoring (Live Map)</h1>
                  <p className="page-subtitle">Real-time geospatial tracking of volunteer teams and task distributions.</p>
                </div>
              </div>
              
              <div className="dash-card-box" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Simulated Map Area */}
                <div style={{ height: '400px', background: '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748B' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <h3 style={{ marginTop: '16px' }}>Interactive Live Map Rendered Here</h3>
                  <p style={{ fontSize: '0.85rem' }}>Showing 450 volunteers clustered in 3 major disaster zones.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RECOGNITION MANAGEMENT */}
          {activeTab === 'recognition' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Recognition Management</h1>
                  <p className="page-subtitle">Approve certificates, badges, and rating endorsements for outstanding volunteers.</p>
                </div>
              </div>

              <div className="dash-card-box">
                <div className="custom-table-container">
                  <table className="auth-table">
                    <thead>
                      <tr>
                        <th>Volunteer Name</th>
                        <th>NGO Affiliation</th>
                        <th>Award / Certificate</th>
                        <th>Status</th>
                        <th>Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recognitionList.map(rec => (
                        <tr key={rec.id}>
                          <td><strong>{rec.volunteerName}</strong></td>
                          <td>{rec.ngo}</td>
                          <td><span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>🏆 {rec.award}</span></td>
                          <td><span className={`badge-status ${rec.status.toLowerCase().replace(' ', '-')}`}>{rec.status}</span></td>
                          <td>
                            {rec.status !== 'Approved' ? (
                              <button 
                                className="btn-table-action" 
                                style={{ background: '#10B981', color: 'white' }}
                                onClick={() => handleApproveRecognition(rec.id)}
                              >
                                Approve
                              </button>
                            ) : (
                              <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓ Approved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS & SETTINGS (Placeholders for brevity) */}
          {(activeTab === 'analytics' || activeTab === 'settings') && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h1>
                  <p className="page-subtitle">District-level configurations and data visualization tools.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                <h2>🏗️ Module Under Construction</h2>
                <p>This module is currently being configured for the State Data Center.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default DistrictAuthorityDashboard;
