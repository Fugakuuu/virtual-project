"use client";

import React, { useState, useRef } from "react";
import {
  User, Camera, Copy, Check, Mail, Terminal,
  Shield, Globe, Loader2, ShieldCheck,
  Home as HomeIcon,
  Zap as ZapIcon,
  LogOutIcon,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Dock from "@/components/ui/Dock";
import {OTPInput} from "@/components/ui/OTPInput";
import { signOut } from "next-auth/react";

interface ProfileClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    overlayToken?: string | null;
    isOAuth?: boolean;
  };
}

export const ProfileClient = ({ user }: ProfileClientProps) => {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email verification state
  const [isVerified, setIsVerified] = useState(!!user.emailVerified || !!user.isOAuth);
  const [verifying, setVerifying] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const dockItems = [
    { 
      icon: <HomeIcon size={18} />, 
      label: 'Home', 
      onClick: () => router.push('/') 
    },
    { 
      icon: <ZapIcon size={18} />, 
      label: 'Dashboard', 
      onClick: () => router.push('/dashboard') 
    },
    { 
      icon: <User size={18} />, 
      label: 'Profile', 
      onClick: () => router.push('/profile') 
    },
    { 
      icon: <LogOutIcon size={18} />, 
      label: 'Logout', 
      onClick: () => signOut({ callbackUrl: "/" }) 
    },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

      if (!response.ok) throw new Error("Gagal mengunggah gambar");
      
      const data = await response.json();
      setImage(data.url);
      
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.url }),
      });
      
    } catch (err) {
      setError("Gagal mengunggah gambar profil.");
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

      if (!response.ok) throw new Error("Gagal memperbarui profil");
      
      showNotification("Profile updated successfully", "success");
    } catch (err) {
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user.email) return;
    setVerifying(true);
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showNotification(data.error || "Failed to send code", "error");
      } else {
        setOtpStep(true);
        showNotification("Verification code sent to email", "success");
      }
    } catch (err) {
      showNotification("Failed to send code", "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!user.email || !otpCode) return;
    setVerifying(true);

    try {
      const res = await fetch("/api/user/profile/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.error || "Invalid code", "error");
      } else {
        setIsVerified(true);
        setOtpStep(false);
        showNotification("Email verified successfully!", "success");
      }
    } catch (err) {
      showNotification("Failed to verify code", "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!user.email) return;
    setVerifying(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.error || "Failed to send code", "error");
      } else {
        // Start 60-second timer
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        showNotification("New verification code sent", "success");
      }
    } catch (err) {
      showNotification("Failed to send code", "error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#3d4f58] pb-8">
        <div>
          <h1 className="font-archivo text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Profile{" "}
            <span className="text-[#00ed64] border-[#00ed64] pb-1">Settings</span>
          </h1>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-3 bg-[#1c2d38] px-5 py-2.5 rounded-[100px] border border-[#3d4f58]">
          <div className="h-2 w-2 rounded-full bg-[#00ed64] animate-pulse shadow-[0_0_8px_rgba(0,237,100,0.4)]" />
          <span className="font-mono text-[9px] font-semibold text-[#00ed64] uppercase tracking-[2.5px]">
            Auth Live
          </span>
        </div>
      </div>

      <div className="space-y-10 max-w-5xl">
        {/* ── Identity Module ── */}
        <div 
          className="bg-[#1c2d38] border border-[#3d4f58] rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}
        >
          {/* Glow accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ed64]/5 blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-[32px] bg-[#001e2b] border border-[#3d4f58] flex items-center justify-center overflow-hidden transition-all duration-500">
                  {image ? (
                    <img 
                      src={image} 
                      className="w-full h-full object-cover transition-transform duration-700 scale-105 hover:scale-110" 
                      alt="Avatar" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-[#5c6c75]">
                      <User size={64} strokeWidth={1} />
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-[2px]">No Image</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-4 rounded-[100px] bg-[#00684a] border border-[#00684a] text-black shadow-[rgba(0,0,0,0.06)_0px_1px_6px] hover:scale-[1.1] transition-all duration-200 active:scale-[0.85]"
                >
                  <Camera size={20} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div> 
            </div>

            {/* Form Column */}
            <div className="md:col-span-8 space-y-8">
              {/* Display Name Field */}
              <div className="space-y-3">
                <label className="font-mono text-[14px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] text-[#e8edeb] font-sans text-lg font-light focus:outline-none focus:border-[#00ed64]/50 focus:ring-2 focus:ring-[#00ed64]/10 transition-all placeholder:text-[#3d4f58]"
                    placeholder="Enter display name..."
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3d4f58]">
                    <Terminal size={16} />
                  </div>
                </div>
              </div>


              {/* Email Field (Read-only) */}
              <div className="space-y-3">
                <label className="font-mono text-[14px] font-medium uppercase tracking-[2px] text-[#5c6c75] flex items-center gap-2">
                  Primary Email
                </label>
                <div className="w-full h-14 px-6 bg-[#001e2b] border border-[#3d4f58] rounded-[4px] flex items-center">
                  <Mail size={16} className="text-[#5c6c75] mr-4" />
                  <p className="text-[#e8edeb] font-sans text-base font-light tracking-tight">{user.email}</p>
                  
                  {isVerified ? (
                    <div className="ml-auto px-3 py-1 bg-[#1c2d38] rounded-[100px] border border-[#3d4f58] flex items-center gap-2">
                      <ShieldCheck size={12} className="text-[#00ed64]" />
                      <span className="font-mono text-[9px] font-semibold text-[#00ed64] uppercase tracking-[2px]">Verified</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSendVerification}
                      disabled={verifying || otpStep}
                      className="ml-auto px-4 py-1.5 bg-[#1c2d38] rounded-[100px] border border-[#3d4f58] flex items-center gap-2 hover:bg-[#253945] transition-colors disabled:opacity-50"
                    >
                      {verifying && !otpStep ? <Loader2 size={12} className="animate-spin text-[#00ed64]" /> : <Shield size={12} className="text-[#5c6c75]" />}
                      <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-[2px]">
                        {verifying && !otpStep ? 'Sending...' : 'Verify Email'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Verification Form — separate card below email */}
              <AnimatePresence>
                {otpStep && !isVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-[#001e2b] border border-[#3d4f58] rounded-xl relative">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ed64]/5 blur-[80px] pointer-events-none" />

                      {/* Close */}
                      <button
                        onClick={() => { setOtpStep(false); setOtpCode(""); }}
                        className="absolute top-4 right-4 text-[#5c6c75] hover:text-white p-1.5 rounded-full hover:bg-[#1c2d38] transition-all"
                      >
                        <X size={14} />
                      </button>

                      <div className="relative z-10 space-y-5">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#00ed64]/10 border border-[#00ed64]/20 flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} className="text-[#00ed64]" />
                          </div>
                          <div>
                            <h4 className="font-archivo text-sm font-bold text-white tracking-tight">Enter Verification Code</h4>
                            <p className="text-[#5c6c75] text-xs font-sans">
                              6-digit code sent to <span className="text-[#e8edeb]">{user.email}</span>
                            </p>
                          </div>
                        </div>

                        {/* OTP Input + Actions row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <OTPInput value={otpCode} onChange={setOtpCode} />
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleVerifyOtp}
                              disabled={verifying || otpCode.length !== 6}
                              className="h-10 px-5 bg-[#00ed64] text-[#001e2b] rounded-lg font-bold uppercase tracking-[1px] text-[11px] hover:bg-[#00c854] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-[0_2px_8px_rgba(0,237,100,0.15)] hover:shadow-[0_4px_12px_rgba(0,237,100,0.25)] active:scale-[0.97] whitespace-nowrap"
                            >
                              {verifying ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                              {verifying ? 'Verifying...' : 'Verify'}
                            </button>
                          </div>
                        </div>

                        {/* Resend link */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#3d4f58]/30">
                          <button
                            onClick={handleResendOtp}
                            disabled={resendTimer > 0 || verifying}
                            className="text-[11px] font-mono text-[#5c6c75] hover:text-[#00ed64] transition-colors disabled:opacity-40 disabled:hover:text-[#5c6c75] uppercase tracking-[1px]"
                          >
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                          </button>
                          <span className="text-[10px] font-mono text-[#3d4f58] uppercase tracking-[1px]">
                            Code expires in 10 min
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-10 flex justify-end pt-8 border-t border-[#3d4f58]">
            <button
              onClick={handleSave}
              disabled={loading || (name === user.name && image === user.image)}
              className="btn-save-profile"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} strokeWidth={2.5} />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {/* ── Overlay Integration ── */}
        <div 
          className="bg-[#1c2d38] border border-[#3d4f58] rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}
        >
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-[#001e2b] border border-[#3d4f58] rounded-xl">
                <Globe size={20} className="text-[#00ed64]" />
              </div>
              <h2 className="font-archivo text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
                Overlay{" "}
                <span className="text-[#00ed64] border-b-2 border-[#00ed64] pb-0.5">Integration</span>
              </h2>
            </div>
            <p className="font-mono text-[14px] font-medium text-[#5c6c75] uppercase tracking-[2px] ml-[52px]">
              Browser Source // Stream Studio
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#001e2b] border border-[#3d4f58] space-y-8">
            {/* URL + Copy */}
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1 w-full space-y-2">
                <label className="font-mono text-[10px] font-semibold uppercase tracking-[2px] text-[#5c6c75] ml-1">
                  Secure Endpoint
                </label>
                <div className="relative">
                  <div className="w-full h-14 bg-[#1c2d38] rounded-[4px] px-5 flex items-center overflow-hidden border border-[#3d4f58] focus-within:border-[#00ed64]/30 transition-all">
                    <code className="text-[13px] text-[#00ed64] font-mono truncate select-all font-medium">
                      {mounted ? overlayUrl : "INITIALIZING_ENDPOINT..."}
                    </code>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ed64] animate-ping opacity-20 pointer-events-none" />
                </div>
              </div>

              {/* Copy Button — Dark Teal style */}
              <button 
                onClick={handleCopy}
                className={`h-14 w-full md:w-48 rounded-[100px] flex items-center justify-center transition-all duration-300 border font-mono font-semibold text-[12px] tracking-[2px] uppercase ${
                  copied 
                  ? "bg-[#00ed64] text-black border-[#00ed64] shadow-[0_0_20px_rgba(0,237,100,0.2)]" 
                  : "bg-[#1c2d38] text-[#5c6c75] border-[#3d4f58] hover:bg-[#1eaedb] hover:text-white hover:border-[#1eaedb] hover:translate-x-[5px]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </div>
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-start gap-5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Shield size={20} />
              </div>
              <div className="space-y-1.5">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[2px] text-red-500">Encryption Notice</p>
                <p className="font-sans text-[14px] text-red-400/60 font-light leading-relaxed max-w-2xl">
                  This URL contains a unique session key. Sharing this endpoint will compromise your broadcast security, allowing external entities to manipulate your scene output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-24 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-xl border shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md ${
              notification.type === 'success' 
                ? 'bg-[#00ed64]/10 border-[#00ed64]/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            {notification.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-[#00ed64]/20 flex items-center justify-center text-[#00ed64]">
                <Check size={16} strokeWidth={3} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <Shield size={16} strokeWidth={3} />
              </div>
            )}
            <span className={`font-mono text-[13px] font-medium tracking-[1px] uppercase ${
              notification.type === 'success' ? 'text-[#00ed64]' : 'text-red-500'
            }`}>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dock Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-2">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={140}
          />
        </div>
      </div>
    </div>
  );
};
