import { Service } from '@/app/types/service.types';

export const getServicesPageSchema = (services: Service[]) => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://apxteck.com/services/#webpage',
        url: 'https://apxteck.com/services',
        name: 'IT Services for SMBs — APXTECK',
        description:
          "Browse APXTeck's premium IT services: Custom Next.js Web Development, Generative Engine Optimization (GEO), and Digital Marketing tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
        inLanguage: 'en-IN',
        isPartOf: {
          '@id': 'https://apxteck.com/#website',
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: services.map((s, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            provider: {
              '@type': 'Organization',
              name: 'APXTeck',
              url: 'https://apxteck.com',
              logo: 'https://apxteck.com/logo.png',
            },
            url: `https://apxteck.com/services/${s.slug}`,
            offers: s.price
              ? {
                  '@type': 'Offer',
                  price: s.price.replace(/[^0-9]/g, ''),
                  priceCurrency: 'INR',
                }
              : undefined,
          },
        })),
      },
      {
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
            name: 'Services',
            item: 'https://apxteck.com/services/',
          },
        ],
      },
    ],
  };
};
