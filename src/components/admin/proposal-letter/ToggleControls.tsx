'use client';

import React from 'react';
import { Link2, RotateCcw, Stamp } from 'lucide-react';
import type {
  LetterAssetKind,
  LetterAssetPlacement,
  LetterAssetStatus,
} from '@/app/types/proposal-letter.types';
import { LETTER_ASSETS } from './lib/proposalLetter.constants';
import { EditorCard } from './EditorCard';
import { ToggleSwitch } from './ToggleSwitch';

interface ToggleControlsProps {
  placements: Record<LetterAssetKind, LetterAssetPlacement>;
  statuses: Record<LetterAssetKind, LetterAssetStatus>;
  footerLinks: boolean;
  onAssetToggle: (kind: LetterAssetKind, visible: boolean) => void;
  onFooterLinksChange: (enabled: boolean) => void;
  onResetPositions: () => void;
}

const ASSET_KINDS: LetterAssetKind[] = ['stamp', 'signature'];

interface ToggleRowProps {
  title: string;
  description: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ title, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} disabled={disabled} />
    </div>
  );
}

const describeAsset = (kind: LetterAssetKind, status: LetterAssetStatus) => {
  const asset = LETTER_ASSETS[kind];
  if (status === 'missing') {
    return (
      <span className="text-amber-600 dark:text-amber-400">
        Image not found. Add it at <code className="font-mono">public{asset.src}</code>.
      </span>
    );
  }
  return status === 'loading' ? 'Checking image…' : asset.description;
};

export function ToggleControls({
  placements,
  statuses,
  footerLinks,
  onAssetToggle,
  onFooterLinksChange,
  onResetPositions,
}: ToggleControlsProps) {
  const anyAssetVisible = ASSET_KINDS.some((kind) => placements[kind].visible);

  return (
    <EditorCard
      title="Stamp & Signature"
      description="Drag them on the last page to reposition."
      icon={Stamp}
      action={
        <button
          type="button"
          onClick={onResetPositions}
          disabled={!anyAssetVisible}
          className="flex items-center gap-1.5 px-3 min-h-[36px] rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent shrink-0"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      }
    >
      <div className="space-y-5">
        {ASSET_KINDS.map((kind) => (
          <ToggleRow
            key={kind}
            title={LETTER_ASSETS[kind].label}
            description={describeAsset(kind, statuses[kind])}
            checked={placements[kind].visible && statuses[kind] === 'ready'}
            disabled={statuses[kind] !== 'ready'}
            onChange={(visible) => onAssetToggle(kind, visible)}
          />
        ))}

        <div className="h-px bg-gray-100 dark:bg-white/5" />

        <ToggleRow
          title="Clickable footer links"
          description={
            <span className="inline-flex items-start gap-1">
              <Link2 size={12} className="mt-0.5 shrink-0" />
              Website, email, phone and social icons open when clicked in the PDF.
            </span>
          }
          checked={footerLinks}
          onChange={onFooterLinksChange}
        />
      </div>
    </EditorCard>
  );
}
