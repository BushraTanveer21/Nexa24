import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

// Header and Footer are kept as shared components for later use.
// They already hide themselves on /login and /admin (see their own
// files), so nothing renders from them right now.
import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";

// Scrolls the window to the top whenever the route path changes (e.g.
// clicking a service card), so the new page always opens from the
// very top instead of inheriting the previous page's scroll position.
// In-page anchor links (like /#services) still work as expected since
// we only reset scroll when there's no hash in the URL.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Services />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Everything else currently points to the services page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
