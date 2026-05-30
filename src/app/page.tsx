"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { motion, Variants, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import { ZapIcon } from "@/components/icons/ZapIcon";
import { LayoutPanelTopIcon } from "@/components/icons/LayoutPanelTopIcon";
import { TimerIcon } from "@/components/icons/TimerIcon";
import { TactileButton } from "@/components/ui/TactileButton";
import ScrollFloat from "@/components/ui/ScrollFloat";
import { LenisProvider } from "@/providers/LenisProvider";
import "@/styles/features.css";
import AnimatedContent from "@/components/ui/AnimatedContent";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const heroRef = React.useRef(null);
  const infraRef = React.useRef(null);
  
  const { scrollY } = useScroll();
  const { scrollYProgress: infraProgress } = useScroll({
    target: infraRef,
    offset: ["start end", "end center"]
  });

  // Spring Physics Configuration for Premium Feel
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Hero Smooth Transforms
  const baseHeroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const baseHeroY = useTransform(scrollY, [0, 400], [0, -100]);
  const baseAuraScale = useTransform(scrollY, [0, 800], [1, 1.2]);
  const baseAuraOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const heroOpacity = useSpring(baseHeroOpacity, springConfig);
  const heroY = useSpring(baseHeroY, springConfig);
  const auraScale = useSpring(baseAuraScale, springConfig);
  const auraOpacity = useSpring(baseAuraOpacity, springConfig);

  // Infrastructure Smooth Transforms
  const infraTitleY = useTransform(infraProgress, [0.5, 1], [0, -60]);
  const infraTitleOpacity = useTransform(infraProgress, [0, 0.5], [1, 1]);
  const smoothInfraY = useSpring(infraTitleY, springConfig);
  const smoothInfraOpacity = useSpring(infraTitleOpacity, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHydrated = mounted && status !== "loading";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <LenisProvider>
      <div className={`transition-opacity duration-500 ${isHydrated ? "opacity-100" : "opacity-0"}`}>
        <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#001e2b]">
        
        {/* Premium Dark Section (Hero) */}
        <section
          ref={heroRef}
          className="relative z-10 flex w-full min-h-[100dvh] flex-col items-center justify-center py-12 px-4 md:px-6"
        >
          {/* Background */}
          <motion.div
            style={{ opacity: auraOpacity, scale: auraScale }}
            className="absolute inset-x-0 top-1/2 -z-10 h-full w-full -translate-y-[60%] bg-[radial-gradient(circle_at_center,rgba(0,104,74,0.15)_0%,transparent_70%)]"
          />

          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={1.3}
            className="w-full max-w-5xl flex flex-col items-center text-center relative z-20"
          >
            {/* Badge Pill */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00ed64]/15 bg-[#00ed64]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#00ed64] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ed64] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ed64]" />
                </span>
                Virtual Stream Deck
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-archivo text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-8 leading-[0.95] uppercase">
              The Stream Deck Engine,{" "}<br />
              <span className="text-white/60">With Unlimited Potential.</span>
            </h1>

            {/* Description */}
            <p
              className="text-[#8899a6] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-sans"
            >
              Kelola semua kebutuhan live stream dalam satu dashboard yang responsif. <br />
              Dari trigger overlay sampai muterin soundboard, semuanya bisa dikontrol <br />
              secara instan tanpa perlu hardware tambahan yang mahal.
            </p>

            <div>
              <button 
                className="btn-modern-hero"
                onClick={() => router.push(status === "authenticated" ? "/dashboard" : "/auth/signin")}
              >
                <svg viewBox="0 0 24 24" className="arr-svg arr-2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text-content">
                  {status === "authenticated" ? "Return to Dashboard" : "Start Building Free"}
                </span>
                <span className="circle-bg" />
                <svg viewBox="0 0 24 24" className="arr-svg arr-1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </button>
            </div>
          </AnimatedContent>
        </section>

        {/* Light Section (Infrastructure) */}
        <section 
          ref={infraRef}
          className="relative z-10 flex w-full flex-col items-center bg-[#e0e0e0] px-4 py-10 text-center sm:px-6 sm:py-24 md:px-12 md:py-24 lg:px-16 lg:py-24"
        >
          {/* Section Transition Shadow */}
          <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-[#e0e0e0] to-transparent pointer-events-none" />
          
          <div className="mx-auto w-full max-w-7xl flex flex-col items-center">
            <motion.div
              style={{ y: smoothInfraY, opacity: smoothInfraOpacity }}
              className="mb-10"
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-[#00684a] label-technical">
                Infrastructure
              </span>
            </motion.div>

            <ScrollFloat
              as="h2"
              stagger={0.03}
              animationDuration={1}
              startY={40}
              className="mb-12 max-w-4xl font-archivo text-[28px] font-bold leading-[1.0] tracking-tight text-[#001e2b] sm:mb-16 sm:text-[36px] md:text-[44px] lg:text-[54px] uppercase"
            >
              Architected for Performance. 
              <br />
              Designed for Creators.
            </ScrollFloat>

            <div className="feature-cards-container mb-24">
              {[
                {
                  title: "Tactile Control",
                  desc: "Bikin perangkat apa pun jadi remote kontrol profesional. Layoutnya bisa diatur sesuka hati dengan grid yang responsif, jadi bisa eksekusi aset multimedia dengan nyaman dan akurat tanpa takut salah pencet.",
                  icon: <LayoutPanelTopIcon />,
                  id: "tactile"
                },
                {
                  title: "Edge Precision",
                  desc: "Tidak perlu pusing lagi install plugin OBS yang ribet. Cukup copypaste URL unik ke browser source, dan semua aset visual bakal sinkron secara instan. Arsitekturnya dibuat ringan banget supaya device tetep lancar jaya buat ngegame sambil streaming.",
                  icon: <ZapIcon />,
                  id: "edge"
                },
                {
                  title: "Real-time Precision",
                  desc: "Dibangun pakai teknologi Socket.io supaya responnya secepat kilat. Sekali klik di dashboard, overlay atau suara bakal langsung muncul tanpa jeda. Ga ada lagi drama delay yang bikin momen penting di stream jadi berantakan.",
                  icon: <TimerIcon />,
                  id: "real-time"
                },
              ].map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`feature-card ${feature.id}`}
                >
                  <div className="icon-wrapper flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 backdrop-blur-md">
                    {feature.icon}
                  </div>
                  <h3 className="font-archivo text-xl uppercase tracking-tight mt-6 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-sans">{feature.desc}</p>
                  
                  <span className="tech-id font-mono">
                    {feature.id}_0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      </div>
    </LenisProvider>
  );
}
