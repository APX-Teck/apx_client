'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { LogIn, ArrowRight, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/axios';

// Validation schema
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Rate Limiter check (Failed login attempts: 5 per 15 minutes)
const checkRateLimit = (): boolean => {
  if (typeof window === 'undefined') return false;
  const now = Date.now();
  const failedAttempts: number[] = JSON.parse(
    localStorage.getItem('failed_login_attempts') || '[]'
  ) as number[];

  // Keep attempts within the last 15 minutes (900000ms)
  const activeAttempts = failedAttempts.filter((t) => now - t < 900000);
  localStorage.setItem('failed_login_attempts', JSON.stringify(activeAttempts));

  return activeAttempts.length >= 5;
};

const recordFailedAttempt = () => {
  if (typeof window === 'undefined') return;
  const failedAttempts: number[] = JSON.parse(
    localStorage.getItem('failed_login_attempts') || '[]'
  ) as number[];
  failedAttempts.push(Date.now());
  localStorage.setItem('failed_login_attempts', JSON.stringify(failedAttempts));
};

const clearFailedAttempts = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('failed_login_attempts');
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin, user, isLoading: authLoading } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Specific inline error messages
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectParam = searchParams.get('redirect') || '';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const msgParam = searchParams.get('message');
    if (msgParam) {
      setSuccessMsg(msgParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect already logged in user dynamically based on role
    if (isMounted && !authLoading && user) {
      const role = (user.role || 'CUSTOMER').toUpperCase();
      const redirectPath =
        role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF'
          ? '/admin'
          : role === 'EMPLOYEE'
          ? '/employee'
          : '/customer';
      router.push(redirectParam || redirectPath);
    }
  }, [isMounted, authLoading, user, router, redirectParam]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg('');
    setResendEmail('');
    setInfoMsg('');
    setSuccessMsg('');

    if (checkRateLimit()) {
      setErrorMsg('Too many attempts. Try again in 15 minutes.');
      return;
    }

    setIsLoading(true);

    try {
      // Use authLogin which stores user state in context AND localStorage
      const userData = await authLogin({
        email: values.email,
        password: values.password,
      });

      if (userData) {
        clearFailedAttempts();

        // Save remember state
        if (values.rememberMe) {
          localStorage.setItem('rememberUser', 'true');
        }

        // Redirect flow based on role
        const role = (userData.role || 'CUSTOMER').toUpperCase();
        if (redirectParam) {
          router.push(redirectParam);
        } else if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF') {
          router.push('/admin');
        } else if (role === 'EMPLOYEE') {
          router.push('/employee');
        } else {
          router.push('/customer');
        }
      }
    } catch (err: any) {
      recordFailedAttempt();

      const msg = (err.response?.data?.message || err.message || '').toLowerCase();
      if (msg.includes('verify your email') || msg.includes('unverified')) {
        setErrorMsg('Please verify your email.');
        setResendEmail(values.email);
      } else if (
        msg.includes('deactivated') ||
        msg.includes('suspended') ||
        msg.includes('block')
      ) {
        setErrorMsg(err.response?.data?.message || 'Your account has been deactivated. Please contact support.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    setInfoMsg('Sending verification email...');
    try {
      const res = await api.resendVerification(resendEmail);
      if (res.success) {
        setSuccessMsg('Verification email resent successfully! Check your inbox.');
        setInfoMsg('');
        setResendEmail('');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to resend verification link.');
      setInfoMsg('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 selection:text-accent transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px] dark:bg-accent/5"></div>
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/5"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-panel p-8 sm:p-10 rounded-3xl relative z-10">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative w-40 h-14 mb-4"
              >
                <Image
                  src="/APXTeck.png"
                  alt="APXTeck Logo"
                  fill
                  sizes="160px"
                  className="object-contain"
                  priority
                />
              </motion.div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
              <p className="text-foreground/60 text-sm mt-1 text-center font-medium">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex gap-3 items-center font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <div className="flex-1">
                    <span>{errorMsg}</span>
                    {resendEmail && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="block mt-1 text-indigo-600 hover:text-indigo-700 font-bold text-xs text-left transition-colors"
                      >
                        Resend verification email?
                      </button>
                    )}
                  </div>
                </div>
              )}

              {infoMsg && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm flex gap-3 items-center font-medium">
                  <Info className="w-5 h-5 shrink-0 text-indigo-600" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex gap-3 items-center font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  suppressHydrationWarning={true}
                  {...register('email')}
                  className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
                  placeholder="admin@apxteck.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-accent hover:text-accent/80 font-bold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  suppressHydrationWarning={true}
                  {...register('password')}
                  className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register('rememberMe')}
                  className="rounded border-foreground/20 text-accent focus:ring-accent bg-background w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-foreground/70 font-medium cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                suppressHydrationWarning={true}
                disabled={isLoading}
                className="group w-full h-12 mt-2 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-foreground/10"></div>
                <span className="flex-shrink-0 mx-4 text-foreground/40 text-[11px] font-bold uppercase tracking-widest">
                  OR
                </span>
                <div className="flex-grow border-t border-foreground/10"></div>
              </div>

              {/* Google login link redirect */}
              <Link
                href={`${process.env.NEXT_PUBLIC_NODEJS_API_URL || 'http://localhost:8090/api/v1'}/auth/google`}
                className="w-full h-12 rounded-xl bg-background border border-foreground/10 text-foreground font-semibold hover:bg-foreground/5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Link>

              <p className="text-center text-sm text-foreground/60 mt-6 font-medium">
                {"Don't have an account? "}
                <Link href="/register" className="text-accent hover:text-accent/80 font-bold transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
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
