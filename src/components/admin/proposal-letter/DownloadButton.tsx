'use client';

import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  disabled: boolean;
  isExporting: boolean;
  onClick: () => void;
}

export function DownloadButton({ disabled, isExporting, onClick }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isExporting}
      aria-busy={isExporting}
      className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:shadow-none"
    >
      {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
      <span>{isExporting ? 'Generating PDF…' : 'Download PDF'}</span>
    </button>
  );
}
