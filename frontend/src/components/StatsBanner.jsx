import React from 'react';
import { Clock, TrendingUp, CheckCircle } from 'lucide-react';

const StatsBanner = () => {
  return (
    <section className="stats-exact container">
      <div className="stats-grid-exact">
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <Clock size={24} strokeWidth={2} />
          </div>
          <h4>Human + Technology</h4>
          <p>We blend the best technology with a human touch to deliver empathetic care.</p>
        </div>
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <TrendingUp size={24} strokeWidth={2} />
          </div>
          <h4>Scalable Solutions</h4>
          <p>Flexible and scalable solution designed to grow with your practice.</p>
        </div>
        <div className="stat-item-exact">
          <div className="stat-icon-exact">
            <CheckCircle size={24} strokeWidth={2} />
          </div>
          <h4>Dedicated Support</h4>
          <p>We provide continuous support and optimization.</p>
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
