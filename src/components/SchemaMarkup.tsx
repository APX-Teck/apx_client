export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "APXTeck",
    "url": "https://www.apxteck.com",
    "logo": "https://www.apxteck.com/logo.png", // Ensure this path is valid
    "sameAs": [
      "https://www.linkedin.com/company/apxteck",
      "https://twitter.com/apxteck",
      "https://github.com/apxteck",
      "https://www.instagram.com/apxteck"
    ],
    "areaServed": [
      { "@type": "Place", "name": "India" },
      { "@type": "Place", "name": "Maharashtra" },
      { "@type": "Place", "name": "Karnataka" },
      { "@type": "Place", "name": "Telangana" },
      { "@type": "Place", "name": "Tamil Nadu" },
      { "@type": "Place", "name": "Gujarat" },
      { "@type": "Place", "name": "Delhi NCR" }
    ],
    "description": "APXTeck is a premium IT solutions, web development, UI/UX, and SEO agency serving Clinics, Restaurants, Hotels, Real Estate Builders, CA, Manufacturers, E-commerce sellers, Startups, and more across India.",
    "knowsAbout": [
      "Enterprise Digital Transformation",
      "Software Development",
      "Web Development",
      "Next.js",
      "Node.js",
      "B2B Software Solutions",
      "E-commerce Platforms"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
