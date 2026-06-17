'use client';

import { ShieldAlert } from 'lucide-react';

interface LinkExpiredStateProps {
  errorState: string;
}

export function LinkExpiredState({ errorState }: LinkExpiredStateProps) {
  return (
    <header className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.15)]" aria-hidden="true">
        <ShieldAlert className="w-7 h-7" aria-hidden="true" role="presentation" />
      </div>
      <h1 id="verify-email-heading" className="text-2xl font-extrabold tracking-tight text-center text-rose-500">
        Link Expired
      </h1>
      <p className="text-foreground/60 text-xs mt-2 text-center max-w-xs leading-relaxed">
        {errorState}
      </p>
    </header>
  );
}
