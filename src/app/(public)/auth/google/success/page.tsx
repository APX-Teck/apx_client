'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function GoogleAuthSuccessPage() {
  const router = useRouter();
  const { user, isLoading, refresh } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Explicitly refresh/fetch user state to load the Google authenticated user details
    refresh().catch((err) => console.error('Failed to refresh user session:', err));
  }, [refresh]);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.fullName);

        const role = (user.role || 'CUSTOMER').toUpperCase();
        const redirectPath =
          role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF'
            ? '/admin'
            : role === 'EMPLOYEE'
            ? '/employee'
            : '/customer';
        
        router.push(redirectPath);
      } else {
        // If no user is authenticated, redirect back to login
        router.push('/login');
      }
    }
  }, [mounted, isLoading, user, router]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass-panel border border-glass-border shadow-xl max-w-sm text-center">
        <Loader className="w-10 h-10 text-accent animate-spin" />
        <h2 className="text-xl font-extrabold tracking-tight">Authenticating with Google</h2>
        <p className="text-foreground/50 text-xs leading-relaxed">
          Google authentication successful! Setting session states and redirecting you to your
          portal dashboard...
        </p>
      </div>
    </div>
  );
}
