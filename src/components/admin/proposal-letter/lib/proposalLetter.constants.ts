import type {
  LetterAssetKind,
  LetterAssetPlacement,
  LetterFontSettings,
  LetterLinkHotspot,
} from '@/app/types/proposal-letter.types';

/** CSS pixels per PDF point (96 dpi / 72 dpi). */
export const PX_PER_PT = 96 / 72;

export const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024;

/** Preview raster density relative to the page's CSS size. */
export const PREVIEW_RENDER_DENSITY = 2;

/** Overlay raster density used when composing the downloaded PDF. */
export const EXPORT_RENDER_DENSITY = 3;

export const STORAGE_KEYS = {
  settings: 'apx_proposal_letter_settings',
  pdf: 'apx_proposal_letter_pdf',
} as const;

/** Writable body area between the letterhead header and footer, as page fractions. */
export const LETTER_BODY_MARGINS = {
  top: 0.125,
  right: 0.085,
  bottom: 0.08,
  left: 0.085,
} as const;

export const FONT_SIZE_RANGE = { min: 8, max: 24, step: 0.5 } as const;

export const LINE_HEIGHT_OPTIONS = [1.15, 1.3, 1.5, 1.75, 2] as const;

export const DEFAULT_FONT_SETTINGS: LetterFontSettings = {
  familyId: 'montserrat',
  sizePt: 11,
  lineHeight: 1.5,
};

export const LETTER_ASSETS: Record<
  LetterAssetKind,
  { label: string; src: string; widthFraction: number; description: string }
> = {
  stamp: {
    label: 'Company Stamp',
    src: '/assets/company-stamp.png',
    widthFraction: 0.17,
    description: 'Official APXTECK seal on the last page.',
  },
  signature: {
    label: 'Company Signature',
    src: '/assets/company-signature.png',
    widthFraction: 0.22,
    description: 'Authorised signatory signature on the last page.',
  },
};

export const DEFAULT_ASSET_PLACEMENTS: Record<LetterAssetKind, LetterAssetPlacement> = {
  stamp: { visible: false, x: 0.5, y: 0.76 },
  signature: { visible: false, x: 0.7, y: 0.79 },
};

const FOOTER_ROW = { y0: 0.964, y1: 0.99 } as const;
const ICON_ROW = { y0: 0.966, y1: 0.988 } as const;

/**
 * Clickable regions over the APXTECK letterhead footer. Coordinates were measured
 * from the official letterhead and only line up with that template.
 */
export const FOOTER_LINK_HOTSPOTS: LetterLinkHotspot[] = [
  { label: 'Website', url: 'https://www.apxteck.com', rect: { x0: 0.018, x1: 0.208, ...FOOTER_ROW } },
  { label: 'Email', url: 'mailto:info@apxteck.com', rect: { x0: 0.222, x1: 0.413, ...FOOTER_ROW } },
  { label: 'Phone', url: 'tel:+919405282582', rect: { x0: 0.427, x1: 0.597, ...FOOTER_ROW } },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61591605886449',
    rect: { x0: 0.751, x1: 0.777, ...ICON_ROW },
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/apxteck.official',
    rect: { x0: 0.78, x1: 0.806, ...ICON_ROW },
  },
  { label: 'X', url: 'https://x.com/apxteckofficial', rect: { x0: 0.81, x1: 0.835, ...ICON_ROW } },
  {
    label: 'Threads',
    url: 'https://www.threads.com/@apxteckofficial',
    rect: { x0: 0.839, x1: 0.864, ...ICON_ROW },
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/apxteck',
    rect: { x0: 0.866, x1: 0.892, ...ICON_ROW },
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/@apxteckofficial',
    rect: { x0: 0.9, x1: 0.933, ...ICON_ROW },
  },
  {
    label: 'Pinterest',
    url: 'https://in.pinterest.com/apxteckofficial',
    rect: { x0: 0.937, x1: 0.963, ...ICON_ROW },
  },
];
