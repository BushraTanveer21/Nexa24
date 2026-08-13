import React, { useEffect, useState } from 'react';
import './FallingPetals.css';

export default function FallingPetals() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const totalPetals = isMobile ? 75 : 100;
    
    const newElements = Array.from({ length: totalPetals }).map((_, i) => {
      const type = Math.floor(Math.random() * 3);
      
      
      const segmentWidth = 100 / totalPetals;
      const left = (i * segmentWidth) + (Math.random() * segmentWidth);
      
      const animDuration = 10 + Math.random() * 15; 
      const animDelay = -Math.random() * 25; 
      
      
      const size = 8 + Math.random() * 8; 
      
      const swayDuration = 2 + Math.random() * 3; 
      const swayDelay = -Math.random() * 3;
      
      return {
        id: i,
        type,
        style: {
          left: `${left}%`,
          '--anim-dur': `${animDuration}s`,
          animationDelay: `${animDelay}s`,
          width: `${size}px`,
          height: `${size}px`,
        },
        innerStyle: {
          animationDuration: `${swayDuration}s`,
          animationDelay: `${swayDelay}s`,
        }
      };
    });
    setElements(newElements);
  }, []);
  
  return (
    <div 
      className="falling-petals-wrapper" 
      aria-hidden="true"
    >
      {elements.map((el) => {
        let SvgIcon = null;
        if (el.type === 0) {
          
          SvgIcon = (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', opacity: 0.9 }}>
              <g fill="#7E22CE">
                <circle cx="50" cy="25" r="20" />
                <circle cx="75" cy="45" r="20" />
                <circle cx="65" cy="75" r="20" />
                <circle cx="35" cy="75" r="20" />
                <circle cx="25" cy="45" r="20" />
              </g>
              <circle cx="50" cy="50" r="12" fill="#FDE047" />
            </svg>
          );
        } else if (el.type === 1) {
          
          SvgIcon = (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', opacity: 0.9 }}>
              <g fill="#9333EA">
                <circle cx="50" cy="25" r="20" />
                <circle cx="75" cy="45" r="20" />
                <circle cx="65" cy="75" r="20" />
                <circle cx="35" cy="75" r="20" />
                <circle cx="25" cy="45" r="20" />
              </g>
              <circle cx="50" cy="50" r="12" fill="#FDE047" />
            </svg>
          );
        } else {
          
          SvgIcon = (
            <svg viewBox="0 0 100 100" style={{ fill: '#A855F7', opacity: 0.8, width: '100%', height: '100%' }}>
              <path d="M10,90 C10,90 30,20 90,10 C90,10 70,80 10,90 Z" />
            </svg>
          );
        }

        return (
          <div key={el.id} className="falling-element" style={el.style}>
            <div className="falling-element-inner" style={el.innerStyle}>
              {SvgIcon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
