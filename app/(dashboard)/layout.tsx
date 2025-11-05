"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { CallProvider, useCall } from "@/contexts/CallContext";
import { CallPopup } from "@/components/calling/CallPopup";
import { MiniPlayerWithDevice } from "@/components/calling/MiniPlayerWithDevice";
import { NotesManager } from "@/components/calling/NotesManager";
import { useAutoHangupOnRouteChange } from "@/hooks/use-auto-hangup";
import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { isPopupOpen, isMiniPlayerVisible } = useCall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useAutoHangupOnRouteChange();

  // Monitor for modal state from body attribute
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modalOpen = document.body.hasAttribute('data-modal-open');
      setIsModalOpen(modalOpen);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-modal-open']
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when sidebar is open on mobile or popup is open
  useEffect(() => {
    if (isPopupOpen || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else if (open && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isPopupOpen, isModalOpen]);

  const handleOverlayClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className={styles.layoutContainer}>
        {/* Header with conditional blur */}
        <div className={(isPopupOpen || isModalOpen) ? "blur-sm transition-all duration-200" : ""}>
          <Header />
        </div>
        
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
          <div className={`relative z-20 lg:relative ${(isPopupOpen || isModalOpen) ? "blur-sm transition-all duration-200" : ""}`}>
            <AppSidebar />
          </div>
          
          {/* Main content with conditional blur */}
          <main className={`${styles.mainContent} ${(isPopupOpen || isModalOpen) ? "blur-sm transition-all duration-200" : ""}`}>
            {children}
          </main>
        </div>
      </div>
      
      {/* Global Call Components - Remain visible and slightly blurred when popup open */}
      <div className={isPopupOpen ? "blur-[2px] transition-all duration-200" : ""}>
        <MiniPlayerWithDevice />
        <NotesManager />
      </div>
      
      {/* Call Popup - z-40 backdrop, z-60 modal */}
      <CallPopup />
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CallProvider>
      <DashboardContent>{children}</DashboardContent>
    </CallProvider>
  );
}
