export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://apxteck.com/login/#webpage',
  name: 'Sign In to Your Dashboard | APXTeck',
  description:
    'Securely sign in to your APXTeck account. Access your custom web development dashboard, IT services, and project management tools tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
  url: 'https://apxteck.com/login',
  isPartOf: {
    '@id': 'https://apxteck.com/#website',
  },
  publisher: {
    '@type': 'Organization',
    '@id': 'https://apxteck.com/#localbusiness',
    name: 'APXTeck',
    url: 'https://apxteck.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://apxteck.com/logo.png',
    },
  },
  mainEntity: {
    '@type': 'Action',
    name: 'Sign In',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://apxteck.com/login',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
  },
};
