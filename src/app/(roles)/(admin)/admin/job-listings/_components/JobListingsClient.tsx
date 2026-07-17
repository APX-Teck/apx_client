'use client';

import React, { useState, useEffect } from 'react';
import { JobListing, JobType, WorkMode, ExperienceLevel } from '@/app/types/job.types';
import { adminJobService } from '@/services/admin/job.service';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobListingsClient({ initialData }: { initialData: JobListing[] }) {
  const [listings, setListings] = useState<JobListing[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedListing, setSelectedListing] = useState<JobListing | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(initialData.length === 0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const res = await adminJobService.getJobListings({ page: 1, limit: 100 });
        setListings(res.data || []);
      } catch (error) {
        console.error('Failed to fetch job listings on client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialData.length === 0) {
      fetchJobs();
    }
  }, [initialData]);
  
  const [formData, setFormData] = useState<Partial<JobListing>>({
    title: '',
    department: '',
    jobType: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    experienceLevel: ExperienceLevel.MID,
    description: '',
    requirements: '',
    vacancies: 1,
    isActive: true,
    showSalary: false,
    sortOrder: 0
  });

  const handleOpenModal = (mode: 'CREATE' | 'EDIT', listing?: JobListing) => {
    setModalMode(mode);
    if (mode === 'EDIT' && listing) {
      setSelectedListing(listing);
      setFormData(listing);
    } else {
      setSelectedListing(null);
      setFormData({
        title: '',
        department: '',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.ONSITE,
        experienceLevel: ExperienceLevel.MID,
        description: '',
        requirements: '',
        vacancies: 1,
        isActive: true,
        showSalary: false,
        sortOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'CREATE') {
        const newListing = await adminJobService.createJobListing(formData);
        setListings([newListing, ...listings]);
        toast.success('Job listing created successfully');
      } else if (modalMode === 'EDIT' && selectedListing) {
        const updatedListing = await adminJobService.updateJobListing(selectedListing.id, formData);
        setListings(listings.map(l => l.id === selectedListing.id ? updatedListing : l));
        toast.success('Job listing updated successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await adminJobService.deleteJobListing(id);
      setListings(listings.filter(l => l.id !== id));
      toast.success('Job listing deleted');
    } catch (error: any) {
      toast.error('Failed to delete job listing');
    }
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal('CREATE')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          <Plus size={18} />
          <span>Add Job</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading job listings...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No job listings found.
                  </td>
                </tr>
              ) : (
                filteredListings.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{job.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.department}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.jobType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        job.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenModal('EDIT', job)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-xl font-bold">
                {modalMode === 'CREATE' ? 'Add New Job' : 'Edit Job Listing'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Title *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Department *</label>
                  <input
                    required
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={e => setFormData({ ...formData, jobType: e.target.value as JobType })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={e => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(WorkMode).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Experience</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={e => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(ExperienceLevel).map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={e => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Requirements (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.requirements || ''}
                  onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              
              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium">Active (Visible on Website)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-medium"
                >
                  {modalMode === 'CREATE' ? 'Create Job' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
