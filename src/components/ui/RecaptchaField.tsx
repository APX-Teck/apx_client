import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface RecaptchaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

export function RecaptchaField<T extends FieldValues>({ control, name, error }: RecaptchaFieldProps<T>) {
  // Added a fallback directly to the site key to immediately bypass any Next.js .env caching issues
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfCgSktAAAAAMSkVNnurpworpL1dvOh7N6HKDhn';

  if (!siteKey) {
    return <div className="text-rose-500 text-sm">reCAPTCHA site key is missing.</div>;
  }

  return (
    <div className="space-y-1.5 flex flex-col items-center sm:items-start w-full overflow-hidden">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={(token: string | null) => field.onChange(token)}
            onExpired={() => field.onChange('')}
            onErrored={() => field.onChange('')}
            className="w-full max-w-[304px] origin-left"
          />
        )}
      />
      {error && (
        <p className="text-xs text-rose-500 font-medium pl-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
