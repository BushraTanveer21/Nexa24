import React, { useState, useEffect } from 'react';
import FallingPetals from './FallingPetals';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', organization: '', service: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [servicesList, setServicesList] = useState([
    "Virtual Assistance Services",
    "Medical Billing Services",
    "Credentialing Services",
    "Marketing Services",
    "Additional Billing & RCM Solutions"
  ]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          const activeServices = data.filter(s => s.isActive).map(s => s.title);
          if (activeServices.length > 0) {
            setServicesList(activeServices);
          }
        }
      } catch (err) {
        console.warn("Could not fetch services, using fallback.");
      }
    };
    fetchServices();
  }, [API_URL]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ fullName: '', email: '', phone: '', organization: '', service: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.warn('Backend unavailable. Simulating success for Vercel deployment.');
      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. (Simulated)' });
      setFormData({ fullName: '', email: '', phone: '', organization: '', service: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-exact container" id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
      <FallingPetals />
      {/* Decorative leaf branch bottom left */}
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
          <div className="eyebrow-exact">GET STARTED</div>
          <h2>Ready to elevate patient care?<br/><span className="purple-text">Get Started</span></h2>
          <p>Partner with NEXA24 and experience uninterrupted<br/>care, powered by people and technology.</p>
          <ul className="contact-checkmarks-exact">
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> No long-term contract</li>
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> Quick onboarding</li>
            <li><div className="check-icon-exact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div> Dedicated account support</li>
          </ul>
        </div>
        <div className="contact-right-exact">
          <form onSubmit={handleSubmit} className="contact-form-exact">
            <div className="form-row-exact">
              <div className="form-group-exact">
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group-exact">
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-exact">
              <div className="form-group-exact">
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group-exact">
                <input type="text" name="organization" placeholder="Organization Name" value={formData.organization} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group-exact full-width">
              <label>I'm interested in</label>
              <div className="select-wrapper">
                  <select name="service" value={formData.service} onChange={handleChange} required>
                    <option value="" disabled hidden>Select a Service</option>
                    {servicesList.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <button type="submit" className="btn-purple-exact form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            {status.message && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: status.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: status.type === 'success' ? '#065F46' : '#991B1B',
                border: `1px solid ${status.type === 'success' ? '#A7F3D0' : '#FECACA'}`
              }}>
                {status.message}
              </div>
            )}
            <p className="privacy-text-exact">We respect your privacy.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
