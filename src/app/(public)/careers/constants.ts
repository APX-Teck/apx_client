export const jsonLdCareersPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://apxteck.com/careers/#webpage',
  name: 'Careers at APXTeck - Join Our Elite Team',
  description: 'Explore exciting career opportunities at APXTeck. Join our elite team of Next.js software engineers, designers, and SEO experts in Pune.',
  url: 'https://apxteck.com/careers',
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
      name: 'Careers',
      item: 'https://apxteck.com/careers',
    },
  ],
};

export const jsonLdJobPostings = [
  {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Senior Frontend Developer (Next.js)',
    description: '<p>We are looking for an elite Next.js developer to build highly performant and stunning web applications.</p>',
    datePosted: '2024-06-21',
    validThrough: '2024-12-31',
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'APXTeck',
      sameAs: 'https://apxteck.com',
      logo: 'https://apxteck.com/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411041',
        addressCountry: 'IN',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Backend Engineer (Node.js)',
    description: '<p>Join our team to design, build, and maintain scalable backend services and RESTful APIs using Node.js and PostgreSQL.</p>',
    datePosted: '2024-06-21',
    validThrough: '2024-12-31',
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'APXTeck',
      sameAs: 'https://apxteck.com',
      logo: 'https://apxteck.com/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411041',
        addressCountry: 'IN',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'SEO Specialist',
    description: '<p>We need an expert to drive our technical SEO strategies and help our clients dominate search engine rankings.</p>',
    datePosted: '2024-06-21',
    validThrough: '2024-12-31',
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'APXTeck',
      sameAs: 'https://apxteck.com',
      logo: 'https://apxteck.com/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411041',
        addressCountry: 'IN',
      },
    },
  }
];
