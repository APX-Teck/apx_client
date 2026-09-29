import { useRef, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { ProposalLetterSettings, StoredLetterPdf } from '@/app/types/proposal-letter.types';
import { buildLetterPdf, downloadPdf } from '../lib/pdfExporter';
import { dataUrlToBytes } from '../lib/pdfRenderer';
import { getLetterFont } from '../lib/letterFonts';

const getExportErrorMessage = (error: unknown) =>
  error instanceof Error && /encrypt/i.test(error.message)
    ? 'This PDF is encrypted. Upload an unprotected copy of the letterhead.'
    : 'Could not generate the PDF. Please try again.';

const waitForFont = async (sizePt: number, family: string) => {
  try {
    await document.fonts.load(`${sizePt}pt ${family}`);
    await document.fonts.ready;
  } catch {
    // Falls back to whatever the browser has already loaded.
  }
};

export const useLetterExport = (pdf: StoredLetterPdf | null, settings: ProposalLetterSettings) => {
  const overlayNodes = useRef(new Map<string, HTMLElement>());
  const [isExporting, setIsExporting] = useState(false);

  const registerOverlay = (pageId: string) => (node: HTMLElement | null) => {
    if (node) overlayNodes.current.set(pageId, node);
    else overlayNodes.current.delete(pageId);
  };

  const exportPdf = async () => {
    if (!pdf || isExporting) return;

    setIsExporting(true);
    try {
      await waitForFont(settings.font.sizePt, getLetterFont(settings.font.familyId).family);
      const bytes = await buildLetterPdf({
        sourceBytes: dataUrlToBytes(pdf.dataUrl),
        pages: settings.pages,
        overlays: new Map(overlayNodes.current),
        footerLinks: settings.footerLinks,
      });
      downloadPdf(bytes, `APXTECK-Proposal-Letter-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('Proposal letter downloaded');
    } catch (error) {
      console.error('Failed to export proposal letter:', error);
      toast.error(getExportErrorMessage(error));
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, exportPdf, registerOverlay };
};
