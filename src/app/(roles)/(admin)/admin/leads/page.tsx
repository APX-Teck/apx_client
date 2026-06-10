"use client";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { leadsService, Lead } from "@/services/admin/leads.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Users, Phone, Mail, CheckCircle, Clock, XCircle, AlertCircle, Search, Target, Flag, PlayCircle, MoreVertical } from "lucide-react";

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
      {type === "success" && <CheckCircle size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    setIsLoading(true);
    leadsService.getLeads()
      .then(data => {
        setLeads(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setToast({ message: "Failed to load leads", type: "error" });
        setIsLoading(false);
      });
  };

  const handleUpdateStatus = async (id: number, status: Lead["status"]) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await leadsService.updateLeadStatus(id, status);
      setToast({ message: `Lead status updated to ${status}`, type: "success" });
      fetchLeads(); // refresh data
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update status", type: "error" });
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.businessName && lead.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.serviceInterest && lead.serviceInterest.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: ColumnDef<Lead>[] = [
    {
      header: "Lead",
      cell: (lead) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{lead.fullName}</p>
          {lead.businessName && <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{lead.businessName}</p>}
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1">Added: {format(new Date(lead.createdAt), "MMM dd, yyyy")}</p>
        </div>
      )
    },
    {
      header: "Contact Info",
      cell: (lead) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <Phone size={12} className="text-gray-400" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <Mail size={12} className="text-gray-400" />
              <span>{lead.email}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: "Interest",
      accessorKey: "serviceInterest",
      cell: (lead) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {lead.serviceInterest || "—"}
        </span>
      )
    },
    {
      header: "Priority",
      cell: (lead) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border inline-flex items-center gap-1 ${
          lead.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
          lead.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
          "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        }`}>
          <Flag size={10} />
          {lead.priority}
        </span>
      )
    },
    {
      header: "Status",
      cell: (lead) => {
        const statusConfig = {
          NEW: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: AlertCircle },
          CONTACTED: { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20", icon: Phone },
          INTERESTED: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: Target },
          NEGOTIATING: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-100 dark:border-purple-500/20", icon: PlayCircle },
          CONVERTED: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle },
          LOST: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle }
        };
        const config = statusConfig[lead.status] || statusConfig.NEW;
        const Icon = config.icon;

        return (
          <div className="flex flex-col gap-1 items-start">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border tracking-wide uppercase ${config.bg} ${config.color} ${config.border}`}>
              <Icon size={12} />
              {lead.status}
            </div>
            {lead.nextFollowUpAt && lead.status !== "CONVERTED" && lead.status !== "LOST" && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-1">
                <Clock size={10} />
                Due: {format(new Date(lead.nextFollowUpAt), "MMM dd")}
              </p>
            )}
          </div>
        );
      }
    },
    {
      header: "Actions",
      cell: (lead) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(`/admin/leads/${lead.id}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-colors"
          >
            View Details
          </button>
          
          <div className="relative group">
            <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <MoreVertical size={16} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col overflow-hidden">
              <button 
                onClick={() => handleUpdateStatus(lead.id, "CONTACTED")}
                className="px-4 py-2 text-xs font-medium text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
              >
                Mark Contacted
              </button>
              <button 
                onClick={() => handleUpdateStatus(lead.id, "INTERESTED")}
                className="px-4 py-2 text-xs font-medium text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
              >
                Mark Interested
              </button>
              <button 
                onClick={() => handleUpdateStatus(lead.id, "CONVERTED")}
                className="px-4 py-2 text-xs font-medium text-left hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                Mark Converted
              </button>
              <button 
                onClick={() => handleUpdateStatus(lead.id, "LOST")}
                className="px-4 py-2 text-xs font-medium text-left hover:bg-red-50 dark:hover:bg-red-500/10 text-red-700 dark:text-red-400 border-t border-gray-100 dark:border-white/5"
              >
                Mark Lost
              </button>
            </div>
          </div>
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
              <Users size={24} />
            </div>
            Leads & CRM
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage your sales pipeline, track follow-ups, and convert leads.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, business, or service..."
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading leads...</p>
              </div>
            </div>
          ) : filteredLeads.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredLeads} 
            />
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Search className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No leads found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any leads matching "{searchTerm}". Try adjusting your search.
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
