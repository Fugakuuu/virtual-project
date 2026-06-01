"use client";

import React, { useRef, useCallback, useState } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OTPInput = ({ value, onChange, length = 6 }: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Build a clean array: each slot is either a digit char or ""
  const digits: string[] = [];
  for (let i = 0; i < length; i++) {
    const ch = value[i];
    digits.push(ch && /[0-9]/.test(ch) ? ch : "");
  }

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputRefs.current[clamped]?.focus();
    },
    [length]
  );

  const updateDigit = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) return;

    updateDigit(index, raw.slice(-1));
    if (index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        updateDigit(index - 1, "");
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveIdx(index);
  };

  const handleBlur = () => setActiveIdx(null);

  const half = Math.floor(length / 2);

  const slotClass = (index: number) => {
    const active = activeIdx === index;
    return [
      "w-10 h-11 sm:w-9 sm:h-10 rounded-lg border text-center text-base sm:text-sm font-mono font-semibold",
      "outline-none transition-all duration-200",
      "bg-[#1c2d38]/60 border-[#3d4f58] text-[#00ed64] placeholder:text-transparent",
      "shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.06),inset_0px_-1px_0px_0px_rgba(0,0,0,0.3),0px_2px_4px_0px_rgba(0,0,0,0.25)]",
      active
        ? "ring-2 ring-[#00ed64]/25 border-[#00ed64]/50"
        : "hover:border-[#5c6c75]/60",
    ].join(" ");
  };

  const renderSlot = (index: number) => {
    const d = digits[index];
    return (
      <input
        key={index}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        type="text"
        inputMode="numeric"
        autoComplete={index === 0 ? "one-time-code" : "off"}
        maxLength={1}
        value={d}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onPaste={handlePaste}
        onFocus={(e) => handleFocus(e, index)}
        onBlur={handleBlur}
        aria-label={`Digit ${index + 1}`}
        className={slotClass(index)}
      />
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* First group */}
      <div className="flex gap-1.5">
        {Array.from({ length: half }, (_, i) => renderSlot(i))}
      </div>

      {/* Separator */}
      <span className="text-[#5c6c75] text-base font-medium select-none px-0.5">
        —
      </span>

      {/* Second group */}
      <div className="flex gap-1.5">
        {Array.from({ length: length - half }, (_, i) => renderSlot(half + i))}
      </div>
    </div>
  );
};