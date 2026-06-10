"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requestsService, ServiceRequestDetail, RequestStatus } from "@/services/admin/requests.service";
import { usersService, User } from "@/services/admin/users.service";
import { format } from "date-fns";
import { 
  ArrowLeft, User as UserIcon, Mail, Phone, FileText, 
  Paperclip, CreditCard, Clock, CheckCircle, ShieldAlert, 
  PlayCircle, XCircle, Save, MessageSquare, Loader2
} from "lucide-react";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [request, setRequest] = useState<ServiceRequestDetail | null>(null);
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editable states
  const [status, setStatus] = useState<RequestStatus>("NEW");
  const [assignedToId, setAssignedToId] = useState<number | "">("");
  const [internalNotes, setInternalNotes] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;
      try {
        const [reqData, usersData] = await Promise.all([
          requestsService.getRequestDetail(params.id as string),
          usersService.getUsers()
        ]);
        
        if (reqData) {
          setRequest(reqData);
          setStatus(reqData.status);
          setAssignedToId(reqData.assignedToId || "");
          setInternalNotes(reqData.internalNotes || "");
        }
        
        // Filter users to get only admins/staff
        if (usersData) {
          const staff = usersData.filter(u => 
            u.role?.name === "SUPER_ADMIN" || 
            u.role?.name === "ADMIN" || 
            u.role?.name?.includes("STAFF")
          );
          setAdmins(staff);
        }
      } catch (error) {
        console.error("Failed to fetch request data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params]);

  const handleSave = async () => {
    if (!request || !params?.id) return;
    setIsSaving(true);
    try {
      const promises = [];
      
      if (status !== request.status) {
        promises.push(requestsService.updateRequestStatus(params.id as string, status));
      }
      
      if (assignedToId !== (request.assignedToId || "")) {
        if (assignedToId !== "") {
          promises.push(requestsService.assignRequest(params.id as string, Number(assignedToId)));
        }
      }
      
      if (internalNotes !== (request.internalNotes || "")) {
        promises.push(requestsService.updateInternalNotes(params.id as string, internalNotes));
      }
      
      if (promises.length > 0) {
        await Promise.all(promises);
        // Refresh request data
        const updatedReq = await requestsService.getRequestDetail(params.id as string);
        if (updatedReq) {
          setRequest(updatedReq);
          setStatus(updatedReq.status);
          setAssignedToId(updatedReq.assignedToId || "");
          setInternalNotes(updatedReq.internalNotes || "");
        }
        alert("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !request) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const getStatusConfig = (currentStatus: string) => {
    switch(currentStatus) {
      case "NEW": return { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: ShieldAlert };
      case "IN_REVIEW": return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: Clock };
      case "IN_PROGRESS": return { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20", icon: PlayCircle };
      case "COMPLETED": return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle };
      case "CANCELLED": return { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle };
      default: return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Clock };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/requests')}
            className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              #{request.id}
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                request.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                request.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
                "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
              }`}>
                {request.priority} PRIORITY
              </span>
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              {request.serviceType} • Created {format(new Date(request.createdAt), "MMM dd, yyyy HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as RequestStatus)}
            className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="NEW">Status: NEW</option>
            <option value="IN_REVIEW">Status: IN REVIEW</option>
            <option value="IN_PROGRESS">Status: IN PROGRESS</option>
            <option value="COMPLETED">Status: COMPLETED</option>
            <option value="CANCELLED">Status: CANCELLED</option>
          </select>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dynamic Form Data */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" /> Submitted Request Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
              {request.formData.map((field, i) => (
                <div key={i} className={field.value.length > 50 ? "md:col-span-2" : ""}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{field.label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-pre-wrap">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments Gallery */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Paperclip size={20} className="text-indigo-500" /> Uploaded Attachments
              </h2>
              <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg">
                {request.attachments.length} Files
              </span>
            </div>
            
            {request.attachments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No attachments uploaded for this request.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {request.attachments.map(att => (
                  <div key={att.id} onClick={() => window.open(att.url, '_blank')} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{att.fileName}</p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{att.fileSize}</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2">
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Operational Panels */}
        <div className="space-y-6">
          
          {/* Customer Card */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon size={16} /> Customer Info
            </h2>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                {request.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{request.customerName}</p>
                <button 
                  onClick={() => router.push(`/admin/users`)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Full Profile
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{request.customerEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{request.customerPhone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Assignment Panel */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Assignment</h2>
            <select 
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 mb-2"
            >
              <option value="">Unassigned</option>
              {admins.map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName} ({admin.role?.name || "STAFF"})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">Assign this request to a staff member. They will receive a notification.</p>
          </div>

          {/* Internal Notes */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Internal Notes
            </h2>
            <textarea 
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Add private notes only visible to admins..."
            />
          </div>

          {/* Payment History */}
          {request.paymentHistory.length > 0 && (
            <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={16} /> Linked Payments
              </h2>
              <div className="space-y-3">
                {request.paymentHistory.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">#{payment.id}</p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                      payment.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
                      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-indigo-600 dark:text-indigo-400 py-2.5 rounded-xl font-bold text-sm transition-colors border border-gray-200 dark:border-white/10">
                + Create New Invoice
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
