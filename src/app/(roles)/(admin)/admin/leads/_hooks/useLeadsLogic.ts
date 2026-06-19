import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { leadsService } from '@/services/admin/leads.service';
import { Lead, LeadStatus } from '@/app/types/lead.types';

export function useLeadsLogic(initialLeads: Lead[] = []) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await leadsService.getLeads();
      setLeads(data);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setLeads(initialLeads);
    if (!initialLeads || initialLeads.length === 0) {
      fetchLeads();
    }
  }, [initialLeads, fetchLeads]);

  const handleUpdateStatus = async (id: number, status: LeadStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await leadsService.updateLeadStatus(id, status);
      toast.success(`Lead status updated to ${status}`, { id: toastId });
      fetchLeads(); // refresh data
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status', { id: toastId });
    }
  };

  return {
    leads,
    isLoading,
    fetchLeads,
    handleUpdateStatus,
  };
}
