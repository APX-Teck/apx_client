import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Lead } from '@/app/types/lead.types';

export function LeadMessageView({ message }: { message?: string }) {
  return (
    <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-[300px]">
      <h2 className="text-[13px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <MessageSquare size={16} strokeWidth={2.5} /> Original Enquiry Message
      </h2>

      {message ? (
        <div className="bg-white dark:bg-[#151515] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-[15px] font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
      ) : (
        <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#151515]/50 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 min-h-[200px]">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
          <p className="text-[15px] font-bold text-gray-500 dark:text-gray-400">
            No message provided.
          </p>
        </div>
      )}
    </div>
  );
}
