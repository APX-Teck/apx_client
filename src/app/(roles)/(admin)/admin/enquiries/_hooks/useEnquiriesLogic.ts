import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { enquiriesService, Enquiry, EnquiryStatus } from '@/services/admin/enquiries.service';

export function useEnquiriesLogic(initialEnquiries: Enquiry[] = []) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await enquiriesService.getEnquiries();
      setEnquiries(data);
    } catch (error) {
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setEnquiries(initialEnquiries);
    if (!initialEnquiries || initialEnquiries.length === 0) {
      fetchEnquiries();
    }
  }, [initialEnquiries, fetchEnquiries]);

  const handleUpdateStatus = async (id: number, status: EnquiryStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await enquiriesService.updateEnquiryStatus(id, status);
      toast.success(`Enquiry status updated to ${status}`, { id: toastId });
      fetchEnquiries(); // refresh data
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status', { id: toastId });
    }
  };

  return {
    enquiries,
    isLoading,
    fetchEnquiries,
    handleUpdateStatus,
  };
}
