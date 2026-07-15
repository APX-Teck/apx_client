'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { SiCoreldraw } from 'react-icons/si';

type TechItem = {
  name: string;
  icon?: string;
  IconComponent?: React.ElementType;
  color?: string;
};

const techStack: TechItem[] = [
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'PostgreSQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'TailwindCSS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
  },
  {
    name: 'Amazon Web Services',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  },
  {
    name: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  // Design Tools
  {
    name: 'Figma',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  },
  {
    name: 'Canva',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg',
  },
  {
    name: 'Photoshop',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg',
  },
  {
    name: 'Illustrator',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg',
  },
  {
    name: 'Premiere Pro',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/premierepro/premierepro-original.svg',
  },
  {
    name: 'After Effects',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/aftereffects/aftereffects-original.svg',
  },
  { 
    name: 'CorelDraw', 
    IconComponent: SiCoreldraw,
    color: '#1E8E3E' // CorelDraw Brand Green
  },
];

export function TechStackMarquee() {
  // Double the array to ensure smooth infinite scrolling loop
  const infiniteStack = [...techStack, ...techStack];

  return (
    <section className="py-12 border-y border-glass-border bg-background overflow-hidden relative">
      {/* Background gradients for soft fading edges */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col items-center justify-center gap-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest text-foreground/40 text-center px-4"
        >
          Powered by Industry-Leading Technologies
        </motion.p>

        {/* Infinite Scroll Container */}
        <div className="flex overflow-hidden w-full group">
          <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {infiniteStack.map((tech, index) => {
              const isDuplicate = index >= techStack.length;
              return (
              <div
                key={index}
                className="flex items-center gap-3 px-8 sm:px-12 hover:scale-110 transition-all duration-300 min-w-max"
                aria-hidden={isDuplicate ? "true" : undefined}
              >
                {tech.icon ? (
                  <Image
                    src={tech.icon}
                    alt={isDuplicate ? "" : `${tech.name} technology logo`}
                    title={isDuplicate ? undefined : tech.name}
                    width={80}
                    height={80}
                    className="h-8 md:h-10 w-auto object-contain drop-shadow-md"
                    // Next.js specific invert for dark mode if it's the nextjs logo
                    style={
                      tech.name === 'Next.js' || tech.name === 'Amazon Web Services'
                        ? { filter: 'var(--tw-invert, invert(1))' }
                        : {}
                    }
                  />
                ) : tech.IconComponent ? (
                  <tech.IconComponent 
                    className="h-8 md:h-10 w-auto text-foreground drop-shadow-md" 
                    title={isDuplicate ? undefined : tech.name} 
                    style={{ color: tech.color !== '#000000' ? tech.color : undefined }}
                  />
                ) : null}
                <span className="text-sm font-bold text-foreground/80 hidden sm:block">
                  {tech.name}
                </span>
              </div>
            )})}
          </div>
          {/* Duplicate for seamless infinite scrolling */}
          <div
            className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {infiniteStack.map((tech, index) => (
              <div
                key={`dup-${index}`}
                className="flex items-center gap-3 px-8 sm:px-12 hover:scale-110 transition-all duration-300 min-w-max"
              >
                {tech.icon ? (
                  <Image
                    src={tech.icon}
                    alt=""
                    width={80}
                    height={80}
                    className="h-8 md:h-10 w-auto object-contain drop-shadow-md"
                    style={
                      tech.name === 'Next.js' || tech.name === 'Amazon Web Services'
                        ? { filter: 'var(--tw-invert, invert(1))' }
                        : {}
                    }
                  />
                ) : tech.IconComponent ? (
                  <tech.IconComponent 
                    className="h-8 md:h-10 w-auto text-foreground drop-shadow-md"
                    style={{ color: tech.color !== '#000000' ? tech.color : undefined }}
                  />
                ) : null}
                <span className="text-sm font-bold text-foreground/80 hidden sm:block">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
}
