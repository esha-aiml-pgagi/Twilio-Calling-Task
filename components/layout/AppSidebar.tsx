"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Table } from "lucide-react";
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

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    // If sidebar is collapsed, navigate directly without opening sidebar
    if (state === "collapsed") {
      e.stopPropagation();
      router.push(href);
      // Keep sidebar collapsed
      setOpen(false);
    } else {
      // If expanded, just navigate normally
      router.push(href);
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
