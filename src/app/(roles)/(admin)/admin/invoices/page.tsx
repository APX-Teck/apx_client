import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { invoicesService } from '@/services/admin/invoices.service';
import { InvoicesManager } from './_components/InvoicesManager';
import InvoicesLoading from './loading';

export const metadata: Metadata = {
  title: 'Tax Invoices | APXTeck Admin',
  description: 'Generate and manage GST tax invoices.',
};

async function InvoicesFetcher() {
  const initialInvoices = await invoicesService.getInvoices({ limit: 100 });
  return <InvoicesManager initialInvoices={initialInvoices} />;
}

export default function InvoicesPage() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      <Suspense fallback={<InvoicesLoading />}>
        <InvoicesFetcher />
      </Suspense>
    </div>
  );
}
