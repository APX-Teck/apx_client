import React from 'react';
import { cn } from '@/lib/utils';

export const inputClass = (hasError?: boolean) =>
  cn(
    'w-full bg-white dark:bg-[#151515] border rounded-xl py-3 px-4 text-[14px] font-medium text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm placeholder:text-gray-400',
    'focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 hover:border-gray-300 dark:hover:border-white/20',
    hasError ? 'border-red-400 dark:border-red-500/60' : 'border-gray-200 dark:border-white/10'
  );

interface FieldProps {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-[12px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, description, ...inputProps },
  ref
) {
  return (
    <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
      <input
        type="checkbox"
        ref={ref}
        {...inputProps}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span>
        <span className="block text-sm font-bold text-gray-900 dark:text-white">{label}</span>
        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</span>
      </span>
    </label>
  );
});
