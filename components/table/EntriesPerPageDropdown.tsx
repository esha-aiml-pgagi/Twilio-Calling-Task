"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface EntriesPerPageDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export function EntriesPerPageDropdown({
  value,
  onChange,
}: EntriesPerPageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [10, 25, 50, 100];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} style={{ zIndex: isOpen ? 50 : 'auto' }}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between gap-1 px-2 py-1 text-sm border rounded-md hover:bg-accent transition-colors duration-200 min-w-[60px]"
      >
        <span>{value}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div 
          className={`glass-liquid-container absolute left-0 top-full mt-1 glass-liquid-surface bg-white/95 backdrop-blur-md border rounded-md shadow-lg z-50 min-w-[60px] transition-all duration-250 ease-in-out animate-liquid-glass-in ${
            isClosing 
              ? 'opacity-0 scale-95 -translate-y-2' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="glass-liquid-content">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  handleClose();
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-150 ${
                  value === option ? "bg-accent/50" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
