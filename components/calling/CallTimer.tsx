"use client";

import React, { useEffect, useState } from 'react';

interface CallTimerProps {
  startTime: number | null;
  className?: string;
}

export function CallTimer({ startTime, className = "" }: CallTimerProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setDuration(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-lg font-mono font-semibold ${className}`}>
      {formatTime(duration)}
    </div>
  );
}
