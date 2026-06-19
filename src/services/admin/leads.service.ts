import apiClient from '@/lib/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';
import { Lead, LeadStatus, LeadFollowUp } from '@/app/types/lead.types';

export type { Lead, LeadStatus, LeadFollowUp };

export const leadsService = {
  getLeads: async (): Promise<Lead[]> => {
    try {
      const response = await apiClient.post('/enquiry/leads/all', {
        search: '',
        page: 1,
        limit: 100,
      });
      return extractDataArray<Lead>(response.data);
    } catch (error) {
      console.error('Failed to fetch leads', error);
      return [];
    }
  },

  getLeadById: async (id: number): Promise<Lead | null> => {
    try {
      const response = await apiClient.get(`/enquiry/leads/${id}`);
      return extractDataObject<Lead>(response.data);
    } catch (error) {
      console.error('Failed to fetch lead', error);
      return null;
    }
  },

  updateLeadStatus: async (id: number, status: LeadStatus): Promise<Lead> => {
    const response = await apiClient.patch(`/enquiry/leads/${id}`, { status });
    return extractDataObject<Lead>(response.data) || response.data;
  },

  assignLead: async (id: number, assignedToId: number): Promise<Lead> => {
    const response = await apiClient.patch(`/enquiry/leads/${id}`, { assignedToId });
    return extractDataObject<Lead>(response.data) || response.data;
  },

  getLeadFollowUps: async (leadId: number): Promise<LeadFollowUp[]> => {
    try {
      const response = await apiClient.post(`/enquiry/follow-ups/all`, { page: 1, limit: 100 });
      const allFollowUps = extractDataArray<LeadFollowUp>(response.data);
      return allFollowUps.filter((f: LeadFollowUp) => f.leadId === leadId);
    } catch (error) {
      console.error('Failed to fetch follow ups', error);
      return [];
    }
  },

  addLeadFollowUp: async (data: {
    leadId: number;
    doneById?: number;
    note: string;
    followedAt: string;
    nextFollowUpAt: string;
  }): Promise<LeadFollowUp> => {
    const response = await apiClient.post('/enquiry/follow-ups', data);
    return extractDataObject<LeadFollowUp>(response.data) || response.data;
  },

  getAssignableEmployees: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/enquiry/assignable-users');
      return extractDataArray(response.data);
    } catch (error) {
      console.error('Failed to fetch assignable employees', error);
      return [];
    }
  },
};
