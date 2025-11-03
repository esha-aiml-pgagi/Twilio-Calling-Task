"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";

interface NotesCellProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesCell({ value, onChange }: NotesCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleExpand = () => {
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
        className="cursor-pointer text-sm hover:bg-accent/50 rounded px-2 py-1 transition-colors duration-200"
      >
        {!value ? (
          <span className="text-muted-foreground italic">Input here</span>
        ) : isTruncated ? (
          <span className="truncate block">{displayText.substring(0, 30)}...</span>
        ) : (
          <span>{displayText}</span>
        )}
      </div>

      {mounted && isExpanded && createPortal(
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300"
          onClick={handleClickOutside}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
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
                className="flex-shrink-0 p-2 hover:bg-accent rounded-md transition-colors duration-200"
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
