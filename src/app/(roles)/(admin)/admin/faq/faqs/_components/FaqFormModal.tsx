import React from 'react';
import { Edit, PlusCircle, XCircle, CheckCircle2 } from 'lucide-react';
import { Faq } from '@/app/types/faq.types';
import { useFaqFormLogic } from '../_hooks/useFaqFormLogic';

interface FaqFormModalProps {
  editingFaq: Faq | null;
  onClose: () => void;
  onSuccess: () => void;
  nextSortOrder: number;
}

export function FaqFormModal({ editingFaq, onClose, onSuccess, nextSortOrder }: FaqFormModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    touchedFields,
    isSubmitted,
    isSubmitting,
    isPublished,
    togglePublished,
    questionValue,
    answerValue,
  } = useFaqFormLogic(editingFaq, onClose, onSuccess, nextSortOrder);

  const showQuestionError = errors.question && (touchedFields.question || isSubmitted);
  const showAnswerError = errors.answer && (touchedFields.answer || isSubmitted);
  const showSortOrderError = errors.sortOrder && (touchedFields.sortOrder || isSubmitted);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {editingFaq ? (
              <Edit className="text-indigo-500" size={20} />
            ) : (
              <PlusCircle className="text-indigo-500" size={20} />
            )}
            {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-white dark:bg-[#222] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10"
          >
            <XCircle size={20} />
          </button>
        </div>

        <form
          id="faq-form"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 space-y-6"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Question *
            </label>
            <input
              {...register('question')}
              value={questionValue}
              placeholder="e.g. What services do you offer?"
              className={`w-full bg-gray-50 dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white ${showQuestionError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
            />
            {showQuestionError && (
              <p className="text-red-500 text-xs mt-1">{errors.question?.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Answer *
            </label>
            <textarea
              {...register('answer')}
              value={answerValue}
              placeholder="Provide a detailed answer..."
              className={`w-full bg-gray-50 dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[120px] text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white ${showAnswerError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
            />
            {showAnswerError && <p className="text-red-500 text-xs mt-1">{errors.answer?.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value="General">General</option>
                <option value="Pricing">Pricing</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sort Order
              </label>
              <input
                type="number"
                {...register('sortOrder', { valueAsNumber: true })}
                min={0}
                className={`w-full bg-gray-50 dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white ${showSortOrderError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
              />
              {showSortOrderError && (
                <p className="text-red-500 text-xs mt-1">{errors.sortOrder?.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/5 mt-4">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={togglePublished}
                className="peer sr-only"
              />
              <label
                htmlFor="isPublished"
                className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 cursor-pointer shadow-inner"
              ></label>
            </div>
            <div>
              <label
                htmlFor="isPublished"
                className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer block"
              >
                Published
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If checked, this FAQ will be visible on the website.
              </p>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="faq-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            {isSubmitting ? 'Saving...' : editingFaq ? 'Save Changes' : 'Create FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}
