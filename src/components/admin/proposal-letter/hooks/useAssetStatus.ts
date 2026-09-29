import { useEffect, useState } from 'react';
import type { LetterAssetStatus } from '@/app/types/proposal-letter.types';

/** Checks that a hardcoded /public asset actually exists before offering it. */
export const useAssetStatus = (src: string): LetterAssetStatus => {
  const [status, setStatus] = useState<LetterAssetStatus>('loading');

  useEffect(() => {
    const image = new Image();
    image.onload = () => setStatus('ready');
    image.onerror = () => setStatus('missing');
    image.src = src;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return status;
};
