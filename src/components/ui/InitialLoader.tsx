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
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShow(true);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShow(false);
          localStorage.setItem('hasVisited', 'true');
        }, 1000); // 1s for the dissolve animation
      }, 4500);
      return () => clearTimeout(timer);
    }
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
    
    let x = width > 768 ? width / 2 - 300 : 20; // Center text on desktop, left align on mobile
    let y = height > 768 ? height / 2 - 150 : 100;
    const startX = x;
    const lineHeight = 24;
    const fontSize = width > 768 ? 16 : 14;

    const draw = () => {
      // Clear canvas with very subtle fade to keep it clean
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
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

      animationFrameId = requestAnimationFrame(() => {
        setTimeout(draw, 15); // Fast typing speed
      });
    };

    draw();

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
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* VS Code Typing Canvas Background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-40"
          />

          {/* Central Elements */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center mb-10"
            >
              {/* The Shine Effect Container */}
              <div className="absolute inset-0 overflow-hidden rounded-full z-20 pointer-events-none">
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '200%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
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
            <div className="flex items-center gap-3 text-white/50 text-sm tracking-widest font-mono uppercase">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/20 border-t-accent rounded-full"
              />
              Loading...
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
