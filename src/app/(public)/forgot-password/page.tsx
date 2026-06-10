'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/axios';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email format'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await api.forgotPassword(values.email);
      if (result.success) {
        setSuccessMsg(result.message || 'A password reset link has been sent to your email.');
      } else {
        setErrorMsg('Failed to process request');
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
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
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
              >
                <KeyRound className="w-7 h-7" />
              </motion.div>
              <h1 className="text-3xl font-extrabold tracking-tight text-center">Reset Password</h1>
              <p className="text-foreground/60 text-sm mt-2 text-center">
                Enter your email address and we will send you a secure link to reset your password.
              </p>
            </div>

            {successMsg ? (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/35 items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-emerald-500">
                    Reset Link Sent
                  </h3>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm font-medium"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full h-12 mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                >
                  {isLoading ? 'Sending link...' : 'Send Reset Link'}
                  {!isLoading && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>

                <p className="text-center text-xs text-foreground/60 mt-6 font-medium">
                  Remember your password?{' '}
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
