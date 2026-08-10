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
  EyeOff,
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
  Search,
  Video,
  Camera,
  User
} from "lucide-react";
import nexaLogo from "../assets/nexa24-logo.png";
import branchTL from "../assets/botanical-branch-tl.png";
import "./AdminDashboard.css";
import { ICON_OPTIONS, getIcon } from "../utils/iconMap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TestimonialOrderInput = ({ item, idx, onOrderChange }) => {
  const [val, setVal] = useState(item.order !== undefined ? item.order : idx);

  useEffect(() => {
    setVal(item.order !== undefined ? item.order : idx);
  }, [item.order, idx]);

  const handleCommit = () => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num !== item.order) {
      onOrderChange(item._id, num);
    } else {
      setVal(item.order !== undefined ? item.order : idx);
    }
  };

  return (
    <input
      type="number"
      min="0"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.target.blur();
        }
      }}
      style={{
        width: "55px",
        padding: "5px 8px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        textAlign: "center",
        fontSize: "13px"
      }}
    />
  );
};

// Auth token for admin-only writes (create/update/delete). Reads (GET) stay public.
const getAuthToken = () =>
  localStorage.getItem("nexa_token") || sessionStorage.getItem("nexa_token");

// Uploads a file to the backend, which forwards it to Cloudinary and
// returns a hosted image URL + the Cloudinary public_id. The public_id
// is required later to delete the image from Cloudinary (the URL alone
// isn't enough for that) — so we keep both instead of discarding it.
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
  // NOTE: this assumes /api/upload's response includes public_id alongside
  // url (the standard shape for a Cloudinary upload response). If your
  // upload route only returns { url }, add public_id to that response too —
  // otherwise this will always come back undefined and cleanup can't work.
  return { url: data.url, publicId: data.public_id || data.publicId || "" };
};

