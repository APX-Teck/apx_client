import React from 'react';
import AdminSidebar from '@/components/layout/admin/AdminSidebar';
import AdminTopbar from '@/components/layout/admin/AdminTopbar';
import { AdminProviders } from './_components/AdminProviders';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { PortalFooter } from '@/components/layout/PortalFooter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-dvh bg-[#F8F9FA] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-0 flex flex-col">
            <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 md:p-8 pb-safe pt-safe flex flex-col">
              <div className="flex-1">{children}</div>
              <div className="mt-8">
                <PortalFooter />
              </div>
            </div>
          </main>
        </div>
        <AdminProviders />
      </div>
    </AdminGuard>
  );
}
