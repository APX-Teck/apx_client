'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { RecaptchaField } from '@/components/ui/RecaptchaField';

import { ForgotPasswordValues } from '@/lib/validations/forgotPassword';

interface ForgotPasswordInputFormProps {
  errorMsg: string;
  isLoading: boolean;
  form: UseFormReturn<ForgotPasswordValues>;
  onSubmit: (values: ForgotPasswordValues) => void;
}

export function ForgotPasswordInputForm({
  errorMsg,
  isLoading,
  form: {
    register,
    handleSubmit,
    control,
    formState: { errors },
  },
  onSubmit,
}: ForgotPasswordInputFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMsg && (
        <div
          className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" role="presentation" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-wider text-foreground/75"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm md:text-base font-medium"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-rose-500 font-medium pl-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <RecaptchaField control={control} name="recaptchaToken" error={errors.recaptchaToken?.message as string} />

      <button
        type="submit"
        disabled={isLoading}
        className="group w-full min-h-[44px] sm:min-h-[48px] mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
        aria-label={isLoading ? 'Sending reset link' : 'Send Reset Link'}
      >
        {isLoading ? 'Sending link...' : 'Send Reset Link'}
        {!isLoading && (
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
            role="presentation"
          />
        )}
      </button>

      <div className="text-center mt-6">
        <p className="text-xs sm:text-sm text-foreground/60 font-medium inline-flex items-center gap-1">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-accent hover:underline font-bold inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2 rounded-full transition-colors"
            aria-label="Sign In to Your APXTeck Account"
          >
            Sign In to Your Account
          </Link>
        </p>
      </div>
    </form>
  );
}
