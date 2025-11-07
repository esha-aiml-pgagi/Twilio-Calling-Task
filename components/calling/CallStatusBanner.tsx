"use client";

import React from 'react';
import { CallState } from '@/lib/types';

interface CallStatusBannerProps {
  state: CallState;
  isRecording?: boolean;
  className?: string;
}

export function CallStatusBanner({ state, isRecording = false, className = "" }: CallStatusBannerProps) {
  if (state !== 'connecting' && state !== 'ringing' && !isRecording) {
    return null;
  }

  const getBannerContent = () => {
    if (isRecording) {
      return {
        text: 'Recording',
        dotClass: 'bg-red-500 animate-pulse',
      };
    }
    
    switch (state) {
      case 'connecting':
      case 'ringing':
        return {
          text: 'Calling...',
          dotClass: 'bg-red-500',
        };
      default:
        return null;
    }
  };

  const content = getBannerContent();
  if (!content) return null;

  return (
    <div className={`flex items-center gap-2 justify-center px-4 py-2 bg-red-50 rounded-lg ${className}`}>
      <div className={`w-2 h-2 rounded-full ${content.dotClass}`} />
      <span className="text-sm font-medium text-red-700">{content.text}</span>
    </div>
  );
}
