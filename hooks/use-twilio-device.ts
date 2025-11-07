"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Device, Call } from '@twilio/voice-sdk';

const TWILIO_TOKEN_URL = 'http://localhost:3000/voice-token';

interface UseTwilioDeviceProps {
  setCallState: (state: any) => void;
  setCallSid: (sid: string) => void;
  endCall: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export function useTwilioDevice({
  setCallState,
  setCallSid,
  endCall,
  startRecording,
  stopRecording
}: UseTwilioDeviceProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const currentCallRef = useRef<Call | null>(null);

  // Sync currentCall to ref
  useEffect(() => {
    currentCallRef.current = currentCall;
  }, [currentCall]);

  // Hang up call - use ref to avoid stale closure
  const hangUp = useCallback(() => {
    const call = currentCallRef.current;
    if (call) {
      console.log('🔴 Hanging up call...');
      call.disconnect();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      stopRecording();
      setCurrentCall(null);
      setAudioStream(null);
      audioStreamRef.current = null;
      endCall();
    }
  }, [endCall, stopRecording]);

  // Initialize Twilio Device
  const initializeDevice = useCallback(async () => {
    if (isInitialized) return;

    try {
      const response = await fetch(`${TWILIO_TOKEN_URL}?identity=user_${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch token');
      
      const { token } = await response.json();
      
      const newDevice = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      });

      newDevice.on('registered', () => {
        console.log('✅ Twilio Device registered');
        setIsInitialized(true);
      });

      newDevice.on('error', (error) => {
        console.error('❌ Twilio Device error:', error);
        setError(error.message);
      });

      await newDevice.register();
      setDevice(newDevice);
    } catch (err: any) {
      console.error('Failed to initialize device:', err);
      setError(err.message);
    }
  }, [isInitialized]);

  // Initialize on mount and cleanup on unmount
  useEffect(() => {
    initializeDevice();

    // Cleanup: disconnect call and destroy device on unmount
    return () => {
      if (currentCall) {
        console.log('🧹 Cleaning up: Disconnecting active call');
        currentCall.disconnect();
      }
      if (device) {
        device.unregister();
        device.destroy();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Make a call
  const makeCall = useCallback(async (phoneNumber: string) => {
    if (!device) {
      setError('Device not initialized');
      return;
    }

    try {
      setCallState('connecting');
      
      const call = await device.connect({
        params: { To: phoneNumber },
      });

      setCurrentCall(call);
      currentCallRef.current = call;

      // Call is ringing
      call.on('ringing', () => {
        console.log('📞 Call ringing...');
        setCallState('ringing');
      });

      // Call accepted/connected - AUTO START RECORDING
      call.on('accept', () => {
        console.log('✅ Call connected');
        setCallState('in-progress');
        setCallSid(call.parameters.CallSid || '');
        
        // Get audio stream for visualization - use original stream
        const captureAudioStream = () => {
          try {
            // @ts-ignore - Twilio Call has getRemoteStream method
            const remoteStream = call.getRemoteStream?.() || call._mediaHandler?.stream;
            
            if (remoteStream && remoteStream.getAudioTracks().length > 0) {
              console.log('🎤 Found audio tracks:', remoteStream.getAudioTracks().length);
              
              // Add event listeners to monitor stream lifecycle
              remoteStream.addEventListener('inactive', () => {
                console.warn('⚠️ Audio stream became inactive');
              });
              
              remoteStream.addEventListener('addtrack', () => {
                console.log('🎤 Track added to stream');
              });
              
              remoteStream.addEventListener('removetrack', () => {
                console.warn('⚠️ Track removed from stream');
              });
              
              // Monitor track state
              remoteStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
                track.addEventListener('ended', () => {
                  console.warn('⚠️ Audio track ended');
                });
                console.log('🎤 Track state:', track.readyState, 'enabled:', track.enabled);
              });
              
              // Store the reference in both ref (to prevent GC) and state
              audioStreamRef.current = remoteStream;
              setAudioStream(remoteStream);
              
              console.log('🎤 ✅ Audio stream captured successfully');
              console.log('🎤 Stream ID:', remoteStream.id);
              console.log('🎤 Stream active:', remoteStream.active);
              return true;
            }
            return false;
          } catch (err) {
            console.error('❌ Failed to capture audio stream:', err);
            return false;
          }
        };
        
        // Try immediately
        if (!captureAudioStream()) {
          // If failed, retry after a short delay
          console.log('🎤 Retrying audio stream capture in 500ms...');
          setTimeout(() => {
            if (!captureAudioStream()) {
              console.log('🎤 Retrying audio stream capture in 1000ms...');
              setTimeout(captureAudioStream, 1000);
            }
          }, 500);
        }
        
        // DELAY startRecording UNTIL stream is captured and stable
        // This prevents the context update cascade from clearing the stream
        setTimeout(() => {
          console.log('🔴 Auto-starting recording...');
          startRecording();  // Trigger context update AFTER stream is stable
        }, 150);  // 150ms delay ensures audioStreamRef is locked in
        
        // Start duration timer
        const startTime = Date.now();
        durationIntervalRef.current = setInterval(() => {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          // Update duration through context if needed
        }, 1000);
      });

      // Call disconnected - AUTO STOP RECORDING
      call.on('disconnect', () => {
        console.log('📴 Call disconnected');
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
        // Auto-stop recording if it was active
        stopRecording();
        setAudioStream(null);
        audioStreamRef.current = null;
        endCall();
        setCurrentCall(null);
      });

      // Call canceled
      call.on('cancel', () => {
        console.log('🚫 Call canceled');
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
        stopRecording();
        setAudioStream(null);
        endCall();
        setCurrentCall(null);
      });

      // Call rejected
      call.on('reject', () => {
        console.log('❌ Call rejected');
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
        stopRecording();
        setAudioStream(null);
        endCall();
        setCurrentCall(null);
      });

    } catch (err: any) {
      console.error('Failed to make call:', err);
      setError(err.message);
      endCall();
    }
  }, [device, setCallState, setCallSid, endCall, startRecording, stopRecording]);

  // Memoize audio stream to prevent stale references
  const memoizedAudioStream = useMemo(() => {
    return audioStreamRef.current || audioStream;
  }, [audioStream]);

  return {
    device,
    currentCall,
    isInitialized,
    error,
    audioStream: memoizedAudioStream,
    makeCall,
    hangUp,
  };
}
