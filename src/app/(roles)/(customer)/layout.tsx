import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CustomerSidebar from '@/components/layout/customer/CustomerSidebar';
import CustomerTopbar from '@/components/layout/customer/CustomerTopbar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 transition-colors duration-300">
        <CustomerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <CustomerTopbar />
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden overflow-y-auto relative">
            {/* Background Gradients globally for customer section */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
              <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] dark:bg-cyan-500/5"></div>
              <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/5"></div>
            </div>
            <div className="mx-auto max-w-7xl w-full relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
