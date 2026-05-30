"use client";

import React from "react";
import { Plus, Zap } from "lucide-react";

interface DashboardHeaderProps {
  user: { name?: string | null; image?: string | null };
  onAddClick: () => void;
}

export const DashboardHeader = ({ user, onAddClick }: DashboardHeaderProps) => {
  return (
    <header className="mb-10 sm:mb-12">
      <div className="rounded-2xl border border-[#3d4f58] bg-[#1c2d38] p-6 sm:p-8"
           style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}>
        
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Title + Status */}
          <div className="flex items-start gap-4 sm:items-center">
            
            {/* Text */}
            <div className="min-w-0">
              <h1 className="font-archivo text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl uppercase">
                Dashboard
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 rounded-[100px] bg-[#001e2b] border border-[#3d4f58] px-3 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00ed64] animate-pulse shadow-[0_0_8px_rgba(0,237,100,0.4)]" />
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[2.5px] text-[#00ed64]">
                    Active
                  </span>
                </div>
                {/* User Name */}
                {user.name && (
                  <span className="font-mono text-[14px] uppercase tracking-[2px] text-[#5c6c75]">
                    {user.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Add Asset Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onAddClick}
              className="group inline-flex h-12 w-full items-center gap-3 rounded-[100px] bg-[#00684a] border border-[#00684a] px-6 text-[14px] font-semibold tracking-[0.5px] text-black shadow-[rgba(0,0,0,0.06)_0px_1px_6px] transition-all duration-200 hover:scale-[1.05] active:scale-[0.85] sm:w-auto"
              title="Add asset"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Asset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
