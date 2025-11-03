"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/layout/UserMenu";
import styles from "@/styles/modules/header.module.css";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/table") return "Table";
    return "Dashboard";
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button
          onClick={toggleSidebar}
          className={styles.menuButton}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className={styles.title}>{getPageTitle()}</h1>
        <UserMenu />
      </div>
    </header>
  );
}
