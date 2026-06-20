'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit2, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { blogService } from '@/services/admin/blog.service';
import { BlogCategory } from '@/app/types/admin-blog.types';

export default function CategoriesManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    setIsAdding(true);
    try {
      await blogService.createCategory({ name: newCategoryName.trim() });
      toast.success('Category added successfully');
      setNewCategoryName('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-safe pb-10 px-4 sm:px-6 md:px-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <button 
            onClick={() => router.push('/admin/blog')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft size={16} /> Back to Blog
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FolderTree size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            Blog Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage your blog categories here.
          </p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col p-6 sm:p-8">
        
        {/* Add Category Form */}
        <div className="mb-8 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Technology, Health, Lifestyle..."
              className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !newCategoryName.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Add Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Existing Categories</h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
              <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-500">No categories found. Add one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">/{category.slug}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                    <FolderTree size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
