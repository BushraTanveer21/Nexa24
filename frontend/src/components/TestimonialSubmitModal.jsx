import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import '../pages/TestimonialPage.css'; // Reusing some CSS for the modal

export default function TestimonialSubmitModal({ onClose }) {
  const [formState, setFormState] = useState({
    type: 'text',
    clientName: '',
    designation: '',
    email: '',
    rating: 5,
    message: '',
    videoUrl: '',
    image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const processImageFile = async (file) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large. Maximum size limit is 5MB.");
      return;
    }
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_URL}/api/upload/public/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Image upload failed");
      }
      const data = await res.json();
      setFormState((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const processVideoFile = async (file) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, WebM, MOV).");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("Video is too large. Maximum size limit is 50MB.");
      return;
    }
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", file);
    try {
      const res = await fetch(`${API_URL}/api/upload/public/video`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Video upload failed");
      }
      const data = await res.json();
      setFormState((prev) => ({ ...prev, videoUrl: data.url }));
    } catch (err) {
      setError(err.message || "Failed to upload video. Please try again.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formState.clientName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (formState.type === 'text' && !formState.message.trim()) {
      setError("Please enter a review message.");
      return;
    }
    if (formState.type === 'video') {
      if (!formState.videoUrl) {
        setError("Please upload a video file or paste a video URL.");
        return;
      }
      const trimmed = formState.videoUrl.trim();
      if (!/^(https?:\/\/|\/|blob:)/i.test(trimmed)) {
        setError("Please enter a valid video link (e.g. https://www.youtube.com/...) or upload a video file!");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formState.clientName,
        position: formState.designation,
        email: formState.email,
        rating: Number(formState.rating),
        message: formState.message,
        videoUrl: formState.videoUrl,
        image: formState.image
      };

      const res = await fetch(`${API_URL}/api/testimonials/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit testimonial");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '500px', overflow: 'hidden' }}>
          <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ marginBottom: '10px' }}>Thank You!</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Your testimonial has been successfully submitted and is pending review.</p>
          <button className="btn-primary-purple" onClick={onClose} style={{ alignSelf: 'center', minWidth: '120px', justifyContent: 'center' }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>Share Your Experience</h3>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        {error && <div className="alert-box error" style={{ margin: '16px 24px 0', padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Testimonial Type</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className={`btn-primary-purple ${formState.type === 'text' ? '' : 'btn-outline'}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed',
                  background: formState.type === 'text' ? '#7c3aed' : 'transparent',
                  color: formState.type === 'text' ? 'white' : '#7c3aed',
                  cursor: 'pointer'
                }}
                onClick={() => setFormState({ ...formState, type: 'text' })}
              >
                Text Review
              </button>
              <button 
                type="button" 
                className={`btn-primary-purple ${formState.type === 'video' ? '' : 'btn-outline'}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #7c3aed',
                  background: formState.type === 'video' ? '#7c3aed' : 'transparent',
                  color: formState.type === 'video' ? 'white' : '#7c3aed',
                  cursor: 'pointer'
                }}
                onClick={() => setFormState({ ...formState, type: 'video' })}
              >
                Video Review
              </button>
            </div>
          </div>

          <div className="modal-field">
            <label>Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Sarah Johnson"
              value={formState.clientName}
              onChange={e => setFormState({ ...formState, clientName: e.target.value })}
            />
          </div>

          <div className="modal-field">
            <label>Designation / Practice</label>
            <input
              type="text"
              placeholder="e.g. Family Medicine Practice"
              value={formState.designation}
              onChange={e => setFormState({ ...formState, designation: e.target.value })}
            />
          </div>

          <div className="modal-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={e => setFormState({ ...formState, email: e.target.value })}
            />
          </div>

          {formState.type === 'text' && (
            <div className="modal-field">
              <label>Your Photo (Optional)</label>
              <div className="image-upload-wrapper">
                {formState.image ? (
                  <div className="image-preview-box">
                    <img src={formState.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                    <button type="button" className="btn-remove-image" onClick={() => setFormState({ ...formState, image: "" })}>
                      <X size={14} /> Clear
                    </button>
                  </div>
                ) : (
                  <label 
                    className={`file-upload-dropzone ${isDraggingImage ? 'dragging' : ''}`} 
                    style={{ minHeight: '80px', padding: '1rem', borderColor: isDraggingImage ? '#7c3aed' : undefined, backgroundColor: isDraggingImage ? '#f3e8ff' : undefined }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingImage(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingImage(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingImage(false);
                      const file = e.dataTransfer.files && e.dataTransfer.files[0];
                      if (file) processImageFile(file);
                    }}
                  >
                    <Upload size={16} className="upload-icon" />
                    <div className="upload-text">
                      <strong>{uploadingImage ? "Uploading..." : isDraggingImage ? "Drop photo here!" : "Click or drag to upload photo"}</strong>
                      <span style={{ fontSize: '11px' }}>JPG, PNG up to 5MB</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="file-input-hidden" 
                      disabled={uploadingImage} 
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) processImageFile(file);
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
            <div 
              className={`custom-dropdown-container ${ratingDropdownOpen ? 'open' : ''}`}
              onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
              onBlur={() => setTimeout(() => setRatingDropdownOpen(false), 150)}
              tabIndex="0"
            >
              <div className="custom-dropdown-selected" style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid #cbd5e1' }}>
                {formState.rating} {String(formState.rating) === '1' ? 'Star' : 'Stars'}
                <svg className={`select-icon ${ratingDropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ right: '14px' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {ratingDropdownOpen && (
                <ul className="custom-dropdown-list" style={{ top: 'calc(100% + 4px)', padding: '6px', borderRadius: '8px', zIndex: 10 }}>
                  {[5, 4, 3, 2, 1].map((val) => (
                    <li 
                      key={val} 
                      className={`custom-dropdown-item ${String(formState.rating) === String(val) ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormState({ ...formState, rating: String(val) });
                        setRatingDropdownOpen(false);
                      }}
                      style={{ padding: '8px 12px', borderRadius: '6px' }}
                    >
                      {val} {val === 1 ? 'Star' : 'Stars'}
                      {String(formState.rating) === String(val) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-mark" style={{ right: '12px' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {formState.type === 'text' && (
            <div className="modal-field">
              <label>Your Review *</label>
              <textarea
                rows={4}
                required={formState.type === 'text'}
                placeholder="Share your experience with us..."
                value={formState.message}
                onChange={e => setFormState({ ...formState, message: e.target.value })}
              />
            </div>
          )}

          {formState.type === 'video' && (
            <>
              <div className="modal-field">
                <label>Video Link (YouTube, Vimeo, Social Media, etc.) *</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={formState.videoUrl && !formState.videoUrl.includes('cloudinary') ? formState.videoUrl : ""}
                  onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                  disabled={!!(formState.videoUrl && formState.videoUrl.includes('cloudinary'))}
                />
              </div>
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: '600', margin: '0' }}>OR UPLOAD A FILE</div>
              <div className="modal-field">
                <div className="image-upload-wrapper">
                {formState.videoUrl ? (
                  <div className="image-preview-box" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '500' }}>Video Ready</p>
                    <button type="button" className="btn-remove-image" onClick={() => setFormState({ ...formState, videoUrl: "" })}>
                      <X size={14} /> Remove Video
                    </button>
                  </div>
                ) : (
                  <label 
                    className={`file-upload-dropzone ${isDraggingVideo ? 'dragging' : ''}`}
                    style={{ borderColor: isDraggingVideo ? '#7c3aed' : undefined, backgroundColor: isDraggingVideo ? '#f3e8ff' : undefined }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingVideo(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingVideo(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingVideo(false);
                      const file = e.dataTransfer.files && e.dataTransfer.files[0];
                      if (file) processVideoFile(file);
                    }}
                  >
                    <Upload size={24} className="upload-icon" />
                    <div className="upload-text">
                      <strong>{uploadingVideo ? "Uploading Video..." : isDraggingVideo ? "Drop video here!" : "Click or drag to upload video"}</strong>
                      <span>MP4, WebM up to 50MB</span>
                    </div>
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="file-input-hidden" 
                      disabled={uploadingVideo} 
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) processVideoFile(file);
                        e.target.value = "";
                      }} 
                    />
                  </label>
                )}
              </div>
            </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting || uploadingImage || uploadingVideo}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting || uploadingImage || uploadingVideo || (formState.type === 'video' && !formState.videoUrl)}>
              {submitting ? "Submitting..." : "Submit Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
