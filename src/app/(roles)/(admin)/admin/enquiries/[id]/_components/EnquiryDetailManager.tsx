'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Calendar, CheckCircle, Briefcase } from 'lucide-react';
import { enquiriesService, Enquiry, EnquiryStatus } from '@/services/admin/enquiries.service';
import toast from 'react-hot-toast';

interface Props {
  initialEnquiry: Enquiry | null;
  id: number;
}

export function EnquiryDetailManager({ initialEnquiry, id }: Props) {
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(initialEnquiry);
  const [isLoading, setIsLoading] = useState(!initialEnquiry);
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (!initialEnquiry) {
      const fetchEnquiry = async () => {
        try {
          setIsLoading(true);
          const data = await enquiriesService.getEnquiryById(id);
          setEnquiry(data);
        } catch (error) {
          toast.error('Failed to load enquiry details');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEnquiry();
    }
  }, [initialEnquiry, id]);

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!enquiry) return;
    setIsUpdating(true);
    try {
      await enquiriesService.updateEnquiryStatus(enquiry.id, newStatus);
      setEnquiry({ ...enquiry, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-safe pb-10 px-4 sm:px-6 md:px-8 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-safe pb-10 px-4 sm:px-6 md:px-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="p-8 text-center bg-red-50 dark:bg-red-500/10 rounded-3xl border border-red-100 dark:border-red-500/20">
          <p className="text-lg text-red-600 dark:text-red-400 font-bold mb-2">Enquiry not found</p>
          <button onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-safe pb-10 px-4 sm:px-6 md:px-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 min-h-[44px] text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={16} strokeWidth={3} /> Back to Enquiries
      </button>

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-white/10 pb-6">
          Enquiry Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                <User size={22} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p className="text-base font-bold text-gray-900 dark:text-white truncate">{enquiry.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm border border-emerald-100/50 dark:border-emerald-500/20">
                <Mail size={22} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="text-base font-bold text-gray-900 dark:text-white truncate break-words">
                  {enquiry.email}
                </p>
              </div>
            </div>

            {enquiry.phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm border border-cyan-100/50 dark:border-cyan-500/20">
                  <Phone size={22} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white truncate">{enquiry.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-amber-100/50 dark:border-amber-500/20">
                <Calendar size={22} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Date Received</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {new Date(enquiry.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm border border-blue-100/50 dark:border-blue-500/20">
                <CheckCircle size={22} strokeWidth={2.5} />
              </div>
              <div className="flex-1 w-full max-w-sm">
                <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</p>
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  disabled={isUpdating}
                  className="block w-full text-[15px] font-bold px-4 py-2.5 min-h-[44px] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-[#151515] text-gray-900 dark:text-white disabled:opacity-50 transition-all outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="SEEN">SEEN</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="INTERESTED">INTERESTED</option>
                  <option value="NEGOTIATING">NEGOTIATING</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </div>

            {enquiry.serviceInterest && (
              <div className="flex items-start gap-4 mt-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Service Interest</p>
                  <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20 rounded-full text-sm font-bold shadow-sm">
                    {enquiry.serviceInterest}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {enquiry.businessName && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-sm border border-purple-100/50 dark:border-purple-500/20">
                <Briefcase size={22} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Business/Company Name</p>
                <p className="text-lg font-black text-gray-900 dark:text-white truncate">{enquiry.businessName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
