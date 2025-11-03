"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      setIsOpen(true);
    }
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const handleChangePassword = () => {
    handleClose();
    router.push("/change-password");
  };

  return (
    <div className="relative ml-auto" ref={menuRef} style={{ zIndex: isOpen ? 100 : 'auto' }}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-accent transition-colors duration-200"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="text-xs sm:text-sm">JD</AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] md:max-w-[150px]">
            John Doe
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] md:max-w-[150px]">
            john@example.com
          </span>
        </div>
        <ChevronDown
          className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`glass-liquid-container absolute top-full mt-2 right-0 glass-liquid-surface bg-white/95 backdrop-blur-md border rounded-md shadow-lg z-50 min-w-[10rem] sm:min-w-[12rem] transition-all duration-250 ease-in-out animate-liquid-glass-in ${
            isClosing
              ? 'opacity-0 scale-95 -translate-y-2'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="glass-liquid-content p-1">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-accent rounded-md transition-colors duration-150 text-left"
            >
              <KeyRound className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-accent rounded-md transition-colors duration-150 text-left"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
