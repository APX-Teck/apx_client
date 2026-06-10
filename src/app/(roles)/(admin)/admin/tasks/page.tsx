"use client";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { tasksService, Task } from "@/services/admin/tasks.service";
import { format, isPast, isToday } from "date-fns";
import { useRouter } from "next/navigation";
import { ListTodo, CheckCircle2, Clock, XCircle, AlertCircle, Search, PlayCircle, Flag, Calendar, Trash2 } from "lucide-react";

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

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setIsLoading(true);
    tasksService.getTasks()
      .then(data => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setToast({ message: "Failed to load tasks", type: "error" });
        setIsLoading(false);
      });
  };

  const handleUpdateStatus = async (id: number, status: Task["status"]) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await tasksService.updateTaskStatus(id, status);
      setToast({ message: `Task marked as ${status.replace("_", " ")}`, type: "success" });
      fetchTasks(); // refresh data
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update status", type: "error" });
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setToast({ message: "Deleting task...", type: "loading" });
      await tasksService.deleteTask(id);
      setToast({ message: "Task deleted successfully", type: "success" });
      fetchTasks();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete task", type: "error" });
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.assignedToName && task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: ColumnDef<Task>[] = [
    {
      header: "Task",
      cell: (task) => (
        <div className="max-w-xs">
          <p className="font-bold text-gray-900 dark:text-white truncate">{task.title}</p>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1 truncate">
            {task.description || "No description provided."}
          </p>
        </div>
      )
    },
    {
      header: "Assigned To",
      cell: (task) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
            {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {task.assignedToName || "Unassigned"}
          </span>
        </div>
      )
    },
    {
      header: "Due Date",
      cell: (task) => {
        if (!task.dueDate) return <span className="text-xs text-gray-400 font-medium">—</span>;
        
        const date = new Date(task.dueDate);
        const pastDue = isPast(date) && !isToday(date) && task.status !== "COMPLETED" && task.status !== "CANCELLED";
        
        return (
          <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md border ${
            pastDue ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" : 
            "bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#151515] dark:text-gray-400 dark:border-white/10"
          }`}>
            <Calendar size={12} />
            {format(date, "MMM dd, yyyy")}
          </div>
        )
      }
    },
    {
      header: "Priority",
      cell: (task) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border inline-flex items-center gap-1 ${
          task.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
          task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
          "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        }`}>
          <Flag size={10} />
          {task.priority}
        </span>
      )
    },
    {
      header: "Status",
      cell: (task) => {
        const statusConfig = {
          OPEN: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: Clock },
          IN_PROGRESS: { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20", icon: PlayCircle },
          COMPLETED: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle2 },
          CANCELLED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle }
        };
        const config = statusConfig[task.status];
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border tracking-wide uppercase ${config.bg} ${config.color} ${config.border}`}>
            <Icon size={12} />
            {task.status.replace("_", " ")}
          </div>
        );
      }
    },
    {
      header: "Actions",
      cell: (task) => (
        <div className="flex items-center gap-2">
          {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
            <button 
              onClick={() => handleUpdateStatus(task.id, task.status === 'OPEN' ? 'IN_PROGRESS' : 'COMPLETED')}
              title={task.status === 'OPEN' ? "Start Task" : "Complete Task"}
              className={`p-1.5 rounded-lg transition-colors border ${
                task.status === 'OPEN' 
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' 
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
              }`}
            >
              {task.status === 'OPEN' ? <PlayCircle size={16} /> : <CheckCircle2 size={16} />}
            </button>
          )}

          <button 
            onClick={() => router.push(`/admin/tasks/${task.id}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors"
          >
            Details
          </button>
          
          <button 
            onClick={() => handleDeleteTask(task.id)}
            title="Delete Task"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <ListTodo size={24} />
            </div>
            Task Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Assign tasks to your team, track progress, and hit deadlines.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm self-start sm:self-auto">
          + Create Task
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredTasks} 
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
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
