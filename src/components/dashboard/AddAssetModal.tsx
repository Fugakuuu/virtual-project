"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Check, Loader2, Plus, Terminal, Database } from "lucide-react";
import { TactileButton } from "@/components/ui/TactileButton";
import { Asset } from "@/types/asset";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DocumentPortal } from "@/components/ui/DocumentPortal";
import { lockBodyScroll } from "@/lib/body-scroll-lock";

interface AddAssetModalProps {
  onClose: () => void;
  onSuccess: (asset: Asset) => void;
}

export const AddAssetModal = ({ onClose, onSuccess }: AddAssetModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"IMAGE" | "AUDIO" | "VIDEO" | "GIF">("IMAGE");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [autoHide, setAutoHide] = useState(true);
  const [exitAnimation, setExitAnimation] = useState<string>("fade");
  const [chromaKey, setChromaKey] = useState(false);
  const [chromaColor, setChromaColor] = useState("#00ff00");

  // Auto-detect asset type from file MIME
  const detectType = (f: File): "IMAGE" | "AUDIO" | "VIDEO" | "GIF" => {
    const mime = f.type.toLowerCase();
    if (mime === "image/gif") return "GIF";
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime.startsWith("audio/")) return "AUDIO";
    if (mime.startsWith("video/")) return "VIDEO";
    return "IMAGE";
  };

  const handleFileDrop = (droppedFile: File) => {
    setFile(droppedFile);
    setType(detectType(droppedFile));
    // Auto-fill name from filename if empty
    if (!name) {
      const baseName = droppedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setName(baseName);
    }
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    const release = lockBodyScroll();
    return release;
  }, []);

  const handleUpload = async () => {
    if (!name || !file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);
    
    if (autoHide) {
      const finalDuration = type === "AUDIO" ? Math.min(duration, 30) : duration;
      formData.append("duration", finalDuration.toString());
    } else {
      formData.append("duration", "null");
    }
    
    formData.append("exitAnimation", exitAnimation);
    formData.append("chromaKey", chromaKey.toString());
    formData.append("chromaColor", chromaColor);

    try {
      const response = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal mengunggah aset");

      const newAsset = await response.json();
      onSuccess(newAsset);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah aset");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DocumentPortal>
    <div className="fixed inset-0 z-[520] flex items-end justify-center bg-[#001e2b]/85 p-0 backdrop-blur-md sm:items-center sm:p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-[521] flex max-h-[min(92dvh,880px)] w-full max-w-xl flex-col overflow-hidden rounded-t-[24px] border border-b-0 border-[#3d4f58] bg-[#1c2d38] sm:rounded-[24px] sm:border-b"
        style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {/* ── Header ── */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#001e2b] border border-[#3d4f58] flex items-center justify-center text-[#00ed64]">
                <Plus size={24} strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-archivo text-2xl font-bold text-white uppercase leading-none mb-1.5">
                  Deploy <span className="text-[#00ed64]">Asset</span>
                </h2>
                <p className="font-mono text-[10px] font-semibold text-[#5c6c75] uppercase tracking-[2px]">
                  Initialization you Asset
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-xl bg-[#001e2b] border border-[#3d4f58] text-[#5c6c75] hover:text-white hover:border-[rgba(0,237,100,0.25)] transition-all"
              aria-label="Close add asset dialog"
              title="Close"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div className="space-y-6">
            {/* ── Name Input ── */}
            <div className="space-y-2.5">
              <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] ml-1">
                Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4f58] group-focus-within:text-[#00ed64] transition-colors">
                  <Terminal size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 pl-12 pr-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] text-[#e8edeb] font-sans text-base font-light focus:outline-none focus:border-[#00ed64]/50 focus:ring-2 focus:ring-[#00ed64]/10 transition-all placeholder:text-[#3d4f58]"
                  placeholder="Masukkan nama aset..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* ── Type Selection ── */}
              <div className="space-y-2.5">
                <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] ml-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["IMAGE", "GIF", "AUDIO", "VIDEO"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setType(opt as any)}
                      className={cn(
                        "py-3 rounded-[100px] font-mono font-semibold text-[10px] uppercase tracking-[2px] transition-all duration-200 border",
                        type === opt 
                          ? "bg-[#00684a] text-black border-[#00684a] shadow-[rgba(0,0,0,0.06)_0px_1px_6px]" 
                          : "bg-[#001e2b] border-[#3d4f58] text-[#5c6c75] hover:border-[rgba(0,237,100,0.25)] hover:text-[#b8c4c2]"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Duration Slider ── */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75]">
                    Duration
                  </label>
                  <button 
                    onClick={() => setAutoHide(!autoHide)}
                    className={cn(
                      "font-mono text-[9px] font-semibold px-3 py-1 rounded-[100px] border transition-all uppercase tracking-[2px]",
                      autoHide 
                        ? "border-[#00ed64] text-[#00ed64] bg-[rgba(0,237,100,0.05)]" 
                        : "border-[#3d4f58] text-[#5c6c75]"
                    )}
                  >
                    {autoHide ? "Timed" : "Hold"}
                  </button>
                </div>
                <div className="h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] flex items-center">
                  {!autoHide ? (
                    <span className="font-mono text-[11px] text-[#3d4f58] uppercase tracking-[2px]">Manual</span>
                  ) : (
                    <div className="w-full flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max={type === "AUDIO" ? 30 : 60}
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#3d4f58]/40 rounded-full appearance-none cursor-pointer accent-[#00ed64]"
                      />
                      <span className="font-mono font-semibold text-[12px] text-[#00ed64] min-w-[36px] text-right tracking-[1px]">
                        {duration}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── File Upload ── */}
            <div className="space-y-2.5">
              <label className="font-mono text-[12px] font-medium uppercase tracking-[2px] text-[#5c6c75] ml-1">
                Upload File
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={cn(
                  "relative w-full min-h-[120px] px-6 py-5 bg-[#001e2b] border-2 border-dashed rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 group",
                  isDragging
                    ? "border-[#00ed64] bg-[rgba(0,237,100,0.06)] scale-[1.02] shadow-[0_0_30px_rgba(0,237,100,0.08)]"
                    : file 
                      ? "border-[#00684a] bg-[rgba(0,237,100,0.03)] border-solid" 
                      : "border-[#3d4f58] hover:border-[rgba(0,237,100,0.25)]"
                )}
              >
                {/* Drag overlay indicator */}
                {isDragging && (
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-[rgba(0,237,100,0.04)] z-10 pointer-events-none">
                    <Upload size={32} className="text-[#00ed64] mb-2 animate-bounce" />
                    <span className="font-mono text-[12px] font-semibold text-[#00ed64] uppercase tracking-[2px]">
                      Drop file here
                    </span>
                  </div>
                )}

                <div className={cn("flex items-center gap-4", isDragging && "opacity-20")}>
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    file 
                      ? "bg-[#00684a] text-black" 
                      : "bg-[#1c2d38] border border-[#3d4f58] text-[#5c6c75] group-hover:text-[#00ed64] group-hover:border-[rgba(0,237,100,0.25)]"
                  )}>
                    <Upload size={20} />
                  </div>
                  <div>
                    <span className={cn(
                      "block text-[14px] font-sans transition-colors",
                      file ? "text-white font-medium" : "text-[#5c6c75] font-light"
                    )}>
                      {file ? file.name : "Click or drag file here"}
                    </span>
                    <span className="font-mono text-[9px] text-[#3d4f58] uppercase tracking-[2px]">
                      {file 
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type || "unknown"}` 
                        : "Drag from file manager or click to browse"
                      }
                    </span>
                  </div>
                </div>
                {file && !isDragging && <Check size={20} className="text-[#00ed64]" />}
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileDrop(f);
                }}
                className="hidden"
              />
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-4 pt-6 border-t border-[#3d4f58]">
              <TactileButton
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </TactileButton>
              <TactileButton
                variant="primary"
                onClick={handleUpload}
                disabled={!name || !file || isUploading}
                className="flex-[2] gap-3"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Database size={18} />
                    Deploy
                  </>
                )}
              </TactileButton>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </DocumentPortal>
  );
};
