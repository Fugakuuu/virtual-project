"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AuthComponent } from "@/components/auth/AuthComponent";
import AnimatedContent from "@/components/ui/AnimatedContent";

function SignInContent() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  return (
    <main className="min-h-screen flex flex-col bg-[#001e2b] relative overflow-hidden selection:bg-[#00ed64]/20 selection:text-white">
      {/* Animated Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#00ed64]/10 blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.05, 0.1, 0.05],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#006cfa]/10 blur-[120px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />
      </div>
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 sm:p-10 flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
           className="pointer-events-auto"
        >
          <Link href="/">
             <button className="btn-tactile-physical group">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span className="hidden xs:inline">Return to Home</span>
                <span className="xs:hidden">Home</span>
             </button>
          </Link>
        </motion.div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 relative z-10 pt-20 pb-12">
        
        {/* Central Logo */}
        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse
          duration={1.3}
          ease="power3.Out"
          initialOpacity={0}
          animateOpacity
          delay={0.3}
          className="flex justify-center w-full"
        >
          <div className="w-14 h-14 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,237,100,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00ed64]/10 to-transparent opacity-50" />
            <Image
              src="/assets/icon-192.png"
              alt="Virtual Stream Deck"
              width={48}
              height={48}
              className="relative z-10 object-contain"
              priority
            />
          </div>
        </AnimatedContent>

        {/* Headline */}
        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse
          duration={1.3}
          ease="power3.Out"
          initialOpacity={0}
          animateOpacity
          delay={0.3}
          className="text-center mb-10 w-full max-w-md flex flex-col items-center"
        >
          {authError ? (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md px-4 py-3 text-center text-[13px] text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
              {authError === "OAuthAccountNotLinked" 
                ? "This email is already associated with another provider. Please sign in using your original method."
                : "Authentication sequence interrupted. Please try again."}
            </div>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-archivo text-white mb-3 leading-tight tracking-tight px-4 uppercase">
            Sign In to <br></br> 
            <span className="text-[#00ed64]">Virtual Stream Deck</span>
          </h1>
        </AnimatedContent>

        {/* New Multi-step Auth Component */}
        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse={false}
          duration={1.3}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.3}
          className="w-full max-w-md flex justify-center"
        >
          <AuthComponent />
        </AnimatedContent>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#001e2b]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ed64]/50" />
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
