'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Target,
  Eye,
  ShieldAlert,
  Award,
  Star,
  Zap,
  Building2,
  Users,
  Coffee,
  Rocket,
  Cpu,
  TrendingUp,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

const coreValues = [
  {
    title: 'Extreme Precision',
    description:
      'We pay attention to every pixel, line of code, and hover micro-animation to deliver premium products.',
    icon: Cpu,
    color: '#0ea5e9', // Cyan
  },
  {
    title: 'SMB First',
    description:
      'Enterprise tech frameworks scaled down and optimized for growing Indian businesses.',
    icon: TrendingUp,
    color: '#a855f7', // Purple
  },
  {
    title: 'Radical Transparency',
    description:
      'Clear timelines, open dashboard task updates, and direct developer communication channels.',
    icon: HeartHandshake,
    color: '#10b981', // Emerald
  },
  {
    title: 'Continuous Innovation',
    description:
      'Constantly upgrading our toolset with Next.js ISR, Turbopack, and clean Prisma schemas.',
    icon: Sparkles,
    color: '#ec4899', // Pink
  },
];

const typewriterWords = ['APXTeck', 'Developers', 'Innovators', 'Visionaries', 'Creators'];

function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseDelay = 2000) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const currentWord = words[loopNum % words.length];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }, deletingSpeed);
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseDelay]);

  const currentFullWord = words[loopNum % words.length];

  return { text, currentFullWord };
}

