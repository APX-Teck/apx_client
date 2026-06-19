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
        <div className="flex-1 overflow-auto hidden sm:block">
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

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4 p-4">
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
          ) : sortedEnquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">No enquiries found.</div>
          ) : (
            sortedEnquiries.map((enq) => (
              <div key={enq.id} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{enq.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{enq.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{enq.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase border ${
                    enq.status === 'NEW' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400' :
                    enq.status === 'CONTACTED' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400' :
                    enq.status === 'INTERESTED' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' :
                    enq.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                    enq.status === 'LOST' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400' :
                    'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400'
                  }`}>
                    {enq.status}
                  </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg mt-2 flex flex-col gap-1.5">
                  {enq.businessName && (
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">{enq.businessName}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Interest:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{enq.serviceInterest || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Source:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{enq.source || '—'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
