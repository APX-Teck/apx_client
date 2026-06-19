'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { ServiceRequestDetails } from '../../types';

interface RequestProjectDetailsProps {
  request: ServiceRequestDetails;
  isEditing: boolean;
  formData: Record<string, any>;
  handleInputChange: (key: string, value: any) => void;
}

export function RequestProjectDetails({
  request,
  isEditing,
  formData,
  handleInputChange,
}: RequestProjectDetailsProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const projectDetails = request.requestData || [];
  const textFields = projectDetails.filter((d: any) => d.field?.fieldType !== 'FILE');
  const serviceFields = request.service?.fields?.filter((f: any) => f.fieldType !== 'FILE') || [];

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-cyan-500" />
        Project Requirements
      </h2>

      {isEditing ? (
        <div className="space-y-6">
          {serviceFields.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              This service does not have any specific text requirement fields defined.
            </p>
          ) : (
            serviceFields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {field.fieldLabel}
                </label>
                {field.fieldType === 'TEXT' ||
                field.fieldType === 'NUMBER' ||
                field.fieldType === 'DATE' ||
                field.fieldType === 'EMAIL' ||
                field.fieldType === 'PHONE' ? (
                  <input
                    type={field.fieldType === 'PHONE' ? 'tel' : field.fieldType.toLowerCase()}
                    value={formData[field.fieldKey] || ''}
                    placeholder={field.placeholder || ''}
                    onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                ) : field.fieldType === 'TEXTAREA' ? (
                  <textarea
                    rows={4}
                    value={formData[field.fieldKey] || ''}
                    placeholder={field.placeholder || ''}
                    onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  />
                ) : field.fieldType === 'DROPDOWN' ? (
                  <select
                    value={formData[field.fieldKey] || ''}
                    onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="">{field.placeholder || 'Select...'}</option>
                    {Array.isArray(field.options) &&
                      field.options.map((opt: string, idx: number) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                ) : null}
              </div>
            ))
          )}
          <p className="text-xs text-gray-400 mt-2 italic">
            * File fields cannot be edited directly. Please upload new attachments below.
          </p>
        </div>
      ) : projectDetails.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No additional requirements were provided.
        </p>
      ) : (
        <div className="space-y-6">
          {projectDetails.map((data: any) => (
            <div
              key={data.id}
              className="border-b border-gray-100 dark:border-white/5 pb-4 last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {data.field?.fieldLabel || data.fieldKey}
              </p>
              {data.field?.fieldType === 'FILE' ? (
                <a
                  href={data.fieldValue}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium hover:underline flex items-center gap-2 w-fit"
                >
                  <FileText className="w-4 h-4" /> View Uploaded File
                </a>
              ) : (
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {data.fieldValue || '-'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
