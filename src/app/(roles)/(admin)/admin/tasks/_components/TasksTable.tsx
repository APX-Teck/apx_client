'use client';
import React, { useMemo } from 'react';
import { format, isPast, isToday } from 'date-fns';
import {
  Search,
  PlayCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Flag,
  Calendar,
  Trash2,
} from 'lucide-react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import UserAvatar from '@/components/ui/admin/UserAvatar';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import { Task } from '@/services/admin/tasks.service';

interface Props {
  filteredTasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentSort?: string;
  setCurrentSort?: (sort: string) => void;
  currentFilter?: string;
  setCurrentFilter?: (filter: string) => void;
  handleUpdateStatus: (id: number, status: Task['status']) => void;
  handleDeleteTaskClick: (id: number) => void;
  navigateToDetails: (id: number) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  confirmDeleteTask: () => void;
  isDeleting: boolean;
}

export function TasksTable({
  filteredTasks,
  isLoading,
  searchTerm,
  setSearchTerm,
  currentSort,
  setCurrentSort,
  currentFilter,
  setCurrentFilter,
  handleUpdateStatus,
  handleDeleteTaskClick,
  navigateToDetails,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDeleteTask,
  isDeleting,
}: Props) {
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        header: 'Task',
        cell: (task) => (
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                TSK-{task.id}
              </span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white truncate">{task.title}</p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1 truncate">
              {task.description || 'No description provided.'}
            </p>
          </div>
        ),
      },
      {
        header: 'Assigned To',
        cell: (task) => (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={task.assignedTo?.fullName}
              src={task.assignedTo?.profile?.profilePhotoUrl}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {task.assignedTo?.fullName || 'Unassigned'}
            </span>
          </div>
        ),
      },
      {
        header: 'Due Date',
        cell: (task) => {
          if (!task.dueDate) return <span className="text-xs text-gray-400 font-medium">—</span>;

          const date = new Date(task.dueDate);
          const pastDue =
            isPast(date) &&
            !isToday(date) &&
            task.status !== 'COMPLETED' &&
            task.status !== 'CANCELLED';

          return (
            <div
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md border ${
                pastDue
                  ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                  : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#151515] dark:text-gray-400 dark:border-white/10'
              }`}
            >
              <Calendar size={12} />
              {format(date, 'MMM dd, yyyy')}
            </div>
          );
        },
      },
      {
        header: 'Priority',
        cell: (task) => (
          <span
            className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border inline-flex items-center gap-1 ${
              task.priority === 'HIGH'
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                : task.priority === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                  : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
            }`}
          >
            <Flag size={10} />
            {task.priority}
          </span>
        ),
      },
      {
        header: 'Status',
        cell: (task) => {
          const statusConfig = {
            OPEN: {
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-500/10',
              border: 'border-blue-100 dark:border-blue-500/20',
              icon: Clock,
            },
            IN_PROGRESS: {
              color: 'text-indigo-600 dark:text-indigo-400',
              bg: 'bg-indigo-50 dark:bg-indigo-500/10',
              border: 'border-indigo-100 dark:border-indigo-500/20',
              icon: PlayCircle,
            },
            COMPLETED: {
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-500/10',
              border: 'border-emerald-100 dark:border-emerald-500/20',
              icon: CheckCircle2,
            },
            CANCELLED: {
              color: 'text-red-600 dark:text-red-400',
              bg: 'bg-red-50 dark:bg-red-500/10',
              border: 'border-red-100 dark:border-red-500/20',
              icon: XCircle,
            },
          };
          const config = statusConfig[task.status];
          const Icon = config.icon;

          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border tracking-wide uppercase ${config.bg} ${config.color} ${config.border}`}
            >
              <Icon size={12} />
              {task.status.replace('_', ' ')}
            </div>
          );
        },
      },
      {
        header: 'Actions',
        cell: (task) => (
          <div className="flex items-center gap-2">
            {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
              <button
                onClick={() =>
                  handleUpdateStatus(task.id, task.status === 'OPEN' ? 'IN_PROGRESS' : 'COMPLETED')
                }
                title={task.status === 'OPEN' ? 'Start Task' : 'Complete Task'}
                className={`p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors border ${
                  task.status === 'OPEN'
                    ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                }`}
              >
                {task.status === 'OPEN' ? <PlayCircle size={16} /> : <CheckCircle2 size={16} />}
              </button>
            )}

            <button
              onClick={() => navigateToDetails(task.id)}
              className="px-3 py-1.5 min-h-[44px] flex items-center justify-center rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors"
            >
              Details
            </button>

            <button
              onClick={() => handleDeleteTaskClick(task.id)}
              title="Delete Task"
              className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateStatus, navigateToDetails, handleDeleteTaskClick]
  );

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Due Soon', value: 'due_soon' },
    { label: 'Due Late', value: 'due_late' },
  ];

  const filterOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto hidden sm:block">
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Loading tasks...
              </p>
            </div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredTasks}
            searchPlaceholder="Search tasks or assignees..."
            onSearch={setSearchTerm}
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            filterOptions={filterOptions}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
          />
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
              <Search className="text-gray-400 dark:text-gray-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
              We couldn't find any tasks matching "{searchTerm}".
            </p>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4 p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
              placeholder="Search tasks..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={currentSort}
              onChange={(e) => setCurrentSort?.(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={currentFilter}
              onChange={(e) => setCurrentFilter?.(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">No tasks found.</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                    TSK-{task.id}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border inline-flex items-center gap-1 ${
                  task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400' :
                  task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400' :
                  'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400'
                }`}>
                  <Flag size={10} /> {task.priority}
                </span>
              </div>
              
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Assignee</span>
                  <div className="flex items-center gap-1.5 truncate">
                    <UserAvatar name={task.assignedTo?.fullName} src={task.assignedTo?.profile?.profilePhotoUrl} size="sm" />
                    <span className="font-bold text-gray-700 dark:text-gray-300 truncate">{task.assignedTo?.fullName || 'Unassigned'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 truncate">{task.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(task.id, task.status === 'OPEN' ? 'IN_PROGRESS' : 'COMPLETED')}
                    className="flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    {task.status === 'OPEN' ? <PlayCircle size={14} /> : <CheckCircle2 size={14} />}
                    {task.status === 'OPEN' ? 'Start' : 'Complete'}
                  </button>
                )}
                <button
                  onClick={() => navigateToDetails(task.id)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                >
                  Details
                </button>
                <button
                  onClick={() => handleDeleteTaskClick(task.id)}
                  className="p-2.5 rounded-lg text-red-500 bg-red-50 dark:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isLoading={isDeleting}
      />
    </div>
  );
}
