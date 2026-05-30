"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center font-bold tracking-tight whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/30 disabled:pointer-events-none disabled:opacity-30 overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-[#00684a] text-white rounded-full shadow-lg shadow-black/20 hover:bg-[#00ed64] hover:text-black",
        neon:
          "bg-gradient-to-r from-[#00684a] via-[#00ed64] to-[#00684a] bg-[length:200%_auto] text-forest-black rounded-full shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_35px_rgba(0,237,100,0.5)] hover:bg-[100%_0] transition-[background-position,shadow,transform] duration-800",
        secondary:
          "bg-[#1c2d38] text-silver-teal rounded-full border border-teal-gray/20 hover:text-white hover:bg-[#1eaedb] hover:border-transparent",
        outline:
          "bg-transparent text-white border border-white/10 rounded-full hover:border-neon-green/30 hover:bg-white/5",
        ghost:
          "bg-transparent text-silver-teal/40 rounded-full hover:text-white hover:bg-white/5",
      },
      size: {
        default: "h-11 sm:h-12 px-8 text-[13px] label-technical uppercase tracking-wider",
        sm: "h-9 sm:h-10 px-6 text-[11px] label-technical uppercase tracking-wider",
        lg: "h-14 sm:h-16 px-10 text-[15px] label-technical uppercase tracking-wider",
        icon: "h-10 w-10 sm:h-12 sm:w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface TactileButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "style" | "onDragStart">, VariantProps<typeof buttonVariants> {
  active?: boolean;
  ref?: React.Ref<any>;
  as?: "button" | "div";
  style?: React.CSSProperties;
  onDragStart?: (event: any) => void;
}

export function TactileButton({
  className,
  variant,
  size,
  active,
  as = "button",
  children,
  ref,
  ...props
}: TactileButtonProps) {
  
  const Component = as === "div" ? motion.div : motion.button;

  return (
    <Component
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, className }),
        active && "bg-neon-green text-forest-black border-neon-green ring-1 ring-neon-green/20"
      )}
      whileHover={{ scale: 1.03, y: 0 }}
      whileTap={{ scale: 0.97, y: 0 }}
      {...(props as any)}
    >
      {/* Bioluminescent Glow Layer */}
      {(variant === "primary" || variant === "neon") && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-neon-green/0 via-white/20 to-neon-green/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children as React.ReactNode}
      </span>

      {/* Hover glow aura */}
      <motion.div
        className={cn(
          "absolute inset-0 -z-20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          variant === "neon" ? "bg-neon-green/30" : "bg-neon-green/15"
        )}
        initial={false}
      />
    </Component>
  );
}
