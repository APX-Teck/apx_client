'use client';

import { AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface LoginAlertsProps {
  errorMsg: string | null;
  infoMsg: string | null;
  successMsg: string | null;
  resendEmail: boolean;
  onResendVerification: () => void;
}

export function LoginAlerts({
  errorMsg,
  infoMsg,
  successMsg,
  resendEmail,
  onResendVerification,
}: LoginAlertsProps) {
  return (
    <>
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex gap-3 items-center font-medium" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" role="presentation" />
          <div className="flex-1">
            <span>{errorMsg}</span>
            {resendEmail && (
              <button
                type="button"
                onClick={onResendVerification}
                className="block mt-1 text-indigo-600 hover:text-indigo-700 font-bold text-xs text-left transition-colors"
                aria-label="Resend verification email"
              >
                Resend verification email?
              </button>
            )}
          </div>
        </div>
      )}

      {infoMsg && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm flex gap-3 items-center font-medium" role="status">
          <Info className="w-5 h-5 shrink-0 text-indigo-600" aria-hidden="true" role="presentation" />
          <span>{infoMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex gap-3 items-center font-medium" role="status">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden="true" role="presentation" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );
}
