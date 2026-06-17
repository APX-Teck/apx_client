export function BlogSectionSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="w-64 h-12 bg-foreground/5 rounded-xl" />
        <div className="w-48 h-12 bg-foreground/5 rounded-xl" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col rounded-3xl overflow-hidden border border-glass-border bg-foreground/[0.02]">
            <div className="w-full h-48 bg-foreground/10" />
            <div className="p-6 space-y-4">
              <div className="w-24 h-6 bg-foreground/5 rounded-full" />
              <div className="w-full h-8 bg-foreground/5 rounded-md" />
              <div className="w-3/4 h-8 bg-foreground/5 rounded-md" />
              <div className="w-full h-4 bg-foreground/5 rounded-md mt-4" />
              <div className="w-5/6 h-4 bg-foreground/5 rounded-md" />
              <div className="flex items-center gap-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-foreground/5" />
                <div className="w-24 h-4 bg-foreground/5 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
