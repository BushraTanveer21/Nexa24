import React from 'react';
import { useLocation } from 'react-router-dom';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const location = useLocation();
  const isTestimonialPage = location.pathname === '/testimonial';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;
  // Replace with the actual phone number you want to use
  const phoneNumber = "1234567890"; 
  const message = encodeURIComponent("Hello NEXA24! I'm interested in your services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`whatsapp-float-btn ${isTestimonialPage ? 'whatsapp-tucked-right' : ''}`}
      aria-label="Chat with us on WhatsApp"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width="28" 
        height="28" 
        fill="white"
      >
        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.553 4.195 1.603 6.015L.17 23.364l5.474-1.435A12.016 12.016 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 21.984a9.962 9.962 0 0 1-5.088-1.39l-.365-.217-3.784.992.999-3.692-.238-.378A9.957 9.957 0 0 1 2.046 11.97 9.986 9.986 0 0 1 12.031 1.984a9.986 9.986 0 0 1 9.985 9.986 9.986 9.986 0 0 1-9.985 9.985zm5.47-7.464c-.3-.15-1.774-.876-2.049-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.41-1.488-.89-.794-1.492-1.773-1.667-2.073-.175-.3-.018-.462.132-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.626-.925-2.226-.242-.585-.487-.506-.674-.515-.175-.01-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.501s1.075 2.89 1.225 3.09c.15.2 2.108 3.218 5.107 4.512.715.309 1.272.493 1.706.63.716.227 1.368.195 1.882.118.577-.087 1.774-.726 2.024-1.426.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
