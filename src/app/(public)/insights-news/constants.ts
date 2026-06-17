import { Newspaper, TrendingUp, MonitorSmartphone } from 'lucide-react';

export const jsonLdBlog = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://apxteck.com/insights-news/#blog',
  name: 'APXTeck IT Insights & News',
  description:
    "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials.",
  url: 'https://apxteck.com/insights-news',
  publisher: {
    '@type': 'Organization',
    name: 'APXTeck',
    logo: {
      '@type': 'ImageObject',
      url: 'https://apxteck.com/logo.png',
    },
  },
  inLanguage: 'en-IN',
};

export const jsonLdBreadcrumb = {
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
      name: 'Insights & News',
      item: 'https://apxteck.com/insights-news',
    },
  ],
};

export const knowledgeCategories = [
  {
    title: 'Technology & Code',
    description: 'Deep dives into Next.js, advanced frontend architecture, backend scaling, and clean code principles.',
    icon: MonitorSmartphone,
    color: '#0ea5e9', // Cyan
  },
  {
    title: 'Business & Scaling',
    description: 'Insights on how technology drives ROI, automates manual processes, and scales Indian SMBs into enterprise players.',
    icon: TrendingUp,
    color: '#10b981', // Emerald
  },
  {
    title: 'Digital News',
    description: 'The latest updates from APXTeck, industry tech trends, algorithm updates, and what they mean for your business.',
    icon: Newspaper,
    color: '#8b5cf6', // Purple
  },
];
