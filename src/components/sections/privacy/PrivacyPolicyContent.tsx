'use client';

import { Shield, Database, Lock, Eye, Mail, FileText, Server, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function PrivacyPolicyContent() {
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <Shield className="w-6 h-6 text-accent" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            Welcome to APXTeck ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. As a premium web development, custom software engineering, and technical SEO agency, we handle sensitive project information and client data with the utmost care.
          </p>
          <p>
            This privacy policy applies to all information collected through our website (apxteck.com), our client dashboard, and any related IT consulting and development services we provide.
          </p>
        </div>
      ),
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      icon: <Database className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>We may collect, use, store and transfer different kinds of personal data to deliver our custom IT solutions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity & Contact Data:</strong> Includes first name, last name, username, billing address, email address, and telephone numbers.</li>
            <li><strong>Project & Business Data:</strong> Includes your business requirements, server/hosting credentials, API keys, source code access, and SEO analytics data provided to us during the project lifecycle.</li>
            <li><strong>Financial Data:</strong> We do not store full credit card details. Payment transactions are securely processed through our integrated payment gateways (such as Razorpay).</li>
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data for our customer dashboard, browser type and version, and operating system.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      icon: <Server className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>We will only use your personal data to deliver our professional services and ensure a seamless project experience:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Delivery:</strong> To build custom software, web applications, and mobile apps as per your requirements.</li>
            <li><strong>Account Management:</strong> To manage your account on our customer dashboard, process payments, and provide invoices.</li>
            <li><strong>SEO & Analytics:</strong> To perform search engine optimization audits and implement marketing strategies for your business.</li>
            <li><strong>Communication:</strong> To provide project updates, technical support, and respond to your inquiries.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: '4. Third-Party Services & Cookies',
      icon: <Eye className="w-6 h-6 text-orange-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            We use third-party service providers to facilitate our services. This includes cloud hosting providers (e.g., AWS, Vercel), payment processors (e.g., Razorpay), and analytics tools (e.g., Google Analytics). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          <p>
            We also use cookies to track activity on our customer dashboard and public website to hold certain information, ensuring your session remains secure and active.
          </p>
        </div>
      ),
    },
    {
      id: 'data-security',
      title: '5. Data & Code Security',
      icon: <Lock className="w-6 h-6 text-emerald-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            We take the security of your proprietary software and business data seriously. We have put in place appropriate security measures (including encryption, secure repositories, and strict access controls) to prevent your data from being accidentally lost, used, or accessed in an unauthorized way.
          </p>
          <p>
            Access to your project files, server credentials, and personal data is strictly limited to the developers and project managers actively working on your account.
          </p>
        </div>
      ),
    },
    {
      id: 'your-rights',
      title: '6. Your Legal Rights',
      icon: <FileText className="w-6 h-6 text-rose-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal data stored on our dashboard.</li>
            <li>Request correction of inaccurate project or billing information.</li>
            <li>Request erasure of your personal data after the termination of our service contracts.</li>
            <li>Request the secure transfer of your digital assets and credentials back to your complete control.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'contact',
      title: '7. Contact Us',
      icon: <Mail className="w-6 h-6 text-accent" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:
          </p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> info@apxteck.com</li>
            <li><strong>Phone:</strong> +91 94052 82582</li>
            <li><strong>Address:</strong> FL NO-F2-1006 SR NO-296/4, REVELL ORCHID, Lohogaon, Pune City, Pune- 411047, Maharashtra</li>
          </ul>
        </div>
      ),
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Accounts for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-16 relative items-start">
      
      {/* Sticky Table of Contents (Desktop) */}
      <aside className="hidden lg:block lg:w-1/4 sticky top-32">
        <GlassCard className="p-6 border border-glass-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Contents</h3>
          <nav className="flex flex-col gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-left text-sm text-foreground/60 hover:text-accent transition-colors py-1"
              >
                {section.title}
              </button>
            ))}
          </nav>
        </GlassCard>
      </aside>

      {/* Main Content Area */}
      <div className="w-full lg:w-3/4 flex flex-col gap-12">
        
        {/* Header Intro */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide uppercase">
            <Globe className="w-4 h-4" />
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-foreground/60 text-lg">
            Last Updated: June 21, 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] border border-glass-border flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="bg-foreground/[0.01] border border-glass-border rounded-[1.25rem] p-6 md:p-8">
                {section.content}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
