import { useState } from 'react';
import { CompanyVaultDocument, companyVaultService } from '@/services/admin/companyVault.service';

interface UseCompanyVaultFormLogicProps {
  onSuccess: () => void;
}

export function useCompanyVaultFormLogic({ onSuccess }: UseCompanyVaultFormLogicProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<CompanyVaultDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openCreateModal = () => {
    setEditingDocument(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (doc: CompanyVaultDocument) => {
    setEditingDocument(doc);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDocument(null);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const key = (formData.get('key') as string || '').trim();
    const file = formData.get('document') as File;

    const errors: Record<string, string> = {};

    if (!key) errors.key = 'A unique Document Key is strictly required.';
    else if (key.length < 3) errors.key = 'Document Key must be at least 3 characters.';

    if (!editingDocument && (!file || file.size === 0)) {
      errors.document = 'You must select a valid document file to upload.';
    } else if (file && file.size > 10 * 1024 * 1024) {
      errors.document = 'The document file exceeds the maximum size limit of 10MB.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {

      if (editingDocument) {
        // If editing and no new file selected, remove empty file from formData to avoid backend issues
        if (!file || file.size === 0) {
          formData.delete('document');
        }
        await companyVaultService.updateCompanyVault(editingDocument.id, formData);
      } else {
        await companyVaultService.createCompanyVault(formData);
      }

      closeModal();
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save document:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isModalOpen,
    editingDocument,
    isSubmitting,
    formErrors,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
