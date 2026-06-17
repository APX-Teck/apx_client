export const registerPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Create Account | APXTeck',
  description: 'Join APXTeck as a client partner and launch your digital projects with our expert software solutions.',
  url: 'https://apxteck.com/register',
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
    name: 'APXTeck',
    url: 'https://apxteck.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://apxteck.com/logo.png',
    },
  },
};
