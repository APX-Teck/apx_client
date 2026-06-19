'use client';

import React from 'react';
import { useLeadDetailLogic } from '../_hooks/useLeadDetailLogic';
import { LeadDetailHeader } from './LeadDetailHeader';
import { LeadMessageView } from './LeadMessageView';
import { LeadIntelSidebar } from './LeadIntelSidebar';
import { LeadFollowUps } from './LeadFollowUps';
import { Lead, LeadFollowUp } from '@/app/types/lead.types';

interface Props {
  initialLead: Lead | null;
  initialFollowUps: LeadFollowUp[] | null;
  id: number;
}

export function LeadDetailManager({ initialLead, initialFollowUps, id }: Props) {
  const { lead, followUps, handleAddFollowUp, handleAssignLead, isLoading } = useLeadDetailLogic(
    initialLead,
    initialFollowUps,
    id
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-safe pb-10 px-4 sm:px-6 md:px-8 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-safe pb-10 px-4 sm:px-6 md:px-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="p-8 text-center bg-red-50 dark:bg-red-500/10 rounded-3xl border border-red-100 dark:border-red-500/20">
          <p className="text-lg text-red-600 dark:text-red-400 font-bold mb-2">Lead not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-12 px-4 sm:px-6 md:px-8">
      {/* Header Visualizer */}
      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-6">
        <LeadDetailHeader lead={lead} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Message View & Follow Ups */}
        <div className="xl:col-span-2 space-y-6">
          <LeadMessageView message={lead.message} />
          <LeadFollowUps followUps={followUps} onAddFollowUp={handleAddFollowUp} />
        </div>

        {/* Right Column: Lead Intel */}
        <LeadIntelSidebar lead={lead} onAssignLead={handleAssignLead} />
      </div>
    </div>
  );
}
