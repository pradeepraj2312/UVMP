import React, { useState } from 'react';
import logo from '../assets/uvmp_logo.png';
import image2 from '../assets/image_2.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in with ${email}`);
  };

  return (
    <div className="login-page-container">
      <style>{`
        /* Internal CSS styles with reduced font size and image_2 asset */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .login-page-container {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
          background-color: #ffffff;
          min-height: 100vh;
          width: 100%;
          display: flex;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .login-page-container * {
          box-sizing: border-box;
        }

        /* --- Left Panel --- */
        .left-panel {
          flex: 1;
          background: linear-gradient(145deg, #FAF3EE 0%, #F5ECE3 100%);
          padding: 36px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo-card {
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-logo-img {
          height: 54px;
          width: auto;
          object-fit: contain;
        }

        .brand-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #800000;
          letter-spacing: -0.01em;
        }

        .left-content {
          max-width: 440px;
          margin-top: auto;
          margin-bottom: auto;
          padding: 16px 0;
        }

        .left-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.15;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }

        .left-subtext {
          font-size: 0.88rem;
          color: #555555;
          line-height: 1.55;
          margin: 0;
        }

        .illustration-card {
          background: transparent;
          border-radius: 16px;
          padding: 0;
          box-shadow: none;
          width: 100%;
          max-width: 480px;
          margin-top: 16px;
          overflow: hidden;
        }

        .illustration-img {
          width: 100%;
          height: auto;
          border-radius: 16px;
          display: block;
          mix-blend-mode: multiply;
          opacity: 0.95;
          filter: contrast(1.02);
        }

        /* --- Right Panel --- */
        .right-panel {
          flex: 1;
          background-color: #ffffff;
          padding: 36px 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .form-wrapper {
          max-width: 380px;
          width: 100%;
        }

        .form-heading {
          font-size: 1.6rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .info-notice {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #555555;
          font-size: 0.8rem;
          margin-bottom: 24px;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.2px solid #6B7280;
          color: #6B7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          font-style: normal;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #800000;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: 10px 14px 10px 42px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #111827;
          outline: none;
          background-color: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }

        .input-field:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128, 0, 0, 0.08);
        }

        .options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 20px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4B5563;
          cursor: pointer;
          user-select: none;
        }

        .remember-me input {
          accent-color: #800000;
          width: 15px;
          height: 15px;
          cursor: pointer;
          border-radius: 3px;
        }

        .forgot-link {
          color: #800000;
          font-weight: 600;
          text-decoration: none;
          transition: text-decoration 0.2s ease;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-sign-in {
          width: 100%;
          padding: 11px;
          background-color: #800000;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          margin-bottom: 20px;
        }

        .btn-sign-in:hover {
          background-color: #660000;
        }

        .btn-sign-in:active {
          transform: scale(0.99);
        }

        .form-divider {
          height: 1px;
          background-color: #E5E7EB;
          margin-bottom: 20px;
        }

        .form-footer {
          text-align: center;
          font-size: 0.82rem;
          color: #4B5563;
        }

        .apply-link {
          color: #800000;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }

        .apply-link:hover {
          text-decoration: underline;
        }

        /* --- Responsive Design --- */
        @media (max-width: 992px) {
          .left-panel {
            padding: 28px 32px;
          }

          .left-heading {
            font-size: 1.9rem;
          }

          .right-panel {
            padding: 28px 32px;
          }
        }

        @media (max-width: 820px) {
          .login-page-container {
            flex-direction: column;
          }

          .left-panel {
            min-height: auto;
            padding: 28px 20px;
          }

          .left-content {
            margin: 0;
            padding: 12px 0;
          }

          .left-heading {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }

          .illustration-card {
            display: none;
          }

          .right-panel {
            min-height: auto;
            padding: 32px 20px 48px 20px;
          }
        }

        @media (max-width: 480px) {
          .left-heading {
            font-size: 1.5rem;
          }

          .form-heading {
            font-size: 1.4rem;
          }
        }
      `}</style>

      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-header">
          <div className="brand-logo-card">
            <img src={logo} alt="UVMP Logo" className="brand-logo-img" />
          </div>
        </div>

        <div className="left-content">
          <h1 className="left-heading">Empowering Humanity</h1>
          <p className="left-subtext">
            Join our global network of dedicated volunteers. Together, we facilitate complex oversight tasks and manage humanitarian administration efficiently.
          </p>
        </div>

        <div className="illustration-card">
          <img src={image2} alt="Humanitarian Aid Admin Volunteer Portal" className="illustration-img" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="form-heading">Welcome Back</h2>
          
          <div className="info-notice">
            <i className="info-icon">i</i>
            <span>Only approved volunteers can log in.</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Address */}
            <div className="form-group">
              <label className="field-label">Email address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="field-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  required
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot your password?</a>
            </div>

            {/* Sign in button */}
            <button type="submit" className="btn-sign-in">
              Sign in
            </button>

            {/* Horizontal Divider Line */}
            <div className="form-divider"></div>

            {/* Footer prompt */}
            <div className="form-footer">
              Need an account? <a href="#volunteer-register" className="apply-link">Apply to Volunteer</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
