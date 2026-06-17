export function VerifyEmailSkeleton() {
  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-glass-border bg-foreground/[0.02] shadow-2xl animate-pulse">
      <div className="flex flex-col items-center py-12 space-y-4">
        <div className="w-10 h-10 rounded-full bg-foreground/10" />
        <div className="w-32 h-6 rounded-md bg-foreground/10" />
        <div className="w-48 h-4 rounded-md bg-foreground/10 mt-2" />
      </div>
    </div>
  );
}
