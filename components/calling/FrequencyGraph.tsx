"use client";

import React, { useEffect, useRef } from 'react';

interface FrequencyGraphProps {
  isAnimated: boolean;
  className?: string;
}

export function FrequencyGraph({ isAnimated, className = "" }: FrequencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (isAnimated) {
        // Animated sine wave for active call
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const frequency = 0.02;
          const amplitude = 20 + Math.sin(timeRef.current * 0.5) * 10;
          const y = centerY + Math.sin(x * frequency + timeRef.current) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        timeRef.current += 0.1;
      } else {
        // Static line for idle/dialing
        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      if (isAnimated) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimated]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
