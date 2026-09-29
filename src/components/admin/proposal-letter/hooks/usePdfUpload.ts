import { useState } from 'react';
import toast from 'react-hot-toast';
import type { StoredLetterPdf } from '@/app/types/proposal-letter.types';
import { MAX_PDF_SIZE_BYTES } from '../lib/proposalLetter.constants';
import { dataUrlToBytes, getPdfPageCount, readFileAsDataUrl } from '../lib/pdfRenderer';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

const getUploadErrorMessage = (error: unknown) =>
  error instanceof Error && error.name === 'PasswordException'
    ? 'This PDF is password-protected. Upload an unprotected copy.'
    : 'Could not read this PDF. It may be corrupted.';

/** `onLoaded` returns whether the PDF could be persisted to localStorage. */
export const usePdfUpload = (onLoaded: (pdf: StoredLetterPdf) => boolean) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (isProcessing) return;
    if (!isPdfFile(file)) {
      toast.error('Please upload a PDF file.');
      return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      toast.error(`PDF must be smaller than ${MAX_PDF_SIZE_BYTES / (1024 * 1024)} MB.`);
      return;
    }

    setIsProcessing(true);
    try {
      // Browsers may report an empty or octet-stream type; normalise so storage validation passes.
      const dataUrl = (await readFileAsDataUrl(file)).replace(
        /^data:[^;,]*;base64,/,
        'data:application/pdf;base64,'
      );
      const pageCount = await getPdfPageCount(dataUrlToBytes(dataUrl));
      const persisted = onLoaded({ name: file.name, size: file.size, pageCount, dataUrl });

      if (persisted) {
        toast.success('Letterhead loaded');
      } else {
        toast('Letterhead loaded, but it is too large to keep if you leave this page.', {
          icon: '⚠️',
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Failed to load proposal letter PDF:', error);
      toast.error(getUploadErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, handleFile };
};
