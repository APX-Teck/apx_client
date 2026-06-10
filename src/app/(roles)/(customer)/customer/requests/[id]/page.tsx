'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { 
  ArrowLeft, Clock, AlertCircle, CheckCircle2, XCircle, Loader2, 
  FileText, Download, User, DollarSign, Calendar, Paperclip, CreditCard, Edit2, Save
} from 'lucide-react';
import Link from 'next/link';

type RequestStatus = "NEW" | "IN_REVIEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'NEW':
      return { label: 'New', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle };
    case 'IN_REVIEW':
      return { label: 'In Review', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Clock };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Loader2 };
    case 'COMPLETED':
      return { label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    default:
      return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle };
  }
};

export default function CustomerRequestDetailsPage() {
  const { id } = useParams();
  
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRequestDetails = async () => {
    setLoading(true);
    const data = await api.getMyRequestById(Number(id));
    if (data) {
      setRequest(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleEditToggle = () => {
    if (!isEditing) {
      const initialData: Record<string, any> = {};
      request.requestData?.forEach((d: any) => {
        initialData[d.fieldKey] = d.fieldValue;
      });
      setFormData(initialData);
      setNewFiles([]);
      setMessage(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setMessage(null);
    
    const submissionData = new FormData();
    submissionData.append('requestData', JSON.stringify(formData));
    for (const file of newFiles) {
      submissionData.append('attachments', file);
    }
    
    const res = await api.updateMyRequest(Number(id), submissionData);
    setIsSaving(false);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Request updated successfully.' });
      setIsEditing(false);
      fetchRequestDetails();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update request.' });
    }
  };

  const handleCancelRequest = async () => {
    if (!confirm('Are you sure you want to cancel this request? This action cannot be undone.')) return;
    
    setIsCancelling(true);
    setMessage(null);
    const res = await api.cancelRequest(Number(id));
    setIsCancelling(false);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Request cancelled successfully.' });
      fetchRequestDetails();
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to cancel request.' });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find the service request you're looking for.</p>
        <Link href="/customer/requests" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-all">
          Back to Requests
        </Link>
      </div>
    );
  }

  const status = getStatusConfig(request.status);
  const StatusIcon = status.icon;

  const projectDetails = request.requestData || [];
  const textFields = projectDetails.filter((d: any) => d.field?.fieldType !== 'FILE');
  const attachments = request.fileUploads || [];
  const payments = request.payments || [];
  const serviceFields = request.service?.fields?.filter((f: any) => f.fieldType !== 'FILE') || [];

  const canEdit = !['COMPLETED', 'CANCELLED'].includes(request.status);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-start gap-4">
          <Link href="/customer/requests" className="mt-1 p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500">REQ-{request.id.toString().padStart(4, '0')}</span>
              <div className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {request.service?.name}
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {canEdit && (
            <button 
              onClick={handleEditToggle}
              className={`font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isEditing 
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20' 
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
              }`}
            >
              {isEditing ? <XCircle className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {isEditing ? 'Cancel Editing' : 'Edit Request'}
            </button>
          )}

          {request.status === 'NEW' && !isEditing && (
            <button 
              onClick={handleCancelRequest}
              disabled={isCancelling}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel Request
            </button>
          )}

          {isEditing && (
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          )}
        </div>
      </motion.div>

      {message && (
        <motion.div variants={item} className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{message.text}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Project Details */}
          <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-cyan-500" />
              Project Requirements
            </h2>
            
            {isEditing ? (
              <div className="space-y-6">
                {serviceFields.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">This service does not have any specific requirement fields defined.</p>
                ) : (
                  serviceFields.map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {field.fieldLabel}
                      </label>
                      {field.fieldType === 'TEXT' || field.fieldType === 'NUMBER' || field.fieldType === 'DATE' || field.fieldType === 'EMAIL' || field.fieldType === 'PHONE' ? (
                        <input 
                          type={field.fieldType === 'PHONE' ? 'tel' : field.fieldType.toLowerCase()}
                          value={formData[field.fieldKey] || ''}
                          placeholder={field.placeholder || ''}
                          onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      ) : field.fieldType === 'TEXTAREA' ? (
                        <textarea 
                          rows={4}
                          value={formData[field.fieldKey] || ''}
                          placeholder={field.placeholder || ''}
                          onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                        />
                      ) : field.fieldType === 'DROPDOWN' ? (
                        <select 
                          value={formData[field.fieldKey] || ''}
                          onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                          <option value="">{field.placeholder || 'Select...'}</option>
                          {Array.isArray(field.options) && field.options.map((opt: string, idx: number) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            ) : textFields.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No additional requirements were provided.</p>
            ) : (
              <div className="space-y-6">
                {textFields.map((data: any) => (
                  <div key={data.id} className="border-b border-gray-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {data.field?.fieldLabel || data.fieldKey}
                    </p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {data.fieldValue || '-'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Attachments */}
          <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Paperclip className="w-5 h-5 text-cyan-500" />
              Attachments & Documents
            </h2>
            
            {attachments.length === 0 && !isEditing ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No files were attached to this request.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {attachments.map((file: any) => (
                  <a 
                    key={file.id} 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.fileName}</p>
                      <p className="text-xs text-gray-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-cyan-500" />
                  </a>
                ))}
              </div>
            )}

            {isEditing && (
              <div className="mt-6 border-t border-gray-100 dark:border-white/5 pt-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                  Upload New Attachments
                </label>
                <div className="relative border-2 border-dashed border-cyan-500/30 rounded-2xl p-6 hover:bg-cyan-500/5 transition-colors group text-center cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  </div>
                </div>
                {newFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {newFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-cyan-500/20 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                        <button 
                          type="button" 
                          onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Column - Meta & Status */}
        <div className="space-y-8">
          
          {/* Overview Info */}
          <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Overview</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Created Date</p>
                  <p className="text-gray-900 dark:text-white font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Priority</p>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">{request.priority.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assigned Team */}
          <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Assigned To</h3>
            {request.assignedTo ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold">
                  {request.assignedTo.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{request.assignedTo.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">Pending Assignment</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
