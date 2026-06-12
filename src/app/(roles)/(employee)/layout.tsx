'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import EmployeeSidebar from '@/components/layout/employee/EmployeeSidebar';
import EmployeeTopbar from '@/components/layout/employee/EmployeeTopbar';
import { useSocket } from '@/hooks/useSocket';
import { Toaster } from 'react-hot-toast';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  useSocket();
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
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: "dark:bg-[#151515] dark:text-white dark:border-white/10 border",
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }
        }}
      />
    </ProtectedRoute>
  );
}
