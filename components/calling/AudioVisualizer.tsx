"use client";

import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  audioStream?: MediaStream | null;
  className?: string;
}

export function AudioVisualizer({ isActive, audioStream, className = "" }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(0)); 
  const audioStreamRef = useRef<MediaStream | null>(null);
  const [hasAudioActivity, setHasAudioActivity] = useState(false);

  // Persist the audio stream in a ref to prevent it from being lost
  useEffect(() => {
    if (audioStream && audioStream !== audioStreamRef.current) {
      console.log('🎨 AudioVisualizer - New stream received:', audioStream.id);
      audioStreamRef.current = audioStream;
    }
  }, [audioStream]);

  // Initialize audio analysis when stream is available
  useEffect(() => {
    const streamToUse = audioStreamRef.current || audioStream;
    console.log('🎨 AudioVisualizer - isActive:', isActive, 'audioStream:', streamToUse);
    
    if (!streamToUse || !isActive) {
      // Clean up audio context
      if (audioContextRef.current) {
        console.log('🎨 Closing audio context');
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = new Uint8Array(0);
      setHasAudioActivity(false);
      return;
    }

    // Check if stream is still active
    const audioTracks = streamToUse.getAudioTracks();
    if (audioTracks.length === 0) {
      console.log('❌ AudioVisualizer - Stream has no audio tracks');
      return;
    }

    try {
      console.log('🎨 Initializing audio analyzer...');
      console.log('🎨 Audio stream ID:', streamToUse.id);
      console.log('🎨 Audio stream active:', streamToUse.active);
      console.log('🎨 Audio tracks:', audioTracks.length);
      
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      // Resume AudioContext if suspended (browser security requirement)
      if (audioContext.state === 'suspended') {
        console.log('🎤 Resuming suspended AudioContext...');
        audioContext.resume().then(() => {
          console.log('🎤 ✅ AudioContext resumed');
        }).catch(err => {
          console.error('❌ Failed to resume AudioContext:', err);
        });
      }
      
      // Configure analyser
      analyser.fftSize = 64; // Lower value = fewer bars, better performance
      analyser.smoothingTimeConstant = 0.8; // Smooth transitions
      
      // Connect audio stream to analyser
      const source = audioContext.createMediaStreamSource(streamToUse);
      source.connect(analyser);
      
      // Create data array for frequency data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      console.log('🎤 ✅ Audio analyzer initialized successfully');
      console.log('🎤 Buffer length:', bufferLength);
      console.log('🎤 AudioContext state:', audioContext.state);
    } catch (error) {
      console.error('❌ Failed to initialize audio analyzer:', error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream, isActive]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = 24; // Number of frequency bars
    const barWidth = width / barCount;
    const minBarHeight = 4; // Minimum height for idle bars
    const silenceThreshold = 10; // Threshold to detect audio activity

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (isActive && analyserRef.current && dataArrayRef.current.length > 0) {
        // Get frequency data
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Check if there's actual audio activity
        const averageVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        const hasActivity = averageVolume > silenceThreshold;
        setHasAudioActivity(hasActivity);

        // Draw frequency bars
        for (let i = 0; i < barCount; i++) {
          // Map bar index to frequency data index
          const dataIndex = Math.floor(i * dataArrayRef.current.length / barCount);
          const frequencyValue = dataArrayRef.current[dataIndex];
          
          // Calculate bar height based on frequency
          let barHeight = minBarHeight;
          if (hasActivity && frequencyValue > 0) {
            // Scale frequency value (0-255) to canvas height
            barHeight = (frequencyValue / 255) * (height * 0.8) + minBarHeight;
          }
          
          // Position bar at bottom
          const x = i * barWidth + barWidth * 0.1; // Add small gap
          const y = height - barHeight;
          const actualBarWidth = barWidth * 0.8; // 80% width for spacing
          
          // Color: cyan/blue gradient based on height
          const intensity = Math.min(frequencyValue / 128, 1);
          const color = hasActivity 
            ? `rgba(59, 130, 246, ${0.5 + intensity * 0.5})` // Blue with varying opacity
            : 'rgba(148, 163, 184, 0.5)'; // Gray for idle
          
          ctx.fillStyle = color;
          ctx.fillRect(x, y, actualBarWidth, barHeight);
        }
      } else {
        // Draw idle/static bars
        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth + barWidth * 0.1;
          const y = height - minBarHeight;
          const actualBarWidth = barWidth * 0.8;
          
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'; // Gray
          ctx.fillRect(x, y, actualBarWidth, minBarHeight);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

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
