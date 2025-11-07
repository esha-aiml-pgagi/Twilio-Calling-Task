"use client";

import React, { useEffect, useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { useCall } from '@/contexts/CallContext';
import { CallCard } from './CallCard';

export const CallPopup = memo(function CallPopup() {
  const { callSession, isPopupOpen, closeCallPopup } = useCall();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPopupOpen && callSession && mounted) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen, callSession, mounted]);

  if (!shouldRender || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCallPopup}
      />

      {/* Popup Modal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="pointer-events-auto transition-all duration-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50vh)',
          }}
        >
          <CallCard variant="popup" />
        </div>
      </div>
    </div>,
    document.body
  );
});
