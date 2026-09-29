import type { PDFDocument, PDFPage } from 'pdf-lib';
import type { LetterPage } from '@/app/types/proposal-letter.types';
import { EXPORT_RENDER_DENSITY, FOOTER_LINK_HOTSPOTS } from './proposalLetter.constants';

interface BuildLetterPdfOptions {
  sourceBytes: Uint8Array;
  pages: LetterPage[];
  /** Rendered overlay per page id; pages without an entry keep only the letterhead. */
  overlays: Map<string, HTMLElement>;
  footerLinks: boolean;
}

type PdfLib = typeof import('pdf-lib');

const addFooterLinks = (pdfLib: PdfLib, doc: PDFDocument, page: PDFPage) => {
  const box = page.getCropBox();

  FOOTER_LINK_HOTSPOTS.forEach(({ url, rect }) => {
    const annotation = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [
        box.x + rect.x0 * box.width,
        box.y + (1 - rect.y1) * box.height,
        box.x + rect.x1 * box.width,
        box.y + (1 - rect.y0) * box.height,
      ],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: pdfLib.PDFString.of(url) },
    });
    page.node.addAnnot(doc.context.register(annotation));
  });
};

export const buildLetterPdf = async ({
  sourceBytes,
  pages,
  overlays,
  footerLinks,
}: BuildLetterPdfOptions): Promise<Uint8Array> => {
  const [pdfLib, { domToPng }] = await Promise.all([
    import('pdf-lib'),
    import('modern-screenshot'),
  ]);

  const source = await pdfLib.PDFDocument.load(sourceBytes);
  const output = await pdfLib.PDFDocument.create();
  output.setTitle('Proposal Letter');
  output.setAuthor('APXTECK Solutions Pvt. Ltd.');
  output.setCreator('APXTECK Admin');

  const copiedPages = await output.copyPages(
    source,
    pages.map((page) => page.sourcePageIndex)
  );

  for (let i = 0; i < pages.length; i += 1) {
    const page = output.addPage(copiedPages[i]);
    const overlay = overlays.get(pages[i].id);

    if (overlay) {
      const png = await domToPng(overlay, {
        scale: EXPORT_RENDER_DENSITY,
        backgroundColor: null,
      });
      const image = await output.embedPng(png);
      const box = page.getCropBox();
      page.drawImage(image, { x: box.x, y: box.y, width: box.width, height: box.height });
    }

    if (footerLinks) addFooterLinks(pdfLib, output, page);
  }

  return output.save();
};

export const downloadPdf = (bytes: Uint8Array, fileName: string) => {
  const url = URL.createObjectURL(new Blob([bytes.slice()], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
