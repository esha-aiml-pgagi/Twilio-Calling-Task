"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { UserMenu } from "@/components/layout/UserMenu";
import styles from "@/styles/modules/header.module.css";
import Image from "next/image";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleTitleClick = () => {
    router.push("/dashboard");
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
        <div 
          onClick={handleTitleClick}
          className="flex items-center gap-3 cursor-pointer transition-opacity duration-300 hover:opacity-80"
        >
          <Image 
            src="/logo.png" 
            alt="PG-AGI Logo" 
            width={40} 
            height={40}
            className="object-contain rounded-lg"
          />
          <h1 className={styles.title}>PG-AGI Twilio Call-Center</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
