"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Save, Loader2, Camera, Copy, Check, 
  Zap, Mail, CreditCard, Shield, 
  Settings2, Activity, Info, BarChart3, Lock,
  ExternalLink, Fingerprint, Globe, Terminal, Cpu
} from "lucide-react";
import { TactileButton } from "@/components/ui/TactileButton";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    overlayToken?: string | null;
  };
  onClose: () => void;
  onUpdate: (data: { name?: string; image?: string }) => void;
}

export const ProfileModal = ({ user, onClose, onUpdate }: ProfileModalProps) => {
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const metrics = [
    { label: "Signal Velocity", value: "42ms", icon: <Activity size={14} /> },
    { label: "Regional Node", value: "South East", icon: <Globe size={14} /> },
    { label: "Access Level", value: "Tier 1", icon: <Shield size={14} /> },
  ];

  const overlayUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/overlay/${user.id}?t=${user.overlayToken}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      setImage(data.url);
      
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.url }),
      });
      
      onUpdate({ image: data.url });
    } catch (err) {
      setError("Avatar upload encountered an error.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      onUpdate({ name });
      onClose();
    } catch (err) {
      setError("Profile synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-forest-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-4xl bg-forest-dark border border-teal-gray/20 rounded-[24px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar glass-surface"
      >
        <div className="p-10 md:p-14">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-12 pb-8 border-b border-teal-gray/10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                <Fingerprint size={28} />
              </div>
              <div>
                <h2 className="text-4xl font-archivo font-bold text-white tracking-tight uppercase">
                  User <span className="text-neon-green/40">Integrity</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  <p className="label-technical text-[9px] text-silver-teal/40 uppercase">Connection::Established // Node_Status::Online</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-white/5 text-silver-teal/30 hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Identity Core */}
            <div className="lg:col-span-4 space-y-10">
              <div className="relative flex justify-center">
                <div className="w-56 h-56 rounded-[20px] bg-forest-black/50 flex items-center justify-center overflow-hidden border border-teal-gray/20 relative group">
                  {image ? (
                    <img src={image} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <User size={64} className="text-silver-teal/10" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-forest-black/90 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="animate-spin text-neon-green" size={32} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-4 -right-4 w-14 h-14 rounded-xl bg-neon-green text-forest-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                >
                  <Camera size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-[10px] bg-forest-black/50 border border-teal-gray/10 space-y-2">
                   <p className="label-technical text-[10px] text-silver-teal/30 flex items-center gap-2 uppercase">
                     <Mail size={12} strokeWidth={2.5} /> VERIFICATION_NODE
                   </p>
                   <p className="text-white font-medium text-sm truncate">{user.email || "identity@secure.node"}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-[10px] bg-neon-green/5 border border-neon-green/20 flex items-center justify-between">
                    <div>
                      <p className="label-technical text-[9px] text-neon-green/40 uppercase">Access Clearance</p>
                      <p className="text-white font-archivo font-bold text-lg uppercase">LEVEL_04</p>
                    </div>
                    <Shield size={24} className="text-neon-green opacity-40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interaction & Data */}
            <div className="lg:col-span-8 space-y-10">
              {/* Alias Field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="label-technical text-[10px] text-silver-teal/50 uppercase">Identity Alias</label>
                  {error && <span className="label-technical text-[10px] text-red-400 uppercase">{error}</span>}
                </div>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neon-green/20 group-focus-within:text-neon-green transition-colors">
                     <Terminal size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-16 pl-16 pr-8 bg-forest-black/50 border border-teal-gray/10 rounded-[10px] text-white font-archivo font-bold text-xl focus:outline-none focus:border-neon-green/30 transition-all placeholder:text-silver-teal/10 uppercase"
                    placeholder="Enter Alias..."
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-4">
                <p className="label-technical text-[10px] text-silver-teal/50 px-1">System Diagnostics</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.map((m, i) => (
                    <div key={i} className="bg-forest-black/30 p-5 rounded-[10px] border border-teal-gray/10 group hover:border-neon-green/20 transition-all">
                      <div className="text-silver-teal/20 mb-3 group-hover:text-neon-green transition-colors">
                        {m.icon}
                      </div>
                      <p className="text-xl font-bold text-white tracking-tight leading-none mb-2">{m.value}</p>
                      <p className="label-technical text-[9px] text-silver-teal/30 uppercase">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay Pipeline */}
              <div className="p-8 rounded-[10px] bg-forest-black/50 border border-teal-gray/10 space-y-8 relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                        <Zap size={20} strokeWidth={2.5} />
                     </div>
                     <div>
                       <span className="label-technical text-[10px] text-neon-green block uppercase">Stream Pipeline</span>
                       <span className="label-technical text-[9px] text-silver-teal/20 uppercase tracking-widest">Relay::Secure_Tunnel_v2</span>
                     </div>
                  </div>
                  <AnimatePresence>
                    {copied && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 px-3 py-1 bg-neon-green/10 rounded-md border border-neon-green/20"
                      >
                         <Check size={10} strokeWidth={3} className="text-neon-green" />
                         <span className="label-technical text-[8px] text-neon-green uppercase font-bold">Protocol_Copied</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                   <div className="flex-1 h-14 bg-forest-dark rounded-[10px] px-6 flex items-center overflow-hidden border border-teal-gray/10">
                      <code className="label-technical text-[11px] text-silver-teal font-medium truncate select-all opacity-40 group-hover:opacity-80 transition-opacity">{overlayUrl}</code>
                   </div>
                   <button 
                     onClick={handleCopy}
                     className={cn(
                       "w-14 h-14 rounded-[10px] flex items-center justify-center transition-all duration-500 active:scale-95",
                       copied 
                       ? "bg-neon-green text-forest-black shadow-lg shadow-neon-green/20" 
                       : "bg-forest-black border border-teal-gray/20 text-silver-teal/40 hover:text-white"
                     )}
                   >
                     {copied ? <Check size={24} strokeWidth={2.5} /> : <Copy size={24} strokeWidth={2} />}
                   </button>
                </div>

                <div className="flex items-start gap-4 p-5 bg-neon-green/5 rounded-[10px] border border-neon-green/10">
                  <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                    <Info size={14} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="label-technical text-[10px] text-neon-green/60 uppercase mb-1">Security Directive</p>
                    <p className="text-[10px] text-silver-teal/40 leading-relaxed font-medium">
                      Sharing this tunnel endpoint allows external control of your display nodes. Only provide this to high-trust streaming instances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Array */}
              <div className="flex gap-4">
                <TactileButton
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 border-teal-gray/10 text-white hover:bg-white/5"
                >
                  ABORT
                </TactileButton>
                <TactileButton
                  variant="primary"
                  onClick={handleSave}
                  disabled={loading || !name.trim()}
                  className="flex-[2] gap-4 bg-neon-green text-forest-black hover:bg-neon-green/90 shadow-xl shadow-neon-green/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={18} />
                      SYNCHRONIZE_PROFILE
                    </>
                  )}
                </TactileButton>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
