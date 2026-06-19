import React from 'react';
import { IndianRupee, Clock, CheckCircle2, XCircle, SearchX } from 'lucide-react';
import { format } from 'date-fns';
import { Reimbursement } from '@/services/admin/reimbursements.service';

interface Props {
  filteredData: Reimbursement[];
  isLoading: boolean;
  searchTerm: string;
  onSelectRequest: (req: Reimbursement) => void;
}

export function ReimbursementsTable({
  filteredData,
  isLoading,
  searchTerm,
  onSelectRequest,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading reimbursements...</p>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
          <SearchX className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Requests Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {searchTerm
            ? `We couldn't find any reimbursement claims matching "${searchTerm}".`
            : 'There are currently no reimbursement claims submitted.'}
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <Clock size={12} /> Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Paid
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-500 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <div className="hidden sm:block min-w-full inline-block align-middle overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
          <thead className="bg-gray-50 dark:bg-[#151515]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#111111]">
            {filteredData.map((req) => (
              <tr
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      {req.user?.fullName ? req.user.fullName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {req.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{req.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">
                    {req.title}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{req.category}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-black text-sm text-gray-900 dark:text-white flex items-center">
                    <IndianRupee size={14} className="text-gray-400" />
                    {Number(req.amount).toFixed(2)}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3 p-4">
        {filteredData.map((req) => (
          <div
            key={req.id}
            onClick={() => onSelectRequest(req)}
            className="bg-white dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {req.user?.fullName ? req.user.fullName.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                    {req.user?.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500">{format(new Date(req.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="shrink-0">
                {getStatusBadge(req.status)}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-lg flex justify-between items-center gap-3">
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{req.title}</p>
                <p className="text-xs text-gray-500">{req.category}</p>
              </div>
              <p className="font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                ₹{Number(req.amount).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
