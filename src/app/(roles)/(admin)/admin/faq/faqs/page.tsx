import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { FaqsManager } from './_components/FaqsManager';
import FaqsLoading from './loading';
import { faqsService } from '@/services/admin/faqs.service';
import { Faq } from '@/app/types/faq.types';

export const metadata: Metadata = {
  title: 'FAQs Management | APXTeck Admin',
  description: 'Create, edit, and organize Frequently Asked Questions.',
};

async function FaqsDataFetcher() {
  let initialFaqs: Faq[] = [];
  try {
    const data = await faqsService.getFaqs();
    initialFaqs = data || [];
  } catch (error) {
    console.error('Failed to fetch initial FAQs:', error);
  }
  return <FaqsManager initialFaqs={initialFaqs} />;
}

export default function FAQsManagementPage() {
  return (
    <Suspense fallback={<FaqsLoading />}>
      <FaqsDataFetcher />
    </Suspense>
  );
}
