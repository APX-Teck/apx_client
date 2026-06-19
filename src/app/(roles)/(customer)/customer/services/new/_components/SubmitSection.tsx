'use client';
import React from 'react';
import { Loader2, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubmitSectionProps {
  isSubmitting: boolean;
  loadingFields: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export function SubmitSection({ isSubmitting, loadingFields, message }: SubmitSectionProps) {
  return (
    <div className="pl-0 sm:pl-10 pt-8 mt-8 border-t border-gray-100 dark:border-white/5">
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || loadingFields}
        className="group relative flex items-center justify-center gap-2 w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Sparkles className="w-5 h-5" />
            <span>Submit Service Request</span>
            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center md:text-left">
        By submitting, you agree to our terms of service. Our team will review your request and get
        back to you within 24 hours.
      </p>
    </div>
  );
}
