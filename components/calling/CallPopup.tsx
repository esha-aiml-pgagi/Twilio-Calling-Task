"use client";

import React, { useEffect, useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { useCall } from '@/contexts/CallContext';
import { CallCard } from './CallCard';

export const CallPopup = memo(function CallPopup() {
  const { callSession, isPopupOpen, closeCallPopup } = useCall();
  const [mounted, setMounted] = useState(false);

  // Track mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isPopupOpen || !callSession || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200"
        onClick={closeCallPopup}
      />

      {/* Popup Modal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <CallCard variant="popup" />
        </div>
      </div>
    </div>,
    document.body
  );
});
