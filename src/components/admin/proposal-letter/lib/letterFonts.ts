import {
  Inter,
  Lato,
  Merriweather,
  Montserrat,
  Open_Sans,
  Poppins,
  Roboto,
} from 'next/font/google';
import type { LetterFontFamilyId, LetterFontOption } from '@/app/types/proposal-letter.types';

// Self-hosted at build time; files are only fetched by the browser once a font is used.
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', preload: false });
const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false });
const roboto = Roboto({ subsets: ['latin'], display: 'swap', preload: false });
const openSans = Open_Sans({ subsets: ['latin'], display: 'swap', preload: false });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', preload: false });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
});
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
});

export const LETTER_FONTS: LetterFontOption[] = [
  { id: 'montserrat', label: 'Montserrat (Brand)', family: montserrat.style.fontFamily },
  { id: 'inter', label: 'Inter', family: inter.style.fontFamily },
  { id: 'roboto', label: 'Roboto', family: roboto.style.fontFamily },
  { id: 'open-sans', label: 'Open Sans', family: openSans.style.fontFamily },
  { id: 'lato', label: 'Lato', family: lato.style.fontFamily },
  { id: 'poppins', label: 'Poppins', family: poppins.style.fontFamily },
  { id: 'merriweather', label: 'Merriweather', family: merriweather.style.fontFamily },
  { id: 'georgia', label: 'Georgia', family: 'Georgia, "Times New Roman", serif' },
  { id: 'times-new-roman', label: 'Times New Roman', family: '"Times New Roman", Times, serif' },
  { id: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
];

export const getLetterFont = (id: LetterFontFamilyId): LetterFontOption =>
  LETTER_FONTS.find((font) => font.id === id) ?? LETTER_FONTS[0];

export const isLetterFontId = (value: string): value is LetterFontFamilyId =>
  LETTER_FONTS.some((font) => font.id === value);