// Deletes an already-uploaded image straight from Cloudinary. Used by the
// "Clear Image" button so removing an image doesn't leave it orphaned on
// Cloudinary until (or unless) the form is saved.
const deleteImageFile = async (publicId) => {
  if (!publicId) return;
  const token = getAuthToken();
  try {
    await fetch(`${API_URL}/api/upload`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publicId }),
    });
  } catch (err) {
    console.warn("Cloudinary cleanup failed:", err.message);
  }
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
  const [services, setServices] = useState([]);

  // Starts empty — real data comes from the backend via fetchBackendData().
  const [testimonials, setTestimonials] = useState([]);

  // Starts empty — real data comes from the backend via fetchBackendData().
  const [contacts, setContacts] = useState([]);

  // Modals state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    order: 1,
    image: "",
    imagePublicId: "",
    icon: "",
    // Purple highlight line on the detail page (was hardcoded "Real Results.")
    subtitle: "",
    // Single benefit sentence shown under the description on the detail page
    // Benefit pills shown on the detail page — each has its own icon
    benefits: [],
  });

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
    type: "text",
    image: "",
    imagePublicId: "",
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const [uploadingTestimonialVideo, setUploadingTestimonialVideo] = useState(false);
  const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false);
  const [isDraggingTestimonialImage, setIsDraggingTestimonialImage] = useState(false);
  const [isDraggingTestimonialVideo, setIsDraggingTestimonialVideo] = useState(false);

  const [contactSearch, setContactSearch] = useState("");
  const [contactFilterStatus, setContactFilterStatus] = useState("all");

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', onConfirm: null });
  const [testimonialTab, setTestimonialTab] = useState("admin");

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [isServiceImageDragging, setIsServiceImageDragging] = useState(false);

  // Profile Settings state
  const [profileForm, setProfileForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
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
          const mappedT = dataT
            .sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0))
            .map((t, idx) => ({
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
              imagePublicId: t.imagePublicId || "",
              date: t.date || t.createdAt || "",
              createdAt: t.createdAt || "",
              order: idx,
              isClientSubmitted: t.isClientSubmitted || false
            }));
          setTestimonials(mappedT);
        }
      }

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
            imagePublicId: s.imagePublicId || "",
            isActive: s.isActive !== false,
            icon: s.icon || "",
            subtitle: s.subtitle || "",
            benefits: Array.isArray(s.benefits) ? s.benefits : [],
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
    setServiceForm({
      name: "",
      description: "",
      order: services.length + 1,
      image: "",
      imagePublicId: "",
      icon: "",
      subtitle: "",
      benefits: [],
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      order: service.order,
      image: service.image || "",
      imagePublicId: service.imagePublicId || "",
      icon: service.icon || "",
      subtitle: service.subtitle || "",
      benefits: Array.isArray(service.benefits) ? service.benefits : [],
    });
    setShowServiceModal(true);
  };

  const handleAddBenefit = () => {
    setServiceForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { label: "", icon: "check", description: "" }],
    }));
  };

  const handleUpdateBenefit = (index, field, value) => {
    setServiceForm((prev) => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    }));
  };

  const handleRemoveBenefit = (index) => {
    setServiceForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    const payload = {
      title: serviceForm.name,
      description: serviceForm.description,
      order: Number(serviceForm.order) || services.length + 1,
      image: serviceForm.image,
      imagePublicId: serviceForm.imagePublicId,
      isActive: true,
      icon: serviceForm.icon,
      subtitle: serviceForm.subtitle,
      // Drop any empty benefit rows before saving
      benefits: serviceForm.benefits.filter((b) => b.label && b.label.trim()),
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

      // A save can silently bump another service's order (swap logic on
      // the backend), so refetch the full list instead of just patching
      // this one entry — otherwise the other service's card would show
      // a stale order until the page is reloaded.
      await fetchBackendData();
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
      // The backend may have swapped another service's order to make
      // room for this one — refetch so that swap shows up immediately
      // instead of only after a page reload.
      await fetchBackendData();
    } catch (err) {
      console.warn("Order update failed to persist:", err.message);
    }
  };

  const processAdminTestimonialImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPG, PNG, WebP).", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image is too large. Maximum size limit is 5MB.", "error");
      return;
    }
    setUploadingTestimonialImage(true);
    try {
      const url = await uploadImageFile(file);
      setTestimonialForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      showToast(err.message || "Image upload failed. Please try again.", "error");
    } finally {
      setUploadingTestimonialImage(false);
    }
  };

  const processAdminTestimonialVideo = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      showToast("Please select a valid video file (MP4, WebM, MOV).", "error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast("Video is too large. Maximum size limit is 50MB.", "error");
      return;
    }
    setUploadingTestimonialVideo(true);
    try {
      const url = await uploadVideoFile(file);
      setTestimonialForm((prev) => ({ ...prev, videoUrl: url }));
    } catch (err) {
      showToast(err.message || "Video upload failed. Please try again.", "error");
    } finally {
      setUploadingTestimonialVideo(false);
    }
  };

  // Testimonial handlers
  const handleOpenAddTestimonial = (type = 'text') => {
    setEditingTestimonial(null);
    setTestimonialForm({
      clientName: "",
      designation: "",
      status: "Published",
      homepageDisplay: true,
      message: "",
      email: "",
      videoUrl: "",
      image: "",
      imagePublicId: "",
      rating: 5,
      type,
      order: testimonials.length
    });
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
      imagePublicId: t.imagePublicId || "",
      rating: t.rating || 5,
      type: t.videoUrl ? "video" : "text",
      order: t.order !== undefined ? t.order : 0
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
      showToast("Please enter a review message.", "error");
      return;
    }

    if (testimonialForm.type === 'video' && testimonialForm.videoUrl) {
      const trimmed = testimonialForm.videoUrl.trim();
      if (!/^(https?:\/\/|\/|blob:)/i.test(trimmed)) {
        showToast("Please enter a valid video link (e.g. https://www.youtube.com/...) or upload a video file!", "error");
        return;
      }
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
      imagePublicId: testimonialForm.imagePublicId,
      rating: Number(testimonialForm.rating),
      order: testimonialForm.order !== undefined ? Number(testimonialForm.order) : testimonials.length,
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
        imagePublicId: saved.imagePublicId || "",
        date: saved.date || saved.createdAt || new Date().toISOString(),
        createdAt: saved.createdAt || new Date().toISOString(),
        order: saved.order !== undefined ? saved.order : testimonials.length,
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

    setTestimonials(testimonials.map(t => t._id === id ? {
      ...t,
      homepageDisplay: nextValue,
      status: nextValue ? "Published" : "Disabled"
    } : t));

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

  const handleTestimonialOrderChange = async (id, newOrderInput) => {
    const requestedOrder = Math.max(0, parseInt(newOrderInput, 10) || 0);

    // Instant local state update so changes reflect live without page refresh!
    const currentList = [...testimonials].sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));
    const targetIndex = currentList.findIndex(t => t._id === id);
    if (targetIndex !== -1) {
      const [targetItem] = currentList.splice(targetIndex, 1);
      const insertAt = Math.min(requestedOrder, currentList.length);
      currentList.splice(insertAt, 0, targetItem);

      const optimisticList = currentList.map((t, idx) => ({ ...t, order: idx }));
      setTestimonials(optimisticList);
    }

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/testimonials/admin/${id}/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: requestedOrder }),
      });

      if (res.ok) {
        const freshData = await res.json();
        if (Array.isArray(freshData)) {
          const freshMapped = freshData.map((t, idx) => ({
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
            date: t.date || t.createdAt || "",
            createdAt: t.createdAt || "",
            order: t.order !== undefined ? t.order : idx,
            isClientSubmitted: t.isClientSubmitted || false
          }));
          setTestimonials(freshMapped);
        }
      }
    } catch (err) {
      console.warn("Testimonial order update failed to persist:", err.message);
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

  // Profile Settings handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });

    if (!profileForm.currentPassword) {
      setProfileMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileMessage({ type: "error", text: "New password and confirmation don't match." });
      return;
    }

    const payload = { currentPassword: profileForm.currentPassword };
    if (profileForm.newEmail.trim()) payload.newEmail = profileForm.newEmail.trim();
    if (profileForm.newPassword) payload.newPassword = profileForm.newPassword;

    if (!payload.newEmail && !payload.newPassword) {
      setProfileMessage({ type: "error", text: "Enter a new email or password to update." });
      return;
    }

    setSavingProfile(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Keep the token/user in whichever storage was already being used
      const storage = localStorage.getItem("nexa_token") ? localStorage : sessionStorage;
      storage.setItem("nexa_token", data.token);
      storage.setItem("nexa_user", JSON.stringify(data));

      setUser(data);
      setProfileForm({ currentPassword: "", newEmail: "", newPassword: "", confirmPassword: "" });
      setProfileMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMessage({ type: "error", text: err.message || "Could not update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const publishedCount = testimonials.filter(t => t.status === "Published").length;
  const disabledCount = testimonials.filter(t => t.status === "Disabled").length;

  return (
    <div className="nexa-dashboard-page">
      <img src={branchTL} alt="Botanical Branch Top Left" className="botanical-branch branch-top-left" />
      <img src={branchTL} alt="Botanical Branch Bottom Right" className="botanical-branch branch-bottom-right" />

      {sidebarOpen && (
        <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside className={`nexa-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>

        <button
          className="sidebar-collapse-toggle"
          onClick={toggleSidebarCollapse}
          aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="sidebar-brand">
          <img src={nexaLogo} alt="NEXA24 Healthcare Logo" className="sidebar-brand-logo" />
          <div className="sidebar-brand-text">
            <strong className="sidebar-brand-name">NEXA24</strong>
            <span className="sidebar-brand-sub">HEALTHCARE</span>
          </div>
        </div>

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

          <button
            className={`nav-item ${activeNav === "profile" ? "active" : ""}`}
            onClick={() => handleNavClick("profile")}
            title="Profile Settings"
          >
            <User size={18} className="nav-icon" />
            <span>Profile Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-security-badge">
            <ShieldCheck size={16} className="badge-shield-icon" />
            <span>Protected with secure authentication.</span>
          </div>
          <p className="sidebar-copyright">© 2025 NEXA24 HEALTHCARE</p>
        </div>
      </aside>

      <main className="nexa-main-content">
        <div className="dash-mobile-bar">
          <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Navigation Drawer">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="mobile-brand-title">
            <img src={nexaLogo} alt="NEXA24 Logo" className="mobile-logo-small" />
            <span>NEXA24 HEALTHCARE</span>
          </div>
        </div>

        <header className="dash-top-header">
          <div className="header-titles">
            <h1 className="dash-heading">Dashboard Overview</h1>
            <p className="dash-subheading">Welcome back, {user?.name || "Admin"}</p>
          </div>

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
                <button
                  className="dropdown-btn-logout"
                  style={{ background: "#f3e8ff", color: "#7c3aed", marginBottom: "0.4rem" }}
                  onClick={() => { setUserMenuOpen(false); handleNavClick("profile"); }}
                >
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                <button className="dropdown-btn-logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {activeNav === "dashboard" && (
          <>
            <section className="stats-row">
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

            <div className="dash-welcome-banner">
              <h2>Welcome to the NEXA24 Control Center</h2>
              <p>Select a category from the sidebar to manage your services, client testimonials, and contact inquiries.</p>
            </div>
          </>
        )}

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
                      <td className="col-description">
                        <span className="col-description-text" title={s.description}>{s.description}</span>
                      </td>
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
                    <th>Date</th>
                    <th style={{ textAlign: "center", width: "70px" }}>Order</th>
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
                      <td style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {t.date || t.createdAt ? new Date(t.date || t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <TestimonialOrderInput item={t} idx={idx} onOrderChange={handleTestimonialOrderChange} />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="quote-icon-cell">
                          <Quote size={15} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {t.homepageDisplay ? (
                          <span
                            className="status-pill published"
                            onClick={() => handleToggleHomepageDisplay(t._id)}
                            style={{ cursor: 'pointer' }}
                            title="Click to Disable"
                          >
                            Published
                          </span>
                        ) : (
                          <span
                            className="status-pill disabled"
                            onClick={() => handleToggleHomepageDisplay(t._id)}
                            style={{ cursor: 'pointer' }}
                            title="Click to Publish"
                          >
                            Disabled
                          </span>
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

        {activeNav === "contacts" && (
          <section className="dash-section-card animate-fade-in">
            <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Contact Form Inquiries</h2>

              {/* Search & Filter Controls */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginLeft: 'auto' }}>
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '36px',
                      paddingRight: contactSearch ? '30px' : '12px',
                      paddingTop: '7px',
                      paddingBottom: '7px',
                      borderRadius: '20px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  {contactSearch && (
                    <button
                      onClick={() => setContactSearch("")}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <select
                  value={contactFilterStatus}
                  onChange={(e) => setContactFilterStatus(e.target.value)}
                  style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', color: '#334155', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="all">All Inquiries ({contacts.length})</option>
                  <option value="New">New ({contacts.filter(c => c.status === 'New').length})</option>
                  <option value="Handled">Handled / Done</option>
                  <option value="unread">Unread ({contacts.filter(c => !c.isRead).length})</option>
                  <option value="read">Read</option>
                </select>
              </div>
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
                  {contacts.filter((c) => {
                    if (contactFilterStatus === "New" && c.status !== "New") return false;
                    if (contactFilterStatus === "Handled" && c.status !== "Handled" && c.status !== "Done") return false;
                    if (contactFilterStatus === "unread" && c.isRead) return false;
                    if (contactFilterStatus === "read" && !c.isRead) return false;

                    if (contactSearch.trim()) {
                      const q = contactSearch.toLowerCase().trim();
                      const name = (c.name || '').toLowerCase();
                      const email = (c.email || '').toLowerCase();
                      const phone = (c.phone || '').toLowerCase();
                      const org = (c.organization || '').toLowerCase();
                      const service = (c.service || '').toLowerCase();
                      const subject = (c.subject || '').toLowerCase();
                      const message = (c.message || '').toLowerCase();
                      return name.includes(q) || email.includes(q) || phone.includes(q) || org.includes(q) || service.includes(q) || subject.includes(q) || message.includes(q);
                    }
                    return true;
                  }).map((c, idx) => (
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
                        {(c.status === "Handled" || c.status === "Done") && (
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
                  {contacts.filter((c) => {
                    if (contactFilterStatus === "New" && c.status !== "New") return false;
                    if (contactFilterStatus === "Handled" && c.status !== "Handled" && c.status !== "Done") return false;
                    if (contactFilterStatus === "unread" && c.isRead) return false;
                    if (contactFilterStatus === "read" && !c.isRead) return false;

                    if (contactSearch.trim()) {
                      const q = contactSearch.toLowerCase().trim();
                      const name = (c.name || '').toLowerCase();
                      const email = (c.email || '').toLowerCase();
                      const phone = (c.phone || '').toLowerCase();
                      const org = (c.organization || '').toLowerCase();
                      const service = (c.service || '').toLowerCase();
                      const subject = (c.subject || '').toLowerCase();
                      const message = (c.message || '').toLowerCase();
                      return name.includes(q) || email.includes(q) || phone.includes(q) || org.includes(q) || service.includes(q) || subject.includes(q) || message.includes(q);
                    }
                    return true;
                  }).length === 0 && (
                      <tr>
                        <td colSpan="8" className="empty-row">
                          {contactSearch || contactFilterStatus !== "all" ? "No inquiries match your search or filter." : "No contact inquiries found."}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeNav === "profile" && (
          <section className="dash-section-card animate-fade-in profile-settings-section">
            <div className="section-card-header">
              <h2 className="section-title">Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-settings-form" autoComplete="off">
              <div className="profile-field">
                <label>Current Email</label>
                <input type="text" name="nexa_current_email" value={user?.email || ""} autoComplete="off" disabled />
              </div>

              <div className="profile-field">
                <label>Current Password <span className="field-optional">(required to confirm changes)</span></label>
                <div className="password-field-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="nexa_current_password_confirm"
                    required
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="password-toggle-icon-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="profile-form-divider">
                <span>Update Details</span>
              </div>

              <div className="profile-field">
                <label>New Email <span className="field-optional"></span></label>
                <input
                  type="email"
                  name="nexa_new_email"
                  placeholder="Leave blank to keep current email"
                  value={profileForm.newEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, newEmail: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="profile-field">
                <label>New Password <span className="field-optional"></span></label>
                <div className="password-field-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="nexa_new_password"
                    placeholder="Leave blank to keep current password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-icon-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label>Confirm New Password</label>
                <div className="password-field-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="nexa_confirm_new_password"
                    placeholder="Repeat new password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-icon-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {profileMessage.text && (
                <p className={`profile-form-message ${profileMessage.type === "error" ? "error" : "success"}`}>
                  {profileMessage.text}
                </p>
              )}

              <div className="modal-actions-row profile-form-actions">
                <button type="submit" className="btn-primary-purple" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

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
                        disabled={uploadingServiceImage}
                        onClick={async () => {
                          const publicIdToRemove = serviceForm.imagePublicId;
                          setServiceForm({ ...serviceForm, image: "", imagePublicId: "" });
                          // Delete from Cloudinary right away instead of waiting
                          // for the form to be saved, so it never sits around
                          // as an orphaned upload.
                          await deleteImageFile(publicIdToRemove);
                        }}
                      >
                        <X size={14} /> Clear Image
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`file-upload-dropzone${isServiceImageDragging ? " dropzone-active" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsServiceImageDragging(true);
                      }}
                      onDragLeave={() => setIsServiceImageDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsServiceImageDragging(false);
                        const file = e.dataTransfer.files && e.dataTransfer.files[0];
                        if (!file) return;
                        if (!file.type.startsWith("image/")) {
                          alert("Only image files are allowed.");
                          return;
                        }
                        setUploadingServiceImage(true);
                        try {
                          const { url, publicId } = await uploadImageFile(file);
                          setServiceForm((prev) => ({ ...prev, image: url, imagePublicId: publicId }));
                        } catch (err) {
                          alert(err.message || "Image upload failed. Please try again.");
                        } finally {
                          setUploadingServiceImage(false);
                        }
                      }}
                    >
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
                            const { url, publicId } = await uploadImageFile(file);
                            setServiceForm((prev) => ({ ...prev, image: url, imagePublicId: publicId }));
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

              <div className="modal-field">
                <label>Service Icon</label>
                <select
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                >
                  <option value="">Auto-detect from name</option>
                  {ICON_OPTIONS.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <span className="field-hint">
                  Shown on the service card and detail page. Leave on auto-detect and
                  we'll guess a sensible icon from the service name.
                </span>
              </div>

              <div className="modal-field">
                <label>Detail Page Highlight Line</label>
                <input
                  type="text"
                  placeholder='e.g. "Real Results." — shown in purple next to the title'
                  value={serviceForm.subtitle}
                  onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Detail Page Benefit Pills</label>
                <span className="field-hint">
                  Each benefit shows up in two places on the service detail page: as a pill
                  under the title, and as a full card further down (in "What Our ... Handle").
                  Add a short detail sentence so the card below isn't empty.
                </span>
                <div className="benefits-repeater">
                  {serviceForm.benefits.map((benefit, idx) => {
                    const BenefitIcon = getIcon(benefit.icon);
                    return (
                      <div className="benefit-row-card" key={idx}>
                        <div className="benefit-row">
                          <span className="benefit-row-icon"><BenefitIcon size={16} /></span>
                          <input
                            type="text"
                            placeholder="e.g. HIPAA Compliant"
                            value={benefit.label}
                            onChange={(e) => handleUpdateBenefit(idx, "label", e.target.value)}
                          />
                          <select
                            value={benefit.icon || "check"}
                            onChange={(e) => handleUpdateBenefit(idx, "icon", e.target.value)}
                          >
                            {ICON_OPTIONS.map(({ key, label }) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="benefit-row-remove"
                            onClick={() => handleRemoveBenefit(idx)}
                            aria-label="Remove benefit"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <textarea
                          className="benefit-row-desc"
                          placeholder="Detail shown on the card below (optional) — e.g. Your data security is our priority."
                          rows={2}
                          value={benefit.description || ""}
                          onChange={(e) => handleUpdateBenefit(idx, "description", e.target.value)}
                        />
                      </div>
                    );
                  })}
                  <button type="button" className="btn-secondary btn-add-benefit" onClick={handleAddBenefit}>
                    <Plus size={14} /> Add Benefit
                  </button>
                </div>
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

              <div className="modal-field">
                <label>Client Photo</label>
                <div className="image-upload-wrapper">
                  {testimonialForm.image ? (
                    <div className="image-preview-box">
                      <img src={testimonialForm.image} alt="Client Preview" className="service-img-preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => setTestimonialForm({ ...testimonialForm, image: "", imagePublicId: "" })}
                      >
                        <X size={14} /> Clear Image
                      </button>
                    </div>
                  ) : (
                    <label className="file-upload-dropzone">
                      <Upload size={22} className="upload-icon" />
                      <div className="upload-text">
                        <strong>{uploadingTestimonialImage ? "Uploading..." : "Click or drag to upload photo"}</strong>
                        <span>PNG, JPG, WEBP up to 5MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="file-input-hidden"
                        disabled={uploadingTestimonialImage}
                        onChange={async (e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          setUploadingTestimonialImage(true);
                          try {
                            const { url, publicId } = await uploadImageFile(file);
                            setTestimonialForm((prev) => ({ ...prev, image: url, imagePublicId: publicId }));
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
                      <label
                        className={`file-upload-dropzone ${isDraggingTestimonialImage ? 'dragging' : ''}`}
                        style={{ minHeight: '100px', padding: '1rem', borderColor: isDraggingTestimonialImage ? '#7c3aed' : undefined, backgroundColor: isDraggingTestimonialImage ? '#f3e8ff' : undefined }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTestimonialImage(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTestimonialImage(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingTestimonialImage(false);
                          const file = e.dataTransfer.files && e.dataTransfer.files[0];
                          if (file) processAdminTestimonialImage(file);
                        }}
                      >
                        <Upload size={20} className="upload-icon" />
                        <div className="upload-text">
                          <strong>{uploadingTestimonialImage ? "Uploading..." : isDraggingTestimonialImage ? "Drop photo here!" : "Click or drag to upload image"}</strong>
                          <span style={{ fontSize: '11px' }}>JPG, PNG up to 5MB</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input-hidden"
                          disabled={uploadingTestimonialImage}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) processAdminTestimonialImage(file);
                            e.target.value = "";
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
                        <label
                          className={`file-upload-dropzone ${isDraggingTestimonialVideo ? 'dragging' : ''}`}
                          style={{ borderColor: isDraggingTestimonialVideo ? '#7c3aed' : undefined, backgroundColor: isDraggingTestimonialVideo ? '#f3e8ff' : undefined }}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTestimonialVideo(true); }}
                          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTestimonialVideo(false); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDraggingTestimonialVideo(false);
                            const file = e.dataTransfer.files && e.dataTransfer.files[0];
                            if (file) processAdminTestimonialVideo(file);
                          }}
                        >
                          <Upload size={24} className="upload-icon" />
                          <div className="upload-text">
                            <strong>{uploadingTestimonialVideo ? "Uploading Video..." : isDraggingTestimonialVideo ? "Drop video here!" : "Click or drag to upload video"}</strong>
                            <span>MP4, WebM up to 50MB</span>
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            className="file-input-hidden"
                            disabled={uploadingTestimonialVideo}
                            onChange={(e) => {
                              const file = e.target.files && e.target.files[0];
                              if (file) processAdminTestimonialVideo(file);
                              e.target.value = "";
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
                <label>Display Order Position</label>
                <input
                  type="number"
                  min="0"
                  value={testimonialForm.order !== undefined ? testimonialForm.order : 0}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, order: Number(e.target.value) })}
                />
              </div>

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