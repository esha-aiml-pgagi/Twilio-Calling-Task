"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select..."
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = Math.min(options.length * 40 + 16, 300);

        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
      }
      setIsOpen(true);
    }
  };

  const getDisplayValue = () => {
    if (!value || value === "all") return placeholder;
    return value;
  };

  return (
    <div className="relative w-full" ref={dropdownRef} style={{ zIndex: isOpen ? 50 : 'auto' }}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors duration-200 w-full text-left"
      >
        <span className="truncate">{getDisplayValue()}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div 
          className={`glass-liquid-container absolute left-0 ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          } glass-liquid-surface bg-white/95 backdrop-blur-md border rounded-md shadow-lg z-50 w-full max-h-[300px] overflow-y-auto transition-all duration-250 ease-in-out animate-liquid-glass-in ${
            isClosing 
              ? `opacity-0 scale-95 ${openUpward ? 'translate-y-2' : '-translate-y-2'}` 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="glass-liquid-content">
            <button
              onClick={() => {
                onChange("all");
                handleClose();
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors duration-150 ${
                !value || value === "all" ? "bg-accent/50" : ""
              }`}
            >
              All {label}
            </button>
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
