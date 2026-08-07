import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Star,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Eye,
  GripVertical,
  ShieldCheck,
  ChevronDown,
  LogOut,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Check,
  Quote,
  Upload,
  Image as ImageIcon,
  Menu,
  ChevronLeft,
  ChevronRight,
  Video,
  Camera
} from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Auth token for admin-only writes (create/update/delete). Reads (GET) stay public.
const getAuthToken = () =>
  localStorage.getItem("nexa_token") || sessionStorage.getItem("nexa_token");

// Uploads a file to the backend, which forwards it to Cloudinary and
// returns a hosted image URL. Used instead of storing base64 image data
// directly in MongoDB.
const uploadImageFile = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url;
};

const uploadVideoFile = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_URL}/api/upload/video`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Video upload failed");
  return data.url;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // References for scrolling to sections
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactsRef = useRef(null);

  // Starts empty — real data comes from the backend via fetchBackendData().
  // (Previously prefilled with fake placeholder services that looked real
  // but were never actually saved to the database.)
  const [services, setServices] = useState([]);

  // Starts empty — real data comes from the backend via fetchBackendData().
  // (Previously prefilled with fake placeholder testimonials that looked
  // real but were never actually saved to the database.)
  const [testimonials, setTestimonials] = useState([]);

  // Starts empty — real data comes from the backend via fetchBackendData().
  // (Previously prefilled with fake placeholder inquiries that looked real
  // but were never actually saved to the database.)
  const [contacts, setContacts] = useState([]);

  // Modals state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", order: 1, image: "" });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: "",
    designation: "",
    status: "Published",
    homepageDisplay: true,
    message: "",
    email: "",
    videoUrl: "",
    type: "text"
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const [uploadingTestimonialVideo, setUploadingTestimonialVideo] = useState(false);
  const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', onConfirm: null });
  const [testimonialTab, setTestimonialTab] = useState("admin");

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    // Auth Check — verify the token with the backend rather than just
    // trusting that a value exists in storage.
    const token = localStorage.getItem("nexa_token") || sessionStorage.getItem("nexa_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const verifyAndLoad = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("nexa_token");
          localStorage.removeItem("nexa_user");
          sessionStorage.removeItem("nexa_token");
          sessionStorage.removeItem("nexa_user");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
        fetchBackendData();
      } catch (e) {
        // Backend unreachable — don't grant access, send back to login.
        navigate("/login");
      }
    };

    verifyAndLoad();
  }, [navigate]);

  const fetchBackendData = async () => {
    const token = getAuthToken();

    try {
      const resT = await fetch(`${API_URL}/api/testimonials/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (resT.ok) {
        const dataT = await resT.json();
        if (Array.isArray(dataT)) {
          const mappedT = dataT.map((t, idx) => ({
            _id: t._id || `t_${idx}`,
            clientName: t.name || t.clientName || "Client",
            designation: t.position || t.designation || "Healthcare Client",
            status: t.status || (t.isEnabled !== false ? "Published" : "Disabled"),
            homepageDisplay: t.homepageDisplay !== undefined ? t.homepageDisplay : (t.isEnabled !== false),
            message: t.message || "",
            rating: t.rating || 5,
            email: t.email || "",
            videoUrl: t.videoUrl || "",
            image: t.image || "",
            isClientSubmitted: t.isClientSubmitted || false
          }));
          setTestimonials(mappedT);
        }
      }

      // Admin dashboard needs ALL services (including disabled ones), not
      // just the public/active list — use the admin endpoint with auth,
      // so a service that gets deactivated doesn't disappear from here too.
      const resS = await fetch(`${API_URL}/api/services/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (resS.ok) {
        const dataS = await resS.json();
        if (Array.isArray(dataS)) {
          const mappedS = dataS.map((s, idx) => ({
            _id: s._id || `s_${idx}`,
            name: s.title || s.name || "Service",
            description: s.description || "",
            order: s.order || idx + 1,
            image: s.image || s.imageUrl || "",
            isActive: s.isActive !== false
          }));
          setServices(mappedS);
        }
      }

      const resC = await fetch(`${API_URL}/api/contact`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (resC.ok) {
        const dataC = await resC.json();
        if (Array.isArray(dataC)) {
          const mappedC = dataC.map((c) => ({
            _id: c._id,
            name: c.name || c.fullName,
            email: c.email,
            phone: c.phone || "Not Provided",
            subject: c.subject || "General Inquiry",
            receivedOn: c.createdAt
              ? new Date(c.createdAt).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "numeric", minute: "2-digit",
              })
              : "",
            status: c.status || "New",
            message: c.message || "",
            isRead: c.isRead || false,
          }));
          setContacts(mappedC);
        }
      }
    } catch (err) {
      console.warn("Using offline dashboard state:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nexa_token");
    localStorage.removeItem("nexa_user");
    sessionStorage.removeItem("nexa_token");
    sessionStorage.removeItem("nexa_user");
    navigate("/login");
  };

  const handleNavClick = (section) => {
    setActiveNav(section);
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Service handlers
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({ name: "", description: "", order: services.length + 1, image: "" });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({ name: service.name, description: service.description, order: service.order, image: service.image || "" });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    // Backend model field is "title", dashboard form field is "name" — map here.
    const payload = {
      title: serviceForm.name,
      description: serviceForm.description,
      order: Number(serviceForm.order) || services.length + 1,
      image: serviceForm.image,
      isActive: true
    };

    try {
      const token = getAuthToken();
      const isEditing = !!editingService;
      const url = isEditing
        ? `${API_URL}/api/services/${editingService._id}`
        : `${API_URL}/api/services`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save service");
      }

      const saved = await res.json();
      const mapped = {
        _id: saved._id,
        name: saved.title,
        description: saved.description,
        order: saved.order,
        image: saved.image || "",
        isActive: saved.isActive !== false
      };

      if (isEditing) {
        setServices(services.map(s => s._id === editingService._id ? mapped : s));
      } else {
        setServices([...services, mapped]);
      }
      setShowServiceModal(false);
      showToast(isEditing ? "Service updated successfully." : "Service created successfully.");
    } catch (err) {
      showToast(err.message || "Could not save service. Please try again.", "error");
    }
  };

  const handleDeleteService = (id) => {
    setConfirmDialog({
      show: true,
      title: "Are you sure you want to delete this service?",
      onConfirm: async () => {
        try {
          const token = getAuthToken();
          const res = await fetch(`${API_URL}/api/services/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to delete service");
          }

          setServices(services.filter(s => s._id !== id));
          showToast("Service deleted successfully.");
        } catch (err) {
          showToast(err.message || "Could not delete service. Please try again.", "error");
        }
      }
    });
  };

  const handleOrderChange = async (id, newOrder) => {
    const order = Number(newOrder) || 1;
    setServices(services.map(s => s._id === id ? { ...s, order } : s));

    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order }),
      });
    } catch (err) {
      console.warn("Order update failed to persist:", err.message);
    }
  };

  // Testimonial handlers
  const handleOpenAddTestimonial = (type = 'text') => {
    setEditingTestimonial(null);
    setTestimonialForm({ clientName: "", designation: "", status: "Published", homepageDisplay: true, message: "", email: "", videoUrl: "", image: "", rating: 5, type });
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      clientName: t.clientName,
      designation: t.designation,
      status: t.status,
      homepageDisplay: t.homepageDisplay,
      message: t.message || "",
      email: t.email || "",
      videoUrl: t.videoUrl || "",
      image: t.image || "",
      rating: t.rating || 5,
      type: t.videoUrl ? "video" : "text"
    });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.clientName.trim()) return;

    if (testimonialForm.type === 'video' && !testimonialForm.videoUrl) {
      alert("Please upload a video.");
      return;
    }

    if (testimonialForm.type === 'text' && (!testimonialForm.message || !testimonialForm.message.trim())) {
      alert("Please enter a review message.");
      return;
    }

    // Backend model fields are name/position/isEnabled — dashboard form uses
    // clientName/designation/status+homepageDisplay. Map here.
    const payload = {
      name: testimonialForm.clientName,
      position: testimonialForm.designation,
      message: testimonialForm.message,
      email: testimonialForm.email,
      videoUrl: testimonialForm.videoUrl,
      image: testimonialForm.image,
      rating: Number(testimonialForm.rating),
      isEnabled: testimonialForm.status !== "Disabled" && testimonialForm.homepageDisplay,
    };

    try {
      const token = getAuthToken();
      const isEditing = !!editingTestimonial;
      const url = isEditing
        ? `${API_URL}/api/testimonials/${editingTestimonial._id}`
        : `${API_URL}/api/testimonials`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save testimonial");
      }

      const saved = await res.json();
      const mapped = {
        _id: saved._id,
        clientName: saved.name,
        designation: saved.position || "",
        status: saved.isEnabled !== false ? "Published" : "Disabled",
        homepageDisplay: saved.isEnabled !== false,
        message: saved.message || "",
        rating: saved.rating || 5,
        email: saved.email || "",
        videoUrl: saved.videoUrl || "",
        image: saved.image || "",
        isClientSubmitted: saved.isClientSubmitted || false
      };

      if (isEditing) {
        setTestimonials(testimonials.map(t => t._id === editingTestimonial._id ? mapped : t));
      } else {
        setTestimonials([...testimonials, mapped]);
      }
      setShowTestimonialModal(false);
      showToast(isEditing ? "Testimonial updated successfully." : "Testimonial created successfully.");
    } catch (err) {
      showToast(err.message || "Could not save testimonial. Please try again.", "error");
    }
  };

  const handleDeleteTestimonial = (id) => {
    setConfirmDialog({
      show: true,
      title: "Delete this testimonial item?",
      onConfirm: async () => {
        try {
          const token = getAuthToken();
          const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to delete testimonial");
          }

          setTestimonials(testimonials.filter(t => t._id !== id));
          showToast("Testimonial deleted successfully.");
        } catch (err) {
          showToast(err.message || "Could not delete testimonial. Please try again.", "error");
        }
      }
    });
  };

  const handleToggleHomepageDisplay = async (id) => {
    const current = testimonials.find(t => t._id === id);
    if (!current) return;
    const nextValue = !current.homepageDisplay;

    setTestimonials(testimonials.map(t => t._id === id ? { ...t, homepageDisplay: nextValue } : t));

    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: nextValue }),
      });
    } catch (err) {
      console.warn("Homepage display toggle failed to persist:", err.message);
    }
  };

  // Contact handlers
  const handleDeleteContact = (id) => {
    setConfirmDialog({
      show: true,
      title: "Delete this inquiry?",
      onConfirm: async () => {
        try {
          const token = getAuthToken();
          const res = await fetch(`${API_URL}/api/contact/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to delete inquiry");
          }

          setContacts(contacts.filter(c => c._id !== id));
          if (selectedInquiry?._id === id) setSelectedInquiry(null);
          showToast("Inquiry deleted successfully.");
        } catch (err) {
          showToast(err.message || "Could not delete inquiry. Please try again.", "error");
        }
      }
    });
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
    if (selectedInquiry?._id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Inquiry status update failed to persist:", err.message);
    }
  };
  const handleMarkAsRead = async (id, isRead) => {
    setContacts(contacts.map(c => c._id === id ? { ...c, isRead } : c));
    if (selectedInquiry?._id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, isRead } : null);
    }

    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead }),
      });
    } catch (err) {
      console.warn("Read status update failed to persist:", err.message);
    }
  };

  const handleViewInquiry = (contact) => {
    setSelectedInquiry(contact);
    if (!contact.isRead) {
      handleMarkAsRead(contact._id, true);
    }
  };

  const publishedCount = testimonials.filter(t => t.status === "Published").length;
  const disabledCount = testimonials.filter(t => t.status === "Disabled").length;

  return (
    <div className="nexa-dashboard-page">
      {/* Botanical Watercolor Leaf Branches (Matching Login page) */}
      <img src={branchTL} alt="Botanical Branch Top Left" className="botanical-branch branch-top-left" />
      <img src={branchTL} alt="Botanical Branch Bottom Right" className="botanical-branch branch-bottom-right" />

      {/* Sidebar Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`nexa-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>

        {/* Desktop Collapse/Expand Toggle */}
        <button
          className="sidebar-collapse-toggle"
          onClick={toggleSidebarCollapse}
          aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Sidebar Brand Header - Top End Logo */}
        <div className="sidebar-brand">
          <img src={nexaLogo} alt="NEXA24 Healthcare Logo" className="sidebar-brand-logo" />
          <div className="sidebar-brand-text">
            <strong className="sidebar-brand-name">NEXA24</strong>
            <span className="sidebar-brand-sub">HEALTHCARE</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavClick("dashboard")}
            title="Dashboard"
          >
            <Home size={18} className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeNav === "services" ? "active" : ""}`}
            onClick={() => handleNavClick("services")}
            title="Services"
          >
            <Package size={18} className="nav-icon" />
            <span>Services</span>
          </button>

          <button
            className={`nav-item ${activeNav === "testimonials" ? "active" : ""}`}
            onClick={() => handleNavClick("testimonials")}
            title="Testimonials"
          >
            <Star size={18} className="nav-icon" />
            <span>Testimonials</span>
          </button>

          <button
            className={`nav-item ${activeNav === "contacts" ? "active" : ""}`}
            onClick={() => handleNavClick("contacts")}
            title="Contact Inquiries"
          >
            <Mail size={18} className="nav-icon" />
            <span>Contact Inquiries</span>
          </button>
        </nav>

        {/* Sidebar Footer Banner & Copyright */}
        <div className="sidebar-footer">
          <div className="sidebar-security-badge">
            <ShieldCheck size={16} className="badge-shield-icon" />
            <span>Protected with secure authentication.</span>
          </div>
          <p className="sidebar-copyright">© 2025 NEXA24 HEALTHCARE</p>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="nexa-main-content">
        {/* Mobile Top Responsive Bar */}
        <div className="dash-mobile-bar">
          <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Navigation Drawer">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="mobile-brand-title">
            <img src={nexaLogo} alt="NEXA24 Logo" className="mobile-logo-small" />
            <span>NEXA24 HEALTHCARE</span>
          </div>
        </div>

        {/* TOP BAR HEADER */}
        <header className="dash-top-header">
          <div className="header-titles">
            <h1 className="dash-heading">Dashboard Overview</h1>
            <p className="dash-subheading">Welcome back, {user?.name || "Admin"}</p>
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="admin-profile-container">
            <button
              className="admin-user-pill"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="admin-avatar-circle">
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : "A"}</span>
              </div>
              <span className="admin-name-text">{user?.name || "Admin"}</span>
              <ChevronDown size={14} className={`chevron-icon ${userMenuOpen ? "open" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-info">
                  <strong className="user-display-name">{user?.name || "NEXA24 Admin"}</strong>
                  <span className="user-display-email">{user?.email || "admin@nexa24.com"}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-btn-logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* TAB CONTENT RENDERING */}

        {/* DASHBOARD OVERVIEW TAB */}
        {activeNav === "dashboard" && (
          <>
            {/* METRICS / STAT CARDS ROW */}
            <section className="stats-row">
              {/* Card 1: Total Services */}
              <div className="stat-card">
                <div className="stat-icon-box purple">
                  <Package size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-title">Total Services</span>
                  <strong className="stat-number">{services.length}</strong>
                  <span className="stat-subtitle">Active Services</span>
                </div>
              </div>

              {/* Card 2: Total Testimonials */}
              <div className="stat-card">
                <div className="stat-icon-box purple">
                  <Star size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-title">Total Testimonials</span>
                  <strong className="stat-number">{testimonials.length}</strong>
                  <div className="stat-status-divider"></div>
                  <div className="stat-breakdown-row">
                    <span className="dot-badge green">
                      <span className="dot"></span> Published <strong>{publishedCount}</strong>
                    </span>
                    <span className="dot-badge red">
                      <span className="dot"></span> Disabled <strong>{disabledCount}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Total Contact Inquiries */}
              <div className="stat-card">
                <div className="stat-icon-box purple">
                  <Mail size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-title">Total Contact Inquiries</span>
                  <strong className="stat-number">{contacts.length}</strong>
                  <span className="stat-subtitle">Total Messages</span>
                </div>
              </div>
            </section>

            {/* Dashboard Quick Summary or All Tables */}
            <div className="dash-welcome-banner">
              <h2>Welcome to the NEXA24 Control Center</h2>
              <p>Select a category from the sidebar to manage your services, client testimonials, and contact inquiries.</p>
            </div>
          </>
        )}

        {/* SERVICES MANAGEMENT TAB */}
        {activeNav === "services" && (
          <section className="dash-section-card animate-fade-in">
            <div className="section-card-header">
              <h2 className="section-title">Services Management</h2>
              <button className="btn-primary-purple" onClick={handleOpenAddService}>
                <Plus size={16} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="table-responsive-wrapper">
              <table className="nexa-table services-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>#</th>
                    <th style={{ width: "70px" }}>Image</th>
                    <th style={{ width: "22%" }}>Service Name</th>
                    <th>Description</th>
                    <th style={{ width: "90px", textAlign: "center" }}>Order</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, index) => (
                    <tr key={s._id}>
                      <td className="col-index">{index + 1}</td>
                      <td className="col-image">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="service-table-thumb" />
                        ) : (
                          <div className="service-thumb-placeholder" title="No image uploaded">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td className="col-service-name">
                        <strong>{s.name}</strong>
                      </td>
                      <td className="col-description">{s.description}</td>
                      <td className="col-order" style={{ textAlign: "center" }}>
                        <div className="order-drag-cell">
                          <GripVertical size={16} className="grip-icon" />
                          <input
                            type="number"
                            className="order-input"
                            value={s.order}
                            onChange={(e) => handleOrderChange(s._id, e.target.value)}
                            min="1"
                          />
                        </div>
                      </td>
                      <td className="col-actions" style={{ textAlign: "center" }}>
                        <div className="action-btn-group justify-center">
                          <button
                            className="btn-icon edit"
                            onClick={() => handleOpenEditService(s)}
                            title="Edit Service"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteService(s._id)}
                            title="Delete Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-row">No services available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TESTIMONIALS MANAGEMENT TAB */}
        {activeNav === "testimonials" && (
          <section className="dash-section-card animate-fade-in">
            <div className="section-card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button 
                  onClick={() => setTestimonialTab("admin")}
                  style={{ background: 'none', border: 'none', padding: '8px 4px', fontSize: '15px', fontWeight: testimonialTab === "admin" ? '600' : '500', color: testimonialTab === "admin" ? '#6d28d9' : '#64748b', borderBottom: testimonialTab === "admin" ? '2px solid #6d28d9' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-17px' }}
                >
                  Testimonial Management
                </button>
                <button 
                  onClick={() => setTestimonialTab("client")}
                  style={{ background: 'none', border: 'none', padding: '8px 4px', fontSize: '15px', fontWeight: testimonialTab === "client" ? '600' : '500', color: testimonialTab === "client" ? '#6d28d9' : '#64748b', borderBottom: testimonialTab === "client" ? '2px solid #6d28d9' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-17px' }}
                >
                  Client Testimonials
                </button>
              </div>
              <div className="table-actions">
                <button className="btn-primary-purple" onClick={() => handleOpenAddTestimonial('text')}>
                  <Plus size={16} />
                  <span>Add Testimonial</span>
                </button>
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="nexa-table testimonials-table">
                <thead>
                  <tr>
                    <th style={{ width: "32px" }}>#</th>
                    <th style={{ width: "60px" }}>Avatar</th>
                    <th>Client Name</th>
                    <th>Designation</th>
                    <th>Review</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                    <th style={{ textAlign: "center" }}>Homepage Display</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.filter(t => testimonialTab === "client" ? t.isClientSubmitted : !t.isClientSubmitted).map((t, idx) => (
                    <tr key={t._id}>
                      <td className="col-index">{idx + 1}</td>
                      <td className="col-image">
                        {t.image ? (
                          <img 
                            src={t.image}
                            alt={t.clientName} 
                            className="service-table-thumb" 
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName || 'User')}&background=random&color=fff&size=128`}
                            alt={t.clientName} 
                            className="service-table-thumb" 
                            style={{ borderRadius: '50%' }}
                          />
                        )}
                      </td>
                      <td><strong>{t.clientName}</strong></td>
                      <td className="col-designation">{t.designation}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className="quote-icon-cell">
                          <Quote size={15} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {t.status === "Published" && (
                          <span className="status-pill published">Published</span>
                        )}
                        {t.status === "Disabled" && (
                          <span className="status-pill disabled">Disabled</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-btn-group justify-center">
                          <button
                            className="btn-icon edit"
                            onClick={() => handleOpenEditTestimonial(t)}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteTestimonial(t._id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={t.homepageDisplay}
                            onChange={() => handleToggleHomepageDisplay(t._id)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                  {testimonials.filter(t => testimonialTab === "client" ? t.isClientSubmitted : !t.isClientSubmitted).length === 0 && (
                    <tr>
                      <td colSpan="8" className="empty-row">No testimonials found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CONTACT INQUIRIES TAB */}
        {activeNav === "contacts" && (
          <section className="dash-section-card animate-fade-in">
            <div className="section-card-header">
              <h2 className="section-title">Contact Form Inquiries</h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="nexa-table contacts-table">
                <thead>
                  <tr>
                    <th style={{ width: "32px" }}>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Received On</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Read Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, idx) => (
                    <tr key={c._id} style={!c.isRead ? { fontWeight: 600 } : undefined}>
                      <td className="col-index">
                        {idx + 1}
                      </td>
                      <td><strong>{c.name}</strong></td>
                      <td><a href={`mailto:${c.email}`} className="email-text-link">{c.email}</a></td>
                      <td>{c.subject}</td>
                      <td className="col-date">{c.receivedOn}</td>
                      <td style={{ textAlign: "center" }}>
                        {c.status === "New" && (
                          <span className="status-pill new">New</span>
                        )}
                        {c.status === "In Progress" && (
                          <span className="status-pill in-progress">In Progress</span>
                        )}
                        {c.status === "Handled" && (
                          <span className="status-pill handled">Handled</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {c.isRead ? (
                          <span className="status-pill handled">Read</span>
                        ) : (
                          <span className="status-pill pending">Unread</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-btn-group justify-center">
                          <button
                            className="btn-icon view"
                            onClick={() => handleViewInquiry(c)}
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteContact(c._id)}
                            title="Delete Inquiry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="empty-row">No contact inquiries.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* SERVICE MODAL */}
      {showServiceModal && (
        <div className="modal-backdrop" onClick={() => setShowServiceModal(false)}>
          <div className="nexa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? "Edit Service" : "Add New Service"}</h3>
              <button className="modal-close-btn" onClick={() => setShowServiceModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="modal-form">
              <div className="modal-field">
                <label>Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Virtual Assistance Services"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Display Order</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={serviceForm.order}
                  onChange={(e) => setServiceForm({ ...serviceForm, order: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Service Image</label>
                <div className="image-upload-wrapper">
                  {serviceForm.image ? (
                    <div className="image-preview-box">
                      <img src={serviceForm.image} alt="Service Preview" className="service-img-preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => setServiceForm({ ...serviceForm, image: "" })}
                      >
                        <X size={14} /> Clear Image
                      </button>
                    </div>
                  ) : (
                    <label className="file-upload-dropzone">
                      <Upload size={22} className="upload-icon" />
                      <div className="upload-text">
                        <strong>{uploadingServiceImage ? "Uploading..." : "Click or drag to upload image"}</strong>
                        <span>PNG, JPG, WEBP up to 5MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="file-input-hidden"
                        disabled={uploadingServiceImage}
                        onChange={async (e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image is too large. Please upload an image under 5MB.");
                            e.target.value = "";
                            return;
                          }

                          setUploadingServiceImage(true);
                          try {
                            const url = await uploadImageFile(file);
                            setServiceForm((prev) => ({ ...prev, image: url }));
                          } catch (err) {
                            alert(err.message || "Image upload failed. Please try again.");
                          } finally {
                            setUploadingServiceImage(false);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="modal-field">
                <label>Service Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed description of the healthcare service offering..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-secondary" onClick={() => setShowServiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-purple">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div className="modal-backdrop" onClick={() => setShowTestimonialModal(false)}>
          <div className="nexa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingTestimonial
                  ? `Edit ${testimonialForm.type === 'video' ? 'Video' : 'Text'} Testimonial`
                  : `Add New ${testimonialForm.type === 'video' ? 'Video' : 'Text'} Testimonial`}
              </h2>
              <button className="btn-close" onClick={() => setShowTestimonialModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="modal-form">
              <div className="modal-field">
                <label>Testimonial Type</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    className={`btn-primary-purple ${testimonialForm.type === 'text' ? '' : 'btn-outline'}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #7c3aed',
                      background: testimonialForm.type === 'text' ? '#7c3aed' : 'transparent',
                      color: testimonialForm.type === 'text' ? 'white' : '#7c3aed',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTestimonialForm({ ...testimonialForm, type: 'text' })}
                  >
                    Text Review
                  </button>
                  <button 
                    type="button" 
                    className={`btn-primary-purple ${testimonialForm.type === 'video' ? '' : 'btn-outline'}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #7c3aed',
                      background: testimonialForm.type === 'video' ? '#7c3aed' : 'transparent',
                      color: testimonialForm.type === 'video' ? 'white' : '#7c3aed',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTestimonialForm({ ...testimonialForm, type: 'video' })}
                  >
                    Video Review
                  </button>
                </div>
              </div>

              <div className="modal-field">
                <label>Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Johnson"
                  value={testimonialForm.clientName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Designation / Practice</label>
                <input
                  type="text"
                  placeholder="e.g. Family Medicine Practice"
                  value={testimonialForm.designation}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Email Address (For Avatar & Details)</label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={testimonialForm.email}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, email: e.target.value })}
                />
              </div>

              {testimonialForm.type === 'text' && (
                <div className="modal-field">
                  <label>Client Image (Optional)</label>
                  <div className="image-upload-wrapper">
                    {testimonialForm.image ? (
                      <div className="image-preview-box">
                        <img src={testimonialForm.image} alt="Client Preview" className="service-img-preview" />
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => setTestimonialForm({ ...testimonialForm, image: "" })}
                        >
                          <X size={14} /> Clear Image
                        </button>
                      </div>
                    ) : (
                      <label className="file-upload-dropzone" style={{ minHeight: '100px', padding: '1rem' }}>
                        <Upload size={20} className="upload-icon" />
                        <div className="upload-text">
                          <strong>{uploadingTestimonialImage ? "Uploading..." : "Click to upload image"}</strong>
                          <span style={{ fontSize: '11px' }}>JPG, PNG up to 5MB</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input-hidden"
                          disabled={uploadingTestimonialImage}
                          onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;

                            if (file.size > 5 * 1024 * 1024) {
                              alert("Image is too large. Please upload an image under 5MB.");
                              e.target.value = "";
                              return;
                            }

                            setUploadingTestimonialImage(true);
                            try {
                              const url = await uploadImageFile(file);
                              setTestimonialForm((prev) => ({ ...prev, image: url }));
                            } catch (err) {
                              alert(err.message || "Image upload failed. Please try again.");
                            } finally {
                              setUploadingTestimonialImage(false);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="modal-field">
                <label>Rating (1-5)</label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {testimonialForm.type === 'video' && (
                <>
                  <div className="modal-field">
                    <label>Video Link (YouTube, Vimeo, Social Media, etc.)</label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={testimonialForm.videoUrl && !testimonialForm.videoUrl.includes('cloudinary') ? testimonialForm.videoUrl : ""}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, videoUrl: e.target.value })}
                      disabled={!!(testimonialForm.videoUrl && testimonialForm.videoUrl.includes('cloudinary'))}
                    />
                  </div>
                  <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: '600', margin: '0' }}>OR UPLOAD A FILE</div>
                  <div className="modal-field">
                    <div className="image-upload-wrapper">
                    {testimonialForm.videoUrl ? (
                      <div className="image-preview-box" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500' }}>Video Uploaded</p>
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => setTestimonialForm({ ...testimonialForm, videoUrl: "" })}
                        >
                          <X size={14} /> Delete Video
                        </button>
                      </div>
                    ) : (
                      <label className="file-upload-dropzone">
                        <Upload size={24} className="upload-icon" />
                        <div className="upload-text">
                          <strong>{uploadingTestimonialVideo ? "Uploading Video..." : "Click or drag to upload video"}</strong>
                          <span>MP4, WebM up to 50MB</span>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          className="file-input-hidden"
                          disabled={uploadingTestimonialVideo}
                          onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;

                            if (file.size > 50 * 1024 * 1024) {
                              alert("Video is too large. Please upload a video under 50MB.");
                              e.target.value = "";
                              return;
                            }

                            setUploadingTestimonialVideo(true);
                            try {
                              const url = await uploadVideoFile(file);
                              setTestimonialForm((prev) => ({ ...prev, videoUrl: url }));
                            } catch (err) {
                              alert(err.message || "Video upload failed. Please try again.");
                            } finally {
                              setUploadingTestimonialVideo(false);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
                </>
              )}

              {testimonialForm.type === 'text' && (
                <div className="modal-field">
                  <label>Review Message</label>
                  <textarea
                    rows={4}
                    required={testimonialForm.type === 'text'}
                    placeholder="Client feedback message..."
                    value={testimonialForm.message}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                  />
                </div>
              )}

              <div className="modal-field">
                <label>Status</label>
                <select
                  value={testimonialForm.status}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, status: e.target.value })}
                >
                  <option value="Published">Published</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div className="modal-checkbox-field">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={testimonialForm.homepageDisplay}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, homepageDisplay: e.target.checked })}
                  />
                  <span>Display on website homepage</span>
                </label>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-secondary" onClick={() => setShowTestimonialModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-purple">
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT INQUIRY VIEW DETAIL MODAL */}
      {selectedInquiry && (
        <div className="modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div className="nexa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Inquiry Detail</h3>
              <button className="modal-close-btn" onClick={() => setSelectedInquiry(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="inquiry-detail-body">
              <div className="inquiry-header-info">
                <div className="inquiry-user-meta">
                  <div className="inquiry-avatar">
                    {selectedInquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="inquiry-user-text">
                    <strong>{selectedInquiry.name}</strong>
                    <span className="inquiry-email">{selectedInquiry.email}</span>
                  </div>
                </div>
                <div className="inquiry-received-badge">
                  {selectedInquiry.receivedOn}
                </div>
              </div>
              
              <div className="inquiry-meta-grid">
                <div className="meta-card">
                  <span className="meta-label">Subject</span>
                  <span className="meta-value">{selectedInquiry.subject}</span>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Phone</span>
                  <span className="meta-value">{selectedInquiry.phone}</span>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Status</span>
                  <select
                    className="status-select-inline"
                    value={selectedInquiry.status}
                    onChange={(e) => handleUpdateInquiryStatus(selectedInquiry._id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Handled">Handled</option>
                  </select>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Read Status</span>
                  <select
                    className="status-select-inline"
                    value={selectedInquiry.isRead ? "Read" : "Unread"}
                    onChange={(e) => handleMarkAsRead(selectedInquiry._id, e.target.value === "Read")}
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                  </select>
                </div>
              </div>

              {(() => {
                let org = null;
                let srv = null;
                let msg = selectedInquiry.message;

                if (msg && msg.startsWith("Organization:")) {
                  const orgMatch = msg.match(/Organization:\s*([^\n]*)/);
                  const srvMatch = msg.match(/Service Interested In:\s*([^\n]*)/);
                  const msgMatch = msg.match(/Message:\n([\s\S]*)$/);
                  
                  if (orgMatch) org = orgMatch[1];
                  if (srvMatch) srv = srvMatch[1];
                  if (msgMatch) msg = msgMatch[1];
                }

                return (
                  <div className="detail-message-box">
                    {org && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <span className="label">Organization</span>
                        <p>{org}</p>
                      </div>
                    )}
                    {srv && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <span className="label">Service</span>
                        <p>{srv}</p>
                      </div>
                    )}
                    <div>
                      <span className="label">Message</span>
                      <p>{msg}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="modal-actions-row">
              <button type="button" className="btn-secondary" onClick={() => setSelectedInquiry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`} style={{ position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', background: toast.type === 'error' ? '#ef4444' : '#6d28d9', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px', animation: 'slideDown 0.3s ease-out' }}>
          {toast.type === 'error' ? <X size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmDialog.show && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setConfirmDialog({ show: false, title: '', onConfirm: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} color="#6d28d9" />
            </div>
            <h3 style={{ marginBottom: '10px' }}>Confirm Deletion</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>{confirmDialog.title}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setConfirmDialog({ show: false, title: '', onConfirm: null })}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                setConfirmDialog({ show: false, title: '', onConfirm: null });
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}