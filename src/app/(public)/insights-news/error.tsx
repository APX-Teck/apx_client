'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function InsightsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Insights/News page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-28 pb-16">
        <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Oops, something went wrong!</h2>
            <p className="text-foreground/60 text-sm">
              We encountered an unexpected error while loading our insights and news.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-accent hover:bg-accent/90 text-white font-bold transition-all active:scale-95"
          >
            Try again
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
