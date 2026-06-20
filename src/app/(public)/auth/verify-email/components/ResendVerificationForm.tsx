'use client';

import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RecaptchaField } from '@/components/ui/RecaptchaField';
import { ResendFormValues } from '@/lib/validations/resendVerification';

interface ResendVerificationFormProps {
  resendSuccess: string;
  resendError: string;
  isResending: boolean;
  form: UseFormReturn<ResendFormValues>;
  onResendSubmit: (values: ResendFormValues) => void;
}

export function ResendVerificationForm({
  resendSuccess,
  resendError,
  isResending,
  form: {
    register,
    handleSubmit,
    control,
    formState: { errors },
  },
  onResendSubmit,
}: ResendVerificationFormProps) {
  if (resendSuccess) {
    return (
      <div
        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 text-xs flex gap-2.5 items-center font-semibold"
        role="status"
      >
        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" role="presentation" />
        <span>{resendSuccess}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onResendSubmit)}
      className="space-y-4"
      aria-label="Resend Verification Form"
    >
      <h2 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
        <Mail className="w-4 h-4 text-accent" aria-hidden="true" role="presentation" /> Request New
        Code
      </h2>

      {resendError && (
        <div
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-xs flex gap-2 items-center font-semibold"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" role="presentation" />
          <span>{resendError}</span>
        </div>
      )}

      <div className="space-y-1 w-full">
        <label htmlFor="email" className="sr-only">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-2.5 min-h-[44px] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm md:text-sm font-medium"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
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
        disabled={isResending}
        className="group w-full min-h-[44px] sm:h-12 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-accent/15 cursor-pointer disabled:opacity-75"
        aria-busy={isResending}
      >
        <Send className="w-4 h-4" aria-hidden="true" role="presentation" />
        <span>{isResending ? 'Sending...' : 'Resend Verification'}</span>
      </button>
    </form>
  );
}
