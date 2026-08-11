import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";

// Home ko bhi enabled: false kar diya — ab woh sirf text ki tarah dikhega,
// click nahi karega (logo pe click kar ke "/" pe jaya ja sakta hai).
const LINKS = [
  { id: "home", to: "/", label: "HOME", enabled: true },
  { id: "about", to: "/about", label: "ABOUT US", enabled: true },
  { id: "services", to: "/services", label: "SERVICES", enabled: true },
  { id: "testimonials", to: "/testimonial", label: "TESTIMONIALS", enabled: true },
  { id: "contact", to: "/contact", label: "CONTACT", enabled: true },
];

const GET_STARTED_TARGET = "/contact#contact-form";

// ===== Compact drawer styles =====
const drawerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999999,
  background: "#FFFFFF",
  paddingTop: "64px",
  maxHeight: "100vh",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
};

const drawerNavStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: "8px 20px 20px",
  width: "100%",
  boxSizing: "border-box",
};

const drawerLinkStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: "14.5px",
  fontWeight: 700,
  color: "#1E1233",
  background: "#FFFFFF",
  borderBottom: "1px solid #E5D5F9",
  textDecoration: "none",
};

const drawerLinkActiveStyle = {
  ...drawerLinkStyle,
  color: "#6D28D9",
  background: "#F3E8FF",
  borderRadius: "10px",
  borderBottom: "1px solid transparent",
};

const drawerLinkDisabledStyle = {
  ...drawerLinkStyle,
  color: "#C7BCDA",
  cursor: "default",
};

const drawerButtonStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
  margin: "14px 0 0",
  padding: "13px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #6D28D9, #9333EA)",
  color: "#FFFFFF",
  fontWeight: 700,
  fontSize: "14.5px",
  textDecoration: "none",
};

const overlayCloseBtnStyle = {
  position: "fixed",
  top: "14px",
  right: "16px",
  zIndex: 1000000,
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "1px solid #E5D5F9",
  background: "#FFFFFF",
  color: "#6D28D9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default function Header() {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isServices = location.pathname.startsWith("/services");
  const isAbout = location.pathname.startsWith("/about");
  const isTestimonials = location.pathname.startsWith("/testimonial");
  const isContact = location.pathname.startsWith("/contact");

  let initialActive = "home";
  if (isServices) initialActive = "services";
  else if (isAbout) initialActive = "about";
  else if (isTestimonials) initialActive = "testimonials";
  else if (isContact) initialActive = "contact";

  const [activeId, setActiveId] = useState(initialActive);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onHeaderScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    return () => window.removeEventListener("scroll", onHeaderScroll);
  }, []);

  useEffect(() => {
    let currentActive = "home";
    const path = location.pathname;
    if (path.startsWith("/services")) currentActive = "services";
    else if (path.startsWith("/about")) currentActive = "about";
    else if (path.startsWith("/testimonial")) currentActive = "testimonials";
    else if (path.startsWith("/contact")) currentActive = "contact";
    setActiveId(currentActive);
  }, [location.pathname]);

  if (
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  const drawerContent = mobileMenuOpen
    ? createPortal(
        <div style={drawerStyle}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
            style={overlayCloseBtnStyle}
          >
            <X size={22} />
          </button>
          <nav style={drawerNavStyle}>
            {LINKS.map((link) => {
              if (!link.enabled) {
                return (
                  <span key={link.id} style={drawerLinkDisabledStyle}>
                    {link.label}
                  </span>
                );
              }
              const style = activeId === link.id ? drawerLinkActiveStyle : drawerLinkStyle;
              return (
                <Link key={link.id} to={link.to} style={style} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              );
            })}
            <Link to={GET_STARTED_TARGET} style={drawerButtonStyle} onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </nav>
        </div>,
        document.body
      )
    : null;

  return (
    <header
      className={`header ${scrolled || mobileMenuOpen ? "header-scrolled" : "header-transparent"} ${mobileMenuOpen ? "header-menu-open" : ""}`}
    >
      <div className="header-inner">
        <Link to="/" className="logo-mark">
          <img src={nexaLogo} alt="NEXA24 Healthcare" height="48" style={{ height: '48px', width: 'auto' }} />
        </Link>

        <nav className="nav-links">
          {LINKS.map((link) =>
            link.enabled ? (
              <Link key={link.id} to={link.to} className={activeId === link.id ? "active" : ""}>
                {link.label}
              </Link>
            ) : (
              <span key={link.id} style={{ opacity: 0.45, cursor: "default" }} title="Coming soon">
                {link.label}
              </span>
            )
          )}
        </nav>

        <div className="header-actions">
          <Link className="btn-primary desktop-btn-getstarted" to={GET_STARTED_TARGET}>
            Get Started
          </Link>
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {drawerContent}
    </header>
  );
}