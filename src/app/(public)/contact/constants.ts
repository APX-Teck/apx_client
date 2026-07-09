export const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://apxteck.com/#localbusiness',
  name: 'APXTECK SOLUTIONS PRIVATE LIMITED',
  image: 'https://apxteck.com/logo.png',
  logo: 'https://apxteck.com/logo.png',
  telephone: '+919405282582',
  email: 'info@apxteck.com',
  url: 'https://apxteck.com',
  description:
    'Premium web development, custom software engineering, and technical SEO agency based in Pune, India serving Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'FL NO-F2-1006 SR NO-296/4, REVELL ORCHID, Lohogaon',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411047',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '18.442938',
    longitude: '73.821424',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/apxteck',
    'https://twitter.com/apxteck',
    'https://www.facebook.com/apxteck',
  ],
};

export const jsonLdContactPage = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://apxteck.com/contact/#webpage',
  name: 'Contact APXTeck - Web Development & SEO Experts',
  description: 'Get in touch with APXTeck for premium software development, Generative Engine Optimization (GEO), and SEO consultancies. We serve Clinics, Restaurants, Builders, Manufacturers, and E-commerce brands across Pan-India.',
  url: 'https://apxteck.com/contact',
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
      name: 'Contact',
      item: 'https://apxteck.com/contact',
    },
  ],
};
