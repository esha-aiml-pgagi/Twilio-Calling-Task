"use client";

import React from 'react';
import { useCall } from '@/contexts/CallContext';
import { CallCard } from './CallCard';

export function MiniPlayer() {
  const { callSession, isMiniPlayerVisible } = useCall();

  if (!isMiniPlayerVisible || !callSession) return null;

  return (
    <div className="fixed bottom-4 right-4 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <CallCard variant="mini" />
    </div>
  );
}
