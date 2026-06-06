"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogIn, ArrowRight, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import Link from "next/link";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Rate Limiter check (Failed login attempts: 5 per 15 minutes)
const checkRateLimit = (): boolean => {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  const failedAttempts: number[] = JSON.parse(localStorage.getItem("failed_login_attempts") || "[]") as number[];
  
  // Keep attempts within the last 15 minutes (900000ms)
  const activeAttempts = failedAttempts.filter((t) => now - t < 900000);
  localStorage.setItem("failed_login_attempts", JSON.stringify(activeAttempts));
  
  return activeAttempts.length >= 5;
};

const recordFailedAttempt = () => {
  if (typeof window === "undefined") return;
  const failedAttempts: number[] = JSON.parse(localStorage.getItem("failed_login_attempts") || "[]") as number[];
  failedAttempts.push(Date.now());
  localStorage.setItem("failed_login_attempts", JSON.stringify(failedAttempts));
};

const clearFailedAttempts = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("failed_login_attempts");
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Specific inline error messages
  const [errorMsg, setErrorMsg] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const redirectParam = searchParams.get("redirect") || "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    const msgParam = searchParams.get("message");
    if (msgParam) {
      setSuccessMsg(msgParam);
    }

    // Redirect already logged in user
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push(redirectParam || "/dashboard");
    }
  }, [router, redirectParam, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg("");
    setResendEmail("");
    setInfoMsg("");
    setSuccessMsg("");

    if (checkRateLimit()) {
      setErrorMsg("Too many attempts. Try again in 15 minutes.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await api.login({
        email: values.email,
        password: values.password,
      });

      if (result.success && result.user) {
        clearFailedAttempts();
        
        // Save auth state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", result.user.role || "CUSTOMER");
        localStorage.setItem("userName", result.user.fullName || "User");
        
        // Save remember state (sets HttpOnly refresh lifetime on backend; client-side saves config)
        if (values.rememberMe) {
          localStorage.setItem("rememberUser", "true");
        }

        // Redirect flow
        if (redirectParam) {
          router.push(redirectParam);
        } else if (result.user.role === "ADMIN" || result.user.role === "STAFF") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      recordFailedAttempt();
      
      const error = err as Error;
      const msg = error.message || "";
      if (msg.includes("verify your email") || msg.toLowerCase().includes("unverified")) {
        setErrorMsg("Please verify your email.");
        setResendEmail(values.email);
      } else if (msg.toLowerCase().includes("deactivated") || msg.toLowerCase().includes("suspended") || msg.toLowerCase().includes("block")) {
        setErrorMsg("Your account has been suspended. Contact support.");
      } else {
        // Generic message preventing user enumeration
        setErrorMsg("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    setInfoMsg("Sending verification email...");
    try {
      const res = await api.resendVerification(resendEmail);
      if (res.success) {
        setSuccessMsg("Verification email resent successfully! Check your inbox.");
        setInfoMsg("");
        setResendEmail("");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to resend verification link.");
      setInfoMsg("");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16">
        {/* Glowing Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/10 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
              >
                <LogIn className="w-7 h-7" />
              </motion.div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-foreground/60 text-sm mt-2 text-center">
                Sign in to the APXTeck Portal to manage your digital ecosystem.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <span>{errorMsg}</span>
                    {resendEmail && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="block mt-1.5 text-accent hover:underline font-bold text-xs text-left"
                      >
                        Resend verification email?
                      </button>
                    )}
                  </div>
                </div>
              )}

              {infoMsg && (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm flex gap-2.5 items-center font-semibold animate-pulse">
                  <Info className="w-5 h-5 shrink-0" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 text-sm flex gap-2.5 items-center font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm font-medium"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Password</label>
                  <Link href="/forgot-password" className="text-xs text-accent hover:underline font-bold">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="rounded border-glass-border text-accent focus:ring-accent bg-foreground/[0.02] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-foreground/70 font-semibold cursor-pointer">
                  Remember Me (extends login token)
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full h-12 mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-glass-border"></div>
                <span className="flex-shrink-0 mx-4 text-foreground/45 text-[10px] font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-glass-border"></div>
              </div>

              {/* Google login link redirect */}
              <Link
                href="http://localhost:8090/api/v1/auth/google"
                className="w-full h-12 rounded-xl bg-background/30 border border-glass-border hover:bg-white/5 font-semibold active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Link>

              <p className="text-center text-xs text-foreground/60 mt-6 font-medium">
                {"Don't have an account? "}
                <Link href="/register" className="text-accent hover:underline font-bold">
                  Create Account
                </Link>
              </p>
            </form>
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
