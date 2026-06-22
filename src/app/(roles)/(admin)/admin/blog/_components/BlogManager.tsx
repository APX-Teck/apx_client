'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import { BlogHeader } from './BlogHeader';
import { BlogSearch } from './BlogSearch';
import { BlogList } from './BlogList';
import { useBlogLogic } from '../_hooks/useBlogLogic';
import { AdminBlogPost as BlogPost } from '@/app/types/admin-blog.types';

export function BlogManager({ initialPosts = [] }: { initialPosts?: BlogPost[] }) {
  const {
    filteredPosts,
    totalFilteredPosts,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    handleDeleteClick,
    confirmDeletePost,
    handleUpdateStatus,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useBlogLogic(initialPosts);

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return pages.map((page, idx) => {
      if (page === '...') {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-400 font-bold text-lg tracking-widest pb-2"
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={`page-${page}`}
          onClick={() => setCurrentPage(page as number)}
          className={`w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl font-bold transition-all border text-[15px] ${
            currentPage === page
              ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-sm'
              : 'bg-white dark:bg-[#151515] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-10 px-4 sm:px-6 md:px-8">
      <BlogHeader />

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col">
        <BlogSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          <BlogList
            isLoading={isLoading}
            posts={filteredPosts}
            searchTerm={searchTerm}
            onDeleteClick={handleDeleteClick}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalFilteredPosts > 0 && (
          <div className="flex flex-col xl:flex-row items-center justify-between border-t border-gray-100 dark:border-white/5 bg-transparent p-6 gap-6">
            {/* Left side: Results text & dropdown */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-[15px] font-bold text-[#333] dark:text-gray-200">
                Results: {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, totalFilteredPosts)} of {totalFilteredPosts}
              </div>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-[#f1f3f5] dark:bg-[#222] text-[#333] dark:text-gray-200 font-bold text-[14px] rounded-xl pl-4 pr-9 py-2.5 min-h-[44px] outline-none cursor-pointer border border-transparent dark:border-white/5 hover:bg-[#e9ecef] dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700 dark:text-gray-400">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right side: Pagination Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151515] text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>

              {renderPageNumbers()}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151515] text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete Post"
        isLoading={isDeleting}
      />
    </div>
  );
}
