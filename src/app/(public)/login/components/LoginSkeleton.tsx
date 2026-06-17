export function LoginSkeleton() {
  return (
    <div className="w-full max-w-md relative z-10">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative z-10 animate-pulse">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-14 bg-foreground/10 rounded-xl mb-4" />
          <div className="w-48 h-8 bg-foreground/10 rounded-md" />
          <div className="w-32 h-4 bg-foreground/5 rounded-md mt-2" />
        </div>

        <div className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <div className="w-16 h-3 bg-foreground/5 rounded-sm" />
            <div className="w-full h-12 bg-foreground/5 rounded-xl border border-foreground/10" />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="w-20 h-3 bg-foreground/5 rounded-sm" />
              <div className="w-24 h-3 bg-foreground/5 rounded-sm" />
            </div>
            <div className="w-full h-12 bg-foreground/5 rounded-xl border border-foreground/10" />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-4 h-4 bg-foreground/10 rounded" />
            <div className="w-32 h-4 bg-foreground/5 rounded-sm" />
          </div>

          {/* Submit */}
          <div className="w-full h-12 mt-2 bg-foreground/10 rounded-xl" />

          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-foreground/10" />
            <div className="mx-4 w-6 h-3 bg-foreground/5 rounded-sm" />
            <div className="flex-grow border-t border-foreground/10" />
          </div>

          {/* Google */}
          <div className="w-full h-12 bg-foreground/5 rounded-xl border border-foreground/10" />

          <div className="flex justify-center mt-6">
            <div className="w-48 h-4 bg-foreground/5 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
