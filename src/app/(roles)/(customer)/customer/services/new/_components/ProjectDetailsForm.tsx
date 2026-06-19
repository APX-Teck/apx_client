'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ServiceField } from '@/app/types/service.types';

interface ProjectDetailsFormProps {
  serviceFields: ServiceField[];
  loadingFields: boolean;
  setMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  handleInputChange: (fieldKey: string, value: any, type: string) => void;
}

export function ProjectDetailsForm({
  serviceFields,
  loadingFields,
  setMessage,
  handleInputChange,
}: ProjectDetailsFormProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Details</h2>
      </div>

      <div className="pl-0 sm:pl-10">
        {loadingFields ? (
          <div className="flex items-center gap-2 text-gray-500 py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading service fields...</span>
          </div>
        ) : serviceFields.length === 0 ? (
          <p className="text-gray-500 py-4">
            No additional details required for this service. You can submit the request.
          </p>
        ) : (
          <div className="space-y-6">
            {serviceFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
                </label>

                {field.fieldType === 'TEXT' ||
                field.fieldType === 'NUMBER' ||
                field.fieldType === 'DATE' ||
                field.fieldType === 'EMAIL' ||
                field.fieldType === 'PHONE' ? (
                  <input
                    type={field.fieldType === 'PHONE' ? 'tel' : field.fieldType.toLowerCase()}
                    required={field.isRequired}
                    placeholder={field.placeholder || ''}
                    onChange={(e) =>
                      handleInputChange(field.fieldKey, e.target.value, field.fieldType)
                    }
                    className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                ) : field.fieldType === 'TEXTAREA' ? (
                  <textarea
                    rows={4}
                    required={field.isRequired}
                    placeholder={field.placeholder || ''}
                    onChange={(e) =>
                      handleInputChange(field.fieldKey, e.target.value, field.fieldType)
                    }
                    className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                  />
                ) : field.fieldType === 'DROPDOWN' ? (
                  <div className="relative">
                    <select
                      required={field.isRequired}
                      onChange={(e) =>
                        handleInputChange(field.fieldKey, e.target.value, field.fieldType)
                      }
                      className="w-full appearance-none bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    >
                      <option value="">{field.placeholder || 'Select an option...'}</option>
                      {Array.isArray(field.options) &&
                        field.options.map((opt: string, idx: number) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : field.fieldType === 'FILE' ? (
                  <input
                    type="file"
                    accept="image/*,.pdf,.zip,.doc,.docx,.xls,.xlsx,.txt,.csv"
                    required={field.isRequired}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        if (e.target.files[0].size > 50 * 1024 * 1024) {
                          setMessage({
                            type: 'error',
                            text: `File "${e.target.files[0].name}" exceeds 50MB limit.`,
                          });
                          e.target.value = '';
                          return;
                        }
                        setMessage(null);
                        handleInputChange(field.fieldKey, e.target.files[0], field.fieldType);
                      }
                    }}
                    className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-500 hover:file:bg-cyan-500/20"
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
