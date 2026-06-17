'use client';

import { useEffect } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Service Detail Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-rose-500/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight">Service Not Available</h2>
          <p className="text-foreground/60 text-sm">
            We couldn&apos;t load the details for this service. It may have been removed or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => reset()}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] text-sm shadow-md shadow-accent/25"
          >
            Try Again
          </button>
          <Link 
            href="/services"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
