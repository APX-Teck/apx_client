import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactPageSection } from '@/components/sections/ContactPageSection';
import { api } from '@/lib/axios';
import { Suspense } from 'react';
import { jsonLdLocalBusiness, jsonLdContactPage, jsonLdBreadcrumb } from './constants';

async function ContactSectionLoader() {
  try {
    const services = await api.fetchServices();
    return <ContactPageSection services={services} />;
  } catch (err) {
    console.error('Failed to load services for contact page', err);
    return null; // Or return an error state UI
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us for Web Development & SEO | APX - Advanced Precision & Excellence',
    description:
      'Contact APXTeck for custom software, web design, mobile apps, and search engine optimization. Get a free consultation and a detailed project roadmap.',
    keywords:
      'contact APXTeck, software development consultation, hire developers Pune, web design agency contact',
    alternates: {
      canonical: 'https://apxteck.com/contact',
      languages: {
        'en-US': 'https://apxteck.com/contact',
        'en-IN': 'https://apxteck.com/en-in/contact',
      },
    },
    openGraph: {
      title: 'Contact Us for Web Development & SEO | APX - Advanced Precision & Excellence',
      description:
        'Contact APXTeck for custom software, web design, mobile apps, and search engine optimization. Get a free consultation and a detailed project roadmap.',
      url: 'https://apxteck.com/contact',
      siteName: 'APX - Advanced Precision & Excellence',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://apxteck.com/og-contact.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Contact Us for IT Solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us for Web Development & SEO | APX - Advanced Precision & Excellence',
      description:
        'Get in touch with APXTeck for premium software development and SEO consultancies.',
      creator: '@apxteck',
      site: '@apxteck',
      images: ['https://apxteck.com/twitter-contact.jpg'],
    },
  };
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContactPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Navbar />

      <main
        className="flex-1 pt-20 md:pt-24 pb-safe w-full overflow-x-hidden"
        id="main-content"
        role="main"
      >
        <article
          itemScope
          itemType="https://schema.org/ContactPage"
          className="w-full flex flex-col"
        >
          <Suspense
            fallback={
              <div className="min-h-dvh pt-12 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
              </div>
            }
          >
            <ContactSectionLoader />
          </Suspense>
        </article>
      </main>

      <Footer />
    </div>
  );
}
