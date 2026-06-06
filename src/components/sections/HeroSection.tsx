"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { api } from "@/lib/axios";
import { HeroBanner } from "@/app/types/home.types";

export function HeroSection() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await api.fetchHeroBanners();
        setBanners(data);
      } catch (err) {
        console.error("Failed to load hero banners", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBanners();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const resetTimer = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 7000);
  };

  useEffect(() => {
    if (banners.length > 1) {
      resetTimer();
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [banners, currentIndex, resetTimer]);

  if (isLoading || banners.length === 0) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
          <p className="text-foreground/60 text-sm font-medium tracking-wide">Loading experiences...</p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Animated Blobs for Glassy Glow */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[150px] pointer-events-none z-10 animate-pulse delay-1000" />

      {/* Main Media Slider */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Dark tint overlay for reading contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95 lg:to-background/80 z-20" />

            {currentBanner.mediaType === "VIDEO" ? (
              <div className="relative w-full h-full">
                <video
                  src={currentBanner.mediaUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-28 right-8 z-30 w-12 h-12 rounded-full glass-panel border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentBanner.mediaUrl}
                alt={currentBanner.title || "APXTeck hero banner"}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col items-start gap-6 pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-start gap-6 max-w-2xl"
              >
                {/* Micro badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  Premium IT Partner
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                  {currentBanner.title?.split("—").map((part, i) => (
                    <span key={i} className="block">
                      {i === 1 ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                          {part}
                        </span>
                      ) : (
                        part
                      )}
                    </span>
                  )) || "Elevate Your Business"}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-slate-200 leading-relaxed max-w-xl">
                  {currentBanner.subtitle || "Premium, advanced-level web applications with seamless animations and interactive designs."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 z-30">
                  {currentBanner.ctaText && currentBanner.ctaLink && (
                    <Link
                      href={currentBanner.ctaLink}
                      className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent hover:bg-accent/90 px-8 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/30 overflow-hidden"
                    >
                      <span>{currentBanner.ctaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  <Link
                    href="#contact"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 text-sm font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                  >
                    Quick Enquiry
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {banners.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-4 z-30 flex items-center">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full glass-panel border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 z-30 flex items-center">
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full glass-panel border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

      {/* Progress Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={banner.id}
                onClick={() => {
                  setCurrentIndex(index);
                  resetTimer();
                }}
                className="group focus:outline-none py-2"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isActive ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
