import { Lightbulb, Code2, Rocket } from 'lucide-react';
import { Portfolio } from '@/app/types/portfolio.types';

export const deliveryPhilosophy = [
  {
    title: '1. Strategic Blueprint',
    description:
      "We don't start coding blindly. We analyze your market, competitors, and technical requirements to create a robust, scalable architecture blueprint.",
    icon: Lightbulb,
    color: '#0ea5e9', // Cyan
  },
  {
    title: '2. Modular Engineering',
    description:
      'We develop your product using strictly typed, component-driven frameworks like Next.js and Tailwind, ensuring lightning-fast performance and zero tech debt.',
    icon: Code2,
    color: '#8b5cf6', // Purple
  },
  {
    title: '3. Market Deployment',
    description:
      'We deploy on global edge networks with heavy SEO optimizations, guaranteeing your product reaches its target audience from day one.',
    icon: Rocket,
    color: '#ec4899', // Pink
  },
];

export const generatePortfolioItemListSchema = (portfolios: Portfolio[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'APXTeck Case Studies',
  description: "A collection of APXTeck's best work and case studies.",
  numberOfItems: portfolios.length,
  itemListElement: portfolios.map((p, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: p.title,
      headline: p.title,
      description: p.problem || p.results,
      url: `https://apxteck.com/portfolio/${p.slug}`,
    },
  })),
});

export const portfolioBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://apxteck.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Portfolio',
      item: 'https://apxteck.com/portfolio',
    },
  ],
};

export const portfolioCollectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://apxteck.com/portfolio/#webpage',
  name: 'Case Studies & Work Portfolio | APXTeck',
  description:
    "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and Generative Engine Optimization (GEO) for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
  url: 'https://apxteck.com/portfolio',
  isPartOf: {
    '@id': 'https://apxteck.com/#website',
  },
  publisher: {
    '@type': 'Organization',
    '@id': 'https://apxteck.com/#localbusiness',
    name: 'APXTeck',
    logo: {
      '@type': 'ImageObject',
      url: 'https://apxteck.com/logo.png',
    },
  },
};
