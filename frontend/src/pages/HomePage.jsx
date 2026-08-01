import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsBanner from '../components/StatsBanner';
import AboutUs from '../components/AboutUs';
import Advantage from '../components/Advantage';
import ServicesOverview from '../components/ServicesOverview';
import CoreValues from '../components/CoreValues';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <StatsBanner />
        <AboutUs />
        <Advantage />
        <ServicesOverview />
        <CoreValues />
        <ContactSection />
      </div>
    </div>
  );
};

export default HomePage;
