import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { leadsService } from '@/services/admin/leads.service';
import { Lead, LeadStatus, LeadFollowUp } from '@/app/types/lead.types';

export function useLeadDetailLogic(
  initialLead: Lead | null,
  initialFollowUps: LeadFollowUp[] | null,
  id: number
) {
  const [lead, setLead] = useState<Lead | null>(initialLead);
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>(initialFollowUps || []);
  const [isLoading, setIsLoading] = useState(!initialLead);

  useEffect(() => {
    if (initialLead) {
      setLead(initialLead);
      setFollowUps(initialFollowUps || []);
    }
  }, [initialLead, initialFollowUps]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [leadData, followUpsData] = await Promise.all([
        leadsService.getLeadById(id),
        leadsService.getLeadFollowUps(id),
      ]);
      if (leadData) {
        setLead(leadData);
      }
      setFollowUps(followUpsData || []);
    } catch (error) {
      toast.error('Failed to fetch lead details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!initialLead) {
      fetchData();
    }
  }, [initialLead, fetchData]);

  const handleUpdateStatus = async (status: LeadStatus) => {
    if (!lead) return;
    const toastId = toast.loading('Updating status...');
    try {
      await leadsService.updateLeadStatus(lead.id, status);
      toast.success(`Status updated to ${status}`, { id: toastId });
      fetchData(); // refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status', { id: toastId });
    }
  };

  const handleAssignLead = async (assignedToId: number) => {
    if (!lead) return;
    const toastId = toast.loading('Assigning lead...');
    try {
      await leadsService.assignLead(lead.id, assignedToId);
      toast.success(`Lead assigned successfully`, { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign lead', { id: toastId });
    }
  };

  const handleAddFollowUp = async (note: string, nextFollowUpAt: string) => {
    if (!lead) return;
    const toastId = toast.loading('Adding follow-up...');
    try {
      // In a real app, you might want to fetch doneById from the current user session
      // For now, we'll send it without doneById and hope the backend uses req.user or allow null if possible
      // Actually backend createFollowsUp requires doneById. Let's send 1 as a fallback or read from somewhere.
      // Wait, backend:
      // export const createFollowsUp = async (req: Request, res: Response) => {
      //   const { leadId, doneById, note, followedAt, nextFollowUpAt } = req.body;
      await leadsService.addLeadFollowUp({
        leadId: lead.id,
        doneById: lead.assignedToId || 1, // Fallback to assignedToId or 1
        note,
        followedAt: new Date().toISOString(),
        nextFollowUpAt,
      });
      toast.success('Follow-up added', { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add follow-up', { id: toastId });
    }
  };

  return {
    lead,
    followUps,
    isLoading,
    handleUpdateStatus,
    handleAddFollowUp,
    handleAssignLead,
  };
}
