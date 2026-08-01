import React from 'react';

const StatsBanner = () => {
  return (
    <section className="stats-exact container">
      <div className="stats-grid-exact">
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h4>24/7 Care & Support</h4>
          <p>Round-the-clock clinical and administrative support to ensure care never stops.</p>
        </div>
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h4>Secure & Compliant</h4>
          <p>HIPAA-compliant systems with enterprise-grade security to keep patient data safe.</p>
        </div>
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h4>Trusted by Professionals</h4>
          <p>Healthcare providers trust NEX24 for reliable, efficient, and scalable care solutions.</p>
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
