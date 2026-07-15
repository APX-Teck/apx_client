'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CYRILLIC = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const SPECIALS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS = ALPHABET + CYRILLIC + SPECIALS;

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function ScrambleText({ text, className = '', as: Component = 'span' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const maxIterations = text.length;
    let animationFrame: number;

    const scramble = () => {
      setDisplayText((current) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      // Increase speed slightly towards the end
      iteration += 1 / 3;

      if (iteration < maxIterations) {
        animationFrame = requestAnimationFrame(scramble);
      } else {
        setDisplayText(text); // Ensure final text is exact
      }
    };

    animationFrame = requestAnimationFrame(scramble);

    return () => cancelAnimationFrame(animationFrame);
  }, [text, isInView]);

  return (
    <Component ref={ref} className={className}>
      {displayText}
    </Component>
  );
}
