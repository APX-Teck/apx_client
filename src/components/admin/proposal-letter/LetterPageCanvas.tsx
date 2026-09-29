'use client';

import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import type {
  LetterAssetKind,
  LetterFontSettings,
  LetterPage,
  RenderedPdfPage,
  VisibleLetterAsset,
} from '@/app/types/proposal-letter.types';
import { PX_PER_PT } from './lib/proposalLetter.constants';
import { useElementWidth } from './hooks/useElementWidth';
import { LetterOverlay } from './LetterOverlay';

interface LetterPageCanvasProps {
  page: LetterPage;
  pageNumber: number;
  pageCount: number;
  background: RenderedPdfPage;
  font: LetterFontSettings;
  assets: VisibleLetterAsset[];
  onBodyChange: (body: string) => void;
  onAssetMove: (kind: LetterAssetKind, x: number, y: number) => void;
  onRemove?: () => void;
}

export function LetterPageCanvas({
  page,
  pageNumber,
  pageCount,
  background,
  font,
  assets,
  onBodyChange,
  onAssetMove,
  onRemove,
}: LetterPageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);

  const widthPx = background.widthPt * PX_PER_PT;
  const heightPx = background.heightPt * PX_PER_PT;
  // Pages are laid out at true size and scaled down to fit, so point sizes match the PDF.
  const scale = containerWidth ? Math.min(1, containerWidth / widthPx) : 0;

  return (
    <section aria-label={`Page ${pageNumber} of ${pageCount}`} className="space-y-3">
      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Page {pageNumber} <span className="text-gray-400 font-normal">of {pageCount}</span>
          <span className="ml-2 text-xs font-normal text-gray-400">
            · Letterhead page {page.sourcePageIndex + 1}
          </span>
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 px-3 min-h-[36px] rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
            Remove page
          </button>
        )}
      </div>

      <div ref={containerRef} className="w-full">
        <div
          className="relative mx-auto overflow-hidden bg-white shadow-xl ring-1 ring-black/5 dark:ring-white/10"
          style={{
            width: widthPx * scale,
            height: heightPx * scale,
            visibility: scale ? 'visible' : 'hidden',
          }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: widthPx, height: heightPx, transform: `scale(${scale})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL from pdf.js */}
            <img
              src={background.imageUrl}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full select-none pointer-events-none"
            />
            <LetterOverlay
              page={page}
              widthPx={widthPx}
              heightPx={heightPx}
              font={font}
              assets={assets}
              editing={{ scale, onBodyChange, onAssetMove }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
