import React, { useState, useEffect } from 'react';

function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tasks', 'attendance', 'progress', 'achievements', 'notifications', 'settings'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [volunteerProfile, setVolunteerProfile] = useState({
    name: 'Rahul Varma',
    phone: '+91 98765 43210',
    skills: ['First Aid', 'Boat Rescue', 'Logistics'],
    availability: 'Available',
    transport: 'Two Wheeler',
    experience: '2 Years (Flood Relief 2024)',
  });

  const [tasks, setTasks] = useState([
    { id: 'TSK-01', title: 'Distribute Ration Kits', location: 'Meppadi Base Camp', status: 'In Progress', date: '2026-08-27' },
    { id: 'TSK-02', title: 'Medical Camp Setup', location: 'Aluva North', status: 'Completed', date: '2026-08-25' },
    { id: 'TSK-03', title: 'Rescue Boat Operation', location: 'Wayanad River', status: 'On the Way', date: '2026-08-28' },
  ]);

  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 1, date: '2026-08-26', checkIn: '08:00 AM', checkOut: '04:00 PM', location: 'Meppadi Base Camp', status: 'Present' },
    { id: 2, date: '2026-08-25', checkIn: '09:00 AM', checkOut: '05:30 PM', location: 'Aluva North', status: 'Present' },
  ]);

  const [achievementsList, setAchievementsList] = useState([
    { id: 1, title: 'First Responder', date: '2026-08-24', icon: '🏅' },
    { id: 2, title: 'Night Owl', date: '2026-08-20', icon: '🌙' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Task Assigned', text: 'You have been assigned to Rescue Boat Operation.', time: '10m ago', read: false },
    { id: 2, title: 'Achievement Unlocked', text: 'You received the "First Responder" badge.', time: '1d ago', read: true },
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

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    triggerToast(`Task status updated to ${newStatus}.`);
  };

  const handleCheckIn = () => {
    triggerToast('Attendance successfully logged via GPS.');
  };

  return (
    <div className="volunteer-dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .volunteer-dashboard-container {
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

        .volunteer-dashboard-container * {
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

        .profile-section {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #D1D5DB;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        .profile-image-large {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          background: linear-gradient(135deg, #800000 0%, #800000 100%);
          color: white;
          font-weight: 800;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(128, 0, 0, 0.2);
        }

        .profile-details-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .profile-field-group {
          display: flex;
          flex-direction: column;
        }

        .profile-field-label {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .profile-field-value {
          font-size: 0.95rem;
          color: #0F172A;
          font-weight: 600;
        }

        .skill-tag {
          display: inline-block;
          background: #FCE8E6;
          color: #800000;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-right: 6px;
          margin-bottom: 6px;
        }

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

        .btn-primary {
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
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(128, 0, 0, 0.35);
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

        .badge-status.completed {
          background: #DCFCE7;
          color: #15803D;
        }

        .badge-status.in.progress {
          background: #FEF3C7;
          color: #B45309;
        }

        .badge-status.on.the.way {
          background: #DBEAFE;
          color: #1D4ED8;
        }

        .status-dropdown {
          padding: 6px 10px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          outline: none;
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
          .brand-subtitle, .profile-name { display: none; }
        }

        /* PREMIUM UI ENHANCEMENTS */
        .premium-stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .premium-stat-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #800000, #dc2626);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .premium-stat-card:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 20px 25px -5px rgba(128, 0, 0, 0.1), 0 10px 10px -5px rgba(128, 0, 0, 0.04);
        }
        .premium-stat-card:hover::after {
          opacity: 1;
        }
        .premium-input {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 1rem;
          background: #f8fafc;
          transition: all 0.3s ease;
          color: #0F172A;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .premium-input:focus {
          border-color: #800000;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(128,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.01);
          outline: none;
        }
        .premium-btn {
          background: linear-gradient(135deg, #800000 0%, #a30000 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(128,0,0,0.3);
          position: relative;
          overflow: hidden;
        }
        .premium-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: all 0.5s ease;
        }
        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(128,0,0,0.4);
        }
        .premium-btn:hover::before {
          left: 100%;
        }
        
        /* NEW TASK CARD DESIGN */
        .task-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .task-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .task-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1);
          border-color: #cbd5e1;
        }
        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .task-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        .task-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 6px;
        }
        .task-card-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-inprogress { background: #e0f2fe; color: #0284c7; }
        .status-completed { background: #dcfce7; color: #16a34a; }

        .notification-item {
          transition: all 0.2s ease;
          border-radius: 12px;
          margin: 8px 16px;
        }
        .notification-item:hover {
          background: #F1F5F9 !important;
          transform: translateX(4px);
        }
        .achievement-card {
          padding: 30px 20px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 16px;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 10px 25px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .achievement-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #f59e0b, #10b981);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .achievement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        }
        .achievement-card:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* HEADER */}
      <header className="dash-header">
        <div className="header-brand-group">
          <button className="hamburger-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: '#800000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>VD</div>
            <div className="brand-text-block">
              <span className="brand-title">Volunteer Portal</span>
              <span className="brand-subtitle">Task & Field Management</span>
            </div>
          </a>
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
            <div className="profile-avatar">RV</div>
            <span className="profile-name">Rahul Varma</span>
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
            <li className={`sidebar-menu-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              My Tasks
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Attendance Check-In
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => { setActiveTab('progress'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Progress Updates
            </li>
            <li className={`sidebar-menu-item ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => { setActiveTab('achievements'); setMobileSidebarOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              Achievements
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
                  <h1 className="page-title">Volunteer Dashboard</h1>
                  <p className="page-subtitle">Welcome back, {volunteerProfile.name}. Here is your current status.</p>
                </div>
              </div>

              {/* PERSONAL PROFILE SECTION */}
              <div className="profile-section">
                <div className="profile-image-large">RV</div>
                <div className="profile-details-grid">
                  <div className="profile-field-group">
                    <span className="profile-field-label">Full Name</span>
                    <span className="profile-field-value">{volunteerProfile.name}</span>
                  </div>
                  <div className="profile-field-group">
                    <span className="profile-field-label">Phone</span>
                    <span className="profile-field-value">{volunteerProfile.phone}</span>
                  </div>
                  <div className="profile-field-group">
                    <span className="profile-field-label">Availability</span>
                    <span className="profile-field-value" style={{ color: '#16A34A' }}>{volunteerProfile.availability}</span>
                  </div>
                  <div className="profile-field-group">
                    <span className="profile-field-label">Transport</span>
                    <span className="profile-field-value">{volunteerProfile.transport}</span>
                  </div>
                  <div className="profile-field-group" style={{ gridColumn: '1 / -1' }}>
                    <span className="profile-field-label">Skills</span>
                    <div>
                      {volunteerProfile.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="profile-field-group" style={{ gridColumn: '1 / -1' }}>
                    <span className="profile-field-label">Past Experience</span>
                    <span className="profile-field-value">{volunteerProfile.experience}</span>
                  </div>
                </div>
              </div>

              {/* ASSIGNED TASKS PANEL */}
              <div className="dash-card-box">
                <div className="card-header-actions">
                  <h3 className="card-heading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Assigned Tasks
                  </h3>
                  <button className="btn-primary" onClick={handleCheckIn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    GPS Check-In
                  </button>
                </div>
                <div className="custom-table-container">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Task ID</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td style={{ fontWeight: '700', color: '#0F172A' }}>{task.id}</td>
                          <td style={{ fontWeight: '600' }}>{task.title}</td>
                          <td>{task.location}</td>
                          <td>{task.date}</td>
                          <td>
                            <span className={`badge-status ${task.status.toLowerCase().replace(/\s/g, '.')}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="status-dropdown" 
                              value={task.status} 
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            >
                              <option value="On the Way">On the Way</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
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

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">My Tasks</h1>
                  <p className="page-subtitle">View and manage your assigned relief tasks.</p>
                </div>
              </div>
              
              <div className="task-card-grid">
                {tasks.map(t => {
                  let statusClass = 'status-pending';
                  if (t.status === 'In Progress' || t.status === 'On the Way') statusClass = 'status-inprogress';
                  if (t.status === 'Completed') statusClass = 'status-completed';

                  return (
                    <div key={t.id} className="task-card">
                      <div className="task-card-header">
                        <span className={`task-card-status ${statusClass}`}>{t.status}</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>#{t.id}</span>
                      </div>
                      <h3 className="task-card-title">{t.title}</h3>
                      <div className="task-card-meta">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {t.location}
                      </div>
                      <div className="task-card-meta" style={{ marginBottom: '24px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {t.date}
                      </div>
                      
                      <div style={{ marginTop: 'auto' }}>
                        {t.status !== 'Completed' ? (
                          <button 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#0f172a', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                            onClick={() => updateTaskStatus(t.id, 'Completed')}
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7', background: '#f0fdf4', color: '#16a34a', fontWeight: '600', cursor: 'default' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '6px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div>
              <div className="view-title-bar" style={{ marginBottom: '32px' }}>
                <div>
                  <h1 className="page-title">Attendance & Check-ins</h1>
                  <p className="page-subtitle">Log your hours and view attendance history.</p>
                </div>
                <button className="premium-btn" onClick={handleCheckIn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Check In Now
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>Recent Check-ins</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {attendanceHistory.map((att, index) => (
                    <div key={att.id} style={{ display: 'flex', position: 'relative', paddingBottom: index !== attendanceHistory.length - 1 ? '24px' : '0' }}>
                      {/* Simple Timeline Line & Dot */}
                      {index !== attendanceHistory.length - 1 && (
                        <div style={{ position: 'absolute', left: '19px', top: '30px', bottom: '0', width: '2px', background: '#f1f5f9' }}></div>
                      )}
                      
                      <div style={{ marginRight: '24px', marginTop: '6px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          borderRadius: '50%', 
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#64748b', zIndex: 2, position: 'relative'
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                      </div>

                      {/* Clean Details */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: index !== attendanceHistory.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{att.date}</div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>
                            {att.location}
                          </h4>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#475569' }}>
                            <span><strong style={{ color: '#0f172a' }}>In:</strong> {att.checkIn}</span>
                            <span><strong style={{ color: '#0f172a' }}>Out:</strong> {att.checkOut}</span>
                          </div>
                        </div>
                        <div style={{ padding: '4px 12px', borderRadius: '6px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #dcfce7' }}>
                          {att.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === 'progress' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">My Progress</h1>
                  <p className="page-subtitle">Track your contributions and impact.</p>
                </div>
              </div>
              <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Total Hours Logged</span>
                  </div>
                  <div className="metric-value">120 hrs</div>
                  <div className="metric-trend positive">↑ 10 hrs this week</div>
                </div>
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Tasks Completed</span>
                  </div>
                  <div className="metric-value">45</div>
                  <div className="metric-trend positive">↑ 3 this week</div>
                </div>
                <div className="premium-stat-card">
                  <div className="stat-header">
                    <span className="metric-label">Impact Score</span>
                  </div>
                  <div className="metric-value">980</div>
                  <div className="metric-trend positive">Top 5% of volunteers</div>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="dash-card-box" style={{ background: '#fff', padding: '32px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Journey to Next Milestone</h3>
                
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Level</div>
                    <div style={{ fontSize: '1.25rem', color: '#800000', fontWeight: '800' }}>Senior Responder</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>20 hrs remaining</div>
                    <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>Community Leader</div>
                  </div>
                </div>
                
                <div style={{ width: '100%', height: '16px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ 
                    width: '78%', 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #800000 0%, #dc2626 100%)', 
                    borderRadius: '8px',
                    position: 'relative',
                    transition: 'width 1s ease-in-out'
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b', fontWeight: '500', textAlign: 'center' }}>78% completed towards your next rank</div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Achievements</h1>
                  <p className="page-subtitle">Badges and certificates you have earned.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                {achievementsList.map(ach => (
                  <div key={ach.id} className="achievement-card">
                    <div style={{ fontSize: '3.5rem', marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{ach.icon}</div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '8px', fontWeight: '700' }}>{ach.title}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '500' }}>Earned on {ach.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div>
              <div className="view-title-bar">
                <div>
                  <h1 className="page-title">Notifications</h1>
                  <p className="page-subtitle">Your task alerts and updates.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ padding: '8px 0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                {notifications.map(note => (
                  <div key={note.id} className="notification-item" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: note.read ? '#fff' : '#f8fafc', border: note.read ? '1px solid #e2e8f0' : '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ background: note.read ? '#f1f5f9' : '#FCE8E6', color: note.read ? '#64748B' : '#800000', padding: '12px', borderRadius: '50%' }}>
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
                  <h1 className="page-title">Volunteer Settings</h1>
                  <p className="page-subtitle">Update your profile, skills, and availability.</p>
                </div>
              </div>
              <div className="dash-card-box" style={{ padding: '0', display: 'flex', overflow: 'hidden', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                {/* Settings Sidebar */}
                <div style={{ width: '280px', background: '#f8fafc', padding: '32px 24px', borderRight: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '8px', color: '#800000', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Profile
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Security
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      Notifications
                    </div>
                  </div>
                </div>

                {/* Settings Form */}
                <div style={{ flex: 1, padding: '40px 48px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Profile Information</h2>
                  <p style={{ color: '#64748b', marginBottom: '32px' }}>Update your personal details and availability status.</p>
                  
                  <div style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Full Name</label>
                      <input type="text" className="premium-input" defaultValue={volunteerProfile.name} />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Phone Number</label>
                      <input type="text" className="premium-input" defaultValue={volunteerProfile.phone} />
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Availability Status</label>
                      <select className="premium-input" defaultValue={volunteerProfile.availability} style={{ cursor: 'pointer', appearance: 'auto' }}>
                        <option>Available</option>
                        <option>Busy</option>
                        <option>On Duty</option>
                      </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button className="premium-btn" onClick={() => triggerToast('Profile updated successfully.')}>
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

export default VolunteerDashboard;
