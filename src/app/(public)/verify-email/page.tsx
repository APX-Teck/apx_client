"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldAlert, Mail, Send, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import Link from "next/link";

const resendSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

type ResendFormValues = z.infer<typeof resendSchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isMounted, setIsMounted] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [errorState, setErrorState] = useState("");
  
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (!token) {
      setErrorState("Verification token is missing.");
      setVerifying(false);
      return;
    }

    async function verify() {
      try {
        const res = await api.verifyEmail(token);
        if (res.success) {
          if (res.message === "Already verified.") {
            router.push("/login?message=Already verified.");
          } else {
            router.push("/login?message=Email verified! Please sign in.");
          }
        } else {
          setErrorState("Link expired. Request a new verification email.");
        }
      } catch (err: unknown) {
        setErrorState((err as Error).message || "Email verification failed. The link may have expired.");
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [token, router]);

  const onResendSubmit = async (values: ResendFormValues) => {
    setResendError("");
    setResendSuccess("");
    setIsResending(true);

    try {
      const res = await api.resendVerification(values.email);
      if (res.success) {
        setResendSuccess("A new verification email has been sent! Check your inbox.");
      } else {
        setResendError("Failed to send verification email. Try again.");
      }
    } catch (err: unknown) {
      setResendError((err as Error).message || "Failed to resend. Please check the email address.");
    } finally {
      setIsResending(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
            {verifying ? (
              <div className="flex flex-col items-center py-12 space-y-4">
                <Loader className="w-10 h-10 text-accent animate-spin" />
                <h3 className="text-xl font-bold tracking-tight">Verifying Email</h3>
                <p className="text-foreground/50 text-xs text-center max-w-xs leading-relaxed">
                  Cryptographically checking token validity. You will be redirected shortly...
                </p>
              </div>
            ) : errorState ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-center text-rose-500">Link Expired</h1>
                  <p className="text-foreground/60 text-xs mt-2 text-center max-w-xs leading-relaxed">
                    {errorState}
                  </p>
                </div>

                <div className="h-px bg-glass-border w-full my-6" />

                {resendSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 text-xs flex gap-2.5 items-center font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resendSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onResendSubmit)} className="space-y-4">
                    <h4 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" /> Request New Code
                    </h4>
                    
                    {resendError && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-xs flex gap-2 items-center font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{resendError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-xs font-medium"
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isResending}
                      className="group w-full h-10 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-accent/15 cursor-pointer disabled:opacity-75"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isResending ? "Sending..." : "Resend Verification"}</span>
                    </button>
                  </form>
                )}

                <div className="text-center pt-4">
                  <Link href="/login" className="text-xs text-foreground/50 hover:text-foreground font-semibold">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : null}
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
