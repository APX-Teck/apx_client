export const jsonLdForgotPassword = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Forgot Password - APXTeck Secure Access',
  description:
    'Securely reset your APXTeck account password. Regain access to your customized web development dashboard tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
  url: 'https://apxteck.com/forgot-password',
  isPartOf: {
    '@id': 'https://apxteck.com/#website',
  },
  publisher: {
    '@type': 'Organization',
    name: 'APXTeck',
    logo: 'https://apxteck.com/logo.png',
    url: 'https://apxteck.com',
  },
  mainEntity: {
    '@type': 'Action',
    name: 'Reset Password',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://apxteck.com/forgot-password',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
  },
};
