import React from 'react';
import { CheckSquare, Receipt, ClipboardList } from 'lucide-react';
import { TaskItem, ReimbursementItem } from '../_hooks/useDashboardLogic';

interface DashboardStatsProps {
  tasks: TaskItem[];
  reimbursements: ReimbursementItem[];
  assignedRequests: number;
}

export function DashboardStats({ tasks, reimbursements, assignedRequests }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            My Active Tasks
          </p>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 text-indigo-500">
            {tasks.filter((t) => t.status !== 'COMPLETED').length}
          </h3>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
          <CheckSquare className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            Pending Claims
          </p>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 text-amber-500">
            {reimbursements.filter((r) => r.status === 'PENDING').length}
          </h3>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
          <Receipt className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
            Assigned Requests
          </p>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 text-purple-500">{assignedRequests}</h3>
        </div>
        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
          <ClipboardList className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
