import React from 'react';
import { Loader2, CheckSquare } from 'lucide-react';
import { Task } from '@/services/admin/tasks.service';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  statusFilter: string;
  handleFilterChange: (status: string) => void;
  fetchTasks: (pageNum: number) => void;
  handleUpdateStatus: (id: number, currentStatus: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  page,
  totalPages,
  statusFilter,
  handleFilterChange,
  fetchTasks,
  handleUpdateStatus,
}: TaskListProps) {
  return (
    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task List</h3>
          <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
            {tasks.length} Records
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl px-3 py-2 min-h-[44px] outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading your tasks...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
            <CheckSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">No Tasks Found</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              You don't have any tasks matching the current filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} handleUpdateStatus={handleUpdateStatus} />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-6">
              <button
                disabled={page === 1}
                onClick={() => fetchTasks(page - 1)}
                className="px-4 py-2 min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => fetchTasks(page + 1)}
                className="px-4 py-2 min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
