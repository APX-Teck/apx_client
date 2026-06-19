import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { EnquiryDetailManager } from './_components/EnquiryDetailManager';
import { enquiriesService } from '@/services/admin/enquiries.service';
import EnquiriesLoading from '../loading';

export const metadata: Metadata = {
  title: 'Enquiry Details | APXTeck Admin',
  description: 'View and manage enquiry details.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EnquiryDetailFetcher({ id }: { id: string }) {
  try {
    const enquiry = await enquiriesService.getEnquiryById(Number(id));
    return <EnquiryDetailManager initialEnquiry={enquiry} id={Number(id)} />;
  } catch (error) {
    console.error('Failed to fetch enquiry detail:', error);
    // On SSR fail (due to missing auth), render the client component with null so it can fetch securely.
    return <EnquiryDetailManager initialEnquiry={null} id={Number(id)} />;
  }
}

export default async function EnquiryDetailPage(props: PageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<EnquiriesLoading />}>
      <EnquiryDetailFetcher id={params.id} />
    </Suspense>
  );
}
