"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TactileButton } from "@/components/ui/TactileButton";
import { DocumentPortal } from "@/components/ui/DocumentPortal";
import { lockBodyScroll } from "@/lib/body-scroll-lock";
import { X, Maximize, Clock, Volume2, Trash2, ShieldCheck, Terminal, Sliders, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Asset } from "@/types/asset";

export const AssetSettingsModal = ({ 
  asset, 
  onClose, 
  onSave,
  onDelete
}: { 
  asset: Asset; 
  onClose: () => void; 
  onSave: (updated: Asset) => void | Promise<void>;
  onDelete?: () => void;
}) => {
  const [settings, setSettings] = useState(asset);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const release = lockBodyScroll();
    return release;
  }, []);

  return (
    <DocumentPortal>
    <div className="fixed inset-0 z-[520] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6 bg-[#001e2b]/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-[521] flex max-h-[min(92dvh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-[24px] border border-b-0 border-[#3d4f58] bg-[#1c2d38] sm:rounded-[24px] sm:border-b"
        style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-settings-title"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {/* ── Header ── */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#3d4f58]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#001e2b] border border-[#3d4f58] flex items-center justify-center text-[#00ed64]">
                <Sliders size={22} strokeWidth={2} />
              </div>
              <div>
                <h2 id="asset-settings-title" className="font-archivo text-2xl font-bold text-white uppercase leading-none mb-1.5">
                  Asset <span className="text-[#00ed64]">Configuration</span>
                </h2>
                <p className="font-mono text-[10px] font-semibold text-[#5c6c75] uppercase tracking-[2px]">
                  Asset // {asset.id?.slice(0, 8)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-xl bg-[#001e2b] border border-[#3d4f58] text-[#5c6c75] hover:text-white hover:border-[rgba(0,237,100,0.25)] transition-all"
              aria-label="Close settings"
              title="Close"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div className="space-y-8">
            {/* ── Control Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Scale Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                    <Maximize size={13} strokeWidth={2.5} /> Scale
                  </label>
                  <span className="font-mono text-[12px] text-[#00ed64] font-semibold tracking-[1px]">
                    {settings.scale.toFixed(1)}×
                  </span>
                </div>
                <div className="h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] flex items-center">
                  <input 
                    type="range" min="0.1" max="3" step="0.1"
                    value={settings.scale}
                    onChange={(e) => setSettings({ ...settings, scale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#3d4f58]/40 rounded-full appearance-none cursor-pointer accent-[#00ed64]"
                  />
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                    <Volume2 size={13} strokeWidth={2.5} /> Volume
                  </label>
                  <span className="font-mono text-[12px] text-[#00ed64] font-semibold tracking-[1px]">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                <div className="h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] flex items-center">
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={settings.volume}
                    onChange={(e) => setSettings({ ...settings, volume: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-[#3d4f58]/40 rounded-full appearance-none cursor-pointer accent-[#00ed64]"
                  />
                </div>
              </div>

              {/* Duration Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                    <Clock size={13} strokeWidth={2.5} /> Duration
                  </label>
                  <button 
                    onClick={() => setSettings({ ...settings, duration: settings.duration === null ? 5 : null })}
                    className={cn(
                      "font-mono text-[9px] font-semibold px-3 py-1 rounded-[100px] border transition-all uppercase tracking-[2px]",
                      settings.duration !== null 
                        ? "border-[#00ed64] text-[#00ed64] bg-[rgba(0,237,100,0.05)]" 
                        : "border-[#3d4f58] text-[#5c6c75]"
                    )}
                  >
                    {settings.duration !== null ? "Timed" : "Persistent"}
                  </button>
                </div>
                <div className="h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] flex items-center">
                  {settings.duration !== null ? (
                    <div className="w-full flex items-center gap-4">
                      <input 
                        type="range" min="1" max={settings.type === "AUDIO" ? 30 : 60} step="1"
                        value={settings.duration || 5}
                        onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
                        className="w-full h-1 bg-[#3d4f58]/40 rounded-full appearance-none cursor-pointer accent-[#00ed64]"
                      />
                      <span className="font-mono font-semibold text-[12px] text-[#00ed64] min-w-[36px] text-right tracking-[1px]">
                        {settings.duration}s
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-[11px] text-[#3d4f58] uppercase tracking-[2px] mx-auto">
                      Infinite
                    </span>
                  )}
                </div>
              </div>

              {/* Transition Selection */}
              <div className="space-y-3">
                <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] px-1">
                  Exit Animation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["fade", "slide-up", "zoom-out", "none"].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSettings({ ...settings, exitAnimation: opt })}
                      className={cn(
                        "py-3 rounded-[100px] font-mono font-semibold text-[10px] uppercase tracking-[2px] transition-all duration-200 border",
                        settings.exitAnimation === opt 
                          ? "bg-[#00684a] text-black border-[#00684a] shadow-[rgba(0,0,0,0.06)_0px_1px_6px]" 
                          : "bg-[#001e2b] border-[#3d4f58] text-[#5c6c75] hover:border-[rgba(0,237,100,0.25)] hover:text-[#b8c4c2]"
                      )}
                    >
                      {opt.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chroma Key Control */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                    <ShieldCheck size={13} strokeWidth={2.5} /> Chroma Key
                  </label>
                  <button 
                    onClick={() => setSettings({ ...settings, chromaKey: !settings.chromaKey })}
                    className={cn(
                      "font-mono text-[9px] font-semibold px-3 py-1 rounded-[100px] border transition-all uppercase tracking-[2px]",
                      settings.chromaKey 
                        ? "border-[#00ed64] text-[#00ed64] bg-[rgba(0,237,100,0.05)]" 
                        : "border-[#3d4f58] text-[#5c6c75]"
                    )}
                  >
                    {settings.chromaKey ? "Active" : "Off"}
                  </button>
                </div>
                <div className="relative flex items-center h-14 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] overflow-hidden group focus-within:border-[#00ed64]/30 transition-all">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#001e2b] border-r border-[#3d4f58]">
                    <input 
                      type="color"
                      value={settings.chromaColor || "#00ff00"}
                      onChange={(e) => setSettings({ ...settings, chromaColor: e.target.value })}
                      disabled={!settings.chromaKey}
                      className="w-9 h-9 bg-transparent border-none cursor-pointer disabled:opacity-10 disabled:grayscale rounded-lg overflow-hidden"
                    />
                  </div>
                  <div className="absolute left-[72px] text-[#3d4f58]">
                    <Terminal size={14} />
                  </div>
                  <input 
                    type="text"
                    value={settings.chromaColor || "#00ff00"}
                    onChange={(e) => setSettings({ ...settings, chromaColor: e.target.value })}
                    disabled={!settings.chromaKey}
                    className="flex-1 bg-transparent pl-10 pr-6 font-mono text-[14px] font-light text-[#e8edeb] outline-none disabled:opacity-20 uppercase tracking-[2px]"
                    placeholder="#00FF00"
                  />
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="space-y-5 pt-6 border-t border-[#3d4f58]">
              <div className="flex gap-4">
                <TactileButton
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </TactileButton>
                <TactileButton
                  variant="primary"
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      await onSave(settings);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="flex-[2] gap-3"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
                  {isSaving ? "Saving..." : "Save Changes"}
                </TactileButton>
              </div>
              
              {onDelete && (
                <button 
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#5c6c75] hover:text-red-400 transition-all duration-300 group py-2"
                >
                  <Trash2 size={14} strokeWidth={2.5} className="group-hover:translate-y-[-1px] transition-transform" />
                  Delete Asset
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </DocumentPortal>
  );
};
