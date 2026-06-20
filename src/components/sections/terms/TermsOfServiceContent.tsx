'use client';

import { FileSignature, Code2, Users, CreditCard, Clock, Wrench, AlertTriangle, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function TermsOfServiceContent() {
  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      icon: <FileSignature className="w-6 h-6 text-accent" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("Client", "you"), and APXTeck ("Company", "we", "us", or "our"), concerning your access to and use of our IT consulting, custom software development, web design, and SEO services.
          </p>
          <p>
            By accessing our customer dashboard or initiating a project with us, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using our services.
          </p>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: '2. Intellectual Property Rights',
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            <strong>Upon Final Payment:</strong> Once all project milestones and final invoices have been settled in full via our billing system, APXTeck transfers all intellectual property rights of the custom-developed source code, designs, and digital assets to the Client.
          </p>
          <p>
            <strong>Pre-existing Code & Open Source:</strong> Any pre-existing APXTeck proprietary libraries, third-party APIs, or open-source frameworks (e.g., Next.js, TailwindCSS) used within the project remain the intellectual property of their respective owners. We grant you a non-exclusive, perpetual license to use these pre-existing components as part of the delivered software.
          </p>
        </div>
      ),
    },
    {
      id: 'client-responsibilities',
      title: '3. Client Responsibilities',
      icon: <Users className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>For the successful delivery of software and SEO services, the Client agrees to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide timely feedback and approvals on design mockups, prototypes, and milestones through our customer dashboard.</li>
            <li>Supply all necessary digital assets, branding guidelines, content, and server access credentials required for project execution.</li>
            <li>Ensure that any materials provided to APXTeck do not infringe on the intellectual property rights of third parties.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'payments',
      title: '4. Payments, Fees, and Refunds',
      icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            <strong>Payment Processing:</strong> All project payments, milestone invoices, and retainer fees are processed securely via our integrated payment gateway (Razorpay) accessible within your client dashboard.
          </p>
          <p>
            <strong>Payment Schedules:</strong> Custom software projects generally require a non-refundable upfront deposit before work commences. Subsequent payments are tied to agreed-upon project milestones.
          </p>
          <p>
            <strong>Refunds & Cancellations:</strong> Due to the custom nature of our IT services, payments made for work already completed are strictly non-refundable. If a project is cancelled by the Client prior to completion, APXTeck retains the right to bill for all hours logged and resources expended up to the cancellation date.
          </p>
        </div>
      ),
    },
    {
      id: 'timelines',
      title: '5. Project Timelines & Delays',
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            APXTeck will make every reasonable commercial effort to meet the estimated project timelines. However, software development is highly dynamic. Delays may occur due to scope changes, unforeseen technical challenges, or delayed client feedback.
          </p>
          <p>
            APXTeck shall not be held liable for any business losses, loss of profits, or damages resulting from project delays.
          </p>
        </div>
      ),
    },
    {
      id: 'maintenance',
      title: '6. Revisions, Maintenance, and Support',
      icon: <Wrench className="w-6 h-6 text-teal-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            <strong>Revisions:</strong> Our project proposals outline a specific number of revision rounds for UI/UX designs. Additional revisions outside the agreed scope will be billed at our standard hourly rate.
          </p>
          <p>
            <strong>Post-Launch Support:</strong> Upon project deployment, we provide a standard 30-day bug-fix warranty period. This covers critical functionality issues but does not cover new feature requests or third-party API changes.
          </p>
          <p>
            <strong>Ongoing Maintenance:</strong> Long-term SEO management, server monitoring, and software updates require an active Monthly Retainer Agreement.
          </p>
        </div>
      ),
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability',
      icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
      content: (
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            To the fullest extent permitted by law, APXTeck shall not be liable for any indirect, consequential, incidental, special, or punitive damages, including lost profits or lost data, arising from or related to the use of our software deliverables, SEO strategies, or website hosting services.
          </p>
          <p>
            Our total liability to you for any claims arising from our services will at all times be limited to the amount you paid to APXTeck for the specific project or service in dispute.
          </p>
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
            Terms of Service
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
