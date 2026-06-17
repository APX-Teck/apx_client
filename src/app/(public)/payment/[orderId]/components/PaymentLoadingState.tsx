import { Loader2 } from 'lucide-react';

export function PaymentLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 relative z-10">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading secure checkout...</p>
    </div>
  );
}
