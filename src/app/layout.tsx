import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { AuthProvider } from '@/providers/AuthProvider';
import { GoogleTranslateCleaner } from '@/components/ui/GoogleTranslateCleaner';
import { QueryProvider } from '@/providers/QueryProvider';

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
  icons: {
    icon: [
      { url: '/APX%2016x16.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/APX%2032x32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/APX%2048x48.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    shortcut: '/APX%2016x16.ico',
    apple: '/APX%2048x48.svg',
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
              <ScrollProgress />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
