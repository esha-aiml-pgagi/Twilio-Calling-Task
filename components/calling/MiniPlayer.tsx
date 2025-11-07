"use client";

import React, { useState, useEffect } from 'react';
import { useCall } from '@/contexts/CallContext';
import { CallCard } from './CallCard';

export function MiniPlayer() {
  const { callSession, isMiniPlayerVisible } = useCall();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isMiniPlayerVisible && callSession) {
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
  }, [isMiniPlayerVisible, callSession]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <CallCard variant="mini" />
    </div>
  );
}
