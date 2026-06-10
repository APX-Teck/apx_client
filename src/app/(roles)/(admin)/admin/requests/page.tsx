"use client";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { requestsService, ServiceRequest } from "@/services/admin/requests.service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { MoreVertical, ShieldAlert, Clock, PlayCircle, CheckCircle, XCircle } from "lucide-react";

export default function ServiceRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    requestsService.getRequests().then(data => {
      setRequests(data);
      setIsLoading(false);
    });
  }, []);

  const filteredRequests = requests.filter(req => 
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<ServiceRequest>[] = [
    {
      header: "Request ID",
      cell: (req) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{req.id}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{format(new Date(req.createdAt), "MMM dd, yyyy")}</p>
        </div>
      )
    },
    {
      header: "Customer",
      cell: (req) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{req.customerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{req.customerEmail}</p>
        </div>
      )
    },
    {
      header: "Service",
      accessorKey: "serviceType",
      cell: (req) => <span className="font-medium text-gray-700 dark:text-gray-300">{req.serviceType}</span>
    },
    {
      header: "Priority",
      cell: (req) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
          req.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
          req.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
          "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        }`}>
          {req.priority}
        </span>
      )
    },
    {
      header: "Status",
      cell: (req) => {
        const statusConfig = {
          NEW: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: ShieldAlert },
          IN_REVIEW: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: Clock },
          IN_PROGRESS: { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20", icon: PlayCircle },
          COMPLETED: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle },
          CANCELLED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle }
        };
        const config = statusConfig[req.status];
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
            <Icon size={14} />
            {req.status.replace("_", " ")}
          </div>
        );
      }
    },
    {
      header: "Assigned To",
      cell: (req) => (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {req.assignedTo || "— Unassigned —"}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (req) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(`/admin/requests/${req.id}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-colors"
          >
            Manage
          </button>
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Service Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Manage incoming customer requests, tracking, and assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
            Export CSV
          </button>
          <button 
            onClick={() => router.push('/admin/requests/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            Create Request
          </button>
        </div>
      </div>

      <DataTable 
        data={filteredRequests}
        columns={columns}
        searchPlaceholder="Search by ID, customer name, or service..."
        onSearch={setSearchTerm}
      />
    </div>
  );
}
