import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";

const LINKS = [
  { id: "home", to: "/#home", label: "Home" },
  { id: "services", to: "/services", label: "SERVICES" },
  { id: "solutions", to: "/#solutions", label: "SOLUTIONS" },
  { id: "about", to: "/#about", label: "ABOUT US" },
  { id: "testimonials", to: "/testimonials", label: "TESTIMONIALS" },
  { id: "contact", to: "/#contact", label: "CONTACT" },
];

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  if (location.pathname === "/login" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/reset-password")) {
    return null;
  }

  const isTestimonials = location.pathname.startsWith("/testimonials");
  const isServices = location.pathname.startsWith("/services");

  const [activeId, setActiveId] = useState(
    isTestimonials ? "testimonials" : isServices ? "services" : "home"
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Transparent header at the top of the page, solid/blurred once the
  // user starts scrolling so text stays readable over page content.
  useEffect(() => {
    const onHeaderScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    return () => window.removeEventListener("scroll", onHeaderScroll);
  }, []);

  useEffect(() => {
    if (isTestimonials) {
      setActiveId("testimonials");
      return;
    }
    if (isServices) {
      setActiveId("services");
      return;
    }

    // scroll-spy only makes sense on the home page, where these
    // section ids actually exist in the DOM
    const ids = LINKS.filter((l) => l.to.startsWith("/#")).map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const OFFSET = 120; // sticky header height + buffer

    const onScroll = () => {
      const scrollPos = window.scrollY + OFFSET;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isTestimonials, isServices]);

  return (
    <header className={`header ${scrolled ? "header-scrolled" : "header-transparent"}`}>
      <div className="header-inner">
        <Link to="/" className="logo-mark">
          <img src={nexaLogo} alt="NEXA24 Healthcare" />
        </Link>

        <nav className="nav-links">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className={activeId === link.id ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="btn-primary desktop-btn-getstarted" to="/#get-started">Get Started</Link>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            {LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                className={activeId === link.id ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="btn-primary mobile-btn-getstarted"
              to="/#get-started"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}