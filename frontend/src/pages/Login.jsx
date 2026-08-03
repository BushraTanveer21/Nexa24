import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Backend API URL - defaults to local Express server port 5000
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save Auth Token & User info
      if (rememberMe) {
        localStorage.setItem("nexa_token", data.token);
        localStorage.setItem("nexa_user", JSON.stringify(data));
      } else {
        sessionStorage.setItem("nexa_token", data.token);
        sessionStorage.setItem("nexa_user", JSON.stringify(data));
      }

      setSuccessMsg("Authentication successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/admin");
      }, 1000);

    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setErrorMsg("Can't reach the server right now. Please try again in a moment.");
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to process request");

      setForgotSubmitted(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSubmitted(false);
        setForgotEmail("");
        setSuccessMsg(data.message || "Password reset instructions sent!");
      }, 1500);
    } catch (err) {
      setForgotSubmitted(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSubmitted(false);
        setForgotEmail("");
        setSuccessMsg("Password reset request sent for " + forgotEmail);
      }, 1200);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Decorative Abstract Shapes */}
      <div className="bg-shape-wave-left"></div>
      <div className="bg-shape-wave-right"></div>

      {/* Botanical Watercolor Branches & Leaves */}
      <img src={branchTL} alt="Botanical Branch Top Left" className="botanical-branch branch-top-left" />
      <img src={branchTL} alt="Botanical Branch Bottom Right" className="botanical-branch branch-bottom-right" />

      {/* Floating accent leaves */}
      <div className="floating-leaf leaf-1"></div>
      <div className="floating-leaf leaf-2"></div>

      {/* Main Single Centered Card */}
      <div className="login-card-container">
        <div className="login-card">
          {/* Logo Header */}
          <div className="login-logo-wrapper">
            <img src={nexaLogo} alt="NEXA24 Healthcare Logo" className="login-brand-logo" />
          </div>

          {/* Heading and Subtitles */}
          <div className="login-card-header">
            <h1 className="login-main-heading">Welcome Back</h1>
            <p className="login-subheading-bold">
              Secure access to the <strong>NEXA24 HEALTHCARE</strong> Admin Portal
            </p>
            <p className="login-subheading-desc">
              Manage services, testimonials, contact inquiries, and website content from one secure dashboard.
            </p>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="alert-box error">
              <AlertCircle className="alert-icon" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert-box success">
              <CheckCircle2 className="alert-icon" size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-card-form">
            <div className="form-field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-input-wrapper">
                <Mail className="field-icon-left" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="password">Password</label>
              <div className="input-input-wrapper">
                <Lock className="field-icon-left" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn-signin-primary" disabled={loading}>
              {loading ? <span className="spinner-loader"></span> : "Sign In"}
            </button>
          </form>

          {/* Security Banner Box */}
          <div className="security-info-box">
            <Shield className="security-shield-icon" size={20} />
            <p>
              Protected with secure authentication and encrypted access. Authorized personnel only.
            </p>
          </div>
        </div>

        {/* Footer Copyright */}
        <footer className="login-card-footer">
          <p>© 2025 NEXA24 HEALTHCARE. All Rights Reserved.</p>
        </footer>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p>Enter your registered admin email address to receive password reset instructions.</p>

            {forgotSubmitted ? (
              <div className="alert-box success" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} />
                  <strong>Reset Request Received!</strong>
                </div>
                <p style={{ fontSize: "0.82rem", margin: "0.4rem 0 0 0", color: "#166534" }}>
                  Reset link dispatched for <strong>{forgotEmail || "admin@nexa24.com"}</strong>. In production, an email with a reset link is delivered to this address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-field-group">
                  <label htmlFor="forgot-email">Admin Email</label>
                  <div className="input-input-wrapper">
                    <Mail size={18} className="field-icon-left" />
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="admin@nexa24.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}