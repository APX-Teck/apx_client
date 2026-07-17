'use client';

import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '@/app/types/job.types';
import { adminJobService } from '@/services/admin/job.service';
import { Trash2, Search, X, Eye, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';

export default function JobApplicationsClient({ initialData }: { initialData: JobApplication[] }) {
  const [applications, setApplications] = useState<JobApplication[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [search, setSearch] = useState('');
  
  const handleOpenModal = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedApplication) return;
    const newStatus = e.target.value as ApplicationStatus;
    try {
      const updated = await adminJobService.updateJobApplication(selectedApplication.id, { status: newStatus });
      setApplications(applications.map(app => app.id === selectedApplication.id ? updated : app));
      setSelectedApplication(updated);
      toast.success('Status updated');
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await adminJobService.deleteJobApplication(id);
      setApplications(applications.filter(a => a.id !== id));
      toast.success('Application deleted');
      if (selectedApplication?.id === id) {
        handleCloseModal();
      }
    } catch (error: any) {
      toast.error('Failed to delete application');
    }
  };

  const filteredApplications = applications.filter(a => 
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.currentRole?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">Role Applied</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{app.fullName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {app.job?.title || app.currentRole || 'Open Application'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        app.status === ApplicationStatus.RECEIVED ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        app.status === ApplicationStatus.SHORTLISTED ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                        app.status === ApplicationStatus.INTERVIEW ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        app.status === ApplicationStatus.HIRED ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenModal(app)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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

      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-xl font-bold">Application Details</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedApplication.fullName}</h2>
                    <p className="text-gray-500 mt-1">Applied for: {selectedApplication.job?.title || selectedApplication.currentRole || 'Open Application'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail size={16} />
                      <a href={`mailto:${selectedApplication.email}`} className="hover:underline">{selectedApplication.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone size={16} />
                      <a href={`tel:${selectedApplication.phone}`} className="hover:underline">{selectedApplication.phone}</a>
                    </div>
                    {selectedApplication.currentCity && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={16} />
                        <span>{selectedApplication.currentCity}</span>
                      </div>
                    )}
                    {selectedApplication.linkedinUrl && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <ExternalLink size={16} />
                        <Link href={selectedApplication.linkedinUrl} target="_blank" className="hover:underline">Portfolio / Resume</Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl min-w-[200px] flex flex-col justify-between h-fit">
                  <div className="space-y-1.5 mb-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Status</label>
                    <select
                      value={selectedApplication.status}
                      onChange={handleStatusChange}
                      className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#1a1a1a] dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      {Object.values(ApplicationStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">
                    Applied: {format(new Date(selectedApplication.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>

              {selectedApplication.statusNote && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Cover Letter / Message</h4>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedApplication.statusNote}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedApplication.id)}
                className="px-5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium mr-auto"
              >
                Delete Application
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
