"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    description: "Assets & Controls"
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
    description: "Settings"
  }
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-[280px] bg-forest-black border-r border-white/5 flex flex-col z-40 transition-all duration-200 ease-out px-4 py-8">
      
      {/* Brand Section */}
      <Link href="/" className="flex items-center gap-3 px-4 mb-14 group">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-green/30 transition-all shadow-neon-green/5 group-hover:shadow-neon-green/10 overflow-hidden">
          <Image
            src="/assets/icon-192.png"
            alt="Virtual Stream Deck"
            width={32}
            height={32}
            className="rounded-md object-cover"
            priority
          />
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="font-archivo text-base text-white font-medium uppercase tracking-tighter leading-none">
            Virtual
          </span>
          <span className="font-archivo text-lg text-neon-green font-bold uppercase tracking-tighter leading-none mt-1">
            Stream Deck
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-150 overflow-hidden",
                isActive 
                  ? "bg-white/5 border border-white/5 shadow-inner" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-neon-green shadow-2xl shadow-neon-green" />
              )}
              
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all duration-150",
                  isActive ? "text-neon-green scale-110" : "group-hover:text-neon-green/60"
                )} 
              />
              
              <div className="hidden lg:block overflow-hidden">
                <p className={cn("font-archivo font-bold text-[13px] tracking-tight uppercase leading-none", isActive ? "text-white" : "group-hover:text-white")}>
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-8 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group transition-all hover:border-neon-green/20 cursor-default">
          <div className="w-10 h-10 rounded-xl bg-forest-black flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-neon-green/30 transition-all shrink-0 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
          </div>
          <div className="hidden lg:block flex-1 overflow-hidden">
            <p className="font-archivo font-bold text-[11px] text-white/60 truncate uppercase tracking-tight">Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

