'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  requestsService,
  ServiceRequestDetail,
  RequestStatus,
} from '@/services/admin/requests.service';
import { User } from '@/services/admin/users.service';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  FileText,
  Paperclip,
  CreditCard,
  Clock,
  CheckCircle,
  ShieldAlert,
  Save,
  MessageSquare,
  Loader2,
  ChevronDown,
  Check,
  Search,
  Activity,
  AlertCircle
} from 'lucide-react';

interface Props {
  initialData: ServiceRequestDetail;
  initialAdmins: User[];
}

const STATUS_STEPS: { value: RequestStatus; label: string; icon: React.ElementType }[] = [
  { value: 'NEW', label: 'New', icon: Activity },
  { value: 'IN_REVIEW', label: 'In Review', icon: Clock },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Loader2 },
  { value: 'COMPLETED', label: 'Completed', icon: CheckCircle },
];

export function RequestDetailClient({ initialData, initialAdmins }: Props) {
  const router = useRouter();

  const [request, setRequest] = useState<ServiceRequestDetail>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Editable states
  const [status, setStatus] = useState<RequestStatus>(initialData.status);
  const [assignedToId, setAssignedToId] = useState<number | ''>(initialData.assignedToId || '');
  const [internalNotes, setInternalNotes] = useState<string>(initialData.internalNotes || '');

  // Dropdown states
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const assignmentRef = useRef<HTMLDivElement>(null);

  const hasChanges = 
    status !== request.status || 
    assignedToId !== (request.assignedToId || '') || 
    internalNotes !== (request.internalNotes || '');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
      if (assignmentRef.current && !assignmentRef.current.contains(event.target as Node)) {
        setIsAssignmentOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAssignmentOpen) {
      setTimeout(() => setEmployeeSearch(''), 200);
    }
  }, [isAssignmentOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises = [];

      if (status !== request.status) {
        promises.push(requestsService.updateRequestStatus(String(request.id), status));
      }

      if (assignedToId !== (request.assignedToId || '')) {
        if (assignedToId !== '') {
          promises.push(requestsService.assignRequest(String(request.id), Number(assignedToId)));
        }
      }

      if (internalNotes !== (request.internalNotes || '')) {
        promises.push(requestsService.updateInternalNotes(String(request.id), internalNotes));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        const updatedReq = await requestsService.getRequestDetail(String(request.id));
        if (updatedReq) {
          setRequest(updatedReq);
          setStatus(updatedReq.status);
          setAssignedToId(updatedReq.assignedToId || '');
          setInternalNotes(updatedReq.internalNotes || '');
        }
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setStatus(request.status);
    setAssignedToId(request.assignedToId || '');
    setInternalNotes(request.internalNotes || '');
  };

  const filteredAdmins = initialAdmins.filter(
    (admin) =>
      admin.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      (admin.role?.name || '').toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.value === status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-5 lg:p-6 rounded-[2rem] border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
        <div className="flex items-center gap-4 lg:gap-5 relative z-10">
          <button
            onClick={() => router.push('/admin/requests')}
            className="p-3 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 group"
          >
            <ArrowLeft size={22} className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
              #{request.id}
              <span
                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm ${
                  request.priority === 'HIGH'
                    ? 'bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                    : request.priority === 'MEDIUM'
                      ? 'bg-amber-50/80 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                      : 'bg-blue-50/80 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                }`}
              >
                {request.priority} PRIORITY
              </span>
            </h1>
            <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mt-1">
              {request.serviceType} <span className="mx-2">•</span> Created{' '}
              {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main Data) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Status Stepper */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-visible"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                  <Activity size={20} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                </div>
                Request Status
              </h2>

              {/* Status Override Menu */}
              <div className="relative" ref={statusMenuRef}>
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  Override Status
                  <ChevronDown size={14} className={cn('transition-transform duration-300', isStatusMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isStatusMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-1.5"
                    >
                      {[...STATUS_STEPS, { value: 'CANCELLED', label: 'Cancelled', icon: AlertCircle }].map((option) => {
                        const Icon = option.icon;
                        const isCancelled = option.value === 'CANCELLED';
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setStatus(option.value as RequestStatus);
                              setIsStatusMenuOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
                              status === option.value
                                ? isCancelled 
                                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' 
                                  : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10'
                            )}
                          >
                            <Icon size={16} strokeWidth={status === option.value ? 3 : 2} />
                            {option.label}
                            {status === option.value && <Check size={14} className="ml-auto" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {status === 'CANCELLED' ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-2xl">
                <AlertCircle size={40} className="text-red-500 mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Request Cancelled</h3>
                <p className="text-sm text-red-700/70 dark:text-red-400/70 mt-1">This service request has been cancelled.</p>
              </div>
            ) : (
              <div className="relative pt-4 pb-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-white/5 -translate-y-1/2 rounded-full overflow-hidden z-0 hidden sm:block">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.value} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 group">
                        <button
                          onClick={() => setStatus(step.value)}
                          className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative bg-white dark:bg-[#111111]',
                            isCompleted ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                            isCurrent ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] text-indigo-600 dark:text-indigo-400' :
                            'border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                          )}
                        >
                          <StepIcon size={20} strokeWidth={isCurrent || isCompleted ? 3 : 2} className={cn(isCurrent && "animate-pulse")} />
                        </button>
                        <div className="flex flex-col sm:items-center">
                          <span className={cn(
                            'text-sm font-black tracking-tight transition-colors',
                            isCurrent ? 'text-indigo-600 dark:text-indigo-400' :
                            isCompleted ? 'text-gray-900 dark:text-white' :
                            'text-gray-400'
                          )}>
                            {step.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Form Data */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
          >
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <FileText size={20} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              </div>
              Submitted Request Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.formData.map((field, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.05) }}
                  key={i} 
                  className={cn(
                    "bg-gray-50/50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 p-5 rounded-2xl transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md hover:border-gray-200 dark:hover:border-white/10",
                    field.value.length > 50 ? 'md:col-span-2' : ''
                  )}
                >
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-1.5 font-extrabold uppercase tracking-wider">
                    {field.label}
                  </p>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {field.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Attachments */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                  <Paperclip size={20} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                </div>
                Uploaded Attachments
              </h2>
              <span className="text-sm font-extrabold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 rounded-lg border border-indigo-100/50 dark:border-indigo-500/20">
                {request.attachments.length} Files
              </span>
            </div>

            {request.attachments.length === 0 ? (
              <div className="bg-gray-50/50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 rounded-2xl py-12 flex flex-col items-center justify-center">
                <p className="text-[15px] font-bold text-gray-500 dark:text-gray-400">
                  No attachments uploaded for this request.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {request.attachments.map((att, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.05) }}
                    key={att.id}
                    onClick={() => window.open(att.url, '_blank')}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[#151515] border border-gray-200/80 dark:border-white/10 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                        <FileText size={22} strokeWidth={2.5} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[15px] font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {att.fileName}
                        </p>
                        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                          {att.fileSize}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <h2 className="text-[13px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <UserIcon size={16} strokeWidth={3} /> Customer Info
            </h2>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100/80 dark:border-white/10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-2xl border border-indigo-200/50 dark:border-indigo-500/30 shadow-sm transform transition-transform hover:scale-105">
                {request.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-lg text-gray-900 dark:text-white tracking-tight">
                  {request.customerName}
                </p>
                <button
                  onClick={() => router.push(`/admin/users`)}
                  className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors mt-0.5"
                >
                  View Full Profile
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100/50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 shadow-sm flex items-center justify-center">
                  <Mail size={16} className="text-indigo-500 dark:text-indigo-400" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-[14px] text-gray-700 dark:text-gray-300 truncate">
                  {request.customerEmail}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100/50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 shadow-sm flex items-center justify-center">
                  <Phone size={16} className="text-emerald-500 dark:text-emerald-400" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-[14px] text-gray-700 dark:text-gray-300">
                  {request.customerPhone || 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Assignment */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-30 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
          >
            <h2 className="text-[13px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <ShieldAlert size={16} strokeWidth={3} /> Assignment
            </h2>

            <div className="relative mb-3" ref={assignmentRef}>
              <button
                onClick={() => setIsAssignmentOpen(!isAssignmentOpen)}
                className="w-full flex items-center justify-between gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-bold text-[15px] rounded-2xl px-5 py-4 outline-none cursor-pointer border border-gray-200/80 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10 transition-all shadow-sm focus:ring-4 focus:ring-indigo-500/20"
              >
                {assignedToId === ''
                  ? 'Unassigned'
                  : initialAdmins.find((a) => a.id === assignedToId)?.fullName || 'Unknown Staff'}
                <ChevronDown
                  size={18}
                  strokeWidth={3}
                  className={cn(
                    'text-gray-500 dark:text-gray-400 transition-transform duration-300',
                    isAssignmentOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isAssignmentOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-full bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-1.5"
                  >
                    <div className="p-2 border-b border-gray-100 dark:border-white/5">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search employees..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar p-1">
                      {employeeSearch === '' && (
                        <button
                          onClick={() => {
                            setAssignedToId('');
                            setIsAssignmentOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3 text-[15px] font-bold rounded-xl transition-all duration-200',
                            assignedToId === ''
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10'
                          )}
                        >
                          Unassigned
                          {assignedToId === '' && <Check size={18} strokeWidth={3} className="text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      )}

                      {filteredAdmins.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[14px] text-gray-500 dark:text-gray-400">
                          No employees found.
                        </div>
                      ) : (
                        filteredAdmins.map((admin) => (
                          <button
                            key={admin.id}
                            onClick={() => {
                              setAssignedToId(admin.id);
                              setIsAssignmentOpen(false);
                            }}
                            className={cn(
                              'w-full flex flex-col items-start px-4 py-3 text-[15px] rounded-xl transition-all duration-200',
                              assignedToId === admin.id
                                ? 'bg-indigo-50 dark:bg-indigo-500/10'
                                : 'hover:bg-gray-100/80 dark:hover:bg-white/10'
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={cn('font-bold', assignedToId === admin.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white')}>
                                {admin.fullName}
                              </span>
                              {assignedToId === admin.id && <Check size={18} strokeWidth={3} className="text-indigo-600 dark:text-indigo-400" />}
                            </div>
                            <span className={cn('text-[12px] font-bold mt-0.5', assignedToId === admin.id ? 'text-indigo-500 dark:text-indigo-400/70' : 'text-gray-500 dark:text-gray-400')}>
                              {admin.role?.name || 'STAFF'}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 ml-1">
              Assign this request to a staff member. They will receive a notification.
            </p>
          </motion.div>

          {/* Internal Notes */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-20 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
          >
            <h2 className="text-[13px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <MessageSquare size={16} strokeWidth={3} /> Internal Notes
            </h2>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white text-[15px] font-medium rounded-2xl p-5 min-h-[160px] focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/50 resize-none transition-all duration-300 shadow-sm hover:shadow-md"
              placeholder="Add private notes only visible to admins..."
            />
          </motion.div>

          {/* Payments (if any) */}
          {request.paymentHistory.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
            >
              <h2 className="text-[13px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                <CreditCard size={16} strokeWidth={3} /> Linked Payments
              </h2>
              <div className="space-y-3">
                {request.paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100/80 dark:border-white/10 transition-colors hover:bg-gray-100/50 dark:hover:bg-white/10"
                  >
                    <div>
                      <p className="text-[14px] font-black text-gray-900 dark:text-white tracking-tight">
                        #{payment.id}
                      </p>
                      <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border shadow-sm ${
                        payment.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-5 bg-white/80 dark:bg-white/5 backdrop-blur-sm hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 py-3.5 rounded-2xl font-bold text-[14px] transition-all shadow-sm hover:shadow-md border border-gray-200/80 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 active:scale-95">
                + Create New Invoice
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Bar for Unsaved Changes */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-white/95 dark:bg-[#151515]/95 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-full px-6 py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[15px] font-bold text-gray-900 dark:text-white">Unsaved Changes</span>
              </div>
              
              <div className="flex items-center gap-3 sm:ml-4">
                <button
                  onClick={handleDiscard}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-[14px] font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} strokeWidth={2.5} />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
