import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { AuthProvider } from '@/providers/AuthProvider';
import { GoogleTranslateCleaner } from '@/components/ui/GoogleTranslateCleaner';
import { QueryProvider } from '@/providers/QueryProvider';
import { Analytics } from '@vercel/analytics/next';
import { SchemaMarkup } from '@/components/SchemaMarkup';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { CustomCursor } from '@/components/ui/CustomCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'APX - Advanced Precision & Excellence',
  description: 'APX - Advanced Precision & Excellence. Premium IT solutions, web development, UI/UX, and SEO services.',
  keywords: [
    'apxteck', 'apx teck', 'apxteck pune', 'apxteck agency', 'apx technology',
    'custom web development pune', 'web development agency pune', 'next js development agency',
    'node js backend developers', 'react js development company', 'full stack web development pune',
    'ui ux design agency pune', 'premium ui ux design', 'glassmorphic design services',
    'seo services pune', 'generative engine optimization india', 'geo agency pune',
    'custom website development india', 'enterprise digital transformation', 'high performance web architecture',
    'smb web development india', 'web development for clinics', 'web development for real estate',
    'corporate visual marketing', 'professional video editing pune', 'affordable web maintenance',
    'ecommerce website developers pune', 'fast loading websites', 'secure web applications',
    'it partner in india', 'next js isr performance', 'custom software development pune',
    'b2b it services india', 'whatsapp business api integration', 'wati integration services',
    'interakt api setup', 'automated business messaging', 'prisma orm developers',
    'postgresql database development', 'docker and kubernetes deployment', 'typescript web developers',
    'tailwindcss web designers', 'digital transformation for retail', 'educational multimedia content creation',
    'corporate event marketing services', 'restaurant website development', 'coaching institute website design',
    'hospital web development pune', 'dark theme ui design', 'high contrast web design',
    'modern tech aesthetic websites', 'web developers in punawale', 'digital agency in chandigarh',
    'pan india web development agency', 'software agency in narhe', 'graphic design services pune',
    'corporate logo design agency', 'social media reels editing pune', 'youtube video editing services',
    'motion graphics and video editing', 'technical seo agency pune', 'on page optimization services',
    'monthly seo retainer packages', 'custom dashboards for smb', 'brand identity design services',
    'website migration services', 'progressive web app developers', 'business automation services pune',
    'saas application development india', 'b2b portal development company', 'custom crm development pune',
    'aws cloud hosting services', 'api development and integration', 'headless cms development',
    'vercel deployment services', 'landing page design agency', 'startup mvp development india',
    'website speed optimization services', 'conversion rate optimization agency', 'lead generation website design',
    'responsive web design company', 'mobile friendly website developers', 'software development in mumbai',
    'web developers in delhi ncr', 'it agency in bangalore', 'tech partner in gujarat',
    'custom web apps telangana', 'corporate branding materials', 'promotional video makers pune',
    'social media creatives design', 'custom brochure design services', 'business banner design',
    'website redesign services india', 'secure database architecture', 'custom admin panel development',
    'role based access control systems', 'backend migration services', 'ecommerce storefront development',
    'logistics software development', 'it solutions for chartered accountants', 'manufacturing business website design',
    'interior designer portfolio websites', 'b2c digital marketing services', 'web development in hinjewadi',
    'software company in pimpri chinchwad', 'it agency in kharadi', 'web design services in baner',
    'tech startup consulting india', 'rest api development services', 'graphql api developers',
    'figma to nextjs conversion', 'psd to react js development', 'custom payment gateway integration',
    'razorpay api integration expert', 'stripe integration services', 'microservices architecture development',
    'agile software development firm', 'hire dedicated tech team india', 'outsourced frontend developers',
    'hire backend developers pune', 'educational explainer video creators', 'physics concept animation services',
    'corporate photography and branding', 'pitch deck design services', 'business proposal document design',
    'product requirements document creation', 'custom web forms and automation', 'automated lead management systems',
    'high end corporate software', 'futuristic web design services', 'neon color palette ui design',
    'interactive micro animations web', 'blur shadow glassmorphic ui', 'decoupled typescript architecture',
    'ecommerce checkout optimization', 'inventory management software development', 'multi vendor marketplace development',
    'blog and cms development', 'local business seo optimization', 'google my business setup and seo',
    'white hat link building services', 'social media banner designers', 'youtube thumbnail design agency',
    'promotional marketing posters', 'corporate brand guidelines design', 'user flow wireframing services',
    'high fidelity ui prototyping', 'website security audit services', 'plugin update and maintenance',
    'regular website backup services', 'web apps for healthcare clinics', 'real estate property listing websites',
    'event management website builders', 'ticket booking platform development', 'booking system integration',
    'custom calendar scheduling app', 'web portals for coaching classes', 'video streaming platform development',
    'it infrastructure setup for smb', 'cloud architecture consulting', 'web deployment automation',
    'custom erp development india', 'advanced precision and excellence tech', 'outsource web development to india',
    'best it agency in maharashtra', 'top web designers in karnataka', 'digital solutions in tamil nadu',
    'hire full stack team for smb', 'website developer near me', 'web design company near me',
    'ecommerce website maker', 'hire someone to build a website', 'create a website for my business',
    'website revamp services', 'fix my slow website', 'hire react developer online',
    'top web development companies in india', 'website developers for small business', 'cost to build an ecommerce website',
    'custom software company near me', 'digital marketing agency near me', 'local seo services near me',
    'logo maker agency pune', 'hire video editor for reels', 'freelance web developer pune',
    'b2b website design services', 'b2c ecommerce website developers', 'seo packages in india',
    'website maintenance cost per month', 'hire node js expert', 'convert figma to react',
    'build dashboard for my business', 'best web developers in kothrud', 'it company in viman nagar',
    'software developers in wakad', 'medical website design company', 'real estate portal development',
    'builders and developers website design', 'restaurant menu website maker', 'wordpress to nextjs migration',
    'php to nodejs migration', 'hire frontend developer on contract', 'backend api developer hire',
    'speed up react website', 'core web vitals optimization service', 'seo friendly website design',
    'youtube channel management agency', 'instagram marketing agency pune', 'digital partner for local business',
    'it outsourcing company india', 'custom business software solutions', 'healthcare software developers',
    'gym and fitness website design', 'salon and spa booking website', 'hotel booking website developers',
    'lawyer website design services', 'travel agency website development', 'school and college website design',
    'best web development company in pune', 'top 10 software companies in pune', 'fastest web development agency india',
    'top rated seo company in pune', 'best ui ux designers in maharashtra', 'hire full stack development team',
    'premium custom web development', 'top web development agencies for startups', 'best ecommerce website developers in india',
    'trusted web maintenance company', 'professional website builders for local business', 'high ranking seo services india',
    'expert custom software developers near me', 'top digital transformation companies', 'best b2b website design agency',
    'affordable web development company in pune', 'best corporate branding agency', 'top video editing agency for corporate',
    'best next js developers in india', 'top node js development company', 'low cost website design for small business',
    'best web development agency for doctors', 'real estate website experts near me', 'hospital web portal developers india',
    'best web developers in shivajinagar', 'top it companies in baner pune', 'best digital marketing services in pune',
    'hire enterprise web architects', 'top generative engine optimization experts', 'best geo services company india',
    'high speed nextjs website developers', 'secure net banking integration developers', 'best tracking portal software company',
    'top mobile app and web developers', 'hire top 1% web developers india', 'best website redesign company near me',
    'top corporate profile designers', 'best social media marketing agency pune', 'hire dedicated frontend developer pune',
    'best backend architecture developers', 'top custom erp software developers', 'best packaging and logistics web design',
    'automating business process experts', 'top responsive UI UX designers', 'best dark mode website builders',
    'top modern tech design agency', 'fix google indexing issues service', 'best core web vitals consultants',
    'top ranking search engine optimization', 'best outsourced software agency pune', 'web development outsourcing to india',
    'white label web design services', 'custom web portal development company', 'enterprise grade web applications',
    'scalable cloud architecture setup', 'next generation web development', 'ai ready website development',
    'generative search optimization agency', 'llm seo optimization services', 'whatsapp automated marketing setup',
    'custom admin panel creators', 'full stack project management', 'b2b lead generation website',
    'clinic appointment booking system', 'restaurant ordering system development', 'coaching institute lms development',
    'event management web portal', 'portfolio website for actors', 'corporate headshot photography pune',
    'promotional banner design services', 'custom ui components development', 'progressive web application company',
    'seo audit and repair services', 'fix broken links website', 'website speed troubleshooting',
    'web hosting and maintenance packages', 'hire react developer for one month', 'postgresql database optimization',
    'prisma orm database design', 'scalable node js backend', 'headless ecommerce development pune',
    'custom storefront developers', 'shopify to next js migration', 'wix to custom website migration',
    'high conversion landing pages', 'corporate branding session pune', 'business card and logo design',
    'marketing material design agency', 'event tracking and expense dashboard', 'digital roadmap consulting services',
    'hire remote developer from pune', 'affordable startup website packages', 'enterprise digital solutions provider',
    'custom software for wholesale business', 'franchise store locator development', 'automated employee id generation system',
    'secure role based authentication', 'json web token integration services', 'custom api endpoints development',
    'whatsapp catalog integration', 'interactive web animations developer', 'custom booking engine development',
    'advanced caching solutions nextjs'
  ],
  icons: {
    icon: [
      { url: '/APX%2016x16.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/APX%2032x32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/APX%2048x48.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    shortcut: '/APX%2016x16.ico',
    apple: '/APX%2048x48.svg',
  },
  other: {
    'google-adsense-account': 'ca-pub-2044879253308502',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col transition-colors duration-300 relative"
      >
        <Script 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2044879253308502" 
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <SchemaMarkup />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-PPHYTWLS1J"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PPHYTWLS1J');
            `,
          }}
        />
        <GoogleTranslateCleaner />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <CustomCursor />
              <ScrollProgress />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
