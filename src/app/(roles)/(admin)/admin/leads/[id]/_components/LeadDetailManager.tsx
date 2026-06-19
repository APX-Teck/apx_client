'use client';

import React from 'react';
import { useLeadDetailLogic } from '../_hooks/useLeadDetailLogic';
import { LeadDetailHeader } from './LeadDetailHeader';
import { LeadMessageView } from './LeadMessageView';
import { LeadIntelSidebar } from './LeadIntelSidebar';
import { LeadFollowUps } from './LeadFollowUps';
import { Lead, LeadFollowUp } from '@/app/types/lead.types';

interface Props {
  initialLead: Lead;
  initialFollowUps: LeadFollowUp[];
}

export function LeadDetailManager({ initialLead, initialFollowUps }: Props) {
  const { lead, followUps, handleAddFollowUp, handleAssignLead } = useLeadDetailLogic(
    initialLead,
    initialFollowUps
  );

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
