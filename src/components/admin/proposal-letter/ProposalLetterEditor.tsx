'use client';

import React from 'react';
import { AlertCircle, FilePlus2, FileText, Loader2, ShieldCheck } from 'lucide-react';
import type { LetterAssetKind, VisibleLetterAsset } from '@/app/types/proposal-letter.types';
import { LETTER_ASSETS } from './lib/proposalLetter.constants';
import { useProposalLetterState } from './hooks/useProposalLetterState';
import { useRenderedPdf } from './hooks/useRenderedPdf';
import { usePdfUpload } from './hooks/usePdfUpload';
import { useAssetStatus } from './hooks/useAssetStatus';
import { useLetterExport } from './hooks/useLetterExport';
import { PDFUploader } from './PDFUploader';
import { FontEditor } from './FontEditor';
import { ToggleControls } from './ToggleControls';
import { DownloadButton } from './DownloadButton';
import { LetterPageCanvas } from './LetterPageCanvas';
import { LetterExportStage } from './LetterExportStage';

const ASSET_KINDS: LetterAssetKind[] = ['stamp', 'signature'];

const panelClassName =
  'bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 min-h-[320px] flex flex-col items-center justify-center gap-3 p-8 text-center';

export default function ProposalLetterEditor() {
  const letter = useProposalLetterState();
  const { pdf, settings } = letter;
  const rendered = useRenderedPdf(pdf?.dataUrl ?? null);
  const upload = usePdfUpload(letter.replacePdf);
  const { isExporting, exportPdf, registerOverlay } = useLetterExport(pdf, settings);

  const assetStatuses = {
    stamp: useAssetStatus(LETTER_ASSETS.stamp.src),
    signature: useAssetStatus(LETTER_ASSETS.signature.src),
  };
  const visibleAssets: VisibleLetterAsset[] = ASSET_KINDS.filter(
    (kind) => settings[kind].visible && assetStatuses[kind] === 'ready'
  ).map((kind) => ({ kind, placement: settings[kind] }));

  const isReady = rendered.pages.length > 0 && !rendered.error;
  const pageCount = settings.pages.length;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Proposal Letter</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compose client proposals on the APXTECK letterhead and download them as PDF.
          </p>
        </div>
        <DownloadButton disabled={!isReady} isExporting={isExporting} onClick={exportPdf} />
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-sm text-indigo-900 dark:text-indigo-200">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <p>
          Everything stays in this browser — nothing is uploaded or saved to the server. Your draft
          survives moving between admin pages but is cleared when you refresh.
        </p>
      </div>

      <PDFUploader
        pdf={pdf}
        isProcessing={upload.isProcessing}
        onFileSelected={upload.handleFile}
        onRemove={letter.removePdf}
      />

      {pdf && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FontEditor font={settings.font} onChange={letter.updateFont} />
          <ToggleControls
            placements={{ stamp: settings.stamp, signature: settings.signature }}
            statuses={assetStatuses}
            footerLinks={settings.footerLinks}
            onAssetToggle={letter.setAssetVisible}
            onFooterLinksChange={letter.setFooterLinks}
            onResetPositions={letter.resetAssetPositions}
          />
        </div>
      )}

      {!pdf ? (
        <div className={panelClassName}>
          <FileText size={48} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Upload the letterhead PDF above to start writing. Each page gets its own editable body.
          </p>
        </div>
      ) : rendered.isRendering ? (
        <div className={panelClassName}>
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Rendering letterhead…</p>
        </div>
      ) : rendered.error ? (
        <div className={`${panelClassName} border-red-100 dark:border-red-900/30`}>
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm">{rendered.error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {settings.pages.map((page, index) => {
            const background = rendered.pages[page.sourcePageIndex];
            if (!background) return null;

            return (
              <LetterPageCanvas
                key={page.id}
                page={page}
                pageNumber={index + 1}
                pageCount={pageCount}
                background={background}
                font={settings.font}
                assets={index === pageCount - 1 ? visibleAssets : []}
                onBodyChange={(body) => letter.updatePageBody(page.id, body)}
                onAssetMove={letter.moveAsset}
                onRemove={pageCount > 1 ? () => letter.removePage(page.id) : undefined}
              />
            );
          })}

          <button
            type="button"
            onClick={letter.addPage}
            className="w-full max-w-[794px] mx-auto flex items-center justify-center gap-2 min-h-[56px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400 transition-colors"
          >
            <FilePlus2 size={18} />
            Add page (uses letterhead page 1)
          </button>

          <LetterExportStage
            pages={settings.pages}
            backgrounds={rendered.pages}
            font={settings.font}
            assets={visibleAssets}
            registerOverlay={registerOverlay}
          />
        </div>
      )}
    </div>
  );
}
