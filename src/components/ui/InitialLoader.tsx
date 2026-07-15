'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const CODE_SNIPPETS = [
  { text: 'import ', color: '#c586c0' },
  { text: '{ APXEngine } ', color: '#9cdcfe' },
  { text: 'from ', color: '#c586c0' },
  { text: "'@apx/core';\n", color: '#ce9178' },
  { text: 'import ', color: '#c586c0' },
  { text: '{ optimizeSEO, generateUI } ', color: '#9cdcfe' },
  { text: 'from ', color: '#c586c0' },
  { text: "'@apx/ai';\n\n", color: '#ce9178' },
  { text: 'export async function ', color: '#569cd6' },
  { text: 'initializeSystem', color: '#dcdcaa' },
  { text: '() {\n', color: '#d4d4d4' },
  { text: '  const ', color: '#569cd6' },
  { text: 'engine ', color: '#4fc1ff' },
  { text: '= ', color: '#d4d4d4' },
  { text: 'new ', color: '#569cd6' },
  { text: 'APXEngine', color: '#4ec9b0' },
  { text: '({\n', color: '#d4d4d4' },
  { text: '    performance: ', color: '#9cdcfe' },
  { text: "'ultra'", color: '#ce9178' },
  { text: ',\n', color: '#d4d4d4' },
  { text: '    design: ', color: '#9cdcfe' },
  { text: "'premium'", color: '#ce9178' },
  { text: ',\n', color: '#d4d4d4' },
  { text: '    aiRoast: ', color: '#9cdcfe' },
  { text: 'true\n', color: '#569cd6' },
  { text: '  });\n\n', color: '#d4d4d4' },
  { text: '  // Booting up the servers...\n', color: '#6a9955' },
  { text: '  await ', color: '#c586c0' },
  { text: 'engine.', color: '#9cdcfe' },
  { text: 'connect', color: '#dcdcaa' },
  { text: '();\n', color: '#d4d4d4' },
  { text: '  console.', color: '#9cdcfe' },
  { text: 'log', color: '#dcdcaa' },
  { text: '(', color: '#d4d4d4' },
  { text: "'APX Systems Online.'", color: '#ce9178' },
  { text: ');\n\n', color: '#d4d4d4' },
  { text: '  return ', color: '#c586c0' },
  { text: 'engine.', color: '#9cdcfe' },
  { text: 'renderReady', color: '#dcdcaa' },
  { text: '();\n', color: '#d4d4d4' },
  { text: '}\n', color: '#d4d4d4' },
];

export function InitialLoader() {
  const [show, setShow] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // We assume layout.tsx only renders this if the cookie is missing.
    // So we just play the animation and set the cookie when done.
    
    // Auto-hide after 4.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setShow(false);
        // Set cookie so the server knows they visited (expires in 1 year)
        document.cookie = "hasVisited=true; path=/; max-age=31536000";
      }, 1000); // 1s for the dissolve animation
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // VS Code Typing Canvas Effect
  useEffect(() => {
    if (!show || isExiting) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let currentTokenIndex = 0;
    let currentCharIndex = 0;
    
    // Make text larger and position it like a real editor
    const fontSize = width > 768 ? 20 : 12;
    const lineHeight = width > 768 ? 32 : 20;
    
    let x = width > 768 ? Math.max(80, width * 0.15) : 16; 
    let y = width > 768 ? Math.max(80, height * 0.15) : 60;
    const startX = x;
    
    let lastDrawTime = 0;
    const typingDelay = 15; // ms between characters

    const draw = (timestamp: number) => {
      if (!lastDrawTime) lastDrawTime = timestamp;
      const elapsed = timestamp - lastDrawTime;

      // Only draw when enough time has passed to maintain a stable speed without choking the CPU
      if (elapsed > typingDelay) {
        // Clear canvas with very subtle fade to keep it clean
        ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'Fira Code', 'Consolas', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        if (currentTokenIndex < CODE_SNIPPETS.length) {
          const token = CODE_SNIPPETS[currentTokenIndex];
          ctx.fillStyle = token.color;
          
          const char = token.text[currentCharIndex];
          
          if (char === '\n') {
            y += lineHeight;
            x = startX;
          } else {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width;
          }

          currentCharIndex++;
          if (currentCharIndex >= token.text.length) {
            currentCharIndex = 0;
            currentTokenIndex++;
          }
        }
        lastDrawTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [show, isExiting]);

  if (!show && !isExiting) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* VS Code Typing Canvas Background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-[0.35]"
          />

          {/* Central Elements */}
          <div className="relative z-10 flex flex-col items-center px-4 w-full">
            
            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 flex items-center justify-center mb-8 md:mb-10 will-change-transform"
            >
              {/* The exact logo shape masked Shine Effect */}
              <div 
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  WebkitMaskImage: 'url(/APXTECK.png)',
                  maskImage: 'url(/APXTECK.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              >
                <motion.div
                  initial={{ x: '-150%' }}
                  animate={{ x: '150%' }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 will-change-transform"
                />
              </div>

              <Image
                src="/APXTECK.png"
                alt="APXTeck Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Simple Loading Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2.5 sm:gap-3 text-white/40 text-xs sm:text-sm tracking-[0.2em] font-mono uppercase"
            >
              <div className="relative flex h-3 sm:h-4 w-3 sm:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 sm:h-4 w-3 sm:w-4 border-2 border-accent"></span>
              </div>
              Loading System...
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
