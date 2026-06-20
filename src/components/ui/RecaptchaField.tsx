'use client';

import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { useTheme } from 'next-themes';

interface RecaptchaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

export function RecaptchaField<T extends FieldValues>({ control, name, error }: RecaptchaFieldProps<T>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Added a fallback directly to the site key to immediately bypass any Next.js .env caching issues
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfCgSktAAAAAMSkVNnurpworpL1dvOh7N6HKDhn';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!siteKey) {
    return <div className="text-rose-500 text-sm">reCAPTCHA site key is missing.</div>;
  }

  const currentTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 py-3 overflow-hidden">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`relative flex justify-center w-[304px] max-w-full rounded-[4px] overflow-hidden transition-all duration-300 group ${error ? 'ring-2 ring-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)]'}`}>
            {/* Background skeleton for smooth loading */}
            {!mounted && <div className="absolute inset-0 bg-foreground/5 animate-pulse" />}
            
            <div className="relative z-10">
              <ReCAPTCHA
                key={currentTheme}
                theme={currentTheme}
                sitekey={siteKey}
                onChange={(token: string | null) => field.onChange(token)}
                onExpired={() => field.onChange('')}
                onErrored={() => field.onChange('')}
              />
            </div>
          </div>
        )}
      />
      {error && (
        <p className="text-xs text-rose-500 font-medium text-center animate-in fade-in slide-in-from-top-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
