"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavHeader, { NavItem } from "@/components/ui/NavHeader";

export const Header = () => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAuthenticated = status === "authenticated";

  // Dynamic Navigation Items
  const items: NavItem[] = [
    { label: "Home", href: "/" },
  ];

  if (isAuthenticated) {
    items.push(
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" },
      { 
        label: "Logout", 
        href: "#", 
        onClick: (e) => {
          e.preventDefault();
          signOut({ callbackUrl: "/" });
        }
      }
    );
  } else if (status !== "loading") {
    items.push({ label: "Sign In", href: "/auth/signin" });
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="fixed top-0 left-0 right-0 z-[100]"
    >
      <div className="flex justify-center w-full px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#001e2b]/80 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
            <Image
              src="/assets/icon-192.png"
              alt="Virtual Stream Deck"
              width={32}
              height={32}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <NavHeader items={items} />
        </div>
      </div>
    </motion.header>
  );
};
