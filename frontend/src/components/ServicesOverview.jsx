import React, { useState } from 'react';
import { Users, FileText, ShieldCheck, Megaphone, DollarSign } from 'lucide-react';
import FallingPetals from './FallingPetals';

const ServicesOverview = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleActive = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const services = [
    { 
      title: 'Virtual Assistance Services', 
      description: 'Smart support for scheduling, admin and daily operations.',
      icon: <Users size={20} strokeWidth={2} /> 
    },
    { 
      title: 'Medical Billing Services', 
      description: 'Accurate coding, claim management and faster reimbursements.',
      icon: <FileText size={20} strokeWidth={2} /> 
    },
    { 
      title: 'Credentialing Services', 
      description: 'Faster credentialing and CAQH maintenance.',
      icon: <ShieldCheck size={20} strokeWidth={2} /> 
    },
    { 
      title: 'Marketing Services', 
      description: 'Digital strategies that grow your practice online.',
      icon: <Megaphone size={20} strokeWidth={2} /> 
    },
    { 
      title: 'Additional Billing & RCM Solutions', 
      description: 'End-to-end revenue cycle management that improves cash flow.',
      icon: <DollarSign size={20} strokeWidth={2} /> 
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
                backgroundColor: activeIndex === i ? 'var(--bg-lavender)' : 'var(--bg-exact)',
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
