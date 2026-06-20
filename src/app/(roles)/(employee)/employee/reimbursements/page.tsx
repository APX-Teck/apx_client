import React from 'react';
// Removed dynamic import
import { reimbursementService, Reimbursement } from '@/services/employee/reimbursements.service';

import ReimbursementsManager from './_components/ReimbursementsManager';

export const dynamic = 'force-dynamic';

export default async function EmployeeReimbursementsPage() {
  let initialReimbursements: Reimbursement[] = [];
  let initialTotalPages = 1;
  let initialPage = 1;

  try {
    const res = await reimbursementService.getMyReimbursements({ page: 1, limit: 10 });
    if (res?.success) {
      initialReimbursements = res.data.data;
      initialTotalPages = res.data.pagination.totalPages;
      initialPage = res.data.pagination.page;
    }
  } catch (error) {
    console.error('Failed to load initial reimbursements on server', error);
  }

  return (
    <div className="w-full">
      <ReimbursementsManager
        initialReimbursements={initialReimbursements}
        initialTotalPages={initialTotalPages}
        initialPage={initialPage}
      />
    </div>
  );
}
