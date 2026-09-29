'use client';

import React from 'react';
import type { LetterAssetKind, LetterAssetPlacement } from '@/app/types/proposal-letter.types';
import { cn } from '@/lib/utils';
import { LETTER_ASSETS } from './lib/proposalLetter.constants';

interface LetterAssetImageProps {
  kind: LetterAssetKind;
  placement: LetterAssetPlacement;
  pageWidthPx: number;
  pageHeightPx: number;
  /** Present only in the editor; the export copy is static. */
  drag?: {
    scale: number;
    onMove: (x: number, y: number) => void;
  };
}

const KEYBOARD_STEP = 0.005;

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

export function LetterAssetImage({
  kind,
  placement,
  pageWidthPx,
  pageHeightPx,
  drag,
}: LetterAssetImageProps) {
  const asset = LETTER_ASSETS[kind];

  const clampAndMove = (element: HTMLElement, x: number, y: number) => {
    if (!drag) return;
    const maxY = 1 - element.offsetHeight / pageHeightPx;
    drag.onMove(clamp(x, 1 - asset.widthFraction), clamp(y, maxY));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!drag) return;
    event.preventDefault();

    const element = event.currentTarget;
    const start = { clientX: event.clientX, clientY: event.clientY, x: placement.x, y: placement.y };
    element.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      clampAndMove(
        element,
        start.x + (moveEvent.clientX - start.clientX) / (pageWidthPx * drag.scale),
        start.y + (moveEvent.clientY - start.clientY) / (pageHeightPx * drag.scale)
      );
    };
    const handleEnd = () => {
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerup', handleEnd);
      element.removeEventListener('pointercancel', handleEnd);
    };

    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerup', handleEnd);
    element.addEventListener('pointercancel', handleEnd);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-KEYBOARD_STEP, 0],
      ArrowRight: [KEYBOARD_STEP, 0],
      ArrowUp: [0, -KEYBOARD_STEP],
      ArrowDown: [0, KEYBOARD_STEP],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    clampAndMove(event.currentTarget, placement.x + delta[0], placement.y + delta[1]);
  };

  return (
    // Plain <img>: next/image's lazy loading and srcset interfere with the PDF capture.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt={asset.label}
      draggable={false}
      tabIndex={drag ? 0 : undefined}
      onPointerDown={drag ? handlePointerDown : undefined}
      onKeyDown={drag ? handleKeyDown : undefined}
      className={cn(
        'absolute h-auto select-none',
        drag &&
          'cursor-move touch-none rounded-md hover:ring-2 hover:ring-indigo-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
      )}
      style={{
        left: `${placement.x * 100}%`,
        top: `${placement.y * 100}%`,
        width: `${asset.widthFraction * 100}%`,
      }}
    />
  );
}
