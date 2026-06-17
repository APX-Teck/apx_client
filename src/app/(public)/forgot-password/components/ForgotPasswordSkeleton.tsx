export function ForgotPasswordSkeleton() {
  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-glass-border bg-foreground/[0.02] shadow-2xl animate-pulse">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-foreground/10 mb-4" />
        <div className="w-48 h-8 rounded-md bg-foreground/10" />
        <div className="w-64 h-4 rounded-md bg-foreground/10 mt-2" />
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="w-24 h-3 rounded-md bg-foreground/10" />
          <div className="w-full h-12 rounded-xl bg-foreground/10" />
        </div>

        <div className="w-full h-12 rounded-xl bg-foreground/10 mt-4" />

        <div className="flex justify-center mt-6">
          <div className="w-40 h-3 rounded-md bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}
