export const registerPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://apxteck.com/register/#webpage',
  name: 'Create Account | APXTeck',
  description:
    'Join APXTeck as a client partner and launch your digital projects with our expert software solutions. We specialize in empowering Clinics, Coaching Classes, Restaurants, Real Estate Builders, CA, Manufacturers, and E-commerce brands across Pan-India with Generative Engine Optimization (GEO) and Custom Web Apps.',
  url: 'https://apxteck.com/register',
  isPartOf: {
    '@id': 'https://apxteck.com/#website',
  },
  mainEntity: {
    '@type': 'RegisterAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://apxteck.com/register',
      inLanguage: 'en-US',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
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
};
