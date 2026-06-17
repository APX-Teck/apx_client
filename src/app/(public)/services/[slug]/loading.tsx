import { Loader2 } from 'lucide-react';

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[url('/grid-bg.svg')] opacity-5" />
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-foreground/60 font-medium animate-pulse text-sm">Loading service details...</p>
      </div>
    </div>
  );
}
