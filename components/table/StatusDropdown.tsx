"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface StatusDropdownProps {
  value: "contacted" | "not contacted" | "lost" | undefined;
  onChange: (value: "contacted" | "not contacted" | "lost") => void;
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
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
        const dropdownHeight = 120;

        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
      }
      setIsOpen(true);
    }
  };

  const options: Array<"contacted" | "not contacted" | "lost"> = [
    "contacted",
    "not contacted",
    "lost",
  ];

  const getDisplayValue = (val: string | undefined) => {
    if (!val) return "Select status";
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "contacted":
        return "text-green-600";
      case "not contacted":
        return "text-gray-600";
      case "lost":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 50 : 'auto' }}>
      <button
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors duration-200 min-w-[140px] ${getStatusColor(
          value
        )}`}
      >
        <span>{getDisplayValue(value)}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute left-0 ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          } bg-white/95 backdrop-blur-md border rounded-md shadow-lg z-50 min-w-[140px] transition-all duration-250 ease-in-out ${
            isClosing 
              ? `opacity-0 scale-95 ${openUpward ? 'translate-y-2' : '-translate-y-2'}` 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
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
              {getDisplayValue(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
