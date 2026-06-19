import { useState, useCallback, useEffect } from 'react';
import { CompanyAsset, companyAssetsService } from '@/services/admin/companyAssets.service';

export function useCompanyAssetsLogic(initialAssets: CompanyAsset[] = []) {
  const [assets, setAssets] = useState<CompanyAsset[]>(initialAssets);
  const [filteredAssets, setFilteredAssets] = useState<CompanyAsset[]>(initialAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await companyAssetsService.getAllCompanyAssets({ limit: 100 });
      setAssets(response.data);
      setFilteredAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setAssets(initialAssets);
    setFilteredAssets(initialAssets);
    if (!initialAssets || initialAssets.length === 0) {
      fetchAssets();
    }
  }, [initialAssets, fetchAssets]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAssets(assets);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredAssets(
      assets.filter(
        (asset) =>
          asset.title.toLowerCase().includes(term) ||
          asset.provider?.toLowerCase().includes(term) ||
          asset.referenceNumber?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, assets]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return false;
    try {
      await companyAssetsService.deleteCompanyAsset(id);
      await fetchAssets();
      return true;
    } catch (error) {
      console.error('Failed to delete asset:', error);
      throw error;
    }
  };

  return {
    assets,
    filteredAssets,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchAssets,
    handleDelete,
  };
}