export function AboutClient() {
  const { text: typewrittenText, currentFullWord } = useTypewriter(typewriterWords, 100, 50, 2500);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const heroPhrases = [
    'Designing next-generation web portals and automated systems.',
    'Helping Indian SMBs achieve unprecedented digital scale.',
    'Engineering high-performance, modular software architectures.',
    'Crafting secure, beautiful, and dynamic digital experiences.',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroPhrases.length]);

  return (
    <main className="flex-1 pt-24 relative overflow-hidden">
      <MouseSpotlight />
      <FloatingWhatsApp phoneNumber="919405282582" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 flex items-center justify-center min-h-[60vh]">
        {/* Background Parallax Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center -z-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider"
          >
            Engineering Excellence
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              We Are
            </motion.span>

            <motion.span
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="flex items-center justify-center min-h-[1.2em] text-[10vw] sm:text-5xl md:text-7xl whitespace-nowrap"
            >
              <span className="relative flex items-center justify-center">
                {/* Invisible placeholder for exact width of the CURRENT word to keep it perfectly centered */}
                <span className="opacity-0 pointer-events-none select-none whitespace-nowrap">
                  {currentFullWord}
                </span>

                {/* Typing text overlay */}
                <span className="absolute left-0 flex items-center whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-500 to-purple-500">
                    {typewrittenText}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 md:w-2 h-[0.8em] bg-purple-500 ml-1 md:ml-2 rounded-sm shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  />
                </span>
              </span>
            </motion.span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-foreground/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed h-[80px] md:h-[60px] relative flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-x-0"
              >
                {heroPhrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Our Story (Animated Timeline Layout) */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wider uppercase text-sm">
              <Rocket className="w-4 h-4" /> The Origin
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Bridging the gap between{' '}
              <span className="text-foreground/50 italic">global enterprise tech</span> and local
              business needs.
            </h2>
            <div className="space-y-6 text-foreground/70 text-lg leading-relaxed">
              <p>
                Founded in 2026, APXTeck was established to solve a critical problem: growing Indian
                small and medium businesses deserved custom, secure, and beautiful products, but
                were priced out by massive enterprise licensing bills.
              </p>
              <p>
                We started as a lean engineering studio in Pune. Today, we work as strategic design
                and system partners for brands across the country, building high-speed Next.js web
                applications, customizing CRM leads systems, and executing data-driven SEO
                campaigns.
              </p>
            </div>
          </motion.div>

          {/* Story Visuals */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden relative border border-glass-border shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
                alt="APXTeck Team collaborating"
                width={800}
                height={600}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Floating Stat inside image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-8 right-8 bg-background/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl"
              >
                <div className="text-3xl font-bold text-accent mb-1">100%</div>
                <div className="text-sm font-semibold text-foreground/80">
                  In-house Engineering Team
                </div>
                <div className="text-xs text-foreground/60 mt-1">
                  Zero outsourcing. Maximum quality control.
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-12 md:py-20 bg-foreground/[0.02] border-y border-glass-border">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 h-full border border-glass-border shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Our Mission</h3>
              <p className="text-foreground/70 leading-relaxed text-lg">
                To democratize premium engineering and custom web development for growing
                businesses. We make high-speed, secure, and beautiful visual experiences accessible
                to every ambitious Indian entrepreneur.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 h-full border border-glass-border shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed text-lg">
                To become the premier digital engineering partner for SMBs in India, recognized for
                modern designs, highly scalable modular codebases, and completely transparent client
                relationships.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Our Culture & Workspace (Pune Focus) */}
      <section className="py-16 md:py-24 relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Our Culture & Headquarters
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-foreground/60 max-w-2xl mx-auto mt-6 text-lg"
          >
            Operating out of the IT hub of Pune, Maharashtra. We foster a culture of deep work,
            continuous learning, and architectural perfection.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative h-[400px] rounded-[2rem] overflow-hidden group"
          >
            <Image
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3"
              alt="Diverse tech team at APXTeck"
              width={1200}
              height={800}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Building2 className="w-5 h-5" />
                <span className="font-bold tracking-widest uppercase text-xs">Headquarters</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Pune, Maharashtra</h3>
              <p className="text-white/80 mt-2 text-sm max-w-md">
                Our central hub where design and engineering converge. Designed for collaborative
                sprints and deep focus work.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 rounded-[2rem] bg-foreground/[0.02] border border-glass-border p-8 flex flex-col justify-center relative overflow-hidden group"
            >
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Agile Teams</h3>
              <p className="text-foreground/60 text-sm">
                Small, highly cross-functional pods that deliver fast iterations without enterprise
                bloat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex-1 rounded-[2rem] bg-foreground/[0.02] border border-glass-border p-8 flex flex-col justify-center relative overflow-hidden group"
            >
              <Coffee className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Developer First</h3>
              <p className="text-foreground/60 text-sm">
                We invest heavily in the best hardware, mechanical keyboards, and top-tier tech
                stacks.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Animated Grid */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            Our Core Values
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-foreground/60 max-w-xl mx-auto mt-4"
          >
            These fundamental operating guidelines direct how we write code, design interfaces, and
            support our partners.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', bounce: 0.4 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <GlassCard
                  className="h-full hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden"
                  glowColor={val.color}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-24 h-24" style={{ color: val.color }} />
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-sm mb-6 relative z-10 transition-transform duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `${val.color}14`,
                      borderColor: `${val.color}3a`,
                      color: val.color,
                      boxShadow: `0 4px 12px -3px ${val.color}26, 0 0 8px 1px ${val.color}1a`,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-3 relative z-10">
                    {val.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed relative z-10">
                    {val.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] p-[2px] overflow-hidden group shadow-2xl"
        >
          {/* Spinning Gradient Border */}
          <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(14,165,233,0.5)_360deg)] animate-[spin_6s_linear_infinite]" />

          {/* Inner Content Card */}
          <div className="relative z-10 bg-background/95 backdrop-blur-3xl rounded-[2.4rem] p-12 md:p-20 border border-white/5 flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Ready to Build Something Great?
            </h2>
            <p className="text-foreground/70 max-w-lg mx-auto mb-10 text-lg">
              Share your business requirements and we will design a high-performance, modular
              solution tailored to your budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full bg-accent hover:bg-accent/90 text-white px-8 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/25"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="inline-flex h-14 items-center justify-center rounded-full glass-panel border border-glass-border text-foreground px-8 font-bold transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
