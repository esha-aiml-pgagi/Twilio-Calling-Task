"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import styles from "./dashboard.module.css";
import { useEffect, useState, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside sidebar or header
      if (
        open &&
        sidebarRef.current &&
        headerRef.current &&
        !sidebarRef.current.contains(target) &&
        !headerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSidebarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!open) {
      setOpen(true);
    }
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className={styles.layoutContainer}>
        <div ref={headerRef}>
          <Header />
        </div>
        <div className={styles.contentWrapper}>
          <div ref={sidebarRef} onClick={handleSidebarClick}>
            <AppSidebar />
          </div>
          <main className={styles.mainContent}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
