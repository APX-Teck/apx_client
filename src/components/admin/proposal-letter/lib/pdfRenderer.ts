import type { PDFDocumentLoadingTask } from 'pdfjs-dist';
import type { RenderedPdfPage } from '@/app/types/proposal-letter.types';
import { PREVIEW_RENDER_DENSITY, PX_PER_PT } from './proposalLetter.constants';

type PdfJs = typeof import('pdfjs-dist');

let pdfJsPromise: Promise<PdfJs> | null = null;

// pdfjs-dist touches browser globals at import time, so it is only ever loaded on demand.
const loadPdfJs = (): Promise<PdfJs> => {
  if (!pdfJsPromise) {
    pdfJsPromise = import('pdfjs-dist')
      .then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        return pdfjs;
      })
      .catch((error: unknown) => {
        pdfJsPromise = null;
        throw error;
      });
  }
  return pdfJsPromise;
};

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });

export const dataUrlToBytes = (dataUrl: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

// pdf.js transfers the buffer to its worker, so always hand it a copy.
// The loading task (not the document) owns the worker resources and must be destroyed.
const openPdf = async (bytes: Uint8Array): Promise<PDFDocumentLoadingTask> => {
  const pdfjs = await loadPdfJs();
  return pdfjs.getDocument({ data: bytes.slice() });
};

/** Opens the PDF to confirm it is readable (not corrupt or password-protected). */
export const getPdfPageCount = async (bytes: Uint8Array): Promise<number> => {
  const task = await openPdf(bytes);
  try {
    return (await task.promise).numPages;
  } finally {
    await task.destroy();
  }
};

const canvasToObjectUrl = (canvas: HTMLCanvasElement): Promise<string> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(URL.createObjectURL(blob));
      else reject(new Error('Could not rasterise the PDF page.'));
    }, 'image/png');
  });

export const revokeRenderedPages = (pages: RenderedPdfPage[]) => {
  pages.forEach((page) => URL.revokeObjectURL(page.imageUrl));
};

/** Rasterises every page to an object URL. Caller owns the URLs (see `revokeRenderedPages`). */
export const renderPdfPages = async (
  bytes: Uint8Array,
  signal: AbortSignal
): Promise<RenderedPdfPage[]> => {
  const task = await openPdf(bytes);
  const rendered: RenderedPdfPage[] = [];

  try {
    const doc = await task.promise;
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      if (signal.aborted) break;

      const page = await doc.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: PX_PER_PT * PREVIEW_RENDER_DENSITY });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvas, viewport }).promise;
      rendered.push({
        index: pageNumber - 1,
        widthPt: base.width,
        heightPt: base.height,
        imageUrl: await canvasToObjectUrl(canvas),
      });
      page.cleanup();
    }
  } catch (error) {
    revokeRenderedPages(rendered);
    throw error;
  } finally {
    await task.destroy();
  }

  if (signal.aborted) {
    revokeRenderedPages(rendered);
    throw new DOMException('PDF rendering was cancelled.', 'AbortError');
  }

  return rendered;
};
