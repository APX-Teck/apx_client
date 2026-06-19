import React, { useMemo } from 'react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import { ServiceRequest } from '@/services/admin/requests.service';
import { format } from 'date-fns';
import { MoreVertical, ShieldAlert, Clock, PlayCircle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  filteredRequests: ServiceRequest[];
  setSearchTerm: (term: string) => void;
  navigateToManage: (id: string | number) => void;
  isLoading?: boolean;
}

export function RequestsTable({ filteredRequests, setSearchTerm, navigateToManage, isLoading }: Props) {
  const columns: ColumnDef<ServiceRequest>[] = useMemo(
    () => [
      {
        header: 'Request ID',
        cell: (req) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{req.id}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              {format(new Date(req.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        ),
      },
      {
        header: 'Customer',
        cell: (req) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{req.customerName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{req.customerEmail}</p>
          </div>
        ),
      },
      {
        header: 'Service',
        accessorKey: 'serviceType',
        cell: (req) => (
          <span className="font-extrabold text-[12px] uppercase tracking-wider bg-gray-100/80 dark:bg-white/5 px-3.5 py-1.5 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-white/10 shadow-sm backdrop-blur-sm whitespace-nowrap">
            {req.serviceType}
          </span>
        ),
      },
      {
        header: 'Priority',
        cell: (req) => (
          <span
            className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm whitespace-nowrap ${
              req.priority === 'HIGH'
                ? 'bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                : req.priority === 'MEDIUM'
                  ? 'bg-amber-50/80 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                  : 'bg-blue-50/80 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
            }`}
          >
            {req.priority}
          </span>
        ),
      },
      {
        header: 'Status',
        cell: (req) => {
          const statusConfig = {
            NEW: {
              color: 'text-blue-700 dark:text-blue-400',
              bg: 'bg-blue-50/80 dark:bg-blue-500/10',
              border: 'border-blue-200/50 dark:border-blue-500/20',
              icon: ShieldAlert,
            },
            IN_REVIEW: {
              color: 'text-amber-700 dark:text-amber-400',
              bg: 'bg-amber-50/80 dark:bg-amber-500/10',
              border: 'border-amber-200/50 dark:border-amber-500/20',
              icon: Clock,
            },
            IN_PROGRESS: {
              color: 'text-indigo-700 dark:text-indigo-400',
              bg: 'bg-indigo-50/80 dark:bg-indigo-500/10',
              border: 'border-indigo-200/50 dark:border-indigo-500/20',
              icon: PlayCircle,
            },
            COMPLETED: {
              color: 'text-emerald-700 dark:text-emerald-400',
              bg: 'bg-emerald-50/80 dark:bg-emerald-500/10',
              border: 'border-emerald-200/50 dark:border-emerald-500/20',
              icon: CheckCircle,
            },
            CANCELLED: {
              color: 'text-red-700 dark:text-red-400',
              bg: 'bg-red-50/80 dark:bg-red-500/10',
              border: 'border-red-200/50 dark:border-red-500/20',
              icon: XCircle,
            },
          };
          const config = statusConfig[req.status as keyof typeof statusConfig] || statusConfig.NEW;
          const Icon = config.icon;

          return (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-extrabold rounded-lg border shadow-sm backdrop-blur-sm whitespace-nowrap ${config.bg} ${config.color} ${config.border}`}
            >
              <Icon size={14} strokeWidth={2.5} />
              {req.status.replace('_', ' ')}
            </div>
          );
        },
      },
      {
        header: 'Assigned To',
        cell: (req) => (
          <span className="text-[14px] font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 whitespace-nowrap">
            {req.assignedTo || '— Unassigned —'}
          </span>
        ),
      },
      {
        header: 'Actions',
        cell: (req) => (
          <div className="flex items-center gap-2.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateToManage(req.id);
              }}
              className="px-4 py-2 rounded-xl text-[13px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200/50 dark:border-indigo-500/30 transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/10 active:scale-95 whitespace-nowrap"
            >
              Manage
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#1a1a1a] transition-all shadow-sm hover:shadow-md border border-transparent hover:border-gray-200/80 dark:hover:border-white/10 active:scale-95"
            >
              <MoreVertical size={18} strokeWidth={2.5} />
            </button>
          </div>
        ),
      },
    ],
    [navigateToManage]
  );

  return (
    <>
      <div className="hidden sm:block">
        <DataTable
          data={filteredRequests}
          columns={columns}
          searchPlaceholder="Search by ID, customer name, or service..."
          onSearch={setSearchTerm}
          isLoading={isLoading}
        />
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4 mt-4">
        {/* Mobile Search */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4">
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
            placeholder="Search requests..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Mobile Cards */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold bg-white/80 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">No requests found.</div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Req #{req.id}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{format(new Date(req.createdAt), 'MMM dd, yyyy')}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-extrabold rounded-md uppercase border ${
                  req.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400' :
                  req.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' :
                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400'
                }`}>
                  {req.priority}
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{req.customerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.customerEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Service</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-xs truncate block">{req.serviceType}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Status</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs truncate block">{req.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => navigateToManage(req.id)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500"
                >
                  Manage
                </button>
                <button className="p-2.5 rounded-xl text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
