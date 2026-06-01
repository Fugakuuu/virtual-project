"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
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
  AlertCircle,
  Eye,
  EyeOff
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

interface FormFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
  autoFocus?: boolean;
  required?: boolean;
}

const AnimatedFormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  showToggle,
  onToggle,
  showPassword,
  autoFocus,
  required
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 ease-in-out focus-within:border-[#00ed64]/50 focus-within:ring-1 focus-within:ring-[#00ed64]/50"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors duration-200 group-focus-within:text-[#00ed64]">
          {icon}
        </div>
        
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className="w-full bg-transparent pl-11 pr-12 py-3 h-11 text-[13px] text-white placeholder:text-transparent focus:outline-none"
          placeholder={placeholder}
        />
        
        <label className={`absolute left-11 transition-all duration-200 ease-in-out pointer-events-none ${
          isFocused || value 
            ? 'top-2 text-[10px] text-[#00ed64] font-medium' 
            : 'top-1/2 -translate-y-1/2 text-[13px] text-white/30'
        }`}>
          {placeholder}
        </label>

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {isHovering && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 237, 100, 0.1) 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    </div>
  );
};

const SocialButton: React.FC<{ icon: React.ReactNode; name: string; onClick: () => void }> = ({ icon, name, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      type="button"
      className="relative flex items-center justify-center gap-2 group p-3 h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-[#00ed64]/10 via-transparent to-transparent transition-transform duration-500 ${
        isHovered ? 'translate-x-0' : '-translate-x-full'
      }`} />
      <div className="relative text-white flex items-center gap-2 text-sm group-hover:text-[#00ed64] transition-colors">
        {icon}
        <span>{name}</span>
      </div>
    </button>
  );
};

// --- Auth Component Logic ---

type Step = "identifier" | "password" | "register" | "social-redirect";

const variants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.98,
    transition: { duration: 1.2, delay:0.5, ease: [0.16, 1, 0.3, 1] }
  }),
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    scale: 1,
    transition: { duration: 1.2, delay:0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: (direction: number) => ({
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.98,
    transition: { duration: 1.2, delay:0.5, ease: [0.16, 1, 0.3, 1] }
  }),
};

export function AuthComponent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identifier");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailInfo, setEmailInfo] = useState<{
    exists: boolean;
    hasPassword?: boolean;
    providers?: string[];
  } | null>(null);

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
  };

  return (
    <motion.div 
      layout
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[350px] mx-auto relative group"
    >
      {/* Glassmorphic Container */}
      <motion.div 
        layout
        className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden p-6 sm:p-7 min-h-[380px] flex flex-col transition-colors duration-500 hover:border-white/10"
      >
        
        {/* Subtle top glare effect */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <AnimatePresence mode="wait" custom={direction}>
          {step === "identifier" && (
            <motion.div
              key="identifier"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col justify-center space-y-6"
            >
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-archivo text-white font-bold uppercase">Sign in to continue</h2>
                <p className="text-white/40 text-[13px]">Enter your email to access your workspace</p>
              </div>

              <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                <AnimatedFormField
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button type="submit" className="w-full group" isLoading={loading}>
                  Continue 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-mono">
                  <span className="bg-[#042431] px-4 text-white/30 rounded-full py-1 border border-white/5 backdrop-blur-md">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SocialButton 
                  onClick={() => handleSocialSignIn("google")} 
                  name="Google"
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  }
                />
                <SocialButton 
                  onClick={() => handleSocialSignIn("github")} 
                  name="GitHub"
                  icon={<Github size={16} />}
                />
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
              className="flex-1 flex flex-col justify-center space-y-6"
            >
              <button onClick={reset} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors group w-fit">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> 
                </div>
                Back
              </button>
              
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-archivo text-white font-bold uppercase">Verify password</h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[13px]">
                  <Mail size={12} className="text-white/40 mr-2" />
                  <span className="text-white/80 truncate max-w-[200px]">{email}</span>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <AnimatedFormField
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                  autoFocus
                  required
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button type="submit" className="w-full" isLoading={loading}>
                  Sign In
                </Button>
              </form>

              <button className="text-[#00ed64]/60 hover:text-[#00ed64] text-xs font-medium transition-colors mx-auto block mt-4">
                Forgot password?
              </button>
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
              className="flex-1 flex flex-col justify-center space-y-6"
            >
              <button onClick={reset} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors group w-fit">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> 
                </div>
                Back
              </button>

              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-archivo text-white font-bold uppercase">Create account</h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[13px]">
                  <Mail size={12} className="text-white/40 mr-2" />
                  <span className="text-white/80 truncate max-w-[180px]">{email}</span>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <AnimatedFormField
                  type="text"
                  placeholder="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  autoFocus
                  required
                />
                
                <AnimatedFormField
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                  required
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button type="submit" className="w-full" isLoading={loading}>
                  Create Account
                </Button>
              </form>

              <p className="text-[10px] text-white/30 text-center font-mono tracking-widest uppercase leading-relaxed mt-4">
                By continuing, you agree to our <br/> Terms of Service and Privacy Policy.
              </p>
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
              className="flex-1 flex flex-col justify-center space-y-8 text-center"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                 <ShieldCheck className="w-10 h-10 text-[#00ed64] relative z-10" />
                 <div className="absolute inset-0 bg-[#00ed64]/10 blur-xl rounded-full" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-archivo text-white font-bold uppercase">Secure Login Required</h2>
                <p className="text-white/40 text-[13px] leading-relaxed px-2">
                  This account is managed by <span className="text-white font-medium">{emailInfo?.providers?.[0]?.toUpperCase()}</span>. <br/>
                  Please use the official provider link to sign in safely.
                </p>
              </div>

              <div className="space-y-4 px-4">
                {emailInfo?.providers?.includes("google") && (
                  <SocialButton 
                    onClick={() => handleSocialSignIn("google")} 
                    name="Continue with Google"
                    icon={
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    }
                  />
                )}
                {emailInfo?.providers?.includes("github") && (
                  <SocialButton 
                    onClick={() => handleSocialSignIn("github")} 
                    name="Continue with GitHub"
                    icon={<Github size={16} />}
                  />
                )}
              </div>

              <button onClick={reset} className="text-white/30 hover:text-white/60 text-[10px] uppercase tracking-[0.2em] transition-colors font-mono mt-4">
                // Return to selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
