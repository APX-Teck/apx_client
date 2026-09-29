'use client';

import React from 'react';
import { Minus, Plus, Type } from 'lucide-react';
import type { LetterFontSettings } from '@/app/types/proposal-letter.types';
import { FONT_SIZE_RANGE, LINE_HEIGHT_OPTIONS } from './lib/proposalLetter.constants';
import { LETTER_FONTS, getLetterFont, isLetterFontId } from './lib/letterFonts';
import { EditorCard } from './EditorCard';

interface FontEditorProps {
  font: LetterFontSettings;
  onChange: (patch: Partial<LetterFontSettings>) => void;
}

const clampSize = (value: number) =>
  Math.min(FONT_SIZE_RANGE.max, Math.max(FONT_SIZE_RANGE.min, value));

const fieldClassName =
  'w-full px-4 min-h-[44px] bg-gray-50 dark:bg-[#1A1A1A] border-none rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all';

const stepButtonClassName =
  'w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#1A1A1A] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40';

export function FontEditor({ font, onChange }: FontEditorProps) {
  const setSize = (value: number) => onChange({ sizePt: clampSize(value) });

  return (
    <EditorCard title="Typography" description="Applies to the letter body on every page." icon={Type}>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="letter-font-family"
            className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
          >
            Font family
          </label>
          <select
            id="letter-font-family"
            value={font.familyId}
            onChange={(event) => {
              if (isLetterFontId(event.target.value)) onChange({ familyId: event.target.value });
            }}
            className={fieldClassName}
          >
            {LETTER_FONTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p
            className="mt-2 px-1 text-gray-700 dark:text-gray-300 truncate"
            style={{ fontFamily: getLetterFont(font.familyId).family, fontSize: '15px' }}
          >
            Dear Client, thank you for considering APXTECK.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="letter-font-size"
              className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Font size
            </label>
            <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
              {font.sizePt} pt
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease font size"
              onClick={() => setSize(font.sizePt - FONT_SIZE_RANGE.step)}
              disabled={font.sizePt <= FONT_SIZE_RANGE.min}
              className={stepButtonClassName}
            >
              <Minus size={16} />
            </button>
            <input
              id="letter-font-size"
              type="range"
              min={FONT_SIZE_RANGE.min}
              max={FONT_SIZE_RANGE.max}
              step={FONT_SIZE_RANGE.step}
              value={font.sizePt}
              onChange={(event) => setSize(Number(event.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <button
              type="button"
              aria-label="Increase font size"
              onClick={() => setSize(font.sizePt + FONT_SIZE_RANGE.step)}
              disabled={font.sizePt >= FONT_SIZE_RANGE.max}
              className={stepButtonClassName}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="letter-line-height"
            className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
          >
            Line spacing
          </label>
          <select
            id="letter-line-height"
            value={font.lineHeight}
            onChange={(event) => onChange({ lineHeight: Number(event.target.value) })}
            className={fieldClassName}
          >
            {LINE_HEIGHT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </EditorCard>
  );
}
