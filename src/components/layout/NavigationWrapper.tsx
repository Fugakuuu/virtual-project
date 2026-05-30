"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const NavigationWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Route detection
  const isOverlay = pathname?.startsWith("/overlay");
  const isHome = pathname === "/";
  const isAuth = pathname?.startsWith("/auth");
  const isDashboard = pathname === "/dashboard";
  const isProfile = pathname === "/profile";
  const isApp = isDashboard || isProfile;

  if (isOverlay) {
    return <main className="min-h-screen bg-transparent">{children}</main>;
  }

  // Home page handles its own background and layout
  if (isHome) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  // Auth pages (Sign In / Up) also handle their own layouts to match the branding exactly
  if (isAuth) {
    return <>{children}</>;
  }

  // Minimal layout for Dashboard and Profile (to use Dock)
  if (isApp) {
    return (
      <div className="min-h-screen bg-forest-black overflow-x-hidden relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-green/3 rounded-full blur-[100px] pointer-events-none" />
        
        <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  // Fallback for other application routes (if any)
  return (
    <div className="flex h-screen bg-forest-black overflow-hidden select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden pl-20 lg:pl-[280px]">
        <Header />
        <main className="custom-scrollbar relative z-10 mt-2 flex-1 overflow-y-auto overscroll-contain pt-14 sm:pt-16">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

