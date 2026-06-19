import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AdsManager } from './_components/AdsManager';
import AdsLoading from './loading';
import { adsService } from '@/services/admin/ads.service';
import { Ad } from '@/app/types/ad.types';

export const metadata: Metadata = {
  title: 'Advertisements Management | APXTeck Admin',
  description: 'Manage banner ads, Google AdSense codes, and placements across the platform.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function AdsDataFetcher() {
  let initialAds: Ad[] = [];
  try {
    const data = await adsService.getAds({ limit: 100 });
    initialAds = data.data || [];
  } catch (error) {
    console.error('Failed to fetch initial ads:', error);
    // You can also throw here to trigger error.tsx
  }
  return <AdsManager initialAds={initialAds} />;
}

export default function AdsManagementPage() {
  return (
    <Suspense fallback={<AdsLoading />}>
      <AdsDataFetcher />
    </Suspense>
  );
}
