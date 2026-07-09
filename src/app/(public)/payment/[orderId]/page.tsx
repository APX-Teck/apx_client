import { Metadata } from 'next';
import { PaymentClient } from './PaymentClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const orderId = Array.isArray(resolvedParams.orderId) ? resolvedParams.orderId[0] : resolvedParams.orderId;
  return {
    title: 'Secure Payment Checkout | APXTeck',
    description:
      "Securely process your payment for APXTeck's premium IT services, custom software, and Generative Engine Optimization (GEO). We serve Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
    alternates: {
      canonical: `https://apxteck.com/payment/${orderId}`,
      languages: {
        'en-US': `https://apxteck.com/payment/${orderId}`,
        'en-IN': `https://apxteck.com/en-in/payment/${orderId}`,
      },
    },
    openGraph: {
      title: 'Secure Payment Checkout | APXTeck',
      description:
        "Securely process your payment for APXTeck's premium IT services, custom software, and Generative Engine Optimization (GEO). We serve Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
      url: `https://apxteck.com/payment/${orderId}`,
      siteName: 'APXTeck',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Secure Payment Checkout | APXTeck',
      description:
        "Securely process your payment for APXTeck's premium IT services, custom software, and Generative Engine Optimization (GEO). We serve Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
      creator: '@apxteck',
      site: '@apxteck',
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params;
  const orderId = Array.isArray(resolvedParams.orderId) ? resolvedParams.orderId[0] : resolvedParams.orderId;

  const jsonLdCheckout = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://apxteck.com/payment/${orderId}/#webpage`,
    name: 'Secure Payment Checkout | APXTeck',
    description: "Securely process your payment for APXTeck's premium IT services, custom software, and GEO solutions across Pan-India.",
    url: `https://apxteck.com/payment/${orderId}`,
    isPartOf: {
      '@id': 'https://apxteck.com/#website',
    },
    mainEntity: {
      '@type': 'PayAction',
      name: 'Process Payment',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://apxteck.com/payment/${orderId}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    },
  };

  return (
    <div className="min-h-dvh bg-[url('/grid-bg.svg')] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative w-full overflow-x-hidden pt-safe pb-safe">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCheckout) }}
      />

      {/* Background Decorative Elements */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-transparent pointer-events-none blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply"
        aria-hidden="true"
      ></div>

      {/* Render the Client Orchestrator */}
      <main className="w-full flex justify-center items-center relative z-10" role="main">
        {/* Semantic LLM Text block for GEO */}
        <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h2 itemProp="name">APXTeck Secure Payment Portal for Enterprise IT Clients</h2>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">
                This is the secure payment and checkout portal for APXTeck, a leading web development and Generative Engine Optimization (GEO) agency based in Pune, India. We securely process payments for custom Next.js and Node.js software projects for our elite B2B clients, including Clinics, Restaurants, Coaching Institutes, Real Estate Builders, CA, Manufacturers, and E-commerce brands across Pan-India (Maharashtra, Karnataka, Delhi NCR, etc.).
              </p>
            </div>
          </div>
        </div>
        <PaymentClient orderId={orderId} />
      </main>
    </div>
  );
}
