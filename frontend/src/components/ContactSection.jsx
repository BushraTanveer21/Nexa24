import React, { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', organization: '', service: ''
  });
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
  };

  return (
    <section className="contact-exact container" id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
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
          <p>Partner with NEX24 and experience uninterrupted<br/>care, powered by people and technology.</p>
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
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="" disabled hidden>Select a Service</option>
                <option value="Remote Patient Monitoring">Remote Patient Monitoring</option>
                <option value="Clinical Documentation Support">Clinical Documentation Support</option>
                <option value="Medical Billing & RCM">Medical Billing & RCM</option>
                <option value="Virtual Assistant & Admin Support">Virtual Assistant & Admin Support</option>
                <option value="Telehealth Support">Telehealth Support</option>
              </select>
            </div>
            <button type="submit" className="btn-purple-exact form-submit-btn">Request a Demo <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
            <p className="privacy-text-exact">We respect your privacy.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
