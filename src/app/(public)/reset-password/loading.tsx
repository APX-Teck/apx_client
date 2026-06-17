import { Loader2 } from 'lucide-react';

export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-[url('/grid-bg.svg')] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading reset password page...</p>
      </div>
    </div>
  );
}
