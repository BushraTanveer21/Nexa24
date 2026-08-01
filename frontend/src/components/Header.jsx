import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-exact">
      <div className="logo-exact">
        <Link to="/">
          <img src="/Logo.jpeg" alt="NEXA24 Logo" style={{ height: '56px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </Link>
      </div>

      <nav className={`nav-links-exact ${menuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
        <Link to="/services" className={location.pathname === '/services' ? 'active' : ''} onClick={closeMenu}>Services</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About Us</Link>
        <Link to="/contact" className="btn-get-started-exact mobile-nav-btn" onClick={closeMenu}>Get Started</Link>
      </nav>

      <div className="header-right-exact">
        <Link to="/contact" className="btn-get-started-exact header-btn desktop-only-btn">Get Started</Link>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Header;
