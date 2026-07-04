import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Disclaimer | APXTeck',
    description: 'Read the official disclaimer for APX - Advanced Precision & Excellence.',
    alternates: {
      canonical: 'https://apxteck.com/disclaimer',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 relative overflow-x-hidden w-full max-w-4xl mx-auto px-6" role="main">
        <MouseSpotlight />
        
        <article className="prose prose-invert max-w-none mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Disclaimer</h1>
          
          <p className="text-foreground/80 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">1. General Information</h2>
          <p className="text-foreground/80 mb-6">
            The information provided by APXTeck ("we," "us," or "our") on https://apxteck.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Professional Disclaimer</h2>
          <p className="text-foreground/80 mb-6">
            The Site cannot and does not contain IT or legal advice. The IT, software development, and SEO information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional IT/legal advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. External Links Disclaimer</h2>
          <p className="text-foreground/80 mb-6">
            The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Testimonials Disclaimer</h2>
          <p className="text-foreground/80 mb-6">
            The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Contact Us</h2>
          <p className="text-foreground/80 mb-6">
            If you have any feedback, comments, requests for technical support, or other inquiries, please contact us by email: info@apxteck.com.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
