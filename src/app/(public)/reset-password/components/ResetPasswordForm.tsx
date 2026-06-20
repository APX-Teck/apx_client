'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ResetPasswordValues } from '@/lib/validations/resetPassword';
import { RecaptchaField } from '@/components/ui/RecaptchaField';

interface Props {
  form: UseFormReturn<ResetPasswordValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
  token: string | null;
}

export function ResetPasswordForm({ form, onSubmit, isLoading, errorMsg, token }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      {!token && (
        <div
          className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold mb-6"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" role="presentation" />
          <span>Invalid link. Reset token is missing from the browser URL address bar.</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5" noValidate aria-label="Reset Password Form">
        {errorMsg && (
          <div
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-500 text-sm flex gap-2.5 items-center font-semibold"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" role="presentation" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-wider text-foreground/75"
          >
            New Password *
          </label>
          <input
            id="password"
            type="password"
            disabled={!token}
            {...register('password')}
            className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm sm:text-base font-medium disabled:opacity-50"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-xs text-rose-500 font-medium pl-1" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-bold uppercase tracking-wider text-foreground/75"
          >
            Confirm New Password *
          </label>
          <input
            id="confirmPassword"
            type="password"
            disabled={!token}
            {...register('confirmPassword')}
            className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm sm:text-base font-medium disabled:opacity-50"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-xs text-rose-500 font-medium pl-1"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <RecaptchaField control={control} name="recaptchaToken" error={errors.recaptchaToken?.message as string} />

        <button
          type="submit"
          disabled={isLoading || !token}
          className="group w-full h-12 min-h-[44px] sm:min-h-[48px] mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
          aria-disabled={isLoading || !token}
        >
          {isLoading ? (
            <>
              <span className="sr-only">Saving your new password</span>
              Saving password...
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
                role="presentation"
              />
            </>
          )}
        </button>
      </form>
    </>
  );
}
