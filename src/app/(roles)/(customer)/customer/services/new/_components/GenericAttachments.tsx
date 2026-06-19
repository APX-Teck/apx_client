'use client';
import React from 'react';
import { XCircle } from 'lucide-react';

interface GenericAttachmentsProps {
  genericFiles: File[];
  handleGenericFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGenericFile: (index: number) => void;
}

export function GenericAttachments({
  genericFiles,
  handleGenericFileUpload,
  removeGenericFile,
}: GenericAttachmentsProps) {
  return (
    <div className="pl-0 sm:pl-10 pt-4 mt-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Additional Attachments / Project Documents (Optional)
        </label>
        <div className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group text-center cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.zip,.doc,.docx,.xls,.xlsx,.txt,.csv"
            onChange={handleGenericFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">
              Any additional files (PDF, images, zips) that describe your project
            </p>
          </div>
        </div>
        {genericFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {genericFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeGenericFile(i)}
                  className="text-red-500 hover:text-red-600 transition-colors flex items-center justify-center min-w-[44px] min-h-[48px]"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
