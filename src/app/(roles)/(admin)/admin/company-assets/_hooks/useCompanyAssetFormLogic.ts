import { useState } from 'react';
import { CompanyAsset, companyAssetsService } from '@/services/admin/companyAssets.service';

interface UseCompanyAssetFormLogicProps {
  onSuccess: () => void;
}

export function useCompanyAssetFormLogic({ onSuccess }: UseCompanyAssetFormLogicProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<CompanyAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (asset: CompanyAsset) => {
    setEditingAsset(asset);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const title = (formData.get('title') as string || '').trim();
    const status = formData.get('status') as string;
    const renewalCostStr = formData.get('renewalCost') as string;

    const errors: Record<string, string> = {};

    if (!type) errors.type = 'Asset Type is universally required.';
    if (!title) errors.title = 'You must provide a descriptive Title for this asset.';
    else if (title.length < 3) errors.title = 'Title must be at least 3 characters long.';
    
    if (!status) errors.status = 'A status selection is required.';

    let parsedRenewalCost: number | undefined = undefined;
    if (renewalCostStr) {
      parsedRenewalCost = Number(renewalCostStr);
      if (isNaN(parsedRenewalCost) || parsedRenewalCost < 0) {
        errors.renewalCost = 'Renewal cost must be a valid positive number.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<CompanyAsset> = {
        type,
        title,
        referenceNumber: (formData.get('referenceNumber') as string) || undefined,
        provider: (formData.get('provider') as string) || undefined,
        status: status as any,
        autoRenew: formData.get('autoRenew') === 'on',
        renewalCost: parsedRenewalCost,
        issuedDate: (formData.get('issuedDate') as string) || undefined,
        expiryDate: (formData.get('expiryDate') as string) || undefined,
        notes: (formData.get('notes') as string) || undefined,
      };

      if (editingAsset) {
        await companyAssetsService.updateCompanyAsset(editingAsset.id, payload);
      } else {
        await companyAssetsService.createCompanyAsset(payload);
      }

      closeModal();
      onSuccess();
    } catch (error) {
      console.error('Failed to save asset:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen,
    editingAsset,
    isSubmitting,
    formErrors,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
