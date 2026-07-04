'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('apx_cookie_consent');
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('apx_cookie_consent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 md:p-8 pointer-events-none flex justify-center">
      <div className="bg-background/80 glass-panel border border-glass-border shadow-2xl rounded-2xl p-6 max-w-4xl w-full pointer-events-auto backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">We value your privacy</h3>
          <p className="text-sm text-foreground/70">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{' '}
            <Link href="/privacy-policy" className="text-accent hover:underline">
              Privacy Policy
            </Link>{' '}
            for more details.
          </p>
        </div>
        <div className="flex gap-4 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setShowConsent(false)}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-glass-border hover:bg-foreground/5 text-sm font-medium transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-accent text-white hover:bg-accent/90 text-sm font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
