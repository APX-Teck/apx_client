import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 relative overflow-x-hidden w-full px-6 text-center" role="main">
        <MouseSpotlight />
        
        <h1 className="text-6xl md:text-8xl font-bold text-accent mb-6 tracking-tighter">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-foreground/70 max-w-md mx-auto mb-10">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-medium text-white shadow-lg transition-all hover:bg-accent/90 hover:scale-105 active:scale-95"
        >
          Return Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
