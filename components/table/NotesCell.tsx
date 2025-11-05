"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import { useCall } from "@/contexts/CallContext";

interface NotesCellProps {
  value: string;
  onChange: (value: string) => void;
  contactId: string;
}

export function NotesCell({ value, onChange, contactId }: NotesCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentContactId, isMiniPlayerVisible, triggerNotesBounce, currentContactNotes } = useCall();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Sync with mini-box notes if this is the current contact
  useEffect(() => {
    if (currentContactId === contactId && isMiniPlayerVisible) {
      setTempValue(currentContactNotes);
      if (value !== currentContactNotes) {
        onChange(currentContactNotes);
      }
    }
  }, [currentContactNotes, currentContactId, contactId, isMiniPlayerVisible, value, onChange]);

  // Handle slide animation
  useEffect(() => {
    if (isExpanded) {
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
  }, [isExpanded]);

  const handleExpand = () => {
    // Check if mini-player is open for this same contact
    if (isMiniPlayerVisible && currentContactId === contactId) {
      // Bounce the notes mini-box instead of opening popup
      triggerNotesBounce();
      return;
    }

    // Otherwise, open the popup normally
    setIsExpanded(true);
    setTempValue(value);
  };

  const handleConfirm = () => {
    onChange(tempValue);
    setIsExpanded(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onChange(tempValue);
      setIsExpanded(false);
    }
  };

  const displayText = value || "";
  const isTruncated = displayText.length > 30;

  return (
    <>
      <div
        onClick={handleExpand}
        className="cursor-pointer text-sm hover:bg-accent/50 rounded-md px-2 py-1 transition-all duration-300"
      >
        {!value ? (
          <span className="text-muted-foreground italic">Input here</span>
        ) : isTruncated ? (
          <span className="truncate block">{displayText.substring(0, 30)}...</span>
        ) : (
          <span>{displayText}</span>
        )}
      </div>

      {mounted && shouldRender && createPortal(
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClickOutside}
        >
          <div
            className="glass-liquid-container glass-liquid-surface bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 animate-liquid-glass-in transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(100vh)',
              opacity: isVisible ? 1 : 0,
            }}
          >
            <div className="glass-liquid-content flex items-start gap-3">
              <textarea
                ref={textareaRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Enter notes here..."
                className="flex-1 min-h-[120px] max-h-[400px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                autoFocus
              />
              <button
                onClick={handleConfirm}
                className="flex-shrink-0 p-2 hover:bg-accent rounded-md transition-colors duration-200 z-20"
                aria-label="Confirm notes"
              >
                <ArrowRight className="h-5 w-5 text-primary" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
