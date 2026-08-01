import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-exact container">
      <div className="footer-grid-exact">
        
        <div className="footer-col-1-exact">
          <div className="footer-brand-exact">
            <Link to="/">
              <img src="/Logo.jpeg" alt="NEXA24 Logo" style={{ height: '56px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </Link>
          </div>
          <p className="footer-desc-exact">
            Next-Level Care. 24/7 Vigilance. We combine advanced clinical intelligence with human empathy to deliver on care and support.
          </p>
        </div>

        <div className="footer-links-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '30px', width: '100%' }}>
          <div className="footer-col-exact">
            <h5>Quick Links</h5>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#solutions">Solutions</a>
            <a href="#about">About Us</a>
          </div>

          <div className="footer-col-exact">
            <h5>Services</h5>
            <a href="#services">Remote Patient Monitoring</a>
            <a href="#services">Clinical Documentation</a>
            <a href="#services">Medical Billing & RCM</a>
            <a href="#services">Telehealth Support</a>
            <a href="#services">Virtual Assistants</a>
          </div>

          <div className="footer-col-exact footer-contact-exact">
            <h5>Contact Us</h5>
            <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> care@nex24.com</p>
            <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> +(1000) 123-4567</p>
            <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path></svg> Silicon Valley,<br/>Med-Tech Pich</p>
          </div>
        </div>
        
      </div>
      
      <div className="footer-bottom-exact">
        <span>&copy; 2024 NEX24. All rights reserved.</span>
        <div className="social-icons-exact">
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
