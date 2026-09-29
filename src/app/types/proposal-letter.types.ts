export type LetterFontFamilyId =
  | 'montserrat'
  | 'inter'
  | 'roboto'
  | 'open-sans'
  | 'lato'
  | 'poppins'
  | 'merriweather'
  | 'georgia'
  | 'times-new-roman'
  | 'arial';

export interface LetterFontOption {
  id: LetterFontFamilyId;
  label: string;
  /** CSS font-family stack, applied inline to the letter body. */
  family: string;
}

export interface LetterFontSettings {
  familyId: LetterFontFamilyId;
  sizePt: number;
  lineHeight: number;
}

export type LetterAssetKind = 'stamp' | 'signature';

export type LetterAssetStatus = 'loading' | 'ready' | 'missing';

/** Position is the image's top-left corner as a fraction (0–1) of the page size. */
export interface LetterAssetPlacement {
  visible: boolean;
  x: number;
  y: number;
}

export interface VisibleLetterAsset {
  kind: LetterAssetKind;
  placement: LetterAssetPlacement;
}

export interface LetterPage {
  id: string;
  /** Zero-based page of the uploaded PDF used as this page's background. */
  sourcePageIndex: number;
  body: string;
}

export interface ProposalLetterSettings {
  pages: LetterPage[];
  font: LetterFontSettings;
  stamp: LetterAssetPlacement;
  signature: LetterAssetPlacement;
  footerLinks: boolean;
}

export interface StoredLetterPdf {
  name: string;
  size: number;
  pageCount: number;
  dataUrl: string;
}

export interface RenderedPdfPage {
  index: number;
  widthPt: number;
  heightPt: number;
  imageUrl: string;
}

/** Rectangle expressed as fractions (0–1) of the page, measured from the top-left. */
export interface FractionalRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface LetterLinkHotspot {
  label: string;
  url: string;
  rect: FractionalRect;
}
