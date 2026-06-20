export const jsonLdTermsPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://apxteck.com/terms-of-service/#webpage',
  name: 'Terms of Service | APXTeck',
  description: 'Read the Terms of Service for APXTeck. These terms govern the use of our web development, custom software, and SEO services.',
  url: 'https://apxteck.com/terms-of-service',
  isPartOf: {
    '@id': 'https://apxteck.com/#website',
  },
  mainEntity: {
    '@id': 'https://apxteck.com/#localbusiness',
  },
};

export const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://apxteck.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Terms of Service',
      item: 'https://apxteck.com/terms-of-service',
    },
  ],
};
