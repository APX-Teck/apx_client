'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  successMsg: string;
}

export function RegisterSuccess({ successMsg }: Props) {
  return (
    <div className="space-y-6 text-center py-4">
      <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/35 items-center justify-center text-emerald-500 mx-auto">
        <CheckCircle2 className="w-9 h-9" aria-hidden="true" role="presentation" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-emerald-500">
          Check Your Email
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed max-w-sm mx-auto">
          {successMsg}
        </p>
      </div>
      <div className="pt-4">
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent hover:bg-accent/90 text-white px-6 text-sm font-semibold transition-transform hover:scale-102 active:scale-98 shadow-md"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
