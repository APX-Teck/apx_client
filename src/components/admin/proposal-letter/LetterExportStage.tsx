'use client';

import React from 'react';
import type {
  LetterFontSettings,
  LetterPage,
  RenderedPdfPage,
  VisibleLetterAsset,
} from '@/app/types/proposal-letter.types';
import { PX_PER_PT } from './lib/proposalLetter.constants';
import { LetterOverlay } from './LetterOverlay';

interface LetterExportStageProps {
  pages: LetterPage[];
  backgrounds: RenderedPdfPage[];
  font: LetterFontSettings;
  assets: VisibleLetterAsset[];
  registerOverlay: (pageId: string) => (node: HTMLElement | null) => void;
}

/**
 * Off-screen, non-interactive copy of each page's overlay at true size. These nodes are
 * captured into the downloaded PDF; pages with nothing to draw are skipped.
 */
export function LetterExportStage({
  pages,
  backgrounds,
  font,
  assets,
  registerOverlay,
}: LetterExportStageProps) {
  return (
    <div aria-hidden className="fixed top-0 -left-[10000px] pointer-events-none">
      {pages.map((page, index) => {
        const background = backgrounds[page.sourcePageIndex];
        const pageAssets = index === pages.length - 1 ? assets : [];
        if (!background || (!page.body.trim() && pageAssets.length === 0)) return null;

        return (
          <LetterOverlay
            key={page.id}
            ref={registerOverlay(page.id)}
            page={page}
            widthPx={background.widthPt * PX_PER_PT}
            heightPx={background.heightPt * PX_PER_PT}
            font={font}
            assets={pageAssets}
          />
        );
      })}
    </div>
  );
}
