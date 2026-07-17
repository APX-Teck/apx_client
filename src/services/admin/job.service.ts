import apiClient from '@/lib/api/axios';
import { extractDataArray, extractDataObject, extractPagination } from '@/lib/api/responseParser';
import { JobListing, JobApplication } from '@/app/types/job.types';

export const adminJobService = {
  // Job Listings
  getJobListings: async (params?: any): Promise<{ data: JobListing[]; meta: any }> => {
    const response = await apiClient.get('/job/getAll', { params });
    return {
      data: extractDataArray<JobListing>(response.data),
      meta: extractPagination(response.data),
    };
  },

  getJobListingById: async (id: number): Promise<JobListing> => {
    const response = await apiClient.get(`/job/${id}`);
    return extractDataObject<JobListing>(response.data) || response.data;
  },

  createJobListing: async (data: any): Promise<JobListing> => {
    const response = await apiClient.post('/job/create', data);
    return extractDataObject<JobListing>(response.data) || response.data;
  },

  updateJobListing: async (id: number, data: any): Promise<JobListing> => {
    const response = await apiClient.patch(`/job/${id}`, data);
    return extractDataObject<JobListing>(response.data) || response.data;
  },

  deleteJobListing: async (id: number) => {
    const response = await apiClient.delete(`/job/${id}`);
    return response.data;
  },

  // Job Applications
  getJobApplications: async (params?: any): Promise<{ data: JobApplication[]; meta: any }> => {
    const response = await apiClient.get('/job/applications/getAll', { params });
    return {
      data: extractDataArray<JobApplication>(response.data),
      meta: extractPagination(response.data),
    };
  },

  getJobApplicationById: async (id: number): Promise<JobApplication> => {
    const response = await apiClient.get(`/job/applications/${id}`);
    return extractDataObject<JobApplication>(response.data) || response.data;
  },

  updateJobApplication: async (id: number, data: any): Promise<JobApplication> => {
    const response = await apiClient.patch(`/job/applications/${id}`, data);
    return extractDataObject<JobApplication>(response.data) || response.data;
  },

  deleteJobApplication: async (id: number) => {
    const response = await apiClient.delete(`/job/applications/${id}`);
    return response.data;
  },
};
