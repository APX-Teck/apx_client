'use client';

import React from 'react';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useCreateTaskLogic } from '../_hooks/useCreateTaskLogic';

interface Props {
  users: any[];
}

export function CreateTaskClient({ users }: Props) {
  const { formData, formErrors, isSubmitting, error, handleChange, handleSubmit, handleCancel } =
    useCreateTaskLogic();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 md:px-8 pb-safe pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Create New Task</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Assign a new task to team members
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-8"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Update Homepage Design"
              className={`w-full bg-white dark:bg-[#151515] border min-h-[48px] rounded-xl px-4 py-3 text-[15px] font-bold focus:ring-4 outline-none transition-all dark:text-white ${
                formErrors.title 
                  ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {formErrors.title && (
              <p className="mt-2 text-sm font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {formErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide more details about the task..."
              rows={4}
              className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[44px] rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleChange}
                className={`w-full bg-white dark:bg-[#151515] border min-h-[48px] rounded-xl px-4 py-3 text-[15px] font-bold focus:ring-4 outline-none transition-all dark:text-white appearance-none cursor-pointer ${
                  formErrors.assignedToId
                    ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.role?.name})
                  </option>
                ))}
              </select>
              {formErrors.assignedToId && (
                <p className="mt-2 text-sm font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {formErrors.assignedToId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[44px] rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[44px] rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 min-h-[44px] flex items-center justify-center rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 min-h-[44px] flex items-center justify-center rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Save size={16} /> Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
