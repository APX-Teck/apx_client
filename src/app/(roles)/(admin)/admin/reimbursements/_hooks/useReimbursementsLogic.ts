import { useState, useMemo, useEffect } from 'react';
import { reimbursementsService, Reimbursement } from '@/services/admin/reimbursements.service';

type ToastState = { message: string; type: 'success' | 'error' | 'loading' } | null;

export const useReimbursementsLogic = (initialReimbursements: Reimbursement[]) => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(initialReimbursements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Reimbursement | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [toast, setToast] = useState<ToastState>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReimbursements = async () => {
    try {
      setIsLoading(true);
      const data = await reimbursementsService.getReimbursements();
      setReimbursements(data || []);
    } catch (err) {
      setToast({ message: 'Failed to load reimbursements', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialReimbursements.length === 0) {
      fetchReimbursements();
    }
  }, []);

  const handleUpdateStatus = async (id: number, status: Reimbursement['status'], note?: string) => {
    try {
      setToast({ message: `Marking as ${status}...`, type: 'loading' });
      await reimbursementsService.updateReimbursementStatus(id, status, note);
      setToast({ message: `Reimbursement ${status}`, type: 'success' });
      setSelectedRequest(null);
      setReviewNote('');
      fetchReimbursements();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return reimbursements.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.user?.fullName && r.user.fullName.toLowerCase().includes(term)) ||
        r.category.toLowerCase().includes(term)
    );
  }, [reimbursements, searchTerm]);

  return {
    reimbursements,
    filteredData,
    searchTerm,
    setSearchTerm,
    selectedRequest,
    setSelectedRequest,
    reviewNote,
    setReviewNote,
    toast,
    setToast,
    isLoading,
    handleUpdateStatus,
  };
};
