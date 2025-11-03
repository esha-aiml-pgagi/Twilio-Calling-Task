"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className={styles.layoutContainer}>
        <Header />
        <div className={styles.contentWrapper}>
          {/* Overlay for mobile/tablet when sidebar is open */}
          {open && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in fade-in duration-200"
              onClick={handleOverlayClick}
              onTouchEnd={handleOverlayClick}
              style={{ cursor: 'pointer' }}
              aria-hidden="true"
            />
          )}
          <div className="relative z-40 lg:relative">
            <AppSidebar />
          </div>
          <main className={styles.mainContent}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
