'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { UseFormRegister, FieldErrors, Control, FieldValues } from 'react-hook-form';
import { RecaptchaField } from '@/components/ui/RecaptchaField';

interface LoginInputFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isLoading: boolean;
  control: Control<T>;
}

export function LoginInputFields<T extends FieldValues>({ register, errors, isLoading, control }: LoginInputFieldsProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-bold text-foreground/70 uppercase tracking-wider"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          suppressHydrationWarning={true}
          {...register('email' as any)}
          className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm md:text-base font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
          placeholder="admin@apxteck.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500 font-medium pl-1" role="alert">
            {errors.email?.message as string}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="text-xs font-bold text-foreground/70 uppercase tracking-wider"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm text-accent hover:text-accent/80 font-bold transition-colors inline-flex items-center min-h-[44px] px-2 -mr-2 rounded-full"
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
            {...register('password' as any)}
            className="w-full bg-foreground/5 dark:bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 pr-12 min-h-[44px] sm:min-h-[48px] outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm md:text-base font-medium text-foreground placeholder:text-foreground/40 backdrop-blur-sm"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/40 hover:text-foreground/70 focus:outline-none transition-colors rounded-full"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs text-red-500 font-medium pl-1" role="alert">
            {errors.password?.message as string}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center pt-1">
        <label
          htmlFor="rememberMe"
          className="flex items-center gap-2.5 cursor-pointer text-sm sm:text-base text-foreground/70 font-medium min-h-[44px] select-none"
        >
          <input
            type="checkbox"
            id="rememberMe"
            suppressHydrationWarning
            {...register('rememberMe' as any)}
            className="rounded border-foreground/20 text-accent focus:ring-accent bg-background w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
          />
          Remember me for 30 days
        </label>
      </div>

      {/* reCAPTCHA */}
      <div className="pt-2">
        <RecaptchaField control={control} name={'recaptchaToken' as any} error={(errors as any).recaptchaToken?.message as string} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        suppressHydrationWarning={true}
        disabled={isLoading}
        className="group w-full min-h-[44px] sm:min-h-[48px] mt-2 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-70 disabled:active:scale-100 cursor-pointer text-sm sm:text-base"
        aria-disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
        {!isLoading && (
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
            role="presentation"
          />
        )}
      </button>
    </>
  );
}
