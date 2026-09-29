'use client';

import React, { Ref } from 'react';
import type {
  LetterAssetKind,
  LetterFontSettings,
  LetterPage,
  VisibleLetterAsset,
} from '@/app/types/proposal-letter.types';
import { EditableLetterBody, StaticLetterBody } from './LetterBody';
import { LetterAssetImage } from './LetterAssetImage';

interface LetterOverlayProps {
  page: LetterPage;
  widthPx: number;
  heightPx: number;
  font: LetterFontSettings;
  assets: VisibleLetterAsset[];
  /** Present in the editor; omitted for the static copy captured into the PDF. */
  editing?: {
    scale: number;
    onBodyChange: (body: string) => void;
    onAssetMove: (kind: LetterAssetKind, x: number, y: number) => void;
  };
  ref?: Ref<HTMLDivElement>;
}

/** Everything drawn on top of the letterhead: body text, stamp and signature. */
export function LetterOverlay({
  page,
  widthPx,
  heightPx,
  font,
  assets,
  editing,
  ref,
}: LetterOverlayProps) {
  return (
    <div ref={ref} className="relative" style={{ width: widthPx, height: heightPx }}>
      {editing ? (
        <EditableLetterBody
          body={page.body}
          font={font}
          pageHeightPx={heightPx}
          onChange={editing.onBodyChange}
        />
      ) : (
        <StaticLetterBody body={page.body} font={font} />
      )}

      {assets.map(({ kind, placement }) => (
        <LetterAssetImage
          key={kind}
          kind={kind}
          placement={placement}
          pageWidthPx={widthPx}
          pageHeightPx={heightPx}
          drag={
            editing && {
              scale: editing.scale,
              onMove: (x, y) => editing.onAssetMove(kind, x, y),
            }
          }
        />
      ))}
    </div>
  );
}
