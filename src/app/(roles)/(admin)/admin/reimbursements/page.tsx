import React, { Suspense } from 'react';
import { ReimbursementsHeader } from './_components/ReimbursementsHeader';
import { reimbursementsService } from '@/services/admin/reimbursements.service';
import ReimbursementsLoading from './loading';
// Removed dynamic import

import ReimbursementsManager from './_components/ReimbursementsManager';

export const dynamic = 'force-dynamic';

async function ReimbursementsFetcher() {
  let initialReimbursements: import('@/services/admin/reimbursements.service').Reimbursement[] = [];
  try {
    const data = await reimbursementsService.getReimbursements();
    initialReimbursements = data || [];
  } catch (error) {
    console.error('Failed to pre-fetch reimbursements:', error);
  }

  return <ReimbursementsManager initialReimbursements={initialReimbursements} />;
}

export default function ReimbursementsPage() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-10 px-4 sm:px-6 md:px-8">
      <ReimbursementsHeader />
      <Suspense fallback={<ReimbursementsLoading />}>
        <ReimbursementsFetcher />
      </Suspense>
    </div>
  );
}
