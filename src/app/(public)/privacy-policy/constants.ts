export const jsonLdPrivacyPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://apxteck.com/privacy-policy/#webpage',
  name: 'Privacy Policy | APXTeck',
  description: 'Learn how APXTeck collects, uses, and protects your personal data. Read our comprehensive Privacy Policy for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
  url: 'https://apxteck.com/privacy-policy',
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
      name: 'Privacy Policy',
      item: 'https://apxteck.com/privacy-policy',
    },
  ],
};
