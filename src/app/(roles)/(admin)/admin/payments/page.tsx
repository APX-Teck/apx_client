import React, { Suspense } from 'react';
import { PaymentsClientWrapper } from './_components/PaymentsClientWrapper';
import { paymentsService } from '@/services/admin/payments.service';
import { requestsService } from '@/services/admin/requests.service';
import PaymentsLoading from './loading';

async function PaymentsFetcher() {
  let initialPaymentsData: {
    payments: import('@/services/admin/payments.service').Payment[];
    total: number;
    page: number;
  } = { payments: [], total: 0, page: 1 };
  let initialRequestsData: any[] = [];

  try {
    const [payments, requests] = await Promise.all([
      paymentsService.getPayments(),
      requestsService.getRequests(),
    ]);
    initialPaymentsData = payments;
    initialRequestsData = requests;
  } catch (error) {
    console.error('Failed to pre-fetch payments data:', error);
  }

  return (
    <PaymentsClientWrapper
      initialPaymentsData={initialPaymentsData}
      initialRequestsData={initialRequestsData}
    />
  );
}

export default function PaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      <Suspense fallback={<PaymentsLoading />}>
        <PaymentsFetcher />
      </Suspense>
    </div>
  );
}
