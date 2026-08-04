import React, { useEffect, useState } from 'react';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    service: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ fullName: '', email: '', phone: '', organization: '', service: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* Decorative leaf branch top-left (starting below logo) */}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        style={{ 
          position: 'absolute', 
          top: '120px', 
          left: -20,
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 1,
          width: '250px',
          maxWidth: '30vw'
        }} 
      />

      {/* Decorative leaf branch bottom-right */}
      <img 
        src="/image.png?v=4" 
        alt="Decorative leaf branch" 
        style={{ 
          position: 'absolute', 
          bottom: -20,
          right: -20,
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 1,
          width: '250px',
          maxWidth: '30vw',
          transform: 'rotate(180deg)'
        }} 
      />
      
      {/* Hero Section */}
      <section className="contact-hero">
        {/* Floating particles for decoration matching the mockup */}
        <div className="hero-particles">
          <div className="particle p1"></div>
          <div className="particle p2"></div>
          <div className="particle p3"></div>
          <div className="particle p4"></div>
          <div className="particle p5"></div>
          <div className="particle p6"></div>
        </div>

        <div className="contact-hero-content">
          <div className="contact-hero-left">
            <div className="contact-eyebrow">
              <span className="eyebrow-dot"></span> WE'RE HERE FOR YOU
            </div>
            <h1 className="contact-title">
              Let's build better healthcare, <span className="purple-text">together.</span>
            </h1>
            <p className="contact-desc">
              Have questions or ready to get started? Our team is here to help you streamline operations and deliver exceptional patient care.
            </p>
            
            <div className="contact-features">
              <div className="contact-feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Response within 24 hours</h4>
                  <p>We respond to all inquiries quickly.</p>
                </div>
              </div>
              
              <div className="contact-feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Your information is secure</h4>
                  <p>We respect your privacy and never share your data.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-hero-right">
            <div className="headset-graphic-wrapper">
              <div className="circle-bg c1"></div>
              <div className="circle-bg c2"></div>
              <div className="circle-bg c3"></div>
              <div className="headset-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  <path d="M19 21v1a2 2 0 0 1-2 2H7"></path>
                </svg>
                <div className="headset-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="contact-form-section">
        
        {/* Wrapper for Card and Decorative Leaf */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          
          {/* Decorative leaf hugging the top-right corner of the card */}
          <img 
            src="/image.png?v=4" 
            alt="Decorative leaf branch" 
            style={{ 
              position: 'absolute', 
              top: '-110px', 
              right: '-20px', 
              width: '200px', 
              opacity: 0.7,
              transform: 'scaleX(-1) rotate(180deg)',
              pointerEvents: 'none',
              zIndex: 0
            }} 
          />

          <div className="contact-form-card-exact" style={{ position: 'relative', zIndex: 10 }}>
            
            <div className="contact-card-left">
              <h3>Get in Touch</h3>
            <p>We'd love to hear from you. Reach out to us through any of the following channels.</p>
            
            <div className="contact-channels">
              <div className="channel-item">
                <div className="channel-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="channel-info">
                  <h5>Email Us</h5>
                  <p>care@nex24.com</p>
                </div>
              </div>
              
              <div className="channel-item">
                <div className="channel-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="channel-info">
                  <h5>Call Us</h5>
                  <p>+1 (800) NEX24-24</p>
                  <p>(800) 639-424</p>
                </div>
              </div>
              
              <div className="channel-item">
                <div className="channel-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="channel-info">
                  <h5>Visit Us</h5>
                  <p>Silicon Valley Med-Tech Park</p>
                  <p>Palo Alto, CA 94301, USA</p>
                </div>
              </div>
              
              <div className="channel-item">
                <div className="channel-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="channel-info">
                  <h5>Business Hours</h5>
                  <p>Mon – Fri: 8:00 AM – 6:00 PM (PT)</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <h5>Follow Us</h5>
              <div className="social-icons">
                <a href="#" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-card-right" style={{ position: 'relative' }}>
            <h3>Send us a message</h3>
            <p>Fill out the form and our team will get back to you shortly.</p>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`form-status ${status.type}`}>
                  {status.message}
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Work Email" required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Organization / Practice Name" />
                </div>
              </div>
              
              <div className="form-group">
                <label>I'm interested in</label>
                <div className="select-wrapper">
                  <select name="service" value={formData.service} onChange={handleChange} required>
                    <option value="" disabled hidden>Select a Service</option>
                    <option value="Virtual Assistant">Virtual Assistant</option>
                    <option value="Medical Billing">Medical Billing</option>
                    <option value="Credentialing">Credentialing</option>
                    <option value="RCM Solutions">RCM Solutions</option>
                  </select>
                  <svg className="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              <div className="form-group">
                <label>How can we help you?</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your needs..." rows="4" required></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-send-message" disabled={isSubmitting}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <div className="privacy-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  We respect your privacy.
                </div>
              </div>
            </form>
          </div>
          
        </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="contact-map-section">
        <div className="map-container">
          <iframe
            title="NEXA24 Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.63929062107!2d-122.14301948469274!3d37.42199987982559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sPalo%20Alto%2C%20CA%2094301!5e0!3m2!1sen!2sus!4v1689280000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
      
    </div>
  );
}
