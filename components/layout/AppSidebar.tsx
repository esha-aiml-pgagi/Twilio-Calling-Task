"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Table } from "lucide-react";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import styles from "@/styles/modules/sidebar.module.css";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Table",
      icon: Table,
      href: "/table",
    },
  ];

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && state === "expanded") {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, state, setOpen]);

  const handleNavigation = (href: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Navigate to the page
    router.push(href);
    
    // Close sidebar on mobile/tablet after navigation
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <TooltipProvider>
      <div className={styles.sidebarWrapper}>
        <Sidebar collapsible="icon" className={styles.sidebar}>
          <SidebarContent className={styles.content}>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={(e) => handleNavigation(item.href, e)}
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className={styles.menuButton}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </TooltipProvider>
  );
}
