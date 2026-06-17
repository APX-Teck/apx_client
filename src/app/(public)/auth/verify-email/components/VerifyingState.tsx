'use client';

import { Loader } from 'lucide-react';

export function VerifyingState() {
  return (
    <section className="flex flex-col items-center py-12 space-y-4" aria-live="polite">
      <Loader className="w-10 h-10 text-accent animate-spin" aria-hidden="true" role="presentation" />
      <h1 id="verify-email-heading" className="text-xl font-bold tracking-tight">Verifying Email</h1>
      <p className="text-foreground/50 text-xs text-center max-w-xs leading-relaxed">
        Cryptographically checking token validity. You will be redirected shortly...
      </p>
    </section>
  );
}
