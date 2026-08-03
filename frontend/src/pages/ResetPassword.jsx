import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not reset password.");

      setSuccessMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="bg-shape-wave-left"></div>
      <div className="bg-shape-wave-right"></div>

      {/* Botanical Watercolor Branches & Leaves */}
      <img src={branchTL} alt="Botanical Branch Top Left" className="botanical-branch branch-top-left" />
      <img src={branchTL} alt="Botanical Branch Bottom Right" className="botanical-branch branch-bottom-right" />

      <div className="login-card-container">
        <div className="login-card">
          <div className="login-logo-wrapper">
            <img src={nexaLogo} alt="NEXA24 Healthcare Logo" className="login-brand-logo" />
          </div>

          <div className="login-card-header">
            <h1 className="login-main-heading">Set New Password</h1>
            <p className="login-subheading-desc">
              Choose a new password for your NEXA24 Healthcare admin account.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="login-card-form">
            <div className="form-field-group">
              <label htmlFor="password">New Password</label>
              <div className="input-input-wrapper">
                <Lock className="field-icon-left" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
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

            <div className="form-field-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-input-wrapper">
                <Lock className="field-icon-left" size={18} />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-signin-primary" disabled={loading}>
              {loading ? <span className="spinner-loader"></span> : "Reset Password"}
            </button>
          </form>

          <div className="security-info-box">
            <Shield className="security-shield-icon" size={20} />
            <p>This reset link is valid for 30 minutes and can only be used once.</p>
          </div>
        </div>

        <footer className="login-card-footer">
          <p>© 2025 NEXA24 HEALTHCARE. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}