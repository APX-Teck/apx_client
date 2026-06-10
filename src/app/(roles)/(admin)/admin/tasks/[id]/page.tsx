"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tasksService, Task } from "@/services/admin/tasks.service";
import { format, isPast, isToday } from "date-fns";
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, 
  Flag, Calendar, User as UserIcon, Paperclip, FileText,
  Trash2, PlayCircle
} from "lucide-react";

/* ─── tiny inline toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : type === "error" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  useEffect(() => {
    fetchTask();
  }, [params]);

  const fetchTask = () => {
    if (params?.id) {
      setIsLoading(true);
      tasksService.getTaskById(Number(params.id)).then(data => {
        setTask(data);
        setIsLoading(false);
      }).catch(err => {
        setToast({ message: "Failed to fetch task details", type: "error" });
        setIsLoading(false);
      });
    }
  };

  const handleUpdateStatus = async (status: Task["status"]) => {
    if (!task) return;
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await tasksService.updateTaskStatus(task.id, status);
      setToast({ message: `Status updated to ${status.replace("_", " ")}`, type: "success" });
      fetchTask();
    } catch (error) {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const handleUpdatePriority = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    try {
      setToast({ message: "Updating priority...", type: "loading" });
      await tasksService.updateTaskPriority(task.id, e.target.value as any);
      setToast({ message: "Priority updated successfully", type: "success" });
      fetchTask();
    } catch (error) {
      setToast({ message: "Failed to update priority", type: "error" });
    }
  };

  const handleDeleteTask = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return;
    try {
      setToast({ message: "Deleting task...", type: "loading" });
      await tasksService.deleteTask(task.id);
      router.push('/admin/tasks');
    } catch (err: any) {
      setToast({ message: "Failed to delete task", type: "error" });
    }
  };

  if (isLoading || !task) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const isPastDue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== "COMPLETED" && task.status !== "CANCELLED";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Visualizer */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin/tasks')}
              className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                {task.title}
                {task.status === "COMPLETED" && (
                  <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                    <CheckCircle2 size={12}/> Completed
                  </span>
                )}
                {task.status === "CANCELLED" && (
                  <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                    <XCircle size={12}/> Cancelled
                  </span>
                )}
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Created by {task.createdByName || "Admin"} • {format(new Date(task.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDeleteTask}
              className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-gray-200 dark:border-white/10 hover:border-red-100 dark:hover:border-red-500/20"
              title="Delete Task"
            >
              <Trash2 size={18} />
            </button>
            
            {task.status !== "COMPLETED" && task.status !== "CANCELLED" && (
              <>
                <button 
                  onClick={() => handleUpdateStatus("CANCELLED")}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-red-100 dark:border-red-500/20"
                >
                  Cancel Task
                </button>
                {task.status === "OPEN" ? (
                  <button 
                    onClick={() => handleUpdateStatus("IN_PROGRESS")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
                  >
                    <PlayCircle size={16} /> Start Task
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdateStatus("COMPLETED")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Mark Completed
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Description & Attachments */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} /> Description
            </h2>
            <div className="bg-gray-50 dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                {task.description || "No description provided for this task."}
              </p>
            </div>
            
            {task.attachmentUrl && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Paperclip size={16} /> Attachments
                </h2>
                <a 
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#151515] rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#222] shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Task_Attachment.pdf</p>
                      <p className="text-xs font-medium text-gray-500">Document</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#222] text-xs font-bold text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg shadow-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    View File
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Task Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <AlertCircle size={16} /> Settings
            </h2>
            
            <div className="space-y-6">
              
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Assignment</p>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-500/20">
                    {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{task.assignedToName || "Unassigned"}</p>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Assigned User</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Priority Level</p>
                <select 
                  value={task.priority}
                  onChange={handleUpdatePriority}
                  disabled={task.status === "COMPLETED" || task.status === "CANCELLED"}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Due Date</p>
                <div className={`border px-4 py-3 rounded-xl flex items-center gap-2 ${
                  isPastDue 
                    ? "bg-red-50 border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400" 
                    : "bg-gray-50 border-gray-200 text-gray-900 dark:bg-[#151515] dark:border-white/10 dark:text-white"
                }`}>
                  <Calendar size={16} className={isPastDue ? "text-red-500" : "text-gray-400"} />
                  <span className="font-bold text-sm">
                    {task.dueDate ? format(new Date(task.dueDate), "MMMM dd, yyyy") : "No due date set"}
                  </span>
                  {isPastDue && <span className="ml-auto text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-2 py-0.5 rounded">OVERDUE</span>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
