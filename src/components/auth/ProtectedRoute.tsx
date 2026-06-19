'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Customer should not access Employee portal
      if (pathname.startsWith('/employee') && user.role === 'CUSTOMER') {
        router.replace('/customer');
        return;
      }

      // Non-customers shouldn't typically access Customer portal (they have Admin/Employee portals)
      if (pathname.startsWith('/customer') && user.role !== 'CUSTOMER') {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/employee');
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Prevent flash of content while redirecting
  if (pathname.startsWith('/employee') && user.role === 'CUSTOMER') return null;
  if (pathname.startsWith('/customer') && user.role !== 'CUSTOMER') return null;

  return <>{children}</>;
};
