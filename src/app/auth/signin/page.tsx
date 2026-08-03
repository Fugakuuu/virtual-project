"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { AuthComponent } from "@/components/auth/AuthComponent";
import AnimatedContent from "@/components/ui/AnimatedContent";

function SignInContent() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  return (
    <main className="min-h-screen flex flex-col bg-[#001e2b] relative overflow-hidden selection:bg-[#00ed64]/20 selection:text-white">
      {/* Static noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none -z-10" />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 sm:p-10 flex items-center justify-between">
        <Link href="/">
           <button className="btn-tactile-physical group">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span className="hidden xs:inline">Return to Home</span>
              <span className="xs:hidden">Home</span>
           </button>
        </Link>
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
          <div className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
            <Image
              src="/assets/icon-192.png"
              alt="Virtual Stream Deck"
              width={48}
              height={48}
              className="object-contain"
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
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-[13px] text-red-300">
              {authError === "OAuthAccountNotLinked" 
                ? "This email is already linked to another provider. Sign in with your original method."
                : "Sign in failed. Please try again."}
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
