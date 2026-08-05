import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ComingSoonPage from './pages/ComingSoonPage';
import TestimonialPage from './pages/TestimonialPage';


import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import AboutUs from "./pages/AboutUs";

function ScrollAnimations() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('section').forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });

      const cardSelectors = [
        '.card',
        '.service-card',
        '.adv-card',
        '.adv-card-exact',
        '.how-step-exact',
        '.service-item-exact',
        '.stat-item-exact',
        '.nexa-meaning-card',
        '.timeline-step',
        '.contact-form-card',
        '.contact-form-card-exact',
        '.about-promise',
        '.hero-inner',
        '.sov-card',
        '.testimonial-card'
      ];

      cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
          el.style.transitionDelay = `${index * 0.1}s`;
          el.classList.add('reveal');
          observer.observe(el);
        });
      });

      document.querySelectorAll(
        '.about-us-headline, .about-us-desc, .about-eyebrow, .eyebrow, .eyebrow-exact, .hero-text h1, .hero-tagline, .hero-ctas, .hero-promise, .contact-info h2, .contact-info p'
      ).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(el);
      });

      // Catch-all: ensure any element manually given the 'reveal' class in JSX is observed!
      document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollAnimations />
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonial" element={<TestimonialPage />} />

            {/*  routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<ComingSoonPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;