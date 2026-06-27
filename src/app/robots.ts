import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apxteck.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth/', '/forgot-password', '/reset-password', '/login', '/register', '/payment/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'ClaudeBot', 'PerplexityBot'],
        allow: ['/'],
        disallow: ['/admin', '/api', '/auth/', '/forgot-password', '/reset-password', '/login', '/register', '/payment/'],
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
