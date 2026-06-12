'use client';

import { Suspense, useState } from 'react';
import { ArrowRight, AlertCircle, Info, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLoginLogic } from '@/hooks/useLoginLogic';

function LoginFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
    handleResendVerification,
    isLoading,
    errorMsg,
    resendEmail,
    infoMsg,
    successMsg,
  } = useLoginLogic();

  return (
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
          <h1 id="login-heading" className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-foreground/60 text-sm mt-1 text-center font-medium">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-labelledby="login-heading" noValidate>
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex gap-3 items-center font-medium" role="alert">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" role="presentation" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {resendEmail && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="block mt-1 text-indigo-600 hover:text-indigo-700 font-bold text-xs text-left transition-colors"
                    aria-label="Resend verification email"
                  >
                    Resend verification email?
                  </button>
                )}
              </div>
            </div>
          )}

          {infoMsg && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm flex gap-3 items-center font-medium" role="status">
              <Info className="w-5 h-5 shrink-0 text-indigo-600" aria-hidden="true" role="presentation" />
              <span>{infoMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex gap-3 items-center font-medium" role="status">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden="true" role="presentation" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              type="email"
              suppressHydrationWarning={true}
              {...register('email')}
              className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
              placeholder="admin@apxteck.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-500 font-medium pl-1" role="alert">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:text-accent/80 font-bold transition-colors"
                aria-label="Forgot your password?"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                suppressHydrationWarning={true}
                {...register('password')}
                className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-500 font-medium pl-1" role="alert">
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
            aria-disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" role="presentation" />
            )}
          </button>

          <div className="relative flex items-center py-2" aria-hidden="true">
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
            aria-label="Continue with Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md relative z-10 flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginFormComponent />
    </Suspense>
  );
}
