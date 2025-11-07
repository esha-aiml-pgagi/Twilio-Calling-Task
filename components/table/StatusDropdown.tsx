"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface StatusDropdownProps {
  value: "contacted" | "not contacted" | "lost" | undefined;
  onChange: (value: "contacted" | "not contacted" | "lost") => void;
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const updatePosition = () => {
      if (dropdownRef.current && isOpen) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
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

  const dropdownMenu = isOpen && mounted ? (
    <div 
      ref={menuRef}
      className={`glass-liquid-container fixed z-[60] glass-liquid-surface bg-white/95 backdrop-blur-md border rounded-md shadow-lg transition-opacity duration-300 ease-in-out ${
        isClosing 
          ? 'opacity-0' 
          : 'opacity-100'
      }`}
      style={{
        top: openUpward ? 'auto' : `${position.top + 4}px`,
        bottom: openUpward ? `${window.innerHeight - position.top + 4}px` : 'auto',
        left: `${position.left}px`,
        minWidth: `${position.width}px`,
      }}
    >
      <div className="glass-liquid-content">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onChange(option);
              handleClose();
            }}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent/60 rounded-md transition-all duration-300 ${
              value === option ? "bg-accent/50" : ""
            }`}
          >
            {getDisplayValue(option)}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggle}
          className={`flex items-center justify-between gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-accent/60 transition-all duration-300 min-w-[140px] ${getStatusColor(
            value
          )}`}
        >
          <span>{getDisplayValue(value)}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ease-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {mounted && dropdownMenu && createPortal(dropdownMenu, document.body)}
    </>
  );
}
