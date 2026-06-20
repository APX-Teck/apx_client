import React from 'react';
import { Box, Edit2, Trash2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CompanyAsset } from '@/services/admin/companyAssets.service';

interface CompanyAssetCardProps {
  asset: CompanyAsset;
  onEdit: (asset: CompanyAsset) => void;
  onDelete: (id: number) => void;
}

export function CompanyAssetCard({ asset, onEdit, onDelete }: CompanyAssetCardProps) {
  const getStatusBadge = (status: string, daysRemaining?: number | null) => {
    // If it's active but expiring within 30 days, force "Expiring Soon" styling
    const isExpiringSoon =
      status === 'EXPIRING_SOON' ||
      (status === 'ACTIVE' &&
        daysRemaining !== undefined &&
        daysRemaining !== null &&
        daysRemaining <= 30 &&
        daysRemaining > 0);
    const isExpired =
      status === 'EXPIRED' ||
      (status === 'ACTIVE' &&
        daysRemaining !== undefined &&
        daysRemaining !== null &&
        daysRemaining <= 0);

    if (isExpired) {
      return (
        <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
          Expired
        </span>
      );
    }

    if (isExpiringSoon) {
      return (
        <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20 flex items-center gap-1">
          Expiring Soon
        </span>
      );
    }

    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#39FF14]/10 text-[#39FF14] rounded-full border border-[#39FF14]/20">
            Active
          </span>
        );
      case 'RENEWED':
        return (
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
            Renewed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-500 rounded-full border border-gray-500/20">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getProgress = (issuedDate?: string, expiryDate?: string) => {
    if (!expiryDate) return null;
    const end = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const start = issuedDate ? new Date(issuedDate).getTime() : end - 365 * 24 * 60 * 60 * 1000; // default to 1 year ago if no issue date

    const total = end - start;
    const elapsed = now - start;

    if (total <= 0) return { percentage: 100, daysRemaining: 0 };

    let percentage = (elapsed / total) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    return { percentage, daysRemaining };
  };

  const progressData = getProgress(asset.issuedDate, asset.expiryDate);
  const isExpiringSoon =
    progressData && progressData.daysRemaining <= 30 && progressData.daysRemaining > 0;
  const isExpired = progressData && progressData.daysRemaining <= 0;

  return (
    <div
      className={`bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border ${isExpiringSoon ? 'border-red-500/30 dark:border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-100 dark:border-white/5'} shadow-sm hover:shadow-md transition-all group flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpiringSoon ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-[#39FF14]'}`}
          >
            <Box size={20} />
          </div>
          <div>
            <h3
              className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]"
              title={asset.title}
            >
              {asset.title}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{asset.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(asset.status, progressData?.daysRemaining)}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
        {asset.provider && (
          <div className="flex justify-between">
            <span>Provider:</span>
            <span className="font-medium text-gray-900 dark:text-white">{asset.provider}</span>
          </div>
        )}
        {asset.renewalCost ? (
          <div className="flex justify-between">
            <span>Cost:</span>
            <span className="font-medium text-gray-900 dark:text-white">₹{asset.renewalCost}</span>
          </div>
        ) : null}
        {asset.expiryDate && (
          <div className="flex justify-between">
            <span>Expires:</span>
            <span
              className={`font-medium ${isExpiringSoon || isExpired ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
            >
              {new Date(asset.expiryDate).toLocaleDateString()}
              {isExpiringSoon && progressData && (
                <span className="ml-2 text-xs opacity-80">
                  ({progressData.daysRemaining} days left)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {progressData && (
        <div className="mb-4">
          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isExpired ? 'bg-red-600' : isExpiringSoon ? 'bg-red-500' : 'bg-indigo-500 dark:bg-[#39FF14]'}`}
              style={{ width: `${progressData.percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-1 pt-4 border-t border-gray-100 dark:border-white/5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            const text = `Asset: ${asset.title}\nProvider: ${asset.provider || 'N/A'}\nStatus: ${asset.status}\nExpires: ${asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : 'N/A'}`;
            navigator.clipboard.writeText(text);
            toast.success('Asset details copied');
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition-colors"
          title="Copy Details"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={() => onEdit(asset)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(asset.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
