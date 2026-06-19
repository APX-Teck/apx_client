import { useState, useCallback, useEffect } from 'react';
import { CompanyVaultDocument, companyVaultService } from '@/services/admin/companyVault.service';

export function useCompanyVaultLogic(initialDocuments: CompanyVaultDocument[] = []) {
  const [documents, setDocuments] = useState<CompanyVaultDocument[]>(initialDocuments);
  const [filteredDocuments, setFilteredDocuments] =
    useState<CompanyVaultDocument[]>(initialDocuments);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await companyVaultService.getAllCompanyVault({ limit: 100 });
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setDocuments(initialDocuments);
    setFilteredDocuments(initialDocuments);
    if (!initialDocuments || initialDocuments.length === 0) {
      fetchDocuments();
    }
  }, [initialDocuments, fetchDocuments]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDocuments(documents);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredDocuments(
      documents.filter(
        (doc) =>
          doc.key.toLowerCase().includes(term) ||
          doc.fileName.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, documents]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this document? This action cannot be undone.'
      )
    )
      return false;
    try {
      await companyVaultService.deleteCompanyVault(id);
      await fetchDocuments();
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  };

  return {
    documents,
    filteredDocuments,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchDocuments,
    handleDelete,
  };
}
