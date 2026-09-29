import { z } from 'zod';
import type { ProposalLetterSettings, StoredLetterPdf } from '@/app/types/proposal-letter.types';
import { STORAGE_KEYS } from './proposalLetter.constants';
import { LETTER_FONTS } from './letterFonts';

const fraction = z.number().min(0).max(1);

const placementSchema = z.object({ visible: z.boolean(), x: fraction, y: fraction });

const settingsSchema = z.object({
  pages: z.array(
    z.object({
      id: z.string().min(1),
      sourcePageIndex: z.number().int().min(0),
      body: z.string(),
    })
  ),
  font: z.object({
    familyId: z.enum(LETTER_FONTS.map((font) => font.id) as [string, ...string[]]),
    sizePt: z.number().positive(),
    lineHeight: z.number().positive(),
  }),
  stamp: placementSchema,
  signature: placementSchema,
  footerLinks: z.boolean(),
});

const pdfSchema = z.object({
  name: z.string(),
  size: z.number().nonnegative(),
  pageCount: z.number().int().positive(),
  dataUrl: z.string().startsWith('data:application/pdf'),
});

let reloadChecked = false;

/**
 * Editor state is meant to survive in-app navigation only. A browser reload wipes it.
 * Checked once per document because client-side navigations keep the same
 * navigation entry (whose type stays "reload" after a refresh).
 */
const clearAfterHardReload = () => {
  if (reloadChecked) return;
  reloadChecked = true;
  try {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entry?.type === 'reload') {
      localStorage.removeItem(STORAGE_KEYS.settings);
      localStorage.removeItem(STORAGE_KEYS.pdf);
    }
  } catch {
    // Storage unavailable (private mode / blocked); the editor still works in memory.
  }
};

const readJson = (key: string): unknown => {
  clearAfterHardReload();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown): boolean => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const loadLetterSettings = (): ProposalLetterSettings | null => {
  const parsed = settingsSchema.safeParse(readJson(STORAGE_KEYS.settings));
  return parsed.success ? (parsed.data as ProposalLetterSettings) : null;
};

export const saveLetterSettings = (settings: ProposalLetterSettings): boolean =>
  writeJson(STORAGE_KEYS.settings, settings);

export const loadLetterPdf = (): StoredLetterPdf | null => {
  const parsed = pdfSchema.safeParse(readJson(STORAGE_KEYS.pdf));
  return parsed.success ? parsed.data : null;
};

/** Returns false when the PDF could not be stored (usually the ~5 MB localStorage quota). */
export const saveLetterPdf = (pdf: StoredLetterPdf | null): boolean => {
  const saved = writeJson(STORAGE_KEYS.pdf, pdf);
  // Never leave a stale PDF behind if the new one didn't fit.
  if (!saved) writeJson(STORAGE_KEYS.pdf, null);
  return saved;
};
