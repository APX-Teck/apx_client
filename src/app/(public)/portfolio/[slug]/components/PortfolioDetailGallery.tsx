'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';
import { Portfolio } from '@/app/types/portfolio.types';

interface Props {
  project: Portfolio;
}

export function PortfolioDetailGallery({ project }: Props) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!project.galleryUrls || project.galleryUrls.length === 0) return null;

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold tracking-tight">Project Gallery</h3>

        <div className="grid sm:grid-cols-2 gap-6">
          {project.galleryUrls.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(url)}
              className="relative h-60 rounded-3xl overflow-hidden border border-glass-border group cursor-zoom-in bg-accent/5 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${project.clientName} screen screenshot ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/85 flex items-center justify-center p-6"
            onClick={() => setActiveImage(null)}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt="Case study screenshot enlarged"
                className="max-w-full max-h-[80vh] object-contain border border-glass-border rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
