import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'verification', 'resources', 'map', 'analytics', 'notifications', 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Global Filter / Search
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Data
  const [incidentsList, setIncidentsList] = useState([
    { id: 'SOS-101', title: 'River Bank Overflow', type: 'Flood', location: 'Aluva, Ernakulam', status: 'Pending', reportedAt: '2026-08-27' },
    { id: 'SOS-102', title: 'Medical Supply Request', type: 'Medical', location: 'Meppadi, Wayanad', status: 'Verified', reportedAt: '2026-08-26' },
    { id: 'SOS-103', title: 'Forest Fire Alert', type: 'Fire', location: 'Devikulam, Idukki', status: 'Rejected', reportedAt: '2026-08-25' },
  ]);

  const [verificationList, setVerificationList] = useState([
    { id: 'REG-001', name: 'Kerala Relief Alliance', type: 'NGO', location: 'Ernakulam', status: 'Pending', date: '2026-08-26' },
    { id: 'REG-002', name: 'Rahul Varma', type: 'Volunteer', location: 'Wayanad', status: 'Pending', date: '2026-08-27' },
    { id: 'REG-003', name: 'Medical Front', type: 'NGO', location: 'Trivandrum', status: 'Verified', date: '2026-08-20' },
  ]);

  const [resourcesData, setResourcesData] = useState([
    { id: 'RES-01', name: 'Medical Kits', category: 'Medical', quantity: 500, location: 'Central Hub', status: 'Available' },
    { id: 'RES-02', name: 'Rescue Boats', category: 'Transport', quantity: 25, location: 'Aluva Hub', status: 'Deployed' },
    { id: 'RES-03', name: 'Ration Packets', category: 'Food', quantity: 2000, location: 'Wayanad Base', status: 'Low Stock' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Urgent Incident Reported', text: 'SOS alert from Aluva requires verification.', time: '2m ago', read: false },
    { id: 2, title: 'System Update', text: 'Server maintenance scheduled for 2AM tonight.', time: '1h ago', read: false },
  ]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  const handleUpdateIncidentStatus = (id, newStatus) => {
    setIncidentsList(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    triggerToast(`Incident status updated to ${newStatus}.`);
  };

  const handleUpdateVerification = (id, newStatus) => {
    setVerificationList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    triggerToast(`Registration ${newStatus.toLowerCase()} successfully.`);
  };

  return (
    <div className="admin-dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .admin-dashboard-container {
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

        .admin-dashboard-container * {
          box-sizing: border-box;
        }

        .dash-header {
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

        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .brand-subtitle {
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

        .dash-layout-body {
          display: flex;
          flex: 1;
        }

        .dash-sidebar {
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

        .dash-main-content {
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

        .dash-card-box {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .card-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .custom-table-container {
          width: 100%;
          overflow-x: auto;
        }

        .dash-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }

        .dash-table th {
          background: #FBF8F5;
          color: #475569;
          font-weight: 700;
          padding: 12px 16px;
          border-bottom: 2px solid #D1D5DB;
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.04em;
        }

        .dash-table td {
          padding: 16px;
          border-bottom: 1px solid #EFEFEF;
          vertical-align: middle;
        }

        .dash-table tr:hover {
          background: #FBF8F5;
        }

        .badge-status {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          display: inline-block;
        }

        .badge-status.verified {
          background: #DCFCE7;
          color: #15803D;
        }

        .badge-status.pending {
          background: #FEF3C7;
          color: #B45309;
        }

        .badge-status.rejected {
          background: #FEE2E2;
          color: #B91C1C;
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

        @media (max-width: 860px) {
          .hamburger-menu-btn { display: flex; align-items: center; justify-content: center; }
          .mobile-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
          .mobile-overlay.open { opacity: 1; pointer-events: auto; }
          .dash-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 10000; transform: translateX(-100%); transition: transform 0.3s ease; }
          .dash-sidebar.mobile-open { transform: translateX(0); }
          .header-search-bar { display: none; }
          .dash-main-content { padding: 20px; }
          .overview-cards-grid { grid-template-columns: 1fr; }
          .brand-subtitle, .profile-name { display: none; }
        }

        /* MINIMALIST UI ENHANCEMENTS */
        .premium-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          border-radius: 12px;
          padding: 24px;
          position: relative;
        }
        .premium-stat-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .premium-bar {
          background: #e2e8f0;
          border-radius: 4px 4px 0 0;
          transition: all 0.2s ease;
          position: relative;
        }
        .premium-bar:hover {
          background: #cbd5e1;
        }
        .premium-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #ffffff;
          transition: all 0.2s ease;
          color: #0f172a;
        }
        .premium-input:focus {
          border-color: #94a3b8;
          outline: none;
        }
        .premium-btn {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .premium-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .map-container {
          background: url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h40v40H0z" fill="%23f8fafc"/><path d="M0 39.5h40M39.5 0v40" stroke="%23e2e8f0" stroke-width="1"/></svg>');
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: inset 0 2px 20px rgba(0,0,0,0.02);
        }
        .pulse-dot {
          width: 16px;
          height: 16px;
          background: #800000;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 0 0 rgba(128,0,0,0.7);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(128,0,0,0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(128,0,0,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(128,0,0,0); }
        }
        .notification-item {
          transition: all 0.2s ease;
          border-radius: 12px;
          margin: 8px 16px;
        }
        .notification-item:hover {
          background: #F1F5F9 !important;
          transform: translateX(4px);
        }
      `}</style>

      {/* HEADER */}
      <header className="dash-header">
        <div className="header-brand-group">
          <button className="hamburger-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: '#800000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AD</div>
            <div className="brand-text-block">
              <span className="brand-title">System Admin Portal</span>
              <span className="brand-subtitle">Central Management Dashboard</span>
            </div>
          </a>
        </div>

        <div className="header-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search users, incidents..." 
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
              <div style={{ position: 'absolute', right: 0, top: '48px', width: '320px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '16px', zIndex: 1000 }}>
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
            <div className="profile-avatar">SA</div>
            <span className="profile-name">Super Admin</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            
            {showProfileMenu && (
              <div style={{ position: 'absolute', right: 0, top: '48px', width: '200px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: '8px 0', zIndex: 1000 }}>
                <div style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }} onClick={() => (window.location.hash = '#landing')}>Return to Landing</div>
                <div style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: '700', color: '#800000', cursor: 'pointer' }} onClick={() => (window.location.hash = '#login')}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY WRAPPER */}
      <div className="dash-layout-body">
        
        {/* Mobile Overlay */}
        <div className={`mobile-overlay ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)}></div>

        {/* SIDEBAR */}
        <aside className={`dash-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <ul className="sidebar-menu-list">
            <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => { setActiveTab('verification'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Incident Verification
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => { setActiveTab('resources'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Resource Management
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => { setActiveTab('map'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
              Live Map
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Analytics & Reports
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveTab('notifications'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dash-main-content">
          
          {activeTab === 'dashboard' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Admin Dashboard</h1>
                  <p className="page-subtitle">System Overview and Incident Verification Queue</p>
                </div>
              </div>

              {/* OVERVIEW CARDS */}
              <div className="overview-cards-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Total Volunteers</span>
                    <span className="metric-value">1,240</span>
                    <span className="metric-trend" style={{ color: '#16A34A' }}>+12% this week</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Active NGOs</span>
                    <span className="metric-value">45</span>
                    <span className="metric-trend" style={{ color: '#16A34A' }}>Verified Partners</span>
                  </div>
                  <div className="metric-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Ongoing Events</span>
                    <span className="metric-value">12</span>
                    <span className="metric-trend" style={{ color: '#800000' }}>3 Critical Status</span>
                  </div>
                  <div className="metric-icon-box" style={{ background: '#FCE8E6', color: '#800000' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Pending Incidents</span>
                    <span className="metric-value">8</span>
                    <span className="metric-trend" style={{ color: '#B45309' }}>Requires Verification</span>
                  </div>
                  <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                </div>
              </div>

              {/* INCIDENT VERIFICATION QUEUE */}
              <div className="dash-card-box">
                <div className="card-header-actions">
                  <h3 className="card-heading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Incident Verification Queue
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {incidentsList.map((inc, index) => (
                    <div key={inc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: index !== incidentsList.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{inc.id} • {inc.reportedAt}</div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{inc.title}</h4>
                          <div style={{ fontSize: '0.85rem', color: '#475569' }}>{inc.type} • {inc.location}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ padding: '4px 12px', borderRadius: '6px', background: '#fffbeb', color: '#b45309', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #fef3c7' }}>{inc.status}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="premium-btn" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => handleUpdateIncidentStatus(inc.id, 'Verified')}>Verify</button>
                          <button className="premium-btn" style={{ padding: '6px 16px', fontSize: '0.85rem', background: '#f8fafc', color: '#475569' }} onClick={() => handleUpdateIncidentStatus(inc.id, 'Rejected')}>Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {incidentsList.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.95rem' }}>No incidents in queue.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATION TAB */}
          {activeTab === 'verification' && (
            <div>
              <div className="view-title-bar" style={{ marginBottom: '32px' }}>
                <div>
                  <h1 className="page-title">Verification & Approvals</h1>
                  <p className="page-subtitle">Review pending registrations for NGOs and Volunteers.</p>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {verificationList.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 0', borderBottom: index !== verificationList.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{item.id} • {item.date}</div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>{item.name}</h4>
                          <div style={{ fontSize: '0.85rem', color: '#475569' }}>{item.type} • {item.location}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '4px 12px', borderRadius: '6px', background: '#fef3c7', color: '#b45309', fontSize: '0.8rem', fontWeight: '600' }}>{item.status}</div>
                        <button className="premium-btn" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => handleUpdateVerification(item.id, 'Verified')}>Approve</button>
                        <button className="premium-btn" style={{ padding: '6px 16px', fontSize: '0.85rem', background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }} onClick={() => handleUpdateVerification(item.id, 'Rejected')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RESOURCES TAB */}
          {activeTab === 'resources' && (
            <div>
              <div className="view-title-bar" style={{ marginBottom: '32px' }}>
                <div>
                  <h1 className="page-title">Resource Management</h1>
                  <p className="page-subtitle">Track and allocate system-wide relief resources.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {resourcesData.map(res => (
                  <div key={res.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      </div>
                      <div style={{ padding: '4px 10px', borderRadius: '6px', background: res.status === 'Available' ? '#f0fdf4' : (res.status === 'In Use' ? '#eff6ff' : '#fef2f2'), color: res.status === 'Available' ? '#16a34a' : (res.status === 'In Use' ? '#2563eb' : '#dc2626'), fontSize: '0.75rem', fontWeight: '700', border: '1px solid', borderColor: res.status === 'Available' ? '#dcfce7' : (res.status === 'In Use' ? '#dbeafe' : '#fecaca') }}>
                        {res.status}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{res.id} • {res.category}</div>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>{res.name}</h4>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Location</div>
                        <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{res.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Quantity</div>
                        <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>{res.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Incident Map</h1>
                  <p className="page-subtitle">Geographic overview of reported incidents and active resources.</p>
                </div>
              </div>
              <div className="map-container" style={{ position: 'relative', height: '500px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Mock Map Pulse Points */}
                <div className="pulse-dot" style={{ top: '30%', left: '40%' }}></div>
                <div className="pulse-dot" style={{ top: '60%', left: '70%', background: '#f59e0b', animationDelay: '0.5s' }}></div>
                <div className="pulse-dot" style={{ top: '75%', left: '30%', background: '#10b981', animationDelay: '1s' }}></div>

                <div style={{ textAlign: 'center', color: '#64748B', position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '16px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>Interactive Map View</h2>
                  <p>Map integration is active. (Placeholder for maps SDK)</p>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">System Analytics</h1>
                  <p className="page-subtitle">Key metrics and trends across the platform.</p>
                </div>
              </div>
              <div className="stats-grid">
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Total Users</span>
                  </div>
                  <div className="metric-value">12,450</div>
                  <div className="metric-trend positive">↑ 14% this month</div>
                </div>
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Active NGOs</span>
                  </div>
                  <div className="metric-value">342</div>
                  <div className="metric-trend positive">↑ 5% this month</div>
                </div>
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Incidents Resolved</span>
                  </div>
                  <div className="metric-value">89%</div>
                  <div className="metric-trend positive">↑ 2% this week</div>
                </div>
              </div>
              <div className="dash-card-box" style={{ marginTop: '24px', padding: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '700', marginBottom: '24px', textAlign: 'left' }}>Incident Trends (Last 7 Days)</h3>
                <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <div className="premium-bar" style={{ width: '40px', height: `${h}%`, background: '#e2e8f0', borderRadius: '4px 4px 0 0' }}></div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginTop: '12px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                  <span style={{width: '40px', textAlign: 'center'}}>Mon</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Tue</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Wed</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Thu</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Fri</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Sat</span>
                  <span style={{width: '40px', textAlign: 'center'}}>Sun</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">All Notifications</h1>
                  <p className="page-subtitle">History of system alerts and updates.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ padding: '8px 0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                {notifications.map(note => (
                  <div key={note.id} className="notification-item" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ background: '#FCE8E6', color: '#800000', padding: '12px', borderRadius: '50%' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      </div>
                      <div>
                        <h4 style={{ color: '#0F172A', fontSize: '1.05rem', marginBottom: '6px', fontWeight: '700' }}>{note.title}</h4>
                        <p style={{ color: '#475569', fontSize: '0.95rem' }}>{note.text}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>{note.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Admin Settings</h1>
                  <p className="page-subtitle">Configure system preferences and profile.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ padding: '0', display: 'flex', overflow: 'hidden', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                {/* Settings Sidebar */}
                <div style={{ width: '280px', background: '#f8fafc', padding: '32px 24px', borderRight: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '8px', color: '#800000', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Admin Profile
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Security & Access
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      System Notifications
                    </div>
                  </div>
                </div>

                {/* Settings Form */}
                <div style={{ flex: 1, padding: '40px 48px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Admin Profile Information</h2>
                  <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage the overarching administrative details.</p>
                  
                  <div style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Admin Name</label>
                      <input type="text" className="premium-input" defaultValue="Super Admin" />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Email Address</label>
                      <input type="email" className="premium-input" defaultValue="admin@uvmp.gov.in" />
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#334155', fontWeight: '500', cursor: 'pointer', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <input type="checkbox" defaultChecked style={{ width: '22px', height: '22px', accentColor: '#800000' }} /> 
                        Receive SMS alerts for Critical Incidents
                      </label>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button className="premium-btn" onClick={() => triggerToast('Settings saved successfully.')}>
                        Save Changes
                      </button>
                      <button style={{ padding: '14px 32px', borderRadius: '12px', background: '#fff', border: '1px solid #cbd5e1', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
