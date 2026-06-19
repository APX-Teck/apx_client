'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import DataTable from '@/components/ui/admin/DataTable';
import { EnquiriesHeader } from './EnquiriesHeader';
import { useEnquiriesColumns } from './EnquiriesColumns';
import { useEnquiriesLogic } from '../_hooks/useEnquiriesLogic';

import { Enquiry } from '@/services/admin/enquiries.service';

export function EnquiriesManager({ initialEnquiries = [] }: { initialEnquiries?: Enquiry[] }) {
  const { enquiries, isLoading } = useEnquiriesLogic(initialEnquiries);
  const columns = useEnquiriesColumns();

  const [currentSort, setCurrentSort] = useState('newest');

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Status', value: 'status' },
  ];

  const sortedEnquiries = useMemo(() => {
    return [...enquiries].sort((a, b) => {
      switch (currentSort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name_asc':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'name_desc':
          return (b.fullName || '').localeCompare(a.fullName || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });
  }, [enquiries, currentSort]);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-10 px-4 sm:px-6 md:px-8">
      <EnquiriesHeader />

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loading enquiries...
                </p>
              </div>
            </div>
          ) : enquiries.length > 0 ? (
            <DataTable
              columns={columns}
              data={sortedEnquiries}
              sortOptions={sortOptions}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Search className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No enquiries found
              </h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any enquiries matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
