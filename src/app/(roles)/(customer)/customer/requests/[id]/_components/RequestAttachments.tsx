'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Paperclip, FileText, Download, XCircle } from 'lucide-react';
import { ServiceRequestDetails } from '../../types';

interface RequestAttachmentsProps {
  request: ServiceRequestDetails;
  isEditing: boolean;
  newFiles: File[];
  setNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function RequestAttachments({
  request,
  isEditing,
  newFiles,
  setNewFiles,
}: RequestAttachmentsProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const attachments = request.fileUploads || [];

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Paperclip className="w-5 h-5 text-cyan-500" />
        Attachments & Documents
      </h2>

      {attachments.length === 0 && !isEditing ? (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No files were attached to this request.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {attachments.map((file: any) => (
            <a
              key={file.id}
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {file.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-cyan-500" />
            </a>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="mt-6 border-t border-gray-100 dark:border-white/5 pt-6">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">
            Upload New Attachments
          </label>
          <div className="relative border-2 border-dashed border-cyan-500/30 rounded-2xl p-6 hover:bg-cyan-500/5 transition-colors group text-center cursor-pointer">
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Paperclip className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
            </div>
          </div>
          {newFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {newFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-cyan-500/20 text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
