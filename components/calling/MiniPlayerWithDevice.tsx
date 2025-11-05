"use client";

import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { useCall } from '@/contexts/CallContext';
import { useDraggable } from '@/hooks/use-draggable';
import { AudioVisualizer } from './AudioVisualizer';
import { CallTimer } from './CallTimer';
import { CallStatusBanner } from './CallStatusBanner';
import { Button } from '@/components/ui/button';

export function MiniPlayerWithDevice() {
  const {
    callSession,
    isMiniPlayerVisible,
    reopenPopup,
    startCall,
    closeMiniPlayer,
    setHangUpFunction,
    currentCorner,
    setCurrentCorner,
    setIsDragging: setContextIsDragging,
    isRecording,
    // Get Twilio properties from context instead of hook
    makeCall,
    twilioHangUp,
    isInitialized,
    audioStream,
  } = useCall();

  const { elementRef, position, isDragging, handleMouseDown } = useDraggable({
    initialCorner: currentCorner,
    onCornerChange: setCurrentCorner,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Sync dragging state to context
  useEffect(() => {
    setContextIsDragging(isDragging);
  }, [isDragging, setContextIsDragging]);

  // Register the hangUp function globally
  useEffect(() => {
    setHangUpFunction(twilioHangUp);
    return () => setHangUpFunction(null);
  }, [twilioHangUp, setHangUpFunction]);

  // Handle slide-in animation based on corner
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
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isMiniPlayerVisible, callSession]);

  if (!shouldRender || !callSession) return null;

  const { phoneNumber, state, startTime } = callSession;

  const handleCall = async () => {
    startCall();
    await makeCall(phoneNumber);
  };

  const handleHangUp = () => {
    twilioHangUp();
  };

  const handleClose = () => {
    closeMiniPlayer();
  };

  const isCallActive = state === 'in-progress' || isRecording;
  const isDialing = state === 'connecting' || state === 'ringing';
  const isIdle = state === 'idle';
  const isVisualizerActive = isCallActive; // Visualizer only active when call is in progress

  // Determine if we should use bottom positioning (for bottom corners)
  const isBottomCorner = currentCorner === 'bottom-right' || currentCorner === 'bottom-left';

  // Get slide direction based on corner
  const getSlideTransform = () => {
    if (!isVisible) {
      switch (currentCorner) {
        case 'bottom-right':
          return 'translate(100%, 100%)';
        case 'bottom-left':
          return 'translate(-100%, 100%)';
        case 'top-right':
          return 'translate(100%, -100%)';
        case 'top-left':
          return 'translate(-100%, -100%)';
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <div
      ref={elementRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        // Always use top positioning while dragging, use bottom only when snapped to bottom corners
        ...(isBottomCorner && !isDragging
          ? { bottom: `20px`, top: 'auto' }  // Bottom-anchored with fixed bottom margin
          : { top: `${position.y}px`, bottom: 'auto' }  // Top-anchored (always during drag)
        ),
        transform: isDragging ? 'translate(0, 0)' : getSlideTransform(),
        opacity: isVisible ? 1 : 0,
        transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: isDragging ? 'move' : 'pointer',
      }}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl p-4 w-80 border flex flex-col ${
          isDragging ? 'border-blue-400 shadow-blue-200' : 'border-gray-200'
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Header with Redirect and Close Buttons */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={reopenPopup}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 truncate ml-2 flex-1">{phoneNumber}</span>
          {isIdle && (
            <button
              onClick={handleClose}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Status Banner (only for dialing/recording) */}
        {(isDialing || isRecording) && (
          <CallStatusBanner state={state} isRecording={isRecording} className="mb-2" />
        )}

        {/* Timer (only when call is active) */}
        {isCallActive && (
          <div className="flex justify-center mb-2">
            <CallTimer startTime={startTime} className="text-gray-900 text-sm" />
          </div>
        )}

        {/* Audio Visualizer */}
        <div className="mb-3 bg-gray-50 rounded-lg p-2">
          <AudioVisualizer 
            isActive={isVisualizerActive} 
            audioStream={audioStream}
            className="h-12" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2" onMouseDown={(e) => e.stopPropagation()}>
          {isIdle && (
            <Button
              onClick={handleCall}
              disabled={!isInitialized}
              size="sm"
              className="flex-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white h-9"
            >
              {isInitialized ? 'Call' : 'Initializing...'}
            </Button>
          )}
          
          {(isDialing || isCallActive) && (
            <Button
              onClick={handleHangUp}
              size="sm"
              className="flex-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white h-9"
            >
              Hang Up
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
