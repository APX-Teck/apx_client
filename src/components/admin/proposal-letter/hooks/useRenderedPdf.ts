import { useEffect, useState } from 'react';
import type { RenderedPdfPage } from '@/app/types/proposal-letter.types';
import { dataUrlToBytes, renderPdfPages, revokeRenderedPages } from '../lib/pdfRenderer';

interface RenderResult {
  source: string | null;
  pages: RenderedPdfPage[];
  error: string | null;
}

const EMPTY_RESULT: RenderResult = { source: null, pages: [], error: null };

/** Rasterises the stored PDF for the on-screen preview. */
export const useRenderedPdf = (dataUrl: string | null) => {
  const [result, setResult] = useState<RenderResult>(EMPTY_RESULT);

  useEffect(() => {
    if (!dataUrl) return;

    const controller = new AbortController();
    let rendered: RenderedPdfPage[] = [];

    renderPdfPages(dataUrlToBytes(dataUrl), controller.signal)
      .then((pages) => {
        if (controller.signal.aborted) {
          revokeRenderedPages(pages);
          return;
        }
        rendered = pages;
        setResult({ source: dataUrl, pages, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Failed to render proposal letter PDF:', error);
        setResult({
          source: dataUrl,
          pages: [],
          error: 'This PDF could not be rendered. Try re-exporting it and upload again.',
        });
      });

    return () => {
      controller.abort();
      revokeRenderedPages(rendered);
    };
  }, [dataUrl]);

  const isCurrent = dataUrl !== null && result.source === dataUrl;

  return {
    pages: isCurrent ? result.pages : [],
    error: isCurrent ? result.error : null,
    isRendering: dataUrl !== null && !isCurrent,
  };
};
