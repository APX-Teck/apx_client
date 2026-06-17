import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function InsightsLoading() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-32 pb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
        
        {/* Hero Skeleton */}
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse text-center flex flex-col items-center">
          <div className="w-32 h-6 rounded-full bg-accent/20" />
          <div className="w-full max-w-2xl h-16 sm:h-20 rounded-xl bg-foreground/10" />
          <div className="w-full max-w-xl h-8 rounded-md bg-foreground/10 mt-4" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
