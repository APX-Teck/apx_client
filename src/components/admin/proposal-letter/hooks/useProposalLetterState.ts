import { useEffect, useState } from 'react';
import type {
  LetterAssetKind,
  LetterFontSettings,
  LetterPage,
  ProposalLetterSettings,
  StoredLetterPdf,
} from '@/app/types/proposal-letter.types';
import {
  DEFAULT_ASSET_PLACEMENTS,
  DEFAULT_FONT_SETTINGS,
} from '../lib/proposalLetter.constants';
import {
  loadLetterPdf,
  loadLetterSettings,
  saveLetterPdf,
  saveLetterSettings,
} from '../lib/proposalLetter.storage';

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const createDefaultSettings = (): ProposalLetterSettings => ({
  pages: [],
  font: DEFAULT_FONT_SETTINGS,
  stamp: DEFAULT_ASSET_PLACEMENTS.stamp,
  signature: DEFAULT_ASSET_PLACEMENTS.signature,
  footerLinks: true,
});

/** One page per PDF page; text (and extra continuation pages) carry over when the PDF is replaced. */
const buildPages = (pageCount: number, previous: LetterPage[]): LetterPage[] =>
  Array.from({ length: Math.max(pageCount, previous.length) }, (_, index) => ({
    id: createId(),
    sourcePageIndex: index < pageCount ? index : 0,
    body: previous[index]?.body ?? '',
  }));

const restoreState = () => {
  const pdf = loadLetterPdf();
  const settings = loadLetterSettings() ?? createDefaultSettings();
  if (!pdf) return { pdf, settings };

  const pages = settings.pages.filter((page) => page.sourcePageIndex < pdf.pageCount);
  return {
    pdf,
    settings: { ...settings, pages: pages.length ? pages : buildPages(pdf.pageCount, []) },
  };
};

export const useProposalLetterState = () => {
  const [restored] = useState(restoreState);
  const [pdf, setPdf] = useState<StoredLetterPdf | null>(restored.pdf);
  const [settings, setSettings] = useState<ProposalLetterSettings>(restored.settings);

  useEffect(() => {
    saveLetterSettings(settings);
  }, [settings]);

  /** Returns false when the PDF is too large to persist across navigation. */
  const replacePdf = (next: StoredLetterPdf): boolean => {
    setPdf(next);
    setSettings((prev) => ({ ...prev, pages: buildPages(next.pageCount, prev.pages) }));
    return saveLetterPdf(next);
  };

  const removePdf = () => {
    setPdf(null);
    setSettings((prev) => ({ ...prev, pages: [] }));
    saveLetterPdf(null);
  };

  const updatePageBody = (id: string, body: string) =>
    setSettings((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === id ? { ...page, body } : page)),
    }));

  const addPage = () =>
    setSettings((prev) => ({
      ...prev,
      pages: [...prev.pages, { id: createId(), sourcePageIndex: 0, body: '' }],
    }));

  const removePage = (id: string) =>
    setSettings((prev) =>
      prev.pages.length <= 1
        ? prev
        : { ...prev, pages: prev.pages.filter((page) => page.id !== id) }
    );

  const updateFont = (patch: Partial<LetterFontSettings>) =>
    setSettings((prev) => ({ ...prev, font: { ...prev.font, ...patch } }));

  const setAssetVisible = (kind: LetterAssetKind, visible: boolean) =>
    setSettings((prev) => ({ ...prev, [kind]: { ...prev[kind], visible } }));

  const moveAsset = (kind: LetterAssetKind, x: number, y: number) =>
    setSettings((prev) => ({ ...prev, [kind]: { ...prev[kind], x, y } }));

  const resetAssetPositions = () =>
    setSettings((prev) => ({
      ...prev,
      stamp: { ...DEFAULT_ASSET_PLACEMENTS.stamp, visible: prev.stamp.visible },
      signature: { ...DEFAULT_ASSET_PLACEMENTS.signature, visible: prev.signature.visible },
    }));

  const setFooterLinks = (footerLinks: boolean) =>
    setSettings((prev) => ({ ...prev, footerLinks }));

  return {
    pdf,
    settings,
    replacePdf,
    removePdf,
    updatePageBody,
    addPage,
    removePage,
    updateFont,
    setAssetVisible,
    moveAsset,
    resetAssetPositions,
    setFooterLinks,
  };
};

export type ProposalLetterStateApi = ReturnType<typeof useProposalLetterState>;
