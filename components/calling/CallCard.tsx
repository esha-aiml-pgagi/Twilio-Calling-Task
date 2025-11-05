"use client";

import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { useCall } from '@/contexts/CallContext';
import { AudioVisualizer } from './AudioVisualizer';
import { CallTimer } from './CallTimer';
import { CallStatusBanner } from './CallStatusBanner';
import { Button } from '@/components/ui/button';

interface CallCardProps {
  variant: 'popup' | 'mini';
}

export function CallCard({ variant }: CallCardProps) {
  const {
    callSession,
    reopenPopup,
    startCall,
    closeMiniPlayer,
    closeCallPopup,
    hangUpCall,
    isRecording,
    // Get Twilio properties from context instead of hook
    makeCall,
    isInitialized,
    audioStream,
  } = useCall();

  if (!callSession) return null;

  const { phoneNumber, state, startTime } = callSession;

  const handleCall = async () => {
    startCall();
    await makeCall(phoneNumber);
  };

  const handleHangUp = () => {
    hangUpCall();
  };

  const handleClose = () => {
    if (variant === 'mini') {
      closeMiniPlayer();
    } else {
      closeCallPopup();
    }
  };

  const isCallActive = state === 'in-progress' || isRecording;
  const isDialing = state === 'connecting' || state === 'ringing';
  const isIdle = state === 'idle';
  
  // Audio visualizer is active only when call is connected (not while dialing)
  const isVisualizerActive = isCallActive;

  const isMini = variant === 'mini';

  return (
    <div className={isMini ? "content-card w-80 p-4 shadow-2xl max-h-[calc(100vh-2rem)] flex flex-col" : "bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 border border-gray-200 relative"}>
      {/* Header */}
      {isMini ? (
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={reopenPopup}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 truncate ml-2 flex-1">{phoneNumber}</span>
          {isIdle && (
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Phone Number */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{phoneNumber}</h2>
          </div>
        </>
      )}

      {/* Status Banner (only for dialing/recording) */}
      {(isDialing || isRecording) && (
        <CallStatusBanner 
          state={state} 
          isRecording={isRecording} 
          className={isMini ? "mb-2" : "mb-4"} 
        />
      )}

      {/* Timer (only when call is active) */}
      {isCallActive && (
        <div className={`flex justify-center ${isMini ? 'mb-2' : 'mb-4'}`}>
          <CallTimer 
            startTime={startTime} 
            className={isMini ? "text-gray-900 text-sm" : "text-gray-900"} 
          />
        </div>
      )}

      {/* Audio Visualizer */}
      <div className={`${isMini ? 'mb-3' : 'mb-6'} bg-gray-50 rounded-lg ${isMini ? 'p-2' : 'p-4'}`}>
        <AudioVisualizer 
          isActive={isVisualizerActive} 
          audioStream={audioStream}
          className={isMini ? "h-12" : undefined}
        />
      </div>

      {/* Action Buttons */}
      {isMini ? (
        <div className="flex gap-2">
          {isIdle && (
            <Button
              onClick={handleCall}
              disabled={!isInitialized}
              size="sm"
              className="flex-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isInitialized ? 'Call' : 'Initializing...'}
            </Button>
          )}
          
          {(isDialing || isCallActive) && (
            <Button
              onClick={handleHangUp}
              size="sm"
              className="flex-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              Hang Up
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isIdle && (
            <Button
              onClick={handleCall}
              disabled={!isInitialized}
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isInitialized ? 'Call' : 'Initializing...'}
            </Button>
          )}

          {(isDialing || isCallActive) && (
            <Button
              onClick={handleHangUp}
              className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              Hang Up
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
