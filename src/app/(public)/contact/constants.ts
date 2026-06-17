export const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'APXTeck',
  image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3',
  telephone: '+919405282582',
  email: 'info@apxteck.com',
  url: 'https://apxteck.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411041',
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
};

export const jsonLdContactPage = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact APXTeck',
  description: 'Get in touch with APXTeck for premium software development and SEO consultancies.',
  url: 'https://apxteck.com/contact',
  mainEntity: {
    '@id': 'https://apxteck.com/#organization',
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
