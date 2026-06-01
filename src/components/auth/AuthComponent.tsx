"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Github, 
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

// --- Components ---

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ed64]/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-[#00ed64] text-[#001e2b] hover:bg-[#00c854] shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] font-bold",
        glass: "bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white backdrop-blur-md",
        ghost: "text-white/60 hover:text-white hover:bg-white/5",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#00ed64]/20 bg-black/20 px-4 py-2 text-[13px] text-white placeholder:text-white/30",
          "focus:outline-none focus:ring-1 focus:ring-[#00ed64]/50 focus:border-[#00ed64]/50",
          "transition-all duration-800",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Auth Component Logic ---

type Step = "identifier" | "password" | "register" | "social-redirect";

const variants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 20 : -20,
    scale: 0.95,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -20 : 20,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
  }),
};

export function AuthComponent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("identifier");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInfo, setEmailInfo] = useState<{
    exists: boolean;
    hasPassword?: boolean;
    providers?: string[];
  } | null>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedStep = sessionStorage.getItem("authStep") as Step | null;
      const savedEmail = sessionStorage.getItem("authEmail");
      const savedEmailInfo = sessionStorage.getItem("authEmailInfo");

      if (savedStep && savedEmail) {
        setStep(savedStep);
        setEmail(savedEmail);
        if (savedEmailInfo) {
          setEmailInfo(JSON.parse(savedEmailInfo));
        }
      }
    } catch (e) {
      console.error("Failed to load auth state from session storage");
    }
    setMounted(true);
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem("authStep", step);
      sessionStorage.setItem("authEmail", email);
      if (emailInfo) {
        sessionStorage.setItem("authEmailInfo", JSON.stringify(emailInfo));
      } else {
        sessionStorage.removeItem("authEmailInfo");
      }
    }
  }, [step, email, emailInfo, mounted]);

  const navigateTo = (newStep: Step, dir: number) => {
    setDirection(dir);
    setStep(newStep);
    setError(null);
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setEmailInfo(data);

      if (data.exists) {
        if (data.hasPassword) {
          navigateTo("password", 1);
        } else {
          navigateTo("social-redirect", 1);
        }
      } else {
        navigateTo("register", 1);
      }
    } catch (err) {
      setError("Failed to check email status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid password. Please try again.");
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00ed64", "#ffffff", "#00684a"],
        });
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00ed64", "#ffffff", "#00684a"],
        });
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      }
    } catch (err) {
      setError("Registration failed. Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const reset = () => {
    navigateTo("identifier", -1);
    setEmailInfo(null);
    setPassword("");
    setOtp("");
    sessionStorage.removeItem("authStep");
    sessionStorage.removeItem("authEmail");
    sessionStorage.removeItem("authEmailInfo");
  };

  if (!mounted) return null;

  return (
    <motion.div 
      layout
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[350px] mx-auto relative group z-1"
    >
      <motion.div 
        layout
        className="relative bg-gradient-to-b from-[#00283a]/80 to-[#001e2b] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden p-8 flex flex-col items-center border border-[#00ed64]/10 text-white transition-colors duration-500"
      >
        <AnimatePresence mode="wait" custom={direction}>
          {step === "identifier" && (
            <motion.div
              key="identifier"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold uppercase font-archivo mb-2 text-center text-white mt-4">
                Sign in to continue
              </h2>
              <p className="text-white/50 text-[13px] mb-6 text-center">
                Enter your email to access your workspace
              </p>

              <form onSubmit={handleIdentifierSubmit} className="w-full flex flex-col gap-3 mb-2">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00ed64] transition-colors duration-300" />
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>

                {error && (
                  <div className="text-xs text-red-400 text-left">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-[#00ed64] to-[#00c854] text-[#001e2b] font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:brightness-110 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 flex justify-center items-center h-12"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                </button>
              </form>

              <div className="flex items-center w-full my-4">
                <div className="flex-grow border-t border-dashed border-white/20"></div>
                <span className="mx-3 text-xs text-white/40">Or continue with</span>
                <div className="flex-grow border-t border-dashed border-white/20"></div>
              </div>

              <div className="flex gap-3 w-full justify-center mt-2">
                <button 
                  type="button"
                  onClick={() => handleSocialSignIn("google")}
                  className="flex items-center justify-center h-12 rounded-xl border border-[#00ed64]/20 bg-black/20 hover:bg-white/10 transition grow"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialSignIn("github")}
                  className="flex items-center justify-center h-12 rounded-xl border border-[#00ed64]/20 bg-black/20 hover:bg-white/10 transition grow"
                >
                  <Github size={20} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "password" && (
            <motion.div
              key="password"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center relative"
            >
              <button onClick={reset} className="absolute -left-2 -top-2 text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              
              <h2 className="text-2xl font-bold uppercase font-archivo mb-2 text-center text-white mt-10">
                Verify password
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-[#00ed64]/20 text-[13px] mb-6">
                <Mail size={12} className="text-white/40 mr-2" />
                <span className="text-white/80 truncate max-w-[200px]">{email}</span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-3">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00ed64] transition-colors duration-300" />
                  <Input
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11"
                    autoFocus
                    required
                  />
                </div>

                <div className="w-full flex justify-end mb-1">
                  <button type="button" className="text-xs text-[#00ed64]/80 hover:text-[#00ed64] hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="text-xs text-red-400 text-left mb-1">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-[#00ed64] to-[#00c854] text-[#001e2b] font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:brightness-110 cursor-pointer transition flex justify-center items-center mt-2 h-12"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
              </form>
            </motion.div>
          )}

          {step === "register" && (
            <motion.div
              key="register"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center relative"
            >
              <button onClick={reset} className="absolute -left-2 -top-2 text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              
              <h2 className="text-2xl font-bold uppercase font-archivo mb-2 text-center text-white mt-10">
                Create account
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-[#00ed64]/20 text-[13px] mb-6">
                <Mail size={12} className="text-white/40 mr-2" />
                <span className="text-white/80 truncate max-w-[180px]">{email}</span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-3">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00ed64] transition-colors duration-300" />
                  <Input
                    placeholder="Display Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11"
                    autoFocus
                    required
                  />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00ed64] transition-colors duration-300" />
                  <Input
                    placeholder="Create Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>

                {error && (
                  <div className="text-xs text-red-400 text-left mb-1">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-[#00ed64] to-[#00c854] text-[#001e2b] font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:brightness-110 cursor-pointer transition mt-3 flex justify-center items-center h-12"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Started"}
                </button>
              </form>
            </motion.div>
          )}

          {step === "social-redirect" && (
            <motion.div
              key="social-redirect"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center relative"
            >
              <button onClick={reset} className="absolute -left-2 -top-2 text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>

              <h2 className="text-2xl font-bold uppercase font-archivo mb-2 text-center text-white mt-10">
                Secure Login Required
              </h2>
              <p className="text-white/50 text-[13px] mb-6 text-center leading-relaxed">
                This account is managed by <span className="text-white font-medium">{emailInfo?.providers?.[0]?.toUpperCase()}</span>.<br/>
                Please use the provider link below.
              </p>

              <div className="w-full flex flex-col gap-3">
                {emailInfo?.providers?.includes("google") && (
                  <button 
                    type="button"
                    onClick={() => handleSocialSignIn("google")}
                    className="flex items-center justify-center gap-3 h-12 rounded-xl border border-[#00ed64]/20 bg-black/20 hover:bg-white/10 transition w-full text-white font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                )}
                {emailInfo?.providers?.includes("github") && (
                  <button 
                    type="button"
                    onClick={() => handleSocialSignIn("github")}
                    className="flex items-center justify-center gap-3 h-12 rounded-xl border border-[#00ed64]/20 bg-black/20 hover:bg-white/10 transition w-full text-white font-medium"
                  >
                    <Github size={20} className="text-white" />
                    Continue with GitHub
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
