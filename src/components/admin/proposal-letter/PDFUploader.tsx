'use client';

import React, { useRef, useState } from 'react';
import { FileText, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import type { StoredLetterPdf } from '@/app/types/proposal-letter.types';
import { cn } from '@/lib/utils';
import { MAX_PDF_SIZE_BYTES } from './lib/proposalLetter.constants';
import { EditorCard } from './EditorCard';

interface PDFUploaderProps {
  pdf: StoredLetterPdf | null;
  isProcessing: boolean;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;

export function PDFUploader({ pdf, isProcessing, onFileSelected, onRemove }: PDFUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires a change event.
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && !isProcessing) onFileSelected(file);
  };

  const dropHandlers = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return (
    <EditorCard
      title="Letterhead PDF"
      description="Upload the APXTECK letterhead. It is never sent to the server."
      icon={FileText}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleInputChange}
        tabIndex={-1}
        aria-hidden
      />

      {pdf ? (
        <div
          {...dropHandlers}
          className={cn(
            'flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#1A1A1A] border-2 border-dashed transition-colors',
            isDragging ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10' : 'border-transparent'
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={pdf.name}>
                {pdf.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(pdf.size)} · {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
                {isDragging && ' · Drop to replace'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={isProcessing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 min-h-[40px] rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={isProcessing}
              aria-label="Remove letterhead PDF"
              className="flex items-center justify-center w-10 min-h-[40px] rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          {...dropHandlers}
          onClick={openPicker}
          disabled={isProcessing}
          className={cn(
            'w-full flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-2xl border-2 border-dashed text-center transition-colors disabled:cursor-wait',
            isDragging
              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10'
              : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1A1A1A] hover:border-indigo-400 dark:hover:border-indigo-500/60'
          )}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <UploadCloud size={26} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {isProcessing ? 'Reading PDF…' : 'Drag & drop the letterhead PDF, or click to browse'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PDF up to {MAX_PDF_SIZE_BYTES / (1024 * 1024)} MB
            </p>
          </div>
        </button>
      )}
    </EditorCard>
  );
}
