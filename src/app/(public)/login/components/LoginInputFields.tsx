'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface LoginInputFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isLoading: boolean;
}

export function LoginInputFields({ register, errors, isLoading }: LoginInputFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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
          <p id="email-error" className="text-xs text-red-500 font-medium pl-1" role="alert">{errors.email.message as string}</p>
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
            suppressHydrationWarning
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
            {errors.password.message as string}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          id="rememberMe"
          suppressHydrationWarning
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
    </>
  );
}
