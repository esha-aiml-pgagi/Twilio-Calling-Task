"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface ExpandableAddressCellProps {
  type: "personal" | "company";
  displayText: string;
  city?: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  companyCity?: string;
  companyState?: string;
  companyCountry?: string;
}

export function ExpandableAddressCell({
  type,
  displayText,
  city,
  state,
  country,
  fullAddress,
  companyCity,
  companyState,
  companyCountry,
}: ExpandableAddressCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        cellRef.current &&
        !cellRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    const updatePosition = () => {
      if (cellRef.current && isExpanded) {
        const rect = cellRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isExpanded) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isExpanded]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 300);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isExpanded) {
      handleClose();
    } else {
      if (cellRef.current) {
        const rect = cellRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const cardHeight = 180;

        setOpenUpward(spaceBelow < cardHeight && spaceAbove > spaceBelow);
      }
      setIsExpanded(true);
    }
  };

  const dropdownContent = isExpanded && mounted ? (
    <div 
      ref={cardRef}
      className={`glass-liquid-container fixed z-[60] glass-liquid-surface bg-white/95 backdrop-blur-md border rounded-lg shadow-lg p-4 min-w-[250px] transition-opacity duration-300 ease-in-out ${
        isClosing 
          ? 'opacity-0' 
          : 'opacity-100'
      }`}
      style={{
        top: openUpward ? 'auto' : `${position.top + 8}px`,
        bottom: openUpward ? `${window.innerHeight - position.top + 8}px` : 'auto',
        left: `${position.left}px`,
      }}
    >
      <div className="glass-liquid-content">
        {type === "personal" ? (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">City:</span>{" "}
              <span className="text-muted-foreground">{city || "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">State:</span>{" "}
              <span className="text-muted-foreground">{state || "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Country:</span>{" "}
              <span className="text-muted-foreground">{country || "N/A"}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Address:</span>{" "}
              <span className="text-muted-foreground">{fullAddress || "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">City:</span>{" "}
              <span className="text-muted-foreground">{companyCity || "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">State:</span>{" "}
              <span className="text-muted-foreground">{companyState || "N/A"}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Country:</span>{" "}
              <span className="text-muted-foreground">{companyCountry || "N/A"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative" ref={cellRef}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate">{displayText}</span>
        <button
          onClick={handleToggle}
          className="flex-shrink-0 p-1 hover:bg-accent/60 rounded-md transition-all duration-300"
          aria-label={isExpanded ? "Collapse address" : "Expand address"}
        >
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {mounted && dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
