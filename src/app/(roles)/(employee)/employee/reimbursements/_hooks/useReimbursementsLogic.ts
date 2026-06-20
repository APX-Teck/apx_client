import { useState, useRef, useEffect } from 'react';
import { reimbursementService, Reimbursement } from '@/services/employee/reimbursements.service';

export const useReimbursementsLogic = (
  initialReimbursements: Reimbursement[],
  initialTotalPages: number,
  initialPage: number
) => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(initialReimbursements);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Travel');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const fetchReimbursements = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await reimbursementService.getMyReimbursements({ page: pageNum, limit: 10 });
      if (res.success) {
        setReimbursements(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setPage(res.data.pagination.page);
      }
    } catch (err: any) {
      console.error('Failed to fetch reimbursements', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialReimbursements.length === 0) {
      fetchReimbursements(initialPage);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!title || !amount || !category) {
      setError('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('amount', amount);
      formData.append('category', category);
      if (description) formData.append('description', description);
      if (receiptFile) formData.append('receipt', receiptFile);

      const res = await reimbursementService.createReimbursement(formData);
      if (res.success) {
        setSuccessMessage('Reimbursement claim submitted successfully!');
        setTitle('');
        setAmount('');
        setCategory('Travel');
        setDescription('');
        setReceiptFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchReimbursements(1); // Refresh list
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit reimbursement claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pending claim?')) return;
    try {
      await reimbursementService.deleteReimbursement(id);
      fetchReimbursements(page);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete claim.');
    }
  };

  return {
    reimbursements,
    isLoading,
    isSubmitting,
    successMessage,
    error,
    title,
    setTitle,
    amount,
    setAmount,
    category,
    setCategory,
    description,
    setDescription,
    receiptFile,
    fileInputRef,
    page,
    totalPages,
    handleFileChange,
    handleSubmit,
    handleDelete,
    fetchReimbursements,
  };
};
