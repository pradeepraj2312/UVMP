import React, { useState } from 'react';
import logo from '../assets/uvmp_logo.png';
import heroImage from '../assets/management_image_1.png';

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="uvmp-landing">
      <style>{`
        /* Internal CSS styles for Landing Page */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .uvmp-landing {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .uvmp-landing * {
          box-sizing: border-box;
        }

        /* --- Header --- */
        .landing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 5%;
          background-color: #ffffff;
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .header-logo-img {
          height: 54px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06));
          transition: transform 0.2s ease;
        }

        .header-brand:hover .header-logo-img {
          transform: scale(1.04);
        }

        .header-brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: #800000;
          letter-spacing: -0.01em;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 36px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item-link {
          text-decoration: none;
          color: #333333;
          font-size: 0.95rem;
          font-weight: 500;
          padding-bottom: 4px;
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-item-link:hover {
          color: #800000;
        }

        .nav-item-link.active {
          color: #800000;
          font-weight: 600;
        }

        .nav-item-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #800000;
          border-radius: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .btn-login-link {
          text-decoration: none;
          color: #333333;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .btn-login-link:hover {
          color: #800000;
        }

        .btn-join-mission {
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(128, 0, 0, 0.2);
        }

        .btn-join-mission:hover {
          background-color: #660000;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(128, 0, 0, 0.3);
        }

        /* Hamburger Toggle Button */
        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #111827;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .hamburger-btn:hover {
          background-color: #f3f4f6;
        }

        /* Mobile Drawer Menu Overlay */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
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
          margin-bottom: 40px;
        }

        .close-menu-btn {
          background: #f3f4f6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #111827;
          transition: background-color 0.2s ease;
        }

        .close-menu-btn:hover {
          background: #e5e7eb;
        }

        .mobile-nav-links {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-nav-link {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .mobile-nav-link:hover {
          color: #800000;
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: auto;
        }

        .btn-mobile-login {
          width: 100%;
          text-align: center;
          padding: 14px;
          border-radius: 50px;
          border: 1px solid #D1D5DB;
          background: #ffffff;
          color: #374151;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
        }

        .btn-mobile-join {
          width: 100%;
          text-align: center;
          padding: 14px;
          border-radius: 50px;
          border: none;
          background: #800000;
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
        }

        /* --- Hero Section --- */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 40px;
          padding: 60px 5%;
          background: linear-gradient(135deg, #FBF8F5 0%, #F5ECE5 100%);
          position: relative;
          min-height: 520px;
        }

        .hero-content {
          max-width: 540px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.15;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-hero-primary {
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(128, 0, 0, 0.25);
        }

        .btn-hero-primary:hover {
          background-color: #660000;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(128, 0, 0, 0.35);
        }

        .btn-hero-secondary {
          background-color: #ffffff;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .btn-hero-secondary:hover {
          background-color: #F9FAFB;
          border-color: #9CA3AF;
          transform: translateY(-1px);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-wrapper {
          background: transparent;
          border-radius: 20px;
          padding: 0;
          box-shadow: none;
          max-width: 580px;
          width: 100%;
          transition: transform 0.3s ease;
          overflow: hidden;
        }

        .hero-image-wrapper:hover {
          transform: translateY(-4px);
        }

        .hero-img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          display: block;
          mix-blend-mode: multiply;
          filter: contrast(1.02);
        }

        /* --- Section Shared --- */
        .section-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 48px auto;
        }

        .section-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .section-subheading {
          font-size: 0.95rem;
          color: #6B7280;
          line-height: 1.5;
          margin: 0;
        }

        /* --- Choose Your Portal --- */
        .portal-section {
          padding: 80px 5%;
          background-color: #FAFAFA;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .portal-card {
          background-color: #EFEFEF;
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #E5E7EB;
          transition: all 0.3s ease;
        }

        .portal-card:hover {
          background-color: #ffffff;
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
        }

        .card-top-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-pink {
          background-color: #FCE8E6;
          color: #D93025;
        }

        .icon-bronze {
          background-color: #FDF0E6;
          color: #A54D0E;
        }

        .icon-teal {
          background-color: #E6F4EA;
          color: #137333;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .portal-card-actions {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .btn-card-maroon {
          flex: 1;
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.2s ease;
        }

        .btn-card-maroon:hover {
          background-color: #660000;
        }

        .btn-card-brown {
          flex: 1;
          background-color: #8B4513;
          color: #ffffff;
          border: none;
          padding: 12px 16px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.2s ease;
        }

        .btn-card-brown:hover {
          background-color: #72380F;
        }

        .btn-card-outline {
          flex: 1;
          background-color: #EFEFEF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 12px 16px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }

        .portal-card:hover .btn-card-outline {
          background-color: #ffffff;
        }

        .btn-card-outline:hover {
          border-color: #9CA3AF;
          background-color: #F9FAFB !important;
        }

        .btn-card-full-light {
          width: 100%;
          background-color: #EFEFEF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 12px 16px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }

        .portal-card:hover .btn-card-full-light {
          background-color: #ffffff;
        }

        .btn-card-full-light:hover {
          border-color: #9CA3AF;
          background-color: #F9FAFB !important;
        }

        /* --- Stats Banner --- */
        .stats-banner {
          background-color: #800000;
          color: #ffffff;
          padding: 56px 5%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 1100px;
          margin: 0 auto;
        }

        .stat-column {
          text-align: center;
          padding: 0 20px;
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-column:last-child {
          border-right: none;
        }

        .stat-number {
          font-size: 3.2rem;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.95rem;
          font-weight: 500;
          opacity: 0.9;
        }

        /* --- Platform Capabilities --- */
        .capabilities-section {
          padding: 80px 5%;
          background-color: #FAFAFA;
        }

        .capabilities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1150px;
          margin: 0 auto;
        }

        .cap-card-large {
          background-color: #EFEFEF;
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          min-height: 420px;
          overflow: hidden;
          border: 1px solid #E5E7EB;
          transition: transform 0.3s ease;
        }

        .cap-card-large:hover {
          transform: translateY(-4px);
        }

        .cap-bg-circle {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, #FCE8E6 0%, #F3DDD8 100%);
          opacity: 0.8;
          pointer-events: none;
        }

        .cap-icon-dark-maroon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #800000;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          z-index: 1;
        }

        .cap-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          z-index: 1;
        }

        .cap-desc {
          font-size: 0.88rem;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
          z-index: 1;
        }

        .cap-right-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cap-card-small {
          background-color: #EFEFEF;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #E5E7EB;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .cap-card-small:hover {
          transform: translateY(-4px);
        }

        .cap-card-small-icon {
          margin-bottom: 16px;
        }

        /* --- Footer --- */
        .landing-footer {
          background-color: #E5E5E5;
          color: #4B5563;
          padding: 60px 5% 28px 5%;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1150px;
          margin: 0 auto 48px auto;
        }

        .footer-brand-logo {
          height: 28px;
          width: auto;
          margin-bottom: 16px;
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          color: #6B7280;
          line-height: 1.6;
          max-width: 280px;
          margin: 0;
        }

        .footer-col-heading {
          font-size: 0.9rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link-item a {
          color: #4B5563;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .footer-link-item a:hover {
          color: #800000;
        }

        .footer-bottom {
          max-width: 1150px;
          margin: 0 auto;
          border-top: 1px solid #D1D5DB;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #6B7280;
        }

        .footer-legal-links {
          display: flex;
          gap: 20px;
        }

        .footer-legal-links a {
          color: #6B7280;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-legal-links a:hover {
          color: #111827;
        }

        /* --- Responsive Breakpoints for Mobile & Tablet --- */
        @media (max-width: 1024px) {
          .hero-section {
            padding: 48px 4%;
            gap: 32px;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .portal-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .capabilities-grid {
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .landing-header {
            padding: 14px 20px;
          }

          .header-nav, .header-actions {
            display: none;
          }

          .hamburger-btn {
            display: flex;
          }

          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 40px 20px 48px 20px;
            min-height: auto;
          }

          .hero-content {
            max-width: 100%;
            margin: 0 auto;
          }

          .hero-title {
            font-size: 2.1rem;
            line-height: 1.2;
            margin-bottom: 16px;
          }

          .hero-subtitle {
            font-size: 0.95rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 28px;
          }

          .hero-actions {
            justify-content: center;
          }

          .portal-section, .capabilities-section {
            padding: 52px 20px;
          }

          .section-header {
            margin-bottom: 36px;
          }

          .section-heading {
            font-size: 1.8rem;
          }

          .portal-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .portal-card {
            padding: 28px 20px;
          }

          .capabilities-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .cap-card-large {
            min-height: 280px;
            padding: 32px 24px;
          }

          .cap-card-small {
            padding: 24px;
          }

          .stats-banner {
            padding: 44px 20px;
          }

          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 480px) {
          .header-brand-name {
            font-size: 1rem;
          }

          .header-logo-img {
            height: 32px;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }

          .btn-hero-primary, .btn-hero-secondary {
            width: 100%;
            text-align: center;
            padding: 14px 20px;
          }

          .portal-card-actions {
            flex-direction: column;
            gap: 10px;
          }

          .btn-card-maroon, .btn-card-brown, .btn-card-outline, .btn-card-full-light {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .stat-column {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 20px;
          }

          .stat-column:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .stat-number {
            font-size: 2.5rem;
          }

          .stat-label {
            font-size: 0.88rem;
          }

          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .footer-brand-desc {
            max-width: 100%;
          }
        }

        /* Emergency & Disaster Reporting Navigation Buttons */
        .btn-header-report {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: #ffffff !important;
          border: none;
          padding: 9px 20px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 3px 10px rgba(220, 38, 38, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .btn-header-report:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
        }

        .btn-hero-sos {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          padding: 14px 30px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-hero-sos:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.45);
        }

        .card-top-icon.icon-red-sos {
          background-color: #FEE2E2;
          color: #dc2626;
        }

        /* --- Choose Your Portal --- */
        .portal-section {
          padding: 80px 5%;
          background-color: #FAFAFA;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .portal-card {
          background-color: #EFEFEF;
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #E5E7EB;
          transition: all 0.3s ease;
        }

        .portal-card:hover {
          background-color: #ffffff;
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
        }

        .card-top-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-pink {
          background-color: #FCE8E6;
          color: #D93025;
        }

        .icon-bronze {
          background-color: #FDF0E6;
          color: #A54D0E;
        }

        .icon-teal {
          background-color: #E6F4EA;
          color: #137333;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .portal-card-actions {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .btn-card-maroon {
          flex: 1;
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-card-maroon:hover {
          background-color: #660000;
        }

        .btn-card-brown {
          flex: 1;
          background-color: #800000;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-card-brown:hover {
          background-color: #660000;
        }

        .btn-card-outline {
          flex: 1;
          background-color: transparent;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 12px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-card-outline:hover {
          background-color: #ffffff;
          border-color: #9CA3AF;
        }
      `}</style>

      {/* Mobile Drawer Menu Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <a href="#" className="header-brand" onClick={closeMobileMenu}>
            <img src={logo} alt="UVMP Logo" className="header-logo-img" />
          </a>
          <button className="close-menu-btn" onClick={closeMobileMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <ul className="mobile-nav-links">
          <li><a href="#how-it-works" className="mobile-nav-link" onClick={closeMobileMenu}>How it Works</a></li>
          <li>
            <a 
              href="#report" 
              className="mobile-nav-link" 
              style={{ color: '#dc2626', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }} 
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Report Disaster & SOS
            </a>
          </li>
          <li><a href="#impact" className="mobile-nav-link" onClick={closeMobileMenu}>Impact</a></li>
          <li><a href="#portals" className="mobile-nav-link" onClick={closeMobileMenu}>Portals</a></li>
        </ul>

        <div className="mobile-menu-actions">
          <a href="#login" className="btn-mobile-login" onClick={closeMobileMenu}>Login</a>
          <button className="btn-mobile-join" onClick={() => { closeMobileMenu(); window.location.hash = '#volunteer-register'; }}>Join the Mission</button>
        </div>
      </div>

      {/* Desktop & Mobile Header Bar */}
      <header className="landing-header">
        <a href="#" className="header-brand">
          <img src={logo} alt="UVMP Logo" className="header-logo-img" />
        </a>

        {/* Desktop Navigation */}
        <ul className="header-nav">
          <li><a href="#how-it-works" className="nav-item-link active">How it Works</a></li>
          <li>
            <a href="#report" className="nav-item-link" style={{ color: '#dc2626', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Report Incident
            </a>
          </li>
          <li><a href="#impact" className="nav-item-link">Impact</a></li>
          <li><a href="#portals" className="nav-item-link">Portals</a></li>
        </ul>

        {/* Desktop Actions */}
        <div className="header-actions">
          <button className="btn-header-report" onClick={() => (window.location.hash = '#report')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Report SOS
          </button>
          <a href="#login" className="btn-login-link">Login</a>
          <button className="btn-join-mission" onClick={() => (window.location.hash = '#volunteer-register')}>Join Mission</button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Open mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Empowering Humanity through Unified Action</h1>
          <p className="hero-subtitle">
            The central hub for Volunteers, NGOs, and Government Authorities to coordinate disaster response and social impact.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-sos" onClick={() => (window.location.hash = '#report')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Report Disaster / SOS
            </button>
            <button className="btn-hero-primary" onClick={() => (window.location.hash = '#association-register')}>Get Started</button>
            <button className="btn-hero-secondary" onClick={() => (window.location.hash = '#portals')}>Explore NGOs</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img src={heroImage} alt="Volunteers collaborating around a virtual globe" className="hero-img" />
          </div>
        </div>
      </section>

      {/* Choose Your Portal */}
      <section className="portal-section" id="portals">
        <div className="section-header">
          <h2 className="section-heading">Choose Your Portal</h2>
          <p className="section-subheading">
            Access the tools you need to make a difference, tailored to your role in the mission.
          </p>
        </div>

        <div className="portal-grid">
          {/* Card 1: Public Disaster Portal */}
          <div className="portal-card">
            <div>
              <div className="card-top-icon icon-pink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 className="card-title">Public Disaster Portal</h3>
              <p className="card-desc">
                Report flood, fire, or earthquake emergencies instantly. Geotag GPS location and request rescue without logging in.
              </p>
            </div>
            <div className="portal-card-actions">
              <button className="btn-card-maroon" style={{ width: '100%' }} onClick={() => (window.location.hash = '#report')}>
                Report Incident / SOS
              </button>
            </div>
          </div>
          
          {/* Card 2: Volunteer Portal */}
          <div className="portal-card">
            <div>
              <div className="card-top-icon icon-pink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="card-title">Volunteer Portal</h3>
              <p className="card-desc">
                Focus on action, earn badges, and contribute to your community through impactful events.
              </p>
            </div>
            <div className="portal-card-actions">
              <button className="btn-card-maroon" onClick={() => (window.location.hash = '#volunteer-register')}>Register</button>
              <button className="btn-card-outline" onClick={() => (window.location.hash = '#login')}>Login</button>
            </div>
          </div>

          {/* Card 2: NGO & Association */}
          <div className="portal-card">
            <div>
              <div className="card-top-icon icon-bronze">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
                </svg>
              </div>
              <h3 className="card-title">NGO & Association</h3>
              <p className="card-desc">
                Manage volunteers, utilize AI matching for events, and coordinate broad impact initiatives.
              </p>
            </div>
            <div className="portal-card-actions">
              <button className="btn-card-brown" onClick={() => (window.location.hash = '#association-register')}>Register</button>
              <button className="btn-card-outline" onClick={() => (window.location.hash = '#ngo-dashboard')}>Dashboard</button>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner" id="impact">
        <div className="stats-grid">
          <div className="stat-column">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Volunteers</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">500+</div>
            <div className="stat-label">Registered NGOs</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">1,200+</div>
            <div className="stat-label">Successful Events</div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="capabilities-section" id="how-it-works">
        <div className="section-header">
          <h2 className="section-heading">Platform Capabilities</h2>
          <p className="section-subheading">
            Advanced tools designed to streamline coordination and maximize community impact.
          </p>
        </div>

        <div className="capabilities-grid">
          {/* Left large card */}
          <div className="cap-card-large">
            <div className="cap-bg-circle"></div>
            <div className="cap-icon-dark-maroon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
            </div>
            <h3 className="cap-title">AI-Powered Matching</h3>
            <p className="cap-desc">
              Our intelligent system connects volunteers with NGOs and events based on skills, location, and past engagement, ensuring optimal resource allocation during critical times.
            </p>
          </div>

          {/* Right column with 2 small cards */}
          <div className="cap-right-col">
            <div className="cap-card-small">
              <div className="card-top-icon icon-bronze cap-card-small-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="cap-title">Real-time Tracking</h3>
              <p className="cap-desc">
                Live operational dashboards for disaster zones and event management.
              </p>
            </div>

            <div className="cap-card-small">
              <div className="card-top-icon icon-teal cap-card-small-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
                </svg>
              </div>
              <h3 className="cap-title">Impact Recognition</h3>
              <p className="cap-desc">
                Gamified badges, certificates, and persistent impact scores for dedicated volunteers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div>
            <img src={logo} alt="UVMP Logo" className="footer-brand-logo" />
            <p className="footer-brand-desc">
              United Volunteer Management Platform. Empowering humanity through coordinated action.
            </p>
          </div>

          <div>
            <div className="footer-col-heading">Platform</div>
            <ul className="footer-link-list">
              <li className="footer-link-item"><a href="#how-it-works">How it Works</a></li>
              <li className="footer-link-item"><a href="#volunteer-dashboard">Volunteer Portal</a></li>
              <li className="footer-link-item"><a href="#ngo-dashboard">NGO Directory</a></li>
              <li className="footer-link-item"><a href="#admin">Admin Access</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-heading">Resources</div>
            <ul className="footer-link-list">
              <li className="footer-link-item"><a href="#">Help Center</a></li>
              <li className="footer-link-item"><a href="#">API Documentation</a></li>
              <li className="footer-link-item"><a href="#">Guidelines</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-heading">Contact</div>
            <ul className="footer-link-list">
              <li className="footer-link-item"><a href="mailto:support@uvmp.org">support@uvmp.org</a></li>
              <li className="footer-link-item"><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
              <li className="footer-link-item"><span>123 Mission St, City</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2024 UVMP. All rights reserved.</div>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
