import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { faqsService } from '@/services/admin/faqs.service';
import { Faq } from '@/app/types/faq.types';

export function useFaqsLogic(initialFaqs: Faq[] = []) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await faqsService.getFaqs();
      setFaqs(data || []);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setFaqs(initialFaqs);
    if (!initialFaqs || initialFaqs.length === 0) {
      fetchFaqs();
    }
  }, [initialFaqs, fetchFaqs]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const toastId = toast.loading('Deleting FAQ...');
      try {
        await faqsService.deleteFaq(id);
        toast.success('FAQ deleted successfully', { id: toastId });
        fetchFaqs();
      } catch (error) {
        toast.error('Failed to delete FAQ', { id: toastId });
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    const toastId = toast.loading('Updating status...');
    try {
      await faqsService.toggleFaqActive(id, currentStatus);
      toast.success(`FAQ is now ${!currentStatus ? 'Published' : 'Hidden'}`, { id: toastId });
      fetchFaqs();
    } catch (error) {
      toast.error('Failed to update FAQ status', { id: toastId });
    }
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    faqs,
    filteredFaqs,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchFaqs,
    handleDelete,
    handleToggleActive,
    isModalOpen,
    setIsModalOpen,
    editingFaq,
    openCreateModal,
    openEditModal,
  };
}
