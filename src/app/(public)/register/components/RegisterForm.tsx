'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '@/lib/validations/register';
import { GoogleSignUpButton } from './GoogleSignUpButton';

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
}

export function RegisterForm({ form, onSubmit, isLoading, errorMsg }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" role="presentation" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Honeypot field (hidden visually, but present in DOM) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="botName">Bot Name</label>
        <input
          id="botName"
          type="text"
          {...register('botName')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
          Full Name *
        </label>
        <input
          type="text"
          {...register('fullName')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
          Email Address *
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
          Phone (Optional)
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
          placeholder="9876543210"
        />
        {errors.phone && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
          Password *
        </label>
        <input
          type="password"
          {...register('password')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
          Confirm Password *
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('terms')}
            className="mt-0.5 rounded border-glass-border text-accent focus:ring-accent bg-foreground/[0.02] w-4 h-4 cursor-pointer"
          />
          <span className="text-xs text-foreground/70 leading-relaxed font-medium">
            I agree to the{' '}
            <Link href="/terms" className="text-accent hover:underline font-bold">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-accent hover:underline font-bold">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.terms.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group w-full h-12 mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
        {!isLoading && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" role="presentation" />
        )}
      </button>

      <GoogleSignUpButton />

      <p className="text-center text-xs text-foreground/60 mt-6 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </form>
  );
}
