import React from 'react';
import { adminJobService } from '@/services/admin/job.service';
import JobApplicationsClient from './_components/JobApplicationsClient';

export default async function JobApplicationsPage() {
  let initialApplications = { data: [], meta: null };
  
  try {
    const res = await adminJobService.getJobApplications({ page: 1, limit: 100 });
    initialApplications = res as any;
  } catch (error) {
    console.error('Failed to pre-fetch job applications:', error);
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-12 px-4 sm:px-6 md:px-8 pt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and manage candidates who have applied to your job postings.
          </p>
        </div>
      </div>
      <JobApplicationsClient initialData={initialApplications.data} />
    </div>
  );
}
