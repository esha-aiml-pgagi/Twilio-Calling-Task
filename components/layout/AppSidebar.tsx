"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Table } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import styles from "@/styles/modules/sidebar.module.css";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className={styles.sidebarWrapper}>
      <Sidebar collapsible="icon" className={styles.sidebar}>
        <SidebarContent className={styles.content}>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
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
  );
}
