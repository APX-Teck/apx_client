import { Portfolio } from '@/app/types/portfolio.types';

export const generateArticleSchema = (project: Portfolio, slug: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `${project.clientName} Case Study - ${project.title}`,
  description: project.problem || project.results,
  image: project.coverImageUrl,
  author: {
    '@type': 'Organization',
    name: 'APXTeck',
    url: 'https://apxteck.com'
  },
  publisher: {
    '@type': 'Organization',
    name: 'APXTeck',
    logo: {
      '@type': 'ImageObject',
      url: 'https://apxteck.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://apxteck.com/portfolio/${slug}`
  }
});

export const generateDetailBreadcrumbSchema = (project: Portfolio, slug: string) => ({
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
    {
      '@type': 'ListItem',
      position: 3,
      name: project.clientName || 'Case Study',
      item: `https://apxteck.com/portfolio/${slug}`,
    },
  ],
});
