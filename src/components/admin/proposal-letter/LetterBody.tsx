'use client';

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { LetterFontSettings } from '@/app/types/proposal-letter.types';
import { LETTER_BODY_MARGINS } from './lib/proposalLetter.constants';
import { getLetterFont } from './lib/letterFonts';

const BODY_BOX_STYLE: CSSProperties = {
  top: `${LETTER_BODY_MARGINS.top * 100}%`,
  right: `${LETTER_BODY_MARGINS.right * 100}%`,
  bottom: `${LETTER_BODY_MARGINS.bottom * 100}%`,
  left: `${LETTER_BODY_MARGINS.left * 100}%`,
};

// Shared by the editable and static bodies so the export wraps lines exactly like the editor.
const TEXT_CLASS_NAME = 'block w-full whitespace-pre-wrap break-words';

const getTextStyle = (font: LetterFontSettings): CSSProperties => ({
  fontFamily: getLetterFont(font.familyId).family,
  fontSize: `${font.sizePt}pt`,
  lineHeight: font.lineHeight,
  color: '#111111',
});

interface StaticLetterBodyProps {
  body: string;
  font: LetterFontSettings;
}

export function StaticLetterBody({ body, font }: StaticLetterBodyProps) {
  if (!body) return null;
  return (
    <div className="absolute overflow-hidden" style={BODY_BOX_STYLE}>
      <div className={TEXT_CLASS_NAME} style={getTextStyle(font)}>
        {body}
      </div>
    </div>
  );
}

interface EditableLetterBodyProps extends StaticLetterBodyProps {
  pageHeightPx: number;
  onChange: (body: string) => void;
}

export function EditableLetterBody({ body, font, pageHeightPx, onChange }: EditableLetterBodyProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textStyle = getTextStyle(font);
  const maxHeightPx =
    pageHeightPx * (1 - LETTER_BODY_MARGINS.top - LETTER_BODY_MARGINS.bottom);

  // A hidden copy of the text grows freely; if it outgrows the body box, content would be clipped.
  useEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    const observer = new ResizeObserver(() =>
      setIsOverflowing(mirror.offsetHeight > maxHeightPx + 1)
    );
    observer.observe(mirror);
    return () => observer.disconnect();
  }, [maxHeightPx]);

  return (
    <div
      className="absolute rounded-sm outline-1 outline-offset-4 outline-transparent hover:outline-dashed hover:outline-indigo-400/60 focus-within:outline-dashed focus-within:outline-indigo-500 transition-colors"
      style={BODY_BOX_STYLE}
    >
      <div
        ref={mirrorRef}
        aria-hidden
        className={`${TEXT_CLASS_NAME} invisible absolute inset-x-0 top-0 pointer-events-none`}
        style={textStyle}
      >
        {`${body}​`}
      </div>
      <textarea
        value={body}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Start typing the letter…"
        aria-label="Letter body"
        spellCheck
        className={`${TEXT_CLASS_NAME} relative h-full resize-none overflow-hidden bg-transparent p-0 border-0 outline-none placeholder:text-gray-400`}
        style={textStyle}
      />
      {isOverflowing && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold shadow-lg whitespace-nowrap">
          <AlertTriangle size={12} />
          Text overflows this page — add a page or shorten it
        </div>
      )}
    </div>
  );
}
