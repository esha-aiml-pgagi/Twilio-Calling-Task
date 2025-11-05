"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { CallSession, CallState } from '@/lib/types';
import { Corner } from '@/lib/drag-utils';
import { useTwilioDevice } from '@/hooks/use-twilio-device';

interface CallContextType {
  callSession: CallSession | null;
  isPopupOpen: boolean;
  isMiniPlayerVisible: boolean;
  currentContactId: string | null;
  currentContactNotes: string;
  currentCorner: Corner;
  isDragging: boolean;
  isRecording: boolean;
  setIsDragging: (dragging: boolean) => void;
  openCallPopup: (phoneNumber: string) => void;
  closeCallPopup: () => void;
  setCallState: (state: CallState) => void;
  startCall: () => void;
  endCall: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  updateDuration: (duration: number) => void;
  setCallSid: (sid: string) => void;
  reopenPopup: () => void;
  setHangUpFunction: (fn: (() => void) | null) => void;
  hangUpCall: () => void;
  openMiniPlayer: (phoneNumber: string, contactId: string, notes?: string) => void;
  closeMiniPlayer: () => void;
  updateContactNotes: (notes: string) => void;
  setCurrentCorner: (corner: Corner) => void;
  isCallActiveOrDialing: () => boolean;
  registerNotesUpdateCallback: (callback: (contactId: string, notes: string) => void) => void;
  unregisterNotesUpdateCallback: () => void;
  triggerNotesBounce: () => void;
  shouldBounceNotes: boolean;
  resetNotesBounce: () => void;
  // Twilio Device properties
  audioStream: MediaStream | null;
  device: any | null;
  isInitialized: boolean;
  makeCall: (phoneNumber: string) => Promise<void>;
  twilioHangUp: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);
  const [currentContactNotes, setCurrentContactNotes] = useState<string>('');
  const [currentCorner, setCurrentCorner] = useState<Corner>('bottom-right');
  const [shouldBounceNotes, setShouldBounceNotes] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const hangUpFunctionRef = useRef<(() => void) | null>(null);
  const notesUpdateCallbackRef = useRef<((contactId: string, notes: string) => void) | null>(null);

  const setCallState = useCallback((state: CallState) => {
    setCallSession(prev => prev ? { ...prev, state } : null);
  }, []);

  const setCallSid = useCallback((sid: string) => {
    setCallSession(prev => prev ? { ...prev, callSid: sid } : null);
  }, []);

  const endCall = useCallback(() => {
    setCallSession(null);
    setIsPopupOpen(false);
    setIsMiniPlayerVisible(false);
    setCurrentContactId(null);
    setCurrentContactNotes('');
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  // Initialize Twilio Device Hook at the context level (ONE instance for entire app)
  const { 
    device, 
    audioStream, 
    hangUp: twilioHangUp, 
    makeCall, 
    isInitialized 
  } = useTwilioDevice({
    setCallState,
    setCallSid,
    endCall,
    startRecording,
    stopRecording
  });

  const setHangUpFunction = useCallback((fn: (() => void) | null) => {
    hangUpFunctionRef.current = fn;
  }, []);

  const hangUpCall = useCallback(() => {
    if (hangUpFunctionRef.current) {
      hangUpFunctionRef.current();
    }
  }, []);

  const isCallActiveOrDialing = useCallback(() => {
    if (!callSession) return false;
    return callSession.state === 'connecting' || 
           callSession.state === 'ringing' || 
           callSession.state === 'in-progress' ||
           isRecording;
  }, [callSession, isRecording]);

  const openMiniPlayer = useCallback((phoneNumber: string, contactId: string, notes: string = '') => {
    setCallSession({
      phoneNumber,
      state: 'idle',
      startTime: null,
      duration: 0,
      callSid: null,
    });
    setCurrentContactId(contactId);
    setCurrentContactNotes(notes);
    setIsMiniPlayerVisible(true);
    setIsPopupOpen(false);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    setCallSession(null);
    setIsMiniPlayerVisible(false);
    setIsPopupOpen(false);
    setCurrentContactId(null);
    setCurrentContactNotes('');
  }, []);

  const updateContactNotes = useCallback((notes: string) => {
    setCurrentContactNotes(notes);
    // Notify the table of the update
    if (currentContactId && notesUpdateCallbackRef.current) {
      notesUpdateCallbackRef.current(currentContactId, notes);
    }
  }, [currentContactId]);

  const registerNotesUpdateCallback = useCallback((callback: (contactId: string, notes: string) => void) => {
    notesUpdateCallbackRef.current = callback;
  }, []);

  const unregisterNotesUpdateCallback = useCallback(() => {
    notesUpdateCallbackRef.current = null;
  }, []);

  const triggerNotesBounce = useCallback(() => {
    setShouldBounceNotes(true);
  }, []);

  const resetNotesBounce = useCallback(() => {
    setShouldBounceNotes(false);
  }, []);

  const openCallPopup = useCallback((phoneNumber: string) => {
    setCallSession({
      phoneNumber,
      state: 'idle',
      startTime: null,
      duration: 0,
      callSid: null,
    });
    setIsPopupOpen(true);
    setIsMiniPlayerVisible(false);
  }, []);

  const closeCallPopup = useCallback(() => {
    setIsPopupOpen(false);
    if (callSession && (callSession.state === 'connecting' || callSession.state === 'ringing' || callSession.state === 'in-progress' || isRecording)) {
      setIsMiniPlayerVisible(true);
    }
  }, [callSession, isRecording]);

  const reopenPopup = useCallback(() => {
    setIsMiniPlayerVisible(true);
    setIsPopupOpen(true);
  }, []);

  const startCall = useCallback(() => {
    setCallSession(prev => prev ? {
      ...prev,
      state: 'connecting',
      startTime: Date.now(),
      duration: 0,
    } : null);
  }, []);

  const updateDuration = useCallback((duration: number) => {
    setCallSession(prev => prev ? { ...prev, duration } : null);
  }, []);

  return (
    <CallContext.Provider
      value={{
        callSession,
        isPopupOpen,
        isMiniPlayerVisible,
        currentContactId,
        currentContactNotes,
        currentCorner,
        isRecording,
        openCallPopup,
        closeCallPopup,
        setCallState,
        startCall,
        endCall,
        startRecording,
        stopRecording,
        updateDuration,
        setCallSid,
        reopenPopup,
        setHangUpFunction,
        hangUpCall,
        openMiniPlayer,
        closeMiniPlayer,
        updateContactNotes,
        setCurrentCorner,
        isCallActiveOrDialing,
        registerNotesUpdateCallback,
        unregisterNotesUpdateCallback,
        triggerNotesBounce,
        shouldBounceNotes,
        resetNotesBounce,
        isDragging,
        setIsDragging,
        // Twilio Device properties from hook
        audioStream,
        device,
        isInitialized,
        makeCall,
        twilioHangUp,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallProvider');
  }
  return context;
}
