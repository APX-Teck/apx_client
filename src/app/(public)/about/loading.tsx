export default function AboutLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Skeleton */}
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-48 h-8 rounded-full bg-foreground/5 animate-pulse" />
        <div className="w-3/4 max-w-4xl h-16 md:h-24 rounded-2xl bg-foreground/5 animate-pulse" />
        <div className="w-1/2 max-w-2xl h-12 rounded-xl bg-foreground/5 animate-pulse" />
      </div>

      {/* Sections Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-24 w-full space-y-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="w-32 h-6 rounded-md bg-foreground/5 animate-pulse" />
            <div className="w-full h-12 rounded-xl bg-foreground/5 animate-pulse" />
            <div className="w-full h-32 rounded-xl bg-foreground/5 animate-pulse" />
          </div>
          <div className="aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] bg-foreground/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
