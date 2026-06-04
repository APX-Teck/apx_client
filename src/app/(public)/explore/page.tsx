import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Explore & News</h1>
          <p className="text-foreground/70 text-lg">
            Stay updated with the latest news, technological explorations, and insights.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
