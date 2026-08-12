'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, Rocket, Code2, Paintbrush, PenTool, Clock, Video, Search, Share2, Wrench, ShieldCheck, Award, Lock, Download, HelpCircle, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

interface Feature {
  text: string;
  included: boolean;
  bold?: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  subprice: string;
  recommended: boolean;
  features: Feature[];
  moreFeatures: Feature[];
}

interface GraphicDesignService {
  name: string;
  description: string;
  basePrice: string;
  withGst: string;
  duration: string;
}

interface SubCategory {
  id: string;
  label: string;
  type: 'cards' | 'list';
  plans?: PricingPlan[];
  services?: GraphicDesignService[];
}

interface PricingCategory {
  id: string;
  label: string;
  icon: any;
  isSimple?: boolean;
  plans?: PricingPlan[]; // For simple categories
  banner?: string;
  subCategories?: SubCategory[]; // For complex categories with sub-tabs
}

const pricingData: PricingCategory[] = [
  {
    id: 'digital-visibility',
    label: 'Digital Visibility',
    icon: Search,
    isSimple: true,
    banner: 'COMPLETE PACKAGE: SEO + GEO + AEO = ₹17,999 (+GST = ₹21,239) | Save ₹2,998! | 21-30 Days Setup',
    plans: [
      {
        name: 'SEO',
        price: '₹6,999',
        subprice: '+GST = ₹8,259 | 10-15 Days + Monthly',
        recommended: false,
        features: [
          { text: 'Keyword research (30 keywords)', included: true },
          { text: 'On-page SEO (15 pages)', included: true },
          { text: 'Technical audit + 20 fixes', included: true },
          { text: 'Backlinks (10/month)', included: true },
        ],
        moreFeatures: [
          { text: 'Local SEO + Google Business', included: true },
          { text: 'Schema markup (5 types)', included: true },
          { text: 'Monthly performance report', included: true },
        ],
      },
      {
        name: 'GEO (AI Search)',
        price: '₹6,999',
        subprice: '+GST = ₹8,259 | 10-15 Days + Monthly',
        recommended: true,
        features: [
          { text: 'AI visibility audit (3 platforms)', included: true },
          { text: 'Content restructure (15 pages)', included: true },
          { text: 'ChatGPT/Gemini/Claude opt.', included: true },
          { text: 'Entity optimization (10 entities)', included: true },
        ],
        moreFeatures: [
          { text: 'Knowledge graph enhancement', included: true },
          { text: 'Structured data (5 schemas)', included: true },
          { text: 'Monthly AI visibility report', included: true },
        ],
      },
      {
        name: 'AEO (Answers)',
        price: '₹6,999',
        subprice: '+GST = ₹8,259 | 10-15 Days + Monthly',
        recommended: false,
        features: [
          { text: 'Snippet targeting (20 queries)', included: true },
          { text: 'People Also Ask (15 questions)', included: true },
          { text: 'Voice search (10 queries)', included: true },
        ],
        moreFeatures: [
          { text: 'FAQ schema (20 FAQs)', included: true },
          { text: 'Answer-ready content (10 pages)', included: true },
          { text: 'Monthly tracking report', included: true },
        ],
      },
    ]
  },
  {
    id: 'social-media',
    label: 'Social Media',
    icon: Share2,
    subCategories: [
      {
        id: 'sm-packages',
        label: 'All-Inclusive Packages',
        type: 'cards',
        plans: [
          {
            name: 'Essential',
            price: '₹20,000/mo',
            subprice: 'all inclusive (mgmt+ads+GST)',
            recommended: false,
            features: [
              { text: 'IG: 6 posts+1 carousel+1 Reel+4 Stories', included: true },
              { text: 'FB: 5 posts+1 carousel+1 video', included: true },
              { text: 'Threads: 8 posts/week (40/mo)', included: true },
              { text: '15 min/day | 15 replies/day', included: true },
              { text: 'DM handling', included: false },
            ],
            moreFeatures: [
              { text: 'ADS (₹4,000 incl): 1 campaign | 1 creative', included: true },
              { text: 'REPORTING: Monthly analytics', included: true },
            ],
          },
          {
            name: 'Growth',
            price: '₹30,000/mo',
            subprice: 'all inclusive (mgmt+ads+GST)',
            recommended: true,
            features: [
              { text: 'IG: 8 posts+2 carousels+2 Reels+6 Stories', included: true },
              { text: 'FB: 8 posts+2 carousels+2 videos+4 Stories', included: true },
              { text: 'Threads: 15 posts/week (100/mo)', included: true },
              { text: '30 min/day | 30 replies/day', included: true },
              { text: 'DM handling (10/day)', included: true },
            ],
            moreFeatures: [
              { text: 'Competitor analysis (3 brands)', included: true },
              { text: 'ADS (₹9,000 incl): 2-3 campaigns | A/B testing', included: true },
              { text: 'REPORTING: Monthly report + growth tips', included: true },
            ],
          },
          {
            name: 'Pro',
            price: '₹45,000/mo',
            subprice: 'all inclusive (mgmt+ads+GST)',
            recommended: false,
            features: [
              { text: 'IG: 12 posts+4 carousels+4 Reels+10 Stories', included: true },
              { text: 'FB: 12 posts+4 carousels+4 videos+8 Stories', included: true },
              { text: 'Threads: 25 posts/week (150/mo)', included: true },
              { text: '1 hr/day | 50 replies/day', included: true },
              { text: 'DM handling (20/day)', included: true },
            ],
            moreFeatures: [
              { text: 'Competitor analysis (5 brands)', included: true },
              { text: 'ADS (₹15,000 incl): 4-5 campaigns | retargeting', included: true },
              { text: 'STRATEGY: Bi-weekly report + Strategy call', included: true },
              { text: 'Content calendar + approval', included: true },
            ],
          },
        ],
      },
      {
        id: 'sm-instagram',
        label: 'Instagram',
        type: 'list',
        services: [
          { name: 'IG Starter', description: '10 posts + 2 Reels + 4 Stories + profile opt. | 2 rev/post', basePrice: '₹9,999', withGst: '₹11,799', duration: 'Monthly' },
          { name: 'IG Growth', description: '20 posts + 4 Reels + 10 Stories + engagement 1hr/day | 3 rev/post', basePrice: '₹19,999', withGst: '₹23,599', duration: 'Monthly' },
          { name: 'IG Pro', description: '30 posts + 8 Reels + 20 Stories + influencer (5/mo) | 4 rev/post', basePrice: '₹34,999', withGst: '₹41,299', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-youtube',
        label: 'YouTube',
        type: 'list',
        services: [
          { name: 'YT Starter', description: '4 videos + SEO + thumbnails + channel branding', basePrice: '₹14,999', withGst: '₹17,699', duration: 'Monthly' },
          { name: 'YT Growth', description: '8 videos + 4 Shorts + A/B thumbnails + content calendar', basePrice: '₹24,999', withGst: '₹29,499', duration: 'Monthly' },
          { name: 'YT Pro', description: '12 videos + 8 Shorts + scripting + premium motion GFX', basePrice: '₹44,999', withGst: '₹53,099', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-linkedin',
        label: 'LinkedIn',
        type: 'list',
        services: [
          { name: 'LI Starter', description: '10 posts + profile opt. + connections (50/mo)', basePrice: '₹9,999', withGst: '₹11,799', duration: 'Monthly' },
          { name: 'LI Growth', description: '20 posts + 2 articles + connections (150/mo) + lead gen', basePrice: '₹19,999', withGst: '₹23,599', duration: 'Monthly' },
          { name: 'LI Pro', description: '25+ posts + 4 articles + newsletter + InMail (100/mo)', basePrice: '₹34,999', withGst: '₹41,299', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-facebook',
        label: 'Facebook',
        type: 'list',
        services: [
          { name: 'FB Starter', description: '10 posts + 2 Stories/wk + page opt.', basePrice: '₹7,999', withGst: '₹9,439', duration: 'Monthly' },
          { name: 'FB Growth', description: '20 posts + Group mgmt + Events (2/mo) + engagement', basePrice: '₹16,999', withGst: '₹20,059', duration: 'Monthly' },
          { name: 'FB Pro', description: '30 posts + FB Live (2/mo) + Chatbot + Shop (50 items)', basePrice: '₹29,999', withGst: '₹35,399', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-twitter',
        label: 'Twitter / X',
        type: 'list',
        services: [
          { name: 'X Starter', description: '10 tweets/wk + 2 Threads/mo + engagement (30/day)', basePrice: '₹7,999', withGst: '₹9,439', duration: 'Monthly' },
          { name: 'X Growth', description: '20 tweets/wk + 4 Threads + Spaces (2/mo)', basePrice: '₹16,999', withGst: '₹20,059', duration: 'Monthly' },
          { name: 'X Pro', description: '25+ tweets/wk + daily Threads + Spaces hosting + crisis', basePrice: '₹29,999', withGst: '₹35,399', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-threads',
        label: 'Threads',
        type: 'list',
        services: [
          { name: 'Starter', description: '10 posts/wk + profile + IG cross-post', basePrice: '₹5,999', withGst: '₹7,079', duration: 'Monthly' },
          { name: 'Growth', description: '20 posts/wk + original content + threading (4/wk)', basePrice: '₹12,999', withGst: '₹15,339', duration: 'Monthly' },
          { name: 'Pro', description: '25+ posts/wk + daily leadership + influencer (3/mo)', basePrice: '₹22,999', withGst: '₹27,139', duration: 'Monthly' },
        ]
      },
      {
        id: 'sm-bundles',
        label: 'Bundles & Ad Management',
        type: 'list',
        services: [
          { name: 'Duo Growth (Any 2)', description: 'Growth plan for 2 platforms + unified strategy', basePrice: '₹29,999', withGst: '₹35,399', duration: 'Monthly' },
          { name: 'Trio Growth (Any 3)', description: 'Growth plan for 3 platforms + dedicated SMM', basePrice: '₹44,999', withGst: '₹53,099', duration: 'Monthly' },
          { name: 'All 6 Growth', description: 'Growth for ALL 6 + dedicated team + weekly calls', basePrice: '₹79,999', withGst: '₹94,399', duration: 'Monthly' },
          { name: 'IG/FB Ads Mgmt', description: 'Campaign setup + creatives + targeting (ad spend separate)', basePrice: '₹7,999', withGst: '₹9,439', duration: 'Monthly' },
          { name: 'YouTube Ads', description: 'Video campaigns + targeting + optimization (spend separate)', basePrice: '₹9,999', withGst: '₹11,799', duration: 'Monthly' },
          { name: 'LinkedIn Ads', description: 'Sponsored content + B2B targeting + lead gen (spend separate)', basePrice: '₹12,999', withGst: '₹15,339', duration: 'Monthly' },
        ]
      },
    ]
  },
  {
    id: 'web-dev',
    label: 'Website Development',
    icon: Code2,
    isSimple: true,
    plans: [
      {
        name: 'Starter (5 Pages)',
        price: '₹12,999',
        subprice: '+GST = ₹15,339 | 7-10 Days',
        recommended: false,
        features: [
          { text: '5 professionally designed pages', included: true },
          { text: '100% mobile responsive', included: true },
          { text: 'Basic SEO (meta tags, sitemap)', included: true },
          { text: 'Contact form + WhatsApp button', included: true },
          { text: 'Free SSL certificate', included: true },
          { text: '1-year basic support (48hr)', included: true },
          { text: 'Up to 3 design revisions', included: true },
        ],
        moreFeatures: [
          { text: 'Custom UI design', included: false },
          { text: 'Hosting included', included: false },
          { text: 'Social media graphics', included: false },
        ],
      },
      {
        name: 'Business (8-12 Pages)',
        price: '₹49,999',
        subprice: '+GST = ₹58,999 | 18-22 Days',
        recommended: true,
        features: [
          { text: '8-12 custom designed pages', included: true },
          { text: 'Custom UI/UX design', included: true },
          { text: 'On-page SEO (10 keywords)', included: true },
          { text: 'Advanced forms + filtering', included: true },
          { text: 'Portfolio + Blog sections', included: true },
          { text: 'FREE hosting 1yr (₹11,031 value)', included: true },
          { text: 'FREE business email 1yr', included: true },
        ],
        moreFeatures: [
          { text: 'Floating WhatsApp integration', included: true },
          { text: '90+ PageSpeed target', included: true },
          { text: '1-year priority support (12hr)', included: true },
          { text: 'Up to 5 design revisions', included: true },
        ],
      },
      {
        name: 'Business Pro',
        price: '₹59,999',
        subprice: '+GST = ₹70,799 | 22-28 Days',
        recommended: false,
        features: [
          { text: 'Everything in Business PLUS:', included: true, bold: true },
          { text: '12 social media graphics (FB+IG)', included: true },
          { text: 'Advanced scroll animations', included: true },
          { text: 'Complete social integration', included: true },
          { text: 'Advanced SEO + schema markup', included: true },
          { text: 'FREE hosting+email (₹11,584)', included: true },
        ],
        moreFeatures: [
          { text: '1-year priority support', included: true },
          { text: 'Up to 7 design revisions', included: true },
        ],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        subprice: 'GST applicable | 35-60 Days',
        recommended: false,
        features: [
          { text: '15+ custom pages', included: true },
          { text: 'Premium design + animations', included: true },
          { text: 'Custom modules (CRM, payments)', included: true },
          { text: 'Multiple business emails', included: true },
          { text: 'Enterprise security + CDN', included: true },
        ],
        moreFeatures: [
          { text: 'Dedicated project manager', included: true },
          { text: '1-year dedicated support (4hr)', included: true },
          { text: 'Up to 10 design revisions', included: true },
        ],
      },
    ],
  },
  {
    id: 'ui-ux',
    label: 'UI/UX Design',
    icon: Paintbrush,
    isSimple: true,
    plans: [
      {
        name: 'Basic Web UI/UX',
        price: '₹12,499',
        subprice: '+GST = ₹14,749 | 5-7 Days',
        recommended: false,
        features: [
          { text: 'Low-fidelity wireframing', included: true },
          { text: '5 high-fidelity screen designs', included: true },
          { text: 'Responsive grid layout', included: true },
        ],
        moreFeatures: [
          { text: 'Color palette + typography', included: true },
          { text: 'Figma/XD source files', included: true },
          { text: 'Up to 3 revision rounds', included: true },
        ],
      },
      {
        name: 'Corporate UI/UX',
        price: '₹24,999',
        subprice: '+GST = ₹29,499 | 12-15 Days',
        recommended: true,
        features: [
          { text: '10-15 high-fidelity screens', included: true },
          { text: 'Desktop + mobile views', included: true },
          { text: 'Interactive clickable prototype', included: true },
          { text: 'Custom iconography (15 icons)', included: true },
        ],
        moreFeatures: [
          { text: 'UI component library', included: true },
          { text: 'Developer handoff docs', included: true },
          { text: 'Up to 5 revision rounds', included: true },
        ],
      },
      {
        name: 'Enterprise Dashboard UI',
        price: '₹37,499',
        subprice: '+GST = ₹44,249 | 18-25 Days',
        recommended: false,
        features: [
          { text: 'Complex user flows', included: true },
          { text: 'Data visualization (8 chart types)', included: true },
          { text: 'Role-based dashboards (4 roles)', included: true },
          { text: 'Advanced interactive prototype', included: true },
        ],
        moreFeatures: [
          { text: 'Design system with tokens', included: true },
          { text: 'Dev specs document (15+ pages)', included: true },
          { text: 'Up to 8 revision rounds', included: true },
        ],
      },
    ],
  },
  {
    id: 'graphic-design',
    label: 'Graphic Design',
    icon: PenTool,
    subCategories: [
      {
        id: 'gd-logo',
        label: 'Logo & Brand Identity',
        type: 'list',
        services: [
          { name: 'Starter Logo', description: '2 concepts, JPG/PNG, 2 revisions', basePrice: '₹3,499', withGst: '₹4,129', duration: '3-4 Days' },
          { name: 'Professional Logo', description: '3 concepts + vector (AI/EPS/SVG), 4 revisions', basePrice: '₹7,999', withGst: '₹9,439', duration: '5-7 Days' },
          { name: 'Premium Corporate', description: '5 concepts + full kit + mockups, 6 revisions', basePrice: '₹16,999', withGst: '₹20,059', duration: '7-10 Days' },
          { name: 'Mini Brand Kit', description: 'Logo + colors + fonts + 4pg guide, 4 revisions', basePrice: '₹14,999', withGst: '₹17,699', duration: '5-7 Days' },
          { name: 'Brand Rulebook', description: '15-20pg PDF + stationery + templates, 8 rev', basePrice: '₹34,999', withGst: '₹41,299', duration: '14-21 Days' },
        ],
      },
      {
        id: 'gd-packaging',
        label: 'Packaging & Publications',
        type: 'list',
        services: [
          { name: 'Product Pouch', description: 'Front+back, print-ready, 3 revisions', basePrice: '₹5,999', withGst: '₹7,079', duration: '3-5 Days' },
          { name: 'Box/Carton', description: 'Die-cut layout, 3 revisions', basePrice: '₹7,999', withGst: '₹9,439', duration: '4-6 Days' },
          { name: 'Book Cover', description: 'Front, back, spine, 3 revisions', basePrice: '₹5,999', withGst: '₹7,079', duration: '3-5 Days' },
          { name: 'Annual Report', description: 'Up to 10pg + infographics, 4 revisions', basePrice: '₹7,999', withGst: '₹9,439', duration: '7-10 Days' },
        ],
      },
      {
        id: 'gd-social',
        label: 'Social Media & Digital',
        type: 'list',
        services: [
          { name: 'Single Post', description: '1 design (JPEG/PNG), 1 revision', basePrice: '₹499', withGst: '₹589', duration: '1 Day' },
          { name: 'Carousel (3-5)', description: '3-5 slides, 2 revisions', basePrice: '₹1,499', withGst: '₹1,769', duration: '1-2 Days' },
          { name: 'Bulk 10 Posts', description: '10 designs, 3 revisions on set', basePrice: '₹3,499', withGst: '₹4,129', duration: '5-7 Days' },
          { name: 'Infographic', description: '1 data graphic, 2 revisions', basePrice: '₹2,999', withGst: '₹3,539', duration: '2-3 Days' },
          { name: 'YouTube Thumbnail', description: '1 high-CTR JPEG, 1 revision', basePrice: '₹349', withGst: '₹412', duration: '1 Day' },
        ],
      },
      {
        id: 'gd-print',
        label: 'Print & Invitations',
        type: 'list',
        services: [
          { name: 'Business Card', description: 'Front+back, CMYK, 2 revisions', basePrice: '₹699', withGst: '₹825', duration: '1 Day' },
          { name: 'Brochure (Bi/Tri)', description: '4-6 panels, 3 revisions', basePrice: '₹3,499', withGst: '₹4,129', duration: '3-5 Days' },
          { name: 'Digital E-Invite', description: '1 page, 2 revisions', basePrice: '₹1,799', withGst: '₹2,123', duration: '2-3 Days' },
          { name: 'Wedding Card', description: 'Up to 4 pages, 3 revisions', basePrice: '₹3,499', withGst: '₹4,129', duration: '3-5 Days' },
          { name: 'Flyer/Pamphlet', description: 'A4/A5, 2 revisions', basePrice: '₹1,199', withGst: '₹1,415', duration: '1-2 Days' },
        ],
      },
    ]
  },
  {
    id: 'video-editing',
    label: 'Video Editing',
    icon: Video,
    subCategories: [
      {
        id: 've-short',
        label: 'Short-Form (Reels & Shorts)',
        type: 'list',
        services: [
          { name: 'Basic Reel (30s)', description: 'Trim + text + music, 1 revision', basePrice: '₹1,199', withGst: '₹1,415', duration: '1-2 Days' },
          { name: 'Premium Reel', description: 'Captions + B-roll + SFX, 2 revisions', basePrice: '₹1,999', withGst: '₹2,359', duration: '2-3 Days' },
          { name: 'Bulk 3 Reels', description: '3 edited reels, 1 revision each', basePrice: '₹2,499', withGst: '₹2,949', duration: '3-5 Days' },
        ]
      },
      {
        id: 've-long',
        label: 'YouTube & Long-Form',
        type: 'list',
        services: [
          { name: 'Standard YT (3-5m)', description: 'Cuts + thirds + color, 2 revisions', basePrice: '₹1,699', withGst: '₹2,005', duration: '2-3 Days' },
          { name: 'Podcast (20m)', description: 'Multi-cam + audio, 2 revisions', basePrice: '₹2,199', withGst: '₹2,595', duration: '3-4 Days' },
          { name: 'Premium YT (5-10m)', description: 'Effects + motion GFX, 3 revisions', basePrice: '₹2,499', withGst: '₹2,949', duration: '3-5 Days' },
        ]
      },
      {
        id: 've-promos',
        label: 'Promos, Ads & Corporate',
        type: 'list',
        services: [
          { name: 'Social Ad (15-30s)', description: 'Hooks + CTA + audio, 2 revisions', basePrice: '₹1,499', withGst: '₹1,769', duration: '2-3 Days' },
          { name: 'Product Teaser', description: 'Cinematic + SFX, 2 revisions', basePrice: '₹2,199', withGst: '₹2,595', duration: '3-4 Days' },
          { name: 'Logo Reveal (5-10s)', description: '2D animation, 2 revisions', basePrice: '₹1,199', withGst: '₹1,415', duration: '2-3 Days' },
          { name: 'Corp Interview (2m)', description: 'Pro audio sync, 2 revisions', basePrice: '₹1,999', withGst: '₹2,359', duration: '3-5 Days' },
          { name: 'Wedding Invite', description: '1-2 min cinematic, 2 revisions', basePrice: '₹2,199', withGst: '₹2,595', duration: '3-5 Days' },
        ]
      }
    ]
  },
  {
    id: 'maintenance',
    label: 'Maintenance & Support',
    icon: Wrench,
    subCategories: [
      {
        id: 'maint-web',
        label: 'Website Maintenance AMC',
        type: 'cards',
        plans: [
          {
            name: 'Basic',
            price: '₹4,999/mo',
            subprice: '+GST = ₹5,899',
            recommended: false,
            features: [
              { text: 'Weekly backups (7-day)', included: true },
              { text: 'Monthly security scan', included: true },
              { text: 'Quarterly updates', included: true },
              { text: '2 content updates/mo', included: true },
              { text: 'Uptime monitoring (30min)', included: true },
            ],
            moreFeatures: [
              { text: 'Email support (48hr)', included: true },
              { text: '99% uptime SLA', included: true },
            ],
          },
          {
            name: 'Standard',
            price: '₹9,999/mo',
            subprice: '+GST = ₹11,799',
            recommended: true,
            features: [
              { text: 'Daily backups (30-day)', included: true },
              { text: 'Weekly security scans', included: true },
              { text: 'Monthly updates', included: true },
              { text: 'Up to 8 bug fixes/mo', included: true },
              { text: '5 content updates/mo', included: true },
            ],
            moreFeatures: [
              { text: 'DB optimization', included: true },
              { text: 'WhatsApp support (12hr)', included: true },
              { text: '99.5% SLA + monthly report', included: true },
            ],
          },
          {
            name: 'Premium',
            price: '₹19,999/mo',
            subprice: '+GST = ₹23,599',
            recommended: false,
            features: [
              { text: '6-hour backups (30-day)', included: true },
              { text: '24/7 security + DDoS', included: true },
              { text: 'Weekly updates', included: true },
              { text: '15 bug fixes/mo', included: true },
              { text: '10 content updates/mo', included: true },
            ],
            moreFeatures: [
              { text: '4hrs dev work/mo', included: true },
              { text: 'Emergency response (4hr)', included: true },
              { text: 'Dedicated manager', included: true },
              { text: '99.9% SLA', included: true },
            ],
          },
        ]
      },
      {
        id: 'maint-app',
        label: 'Application & Software AMC',
        type: 'cards',
        plans: [
          {
            name: 'Basic',
            price: '₹14,999/mo',
            subprice: '+GST = ₹17,699',
            recommended: false,
            features: [
              { text: 'Weekly DB backups', included: true },
              { text: 'Monthly patches', included: true },
              { text: 'Server monitoring', included: true },
              { text: '4hrs bug fixes/mo', included: true },
              { text: 'Error logging', included: true },
            ],
            moreFeatures: [
              { text: '99% SLA', included: true },
            ],
          },
          {
            name: 'Standard',
            price: '₹24,999/mo',
            subprice: '+GST = ₹29,499',
            recommended: true,
            features: [
              { text: 'Daily backups', included: true },
              { text: 'Bi-weekly patches', included: true },
              { text: '24/7 monitoring', included: true },
              { text: '10hrs fixes/mo', included: true },
              { text: '4hrs features/mo', included: true },
            ],
            moreFeatures: [
              { text: 'DB optimization', included: true },
              { text: 'Performance monitoring', included: true },
              { text: '99.5% SLA', included: true },
            ],
          },
          {
            name: 'Premium',
            price: '₹44,999/mo',
            subprice: '+GST = ₹53,099',
            recommended: false,
            features: [
              { text: 'Real-time backups', included: true },
              { text: 'Continuous security', included: true },
              { text: '15 bug fixes/mo', included: true },
              { text: '10hrs features/mo', included: true },
              { text: 'Docker/DevOps', included: true },
            ],
            moreFeatures: [
              { text: 'CI/CD maintenance', included: true },
              { text: 'Emergency (2hr)', included: true },
              { text: 'Dedicated engineer', included: true },
              { text: '99.9% SLA', included: true },
            ],
          },
        ]
      },
      {
        id: 'maint-on-demand',
        label: 'One-Time & On-Demand',
        type: 'list',
        services: [
          { name: 'Security Audit', description: 'OWASP Top 10 + SSL + DB review + 15pg report', basePrice: '₹4,999', withGst: '₹5,899', duration: '3-5 Days' },
          { name: 'Performance Opt.', description: 'PageSpeed 90+ target + caching + CDN', basePrice: '₹7,999', withGst: '₹9,439', duration: '5-7 Days' },
          { name: 'Server Migration', description: 'Full backup + DNS + SSL + 72hr monitoring', basePrice: '₹9,999', withGst: '₹11,799', duration: '3-7 Days' },
          { name: 'Stack Upgrade', description: 'Framework upgrade + refactor + testing', basePrice: '₹14,999', withGst: '₹17,699', duration: '7-14 Days' },
          { name: 'Emergency Fix', description: '2hr response, same-day target, root cause report', basePrice: '₹4,999', withGst: '₹5,899', duration: 'Same Day' },
          { name: 'Developer Hour', description: 'Full-stack on-demand (min 4hrs)', basePrice: '₹1,499/hr', withGst: '₹1,769/hr', duration: 'Per Hour' },
          { name: 'Designer Hour', description: 'Any design on-demand (min 2hrs)', basePrice: '₹999/hr', withGst: '₹1,179/hr', duration: 'Per Hour' },
        ]
      }
    ]
  }
];

const faqs = [
  {
    question: "Are there any hidden charges?",
    answer: "No, our pricing is completely transparent. The prices listed are what you pay. Only GST (18%) is applied as per Indian government regulations, which is explicitly mentioned in each plan."
  },
  {
    question: "Do you offer custom packages?",
    answer: "Yes, we understand every business is unique. While our packages cover 90% of use cases, we can easily tailor a custom solution combining Web Development, SEO, and Social Media tailored precisely to your goals."
  },
  {
    question: "What is the billing cycle for maintenance plans?",
    answer: "Our maintenance and social media management plans are billed on a monthly recurring basis. You can cancel or upgrade your plan anytime with a 30-day notice."
  },
  {
    question: "Do you provide source files for design work?",
    answer: "Yes! For all our UI/UX and Graphic Design services, you receive the complete source files (Figma, AI, PSD, etc.) along with the exported assets upon project completion."
  }
];

const convertToUSD = (text: string, currency: 'INR' | 'USD') => {
  if (currency === 'INR' || !text.includes('₹')) return text;
  return text.replace(/₹([\d,]+)/g, (match, p1) => {
    const inrValue = parseInt(p1.replace(/,/g, ''), 10);
    const usdValue = Math.round(inrValue / 83);
    return `$${usdValue.toLocaleString()}`;
  });
};

const FeatureList = ({ features }: { features: Feature[] }) => (
  <ul className="space-y-3">
    {features.map((feature, idx) => (
      <li key={idx} className="flex items-start gap-3">
        {feature.included ? (
          <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        ) : (
          <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        )}
        <span
          className={`text-sm ${feature.included ? 'text-foreground/80' : 'text-foreground/40'} ${
            feature.bold ? 'font-semibold text-foreground' : ''
          }`}
        >
          {feature.text}
        </span>
      </li>
    ))}
  </ul>
);

const slugToCategoryMap: Record<string, string> = {
  'web-development': 'web-dev',
  'seo-optimization': 'digital-visibility',
  'ui-ux-design': 'ui-ux',
  'digital-marketing': 'social-media',
  'graphic-design': 'graphic-design',
  'video-editing': 'video-editing',
  'maintenance-support': 'maintenance',
};

export function PricingSection({ serviceSlug }: { serviceSlug?: string }) {
  const mappedCategory = serviceSlug ? slugToCategoryMap[serviceSlug] : null;
  const initialCategory = mappedCategory || 'digital-visibility';
  const isFiltered = !!mappedCategory;

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (serviceSlug) {
      const cat = slugToCategoryMap[serviceSlug];
      if (cat) setActiveCategory(cat);
    }
  }, [serviceSlug]);

  const activeData = pricingData.find((cat) => cat.id === activeCategory);

  // When active category changes, set the first sub-category as active by default
  useEffect(() => {
    if (activeData?.subCategories && activeData.subCategories.length > 0) {
      setActiveSubCategory(activeData.subCategories[0].id);
    } else {
      setActiveSubCategory('');
    }
  }, [activeCategory, activeData]);

  const toggleExpand = (key: string) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderPlansGrid = (plansToRender: PricingPlan[], namespace: string) => {
    return (
      <div
        className={`grid gap-8 items-stretch pt-8 pb-4 ${
          plansToRender.length === 3
            ? 'md:grid-cols-3 max-w-5xl mx-auto'
            : 'md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {plansToRender.map((plan) => {
          const expandKey = `${namespace}-${plan.name.replace(/\s+/g, '-')}`;
          const isExpanded = expandedTiers[expandKey] || false;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative h-full ${plan.recommended ? 'md:-translate-y-4' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                  <span className="bg-accent text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg shadow-accent/40 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Recommended
                  </span>
                </div>
              )}

              <GlassCard
                className={`h-full p-8 transition-all duration-300 ${
                  plan.recommended
                    ? 'border-accent shadow-2xl shadow-accent/20'
                    : 'hover:border-white/20 hover:shadow-2xl'
                }`}
                innerClassName="h-full flex flex-col"
                glowColor={plan.recommended ? '#0ea5e9' : 'rgba(255,255,255,0.05)'}
              >
                <div className="text-center mb-8 border-b border-glass-border pb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-foreground tracking-tight">
                      {convertToUSD(plan.price, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/50 font-medium">{convertToUSD(plan.subprice, currency)}</p>
                </div>

                <div className="flex-1 space-y-6">
                  <FeatureList features={plan.features} />

                  <div className="pt-2">
                    <button
                      onClick={() => toggleExpand(expandKey)}
                      className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors w-full justify-center group"
                    >
                      <span>{isExpanded ? 'Show less' : 'View full features'}</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <FeatureList features={plan.moreFeatures} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-glass-border mt-auto">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`Inquiry for ${activeData?.label} - ${plan.name} Plan`)}`}
                    className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center transition-all ${
                      plan.recommended
                        ? 'bg-accent text-white shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-foreground/5 text-foreground hover:bg-foreground hover:text-background hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const activeSubData = activeData?.subCategories?.find((sub) => sub.id === activeSubCategory);

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 relative">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto mb-12 gap-8 px-4">
        <div className="text-center md:text-left max-w-2xl space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Transparent <span className="text-accent">Pricing</span>
          </h2>
          <p className="text-lg text-foreground/70">
            Responsive, SEO-optimized & secure solutions tailored for your business needs. Choose the perfect plan to accelerate your digital growth.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
          {/* Currency Switcher */}
          <div className="flex items-center p-1.5 glass-panel border border-glass-border rounded-full shadow-lg bg-background/50 backdrop-blur-md">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                currency === 'INR' ? 'bg-accent text-white shadow-md' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                currency === 'USD' ? 'bg-accent text-white shadow-md' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              USD ($)
            </button>
          </div>
          
          <button 
            onClick={() => {
              document.body.classList.add('print-pricing-only');
              window.print();
              setTimeout(() => {
                document.body.classList.remove('print-pricing-only');
              }, 1000);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-accent transition-colors no-print"
          >
            <Download className="w-4 h-4" />
            Download Pricing
          </button>
        </div>
      </div>

      {/* PRIMARY TABS FILTER - Hide if filtered by serviceSlug */}
      {!isFiltered && (
        <div className="w-full overflow-x-auto no-scrollbar mb-12 px-6 sm:px-8 py-6 snap-x">
          <div className="flex gap-3 w-max md:w-full md:flex-wrap md:justify-center">
            {pricingData.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 shrink-0 snap-center px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 border ${
                    isActive
                      ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105'
                      : 'glass-panel border-glass-border text-foreground/75 hover:bg-white/10 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full"
          id="pricing-print-area"
        >
          {/* SECONDARY SUB-TABS (PILL BUTTONS) */}
          {activeData?.subCategories && activeData.subCategories.length > 0 && (
            <div className="w-full overflow-x-auto no-scrollbar mb-12 px-6 sm:px-8 py-6 snap-x">
              <div className="flex gap-3 w-max md:w-full md:flex-wrap md:justify-center">
                {activeData.subCategories.map((sub) => {
                  const isSubActive = activeSubCategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCategory(sub.id)}
                      className={`shrink-0 snap-center px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
                        isSubActive
                          ? 'bg-accent/15 text-accent border-accent shadow-[0_0_20px_rgba(14,165,233,0.25)] scale-105'
                          : 'bg-white/5 text-foreground/75 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-foreground'
                      }`}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubCategory || 'simple'}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* SIMPLE CATEGORY RENDERING (Direct Plans) */}
              {activeData?.isSimple && activeData.plans && (
                <div className="space-y-16">
                  {renderPlansGrid(activeData.plans, activeData.id)}
                  
                  {/* Banner */}
                  {activeData.banner && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="max-w-5xl mx-auto pt-8"
                    >
                      <div className="bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl shadow-emerald-500/20 border border-emerald-400/30 text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide">
                          {activeData.banner.split(' = ')[0]} = <span className="text-emerald-100">{convertToUSD(activeData.banner.split(' = ')[1].split(' | ')[0], currency)}</span>
                        </h3>
                        <p className="text-emerald-50 font-medium text-sm md:text-base">
                          {convertToUSD(activeData.banner.split(' | ')[1], currency)} <span className="mx-2">•</span> {activeData.banner.split(' | ')[2]}
                        </p>
                        <div className="mt-6">
                          <Link
                            href={`/contact?subject=${encodeURIComponent(`Inquiry for Complete Package (${activeData.banner.split(' = ')[0]})`)}`}
                            className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-white text-emerald-700 font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                          >
                            Claim Complete Package
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* COMPLEX CATEGORY RENDERING (via activeSubData) */}
              {activeSubData && (
                <>
                  {/* Cards Type Sub-category */}
                  {activeSubData.type === 'cards' && activeSubData.plans && (
                    renderPlansGrid(activeSubData.plans, activeSubData.id)
                  )}

                  {/* List Type Sub-category */}
                  {activeSubData.type === 'list' && activeSubData.services && (
                    <div className="max-w-5xl mx-auto space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {activeSubData.services.map((service, idx) => (
                          <motion.div
                            key={service.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="group"
                          >
                            <div className="relative p-[1px] rounded-2xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] group-hover:scale-[1.01]">
                              <div className="absolute inset-0 bg-gradient-to-r from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <GlassCard className="relative p-6 bg-background/80 backdrop-blur-xl border-white/10 group-hover:border-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full">
                                <div className="flex-1">
                                  <h4 className="font-bold text-foreground text-lg group-hover:text-accent transition-colors duration-300">{service.name}</h4>
                                  <p className="text-sm text-foreground/70 mt-1.5 leading-relaxed">{service.description}</p>
                                </div>
                                <div className="text-left sm:text-right shrink-0 mt-4 sm:mt-0 p-4 sm:p-0 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none">
                                  <div className="text-2xl font-extrabold text-foreground">
                                    {convertToUSD(service.basePrice, currency)}
                                  </div>
                                  <div className="text-xs text-foreground/50 font-medium mt-1">
                                    {convertToUSD(service.withGst, currency)} (incl. GST)
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent mt-3 sm:justify-end">
                                    <Clock className="w-4 h-4" />
                                    <span>{service.duration}</span>
                                  </div>
                                </div>
                              </GlassCard>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="text-center pt-8">
                        <Link
                          href={`/contact?subject=${encodeURIComponent(`Inquiry for ${activeSubData.label} Service`)}`}
                          className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-accent text-white font-semibold text-sm shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                          Request {activeSubData.label} Service
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>

      {/* Trust Badges */}
      <div className="mt-20 pt-12 border-t border-glass-border">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
          <div className="flex items-center gap-3 text-foreground/80 font-semibold text-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <div className="flex flex-col">
              <span>100% Secure</span>
              <span className="text-xs font-normal opacity-70">Bank-grade Security</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foreground/80 font-semibold text-sm">
            <Award className="w-8 h-8 text-accent" />
            <div className="flex flex-col">
              <span>Premium Quality</span>
              <span className="text-xs font-normal opacity-70">Top-rated Agency</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foreground/80 font-semibold text-sm">
            <Lock className="w-8 h-8 text-blue-500" />
            <div className="flex flex-col">
              <span>No Hidden Fees</span>
              <span className="text-xs font-normal opacity-70">Transparent Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 glass-panel rounded-full mb-4">
            <HelpCircle className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <GlassCard key={idx} className="overflow-hidden transition-all duration-300 hover:border-white/20">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-accent" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-foreground/70 leading-relaxed text-sm"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}
