'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import EmployeeSidebar from '@/components/layout/employee/EmployeeSidebar';
import EmployeeTopbar from '@/components/layout/employee/EmployeeTopbar';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <EmployeeTopbar />
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
