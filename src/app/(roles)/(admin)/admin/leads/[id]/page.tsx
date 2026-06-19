import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { LeadDetailManager } from './_components/LeadDetailManager';
import { leadsService } from '@/services/admin/leads.service';
import LeadsLoading from '../loading';

export const metadata: Metadata = {
  title: 'Lead Details | APXTeck Admin',
  description: 'View and manage lead opportunity details.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function LeadDetailFetcher({ id }: { id: string }) {
  try {
    const [lead, followUps] = await Promise.all([
      leadsService.getLeadById(Number(id)),
      leadsService.getLeadFollowUps(Number(id)),
    ]);

    return <LeadDetailManager initialLead={lead} initialFollowUps={followUps} id={Number(id)} />;
  } catch (error) {
    console.error('Failed to fetch lead detail:', error);
    // On SSR fail (due to missing auth), render the client component with null so it can fetch securely.
    return <LeadDetailManager initialLead={null} initialFollowUps={null} id={Number(id)} />;
  }
}

export default async function LeadDetailPage(props: PageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<LeadsLoading />}>
      <LeadDetailFetcher id={params.id} />
    </Suspense>
  );
}
