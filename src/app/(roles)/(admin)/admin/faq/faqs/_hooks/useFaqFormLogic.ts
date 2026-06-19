import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { faqSchema, FaqFormData } from '../_schemas/faq.schema';
import { faqsService } from '@/services/admin/faqs.service';
import { Faq } from '@/app/types/faq.types';

export function useFaqFormLogic(
  editingFaq: Faq | null,
  onClose: () => void,
  onSuccess: () => void,
  nextSortOrder: number
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    mode: 'onTouched',
    defaultValues: editingFaq
      ? {
          question: editingFaq.question,
          answer: editingFaq.answer,
          category: editingFaq.category || 'General',
          sortOrder: editingFaq.sortOrder,
          isPublished: editingFaq.isPublished,
        }
      : {
          question: '',
          answer: '',
          category: 'General',
          sortOrder: nextSortOrder,
          isPublished: true,
        },
  });

  useEffect(() => {
    if (!editingFaq) {
      setValue('sortOrder', nextSortOrder);
    }
  }, [nextSortOrder, editingFaq, setValue]);

  const onSubmit = async (data: FaqFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(editingFaq ? 'Updating FAQ...' : 'Creating FAQ...');
    try {
      if (editingFaq) {
        await faqsService.updateFaq(editingFaq.id, data);
        toast.success('FAQ updated successfully', { id: toastId });
      } else {
        await faqsService.createFaq(data);
        toast.success('FAQ created successfully', { id: toastId });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to save FAQ';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPublished = watch('isPublished');
  const questionValue = watch('question');
  const answerValue = watch('answer');
  const togglePublished = () =>
    setValue('isPublished', !isPublished, { shouldValidate: true, shouldDirty: true });

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    touchedFields,
    isSubmitted,
    isSubmitting,
    isPublished,
    togglePublished,
    questionValue,
    answerValue,
  };
}
