"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, LogOut, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from "@/styles/modules/userMenu.module.css";

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    router.push("/change-password");
  };

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.userButton}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar className={styles.avatar}>
          <AvatarImage src="" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className={styles.userInfo}>
          <span className={styles.userName}>John Doe</span>
          <span className={styles.userEmail}>john@example.com</span>
        </div>
        {isOpen ? (
          <ChevronUp className={styles.chevronUp} />
        ) : (
          <ChevronDown className={styles.chevronDown} />
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            onClick={handleChangePassword}
            className={styles.dropdownItem}
          >
            <KeyRound className="h-4 w-4" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className={styles.dropdownItem}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
