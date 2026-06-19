'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export const NAV_MODULE_MAP: Record<string, string> = {
  '/admin': 'ALWAYS_SHOW',
  '/admin/users': 'USER_ROLE_MANAGEMENT',
  '/admin/roles': 'USER_ROLE_MANAGEMENT',
  '/admin/permissions': 'USER_ROLE_MANAGEMENT',
  '/admin/requests': 'ORDER_PAYMENT_MANAGEMENT',
  '/admin/payments': 'ORDER_PAYMENT_MANAGEMENT',
  '/admin/payments/analytics': 'ORDER_PAYMENT_MANAGEMENT',
  '/admin/company-assets': 'EMPLOYEE_MANAGEMENT',
  '/admin/company-vault': 'EMPLOYEE_MANAGEMENT',
  '/admin/enquiries': 'LEADS_ACCESS_MANAGEMENT',
  '/admin/leads': 'LEADS_ACCESS_MANAGEMENT',
  '/admin/tasks': 'TASK_NOTIFICATION_MANAGEMENT',
  '/admin/reimbursements': 'ORDER_PAYMENT_MANAGEMENT',
  '/admin/services': 'CONTENT_MANAGEMENT',
  '/admin/portfolio': 'CONTENT_MANAGEMENT',
  '/admin/blog': 'BLOG_MANAGEMENT',
  '/admin/blog/comments': 'BLOG_MANAGEMENT',
  '/admin/ads': 'ADVERTISEMENT_MANAGEMENT',
  '/admin/faq/faqs': 'CONTENT_MANAGEMENT',
  '/admin/settings': 'ALWAYS_SHOW',
};

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!user) return;

      const isSuperAdminOrAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
      if (isSuperAdminOrAdmin) return;

      if (user.role === 'CUSTOMER') {
        router.replace('/customer');
        return;
      }

      // Find the best matching route (longest prefix)
      let matchedModule: string | undefined;
      const sortedPaths = Object.keys(NAV_MODULE_MAP).sort((a, b) => b.length - a.length);
      for (const path of sortedPaths) {
        if (pathname === path || pathname.startsWith(path + '/')) {
          matchedModule = NAV_MODULE_MAP[path];
          break;
        }
      }

      if (matchedModule === 'ALWAYS_SHOW') {
        router.replace('/employee');
        return;
      }

      if (matchedModule) {
        const perm = user.permissions?.[matchedModule];
        if (!perm || (!perm.canRead && !perm.canCreate && !perm.canUpdate && !perm.canDelete)) {
          router.replace('/employee');
          return;
        }
      } else {
        router.replace('/employee');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isSuperAdminOrAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

  if (!isSuperAdminOrAdmin) {
    if (user.role === 'CUSTOMER') return null;

    let matchedModule: string | undefined;
    const sortedPaths = Object.keys(NAV_MODULE_MAP).sort((a, b) => b.length - a.length);
    for (const path of sortedPaths) {
      if (pathname === path || pathname.startsWith(path + '/')) {
        matchedModule = NAV_MODULE_MAP[path];
        break;
      }
    }

    if (matchedModule === 'ALWAYS_SHOW' || !matchedModule) {
      return null;
    }

    const perm = user.permissions?.[matchedModule];
    if (!perm || (!perm.canRead && !perm.canCreate && !perm.canUpdate && !perm.canDelete)) {
      return null;
    }
  }

  return <>{children}</>;
};
