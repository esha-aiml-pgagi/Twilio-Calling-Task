"use client";

import { useState, useRef, useEffect } from "react";
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
  const cellRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={cellRef} style={{ zIndex: isExpanded ? 40 : 'auto' }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate">{displayText}</span>
        <button
          onClick={handleToggle}
          className="flex-shrink-0 p-1 hover:bg-accent rounded transition-all duration-200"
          aria-label={isExpanded ? "Collapse address" : "Expand address"}
        >
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div 
          ref={cardRef}
          className={`absolute left-0 ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          } z-40 bg-white border rounded-lg shadow-lg p-4 min-w-[250px] transition-all duration-300 ${
            isClosing 
              ? `opacity-0 scale-95 ${openUpward ? 'translate-y-2' : '-translate-y-2'}` 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
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
      )}
    </div>
  );
}
