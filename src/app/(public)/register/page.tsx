"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { UserPlus, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Link from "next/link";

// Zod validation schema matching specifications
const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(80, "Full Name must be at most 80 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full Name cannot contain numbers or special characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Phone number must be a valid 10-digit number starting with 6-9",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/\d/, "Password must contain at least 1 number"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  botName: z.string().optional(), // Honeypot field
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Rate Limiting Logic (defined outside component to prevent render-time impure warnings)
const checkRateLimit = (): boolean => {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  const attempts: number[] = JSON.parse(localStorage.getItem("register_attempts") || "[]") as number[];
  
  // Filter out attempts older than 15 minutes (15 * 60 * 1000 = 900,000 ms)
  const activeAttempts = attempts.filter((timestamp) => now - timestamp < 900000);
  localStorage.setItem("register_attempts", JSON.stringify(activeAttempts));

  return activeAttempts.length >= 5;
};

const recordAttempt = () => {
  if (typeof window === "undefined") return;
  const attempts: number[] = JSON.parse(localStorage.getItem("register_attempts") || "[]") as number[];
  attempts.push(Date.now());
  localStorage.setItem("register_attempts", JSON.stringify(attempts));
};

export default function RegisterPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // Redirect if already logged in
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
      botName: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMsg("");
    setSuccessMsg("");

    // Bot Honeypot check
    if (values.botName) {
      console.warn("Bot submission blocked via honeypot field.");
      setErrorMsg("An error occurred during submission. Please try again.");
      return;
    }

    // Rate Limit check
    if (checkRateLimit()) {
      setErrorMsg("Too many registration attempts. Try again in 15 minutes.");
      return;
    }

    setIsLoading(true);
    recordAttempt();

    try {
      const result = await api.register({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        passwordHash: values.password, // Maps to backend passwordHash schema requirement
      });

      if (result.success) {
        setSuccessMsg(result.message || "Check your email to verify your account.");
      } else {
        setErrorMsg(result.message || "Registration failed");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Registration failed. Try a different email address.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16">
        {/* Animated Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
              >
                <UserPlus className="w-7 h-7" />
              </motion.div>
              <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
              <p className="text-foreground/60 text-sm mt-2 text-center">
                Join APXTeck as a client partner and launch your digital projects.
              </p>
            </div>

            {successMsg ? (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/35 items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-emerald-500">Check Your Email</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed max-w-sm mx-auto">
                    {successMsg}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-accent hover:bg-accent/90 text-white px-6 text-sm font-semibold transition-transform hover:scale-102 active:scale-98 shadow-md"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Honeypot field (hidden visually, but present in DOM) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="botName">Bot Name</label>
                  <input
                    id="botName"
                    type="text"
                    {...register("botName")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Full Name *</label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Email Address *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Phone (Optional)</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Password *</label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">Confirm Password *</label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("terms")}
                      className="mt-0.5 rounded border-glass-border text-accent focus:ring-accent bg-foreground/[0.02] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-foreground/70 leading-relaxed font-medium">
                      I agree to the{" "}
                      <Link href="#" className="text-accent hover:underline font-bold">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-accent hover:underline font-bold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.terms.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full h-12 mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Google Sign-up integration link */}
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-glass-border"></div>
                  <span className="flex-shrink-0 mx-4 text-foreground/45 text-[10px] font-bold uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-glass-border"></div>
                </div>

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
                  Sign Up with Google
                </Link>

                <p className="text-center text-xs text-foreground/60 mt-6 font-medium">
                  Already have an account?{" "}
                  <Link href="/login" className="text-accent hover:underline font-bold">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
