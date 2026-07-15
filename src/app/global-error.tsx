'use client';

import { useEffect } from 'react';

// global-error must have its own html and body tags
// because it replaces the root layout when the root layout crashes.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-green-500 font-mono flex items-center justify-center min-h-screen p-4 overflow-hidden">
        <div className="max-w-2xl w-full border border-green-500/30 p-8 rounded shadow-[0_0_30px_rgba(34,197,94,0.1)] relative">
          
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 border-b border-green-500/30 pb-4">
              <div className="w-12 h-12 bg-red-500 flex items-center justify-center font-bold text-black text-2xl animate-pulse">
                !
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-widest text-red-500">FATAL KERNEL PANIC</h1>
                <p className="text-sm opacity-70">ERR_ROOT_LAYOUT_CRASH</p>
              </div>
            </div>

            <div className="space-y-2 text-sm opacity-90">
              <p>&gt; Root system structure has suffered a catastrophic failure.</p>
              <p>&gt; Initializing fallback safe mode...</p>
              <p className="text-red-400">&gt; ERROR: {error.message || 'Unknown critical exception'}</p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto px-6 py-3 bg-green-500 text-black font-bold uppercase tracking-widest hover:bg-green-400 active:bg-green-600 transition-colors"
              >
                [ FORCE REBOOT SYSTEM ]
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
