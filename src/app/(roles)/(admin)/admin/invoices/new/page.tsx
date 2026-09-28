import React from 'react';
import { Metadata } from 'next';
import { InvoiceBuilder } from '../_components/InvoiceBuilder';

export const metadata: Metadata = {
  title: 'New Tax Invoice | APXTeck Admin',
  description: 'Create and generate a GST tax invoice.',
};

export default function NewInvoicePage() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      <InvoiceBuilder />
    </div>
  );
}
