import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import nexaLogo from '../assets/nexa24-logo.png';
import FallingPetals from './FallingPetals';

const ContactSection = () => {

  return (
    <section className="contact-exact container" id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
      <FallingPetals />
      {}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        className="decorative-leaf-contact"
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: 0,
          opacity: 0.95,
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />
      <div className="contact-grid-exact" style={{ position: 'relative', zIndex: 2 }}>
        <div className="contact-left-exact">
          <div className="eyebrow-exact">WHAT WE DO</div>
          <h2>Comprehensive Solutions for<br/><span className="purple-text">Modern Healthcare</span></h2>
          <p>We provide comprehensive healthcare support services<br/>powered by technology and delivered by experts.</p>
          <ul className="contact-checkmarks-exact">
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> No long-term contract</li>
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> Quick onboarding</li>
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> Dedicated account support</li>
          </ul>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="contact-cta-card reveal">
            <div className="contact-cta-header">
              <div className="contact-cta-logo-circle">
                <img src={nexaLogo} alt="NEXA24" style={{ height: '48px', width: 'auto' }} />
              </div>
              
              <div className="contact-cta-text">
                <h3>Have questions?</h3>
                <p>Get in touch with our team to learn how we can help.</p>
              </div>
            </div>

            <Link to="/contact#contact-form" className="btn-primary contact-cta-btn">
              Contact Us
              <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
