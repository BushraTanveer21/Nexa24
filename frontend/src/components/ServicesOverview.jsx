import React, { useState } from 'react';
import FallingPetals from './FallingPetals';

const ServicesOverview = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleActive = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const services = [
    { 
      title: 'Remote Patient Monitoring', 
      description: 'Real-time tracking of patient health metrics (vitals, heart rate, blood pressure) from home to improve care outcomes and reduce hospital readmissions.',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 
    },
    { 
      title: 'Clinical Documentation Support', 
      description: 'Accurate and timely transcription, medical scribing, and management of health records to reduce provider burnout and ensure compliance.',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M12 12h.01M7 12h.01M17 12h.01M7 16h10M7 8h10"/></svg> 
    },
    { 
      title: 'Medical Billing & RCM', 
      description: 'Streamlined revenue cycle management including claims coding, submission, and denial management to accelerate reimbursement and maximize practice revenue.',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 
    },
    { 
      title: 'Virtual Assistant & Admin Support', 
      description: 'Dedicated virtual support for scheduling, patient intake, insurance verification, and email management to keep your clinic running smoothly.',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> 
    },
    { 
      title: 'Telehealth Support', 
      description: 'Seamless setup, technical assistance, and session management for virtual consultations, ensuring secure and high-quality remote care.',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> 
    }
  ];

  return (
    <section className="services-exact container" id="services" style={{ position: 'relative', overflow: 'hidden' }}>
      <FallingPetals />
      
      {/* Decorative leaf branch in the bottom-right space */}
      <img 
        src="/image.png?v=5" 
        alt="Decorative leaf branch" 
        className="decorative-leaf decorative-leaf-services"
      />
      <div className="services-split-exact" style={{ position: 'relative', zIndex: 1 }}>
        <div className="services-left-exact">
          <div className="eyebrow-exact">WHAT WE DO</div>
          <h2>Comprehensive Solutions for<br/><span className="purple-text">Modern Healthcare</span></h2>
          <p>We provide comprehensive healthcare support services<br/>powered by technology and delivered by experts.</p>
        </div>
        <div className="services-right-exact">
          {services.map((s, i) => (
            <div 
              className="service-item-exact" 
              key={i}
              onClick={() => toggleActive(i)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 0,
                transition: 'all 0.3s ease',
                backgroundColor: activeIndex === i ? '#F5EEFF' : '#F9FAFB',
                border: activeIndex === i ? '1px solid var(--primary-light)' : '1px solid transparent',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '16px',
                boxShadow: activeIndex === i ? '0 4px 20px rgba(109, 40, 217, 0.08)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
                <div 
                  className="service-icon-exact"
                  style={{
                    backgroundColor: activeIndex === i ? 'var(--primary-exact)' : '#E5E7EB',
                    color: activeIndex === i ? 'var(--white)' : 'var(--primary-exact)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ flex: 1, margin: 0, fontSize: '16px', fontWeight: '700', color: activeIndex === i ? 'var(--primary-exact)' : 'var(--text-dark-exact)' }}>
                  {s.title}
                </h3>
                <div 
                  className="service-arrow-exact"
                  style={{
                    transform: activeIndex === i ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: activeIndex === i ? 'var(--primary-exact)' : 'var(--text-muted-exact)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>

              <div 
                style={{
                  maxHeight: activeIndex === i ? '150px' : '0px',
                  opacity: activeIndex === i ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease',
                  marginTop: activeIndex === i ? '14px' : '0px',
                  paddingLeft: '52px', // aligns text cleanly with title
                  color: 'var(--text-muted-exact)',
                  fontSize: '14.5px',
                  lineHeight: '1.6'
                }}
              >
                {s.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
