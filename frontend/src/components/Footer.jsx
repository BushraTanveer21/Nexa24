import React from "react";
import { Link, useLocation } from "react-router-dom";
import nexaLogo from "../assets/nexa24-logo.png";

export default function Footer() {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/reset-password")) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img 
              src={nexaLogo} 
              alt="NEXA24 Healthcare Logo" 
              style={{ height: "40px", width: "auto" }} 
            />
          </div>
          <p>
            Relentless innovation and patient-centric precision. 24/7
            vigilance in a digital-first world.
          </p>
          <p
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            🛡 HIPAA CERTIFIED
          </p>
        </div>

        <div>
          <h5>QUICK LINKS</h5>
          <a href="#!" onClick={(e) => e.preventDefault()}>Home</a>
          <a href="/#services">Services</a>
          <a href="#!" onClick={(e) => e.preventDefault()}>Testimonials</a>
          <Link to="/about">About Us</Link>
          <a href="#!" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>


        <div>
          <h5>PRIVACY</h5>
          <a href="#privacy">Privacy Policy</a>
          <a href="#patient-rights">Patient Rights</a>
          <a href="#terms">Terms of Use</a>
        </div>

        <div id="contact">
          <h5>CONNECT</h5>
          <a href="mailto:care@nexa24.com">care@nexa24.com</a>
          <a href="tel:+18006392724">+1 (800) NEXA-24</a>
          <a href="#location">Silicon Valley Med-Tech Park</a>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 NEXA24 HEALTHCARE. ENGINEERED FOR EXCELLENCE.
      </div>
    </footer>
  );
}