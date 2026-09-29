import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function EditorCard({
  title,
  description,
  icon: Icon,
  action,
  className,
  children,
}: EditorCardProps) {
  return (
    <section
      className={cn(
        'bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      <header className="flex items-start justify-between gap-4 p-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
