"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  className?: string;
  containerClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  startX?: number;
  startY?: number;
}

const ScrollFloat = ({
  children,
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "top bottom-=10%",
  scrollEnd = "bottom center",
  stagger = 0.03,
  className = "",
  containerClassName = "",
  as: Component = "h2",
  startX = 0,
  startY = 60,
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    
    // Split text into lines, then words, then characters to preserve line breaks
    const text = el.innerText;
    el.innerHTML = "";
    
    const lines = text.split("\n");
    const chars: HTMLSpanElement[] = [];
    
    lines.forEach((line, lineIdx) => {
      const lineContainer = document.createElement("div");
      lineContainer.style.display = "block";
      
      const words = line.split(" ");
      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        
        const wordChars = word.split("").map((char) => {
          const span = document.createElement("span");
          span.innerText = char;
          span.style.display = "inline-block";
          span.style.willChange = "transform, opacity";
          wordSpan.appendChild(span);
          return span;
        });
        
        chars.push(...wordChars);
        lineContainer.appendChild(wordSpan);
        
        // Add space after words (except last one in line)
        if (wordIdx < words.length - 1) {
          const space = document.createElement("span");
          space.innerText = "\u00A0"; // Non-breaking space
          space.style.display = "inline-block";
          lineContainer.appendChild(space);
          chars.push(space);
        }
      });
      
      el.appendChild(lineContainer);
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          willChange: "transform, opacity",
          opacity: 0,
          x: startX,
          y: startY,
          rotateX: 45,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: stagger,
          duration: animationDuration,
          ease: ease,
          scrollTrigger: {
            trigger: el,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, startX, startY]);

  return (
    <div className={`scroll-float-container ${containerClassName}`}>
      <Component ref={containerRef} className={`scroll-float-text ${className}`}>
        {children}
      </Component>
    </div>
  );
};

export default ScrollFloat;
