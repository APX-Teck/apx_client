'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  Edit2,
  XCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { ServiceRequestDetails, RequestStatus } from '../../types';

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'NEW':
      return { label: 'New', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle };
    case 'IN_REVIEW':
      return { label: 'In Review', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Clock };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Loader2 };
    case 'COMPLETED':
      return {
        label: 'Completed',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        icon: CheckCircle2,
      };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    default:
      return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle };
  }
};

interface RequestDetailsHeaderProps {
  request: ServiceRequestDetails;
  isEditing: boolean;
  isCancelling: boolean;
  isSaving: boolean;
  canEdit: boolean;
  handleEditToggle: () => void;
  handleCancelRequest: () => void;
  handleSaveChanges: () => void;
}

export function RequestDetailsHeader({
  request,
  isEditing,
  isCancelling,
  isSaving,
  canEdit,
  handleEditToggle,
  handleCancelRequest,
  handleSaveChanges,
}: RequestDetailsHeaderProps) {
  const status = getStatusConfig(request.status);
  const StatusIcon = status.icon;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <Link
          href="/customer/requests"
          className="mt-1 p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-all min-w-[44px] min-h-[48px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
              REQ-{request.id.toString().padStart(4, '0')}
            </span>
            <div
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.color}`}
            >
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
            className={`font-bold px-5 py-2.5 min-h-[48px] rounded-xl transition-all flex items-center justify-center gap-2 ${
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
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-5 py-2.5 min-h-[48px] rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Cancel Request
          </button>
        )}

        {isEditing && (
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 min-h-[48px] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        )}
      </div>
    </motion.div>
  );
}
