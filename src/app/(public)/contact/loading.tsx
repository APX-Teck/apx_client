export default function ContactLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="w-48 h-10 rounded-xl bg-foreground/5 animate-pulse" />
              <div className="w-full h-16 rounded-xl bg-foreground/5 animate-pulse" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="h-24 rounded-2xl bg-foreground/5 animate-pulse" />
              <div className="h-24 rounded-2xl bg-foreground/5 animate-pulse" />
              <div className="h-24 rounded-2xl bg-foreground/5 animate-pulse sm:col-span-2" />
            </div>

            <div className="w-full h-64 rounded-3xl bg-foreground/5 animate-pulse" />
          </div>

          {/* Right Column Form Skeleton */}
          <div className="lg:col-span-7">
            <div className="w-full h-[600px] rounded-3xl bg-foreground/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
