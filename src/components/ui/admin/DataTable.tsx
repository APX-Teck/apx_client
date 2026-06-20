'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ListFilter,
  ArrowUpDown,
  Check,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SortOption {
  label: string;
  value: string;
}

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  onFilter?: () => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
  filterOptions?: SortOption[];
  currentFilter?: string;
  onFilterChange?: (value: string) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  onSearch,
  onFilter,
  onRowClick,
  isLoading = false,
  sortOptions,
  currentSort,
  onSortChange,
  filterOptions,
  currentFilter,
  onFilterChange,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const itemsPerPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (itemsPerPageRef.current && !itemsPerPageRef.current.contains(event.target as Node)) {
        setIsItemsPerPageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg tracking-widest pb-2"
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={`page-${page}`}
          onClick={() => setCurrentPage(page as number)}
          className={`w-[42px] h-[42px] flex items-center justify-center rounded-2xl font-bold transition-all duration-300 border text-[15px] ${
            currentPage === page
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white/80 dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 shadow-sm'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const perPageOptions = [10, 15, 20, 50];

  return (
    <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden transition-colors duration-300">
      {/* Table Toolbar */}
      <div className="p-6 lg:p-8 border-b border-gray-100/80 dark:border-white/10 flex flex-col sm:flex-row gap-5 justify-between items-center bg-transparent">
        {onSearch ? (
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-gray-200/80 dark:border-white/10 rounded-2xl text-[15px] font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-indigo-500/10"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex gap-3 w-full sm:w-auto">
          {filterOptions && (
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <ListFilter size={18} strokeWidth={2.5} />
                Filter
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={cn('transition-transform duration-300', isFilterOpen && 'rotate-180')}
                />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 max-h-64 overflow-y-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/10 z-50 p-1.5"
                  >
                    <div className="flex flex-col gap-1">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onFilterChange?.(option.value);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
                            currentFilter === option.value
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10'
                          )}
                        >
                          {option.label}
                          {currentFilter === option.value && (
                            <Check
                              size={16}
                              strokeWidth={3}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {onFilter && !filterOptions && (
            <button
              onClick={onFilter}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              <ListFilter size={18} strokeWidth={2.5} />
              Filter
            </button>
          )}

          {sortOptions && (
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <ArrowUpDown size={18} strokeWidth={2.5} />
                Sort
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={cn('transition-transform duration-300', isSortOpen && 'rotate-180')}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-1.5"
                  >
                    <div className="flex flex-col gap-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange?.(option.value);
                            setIsSortOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
                            currentSort === option.value
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10'
                          )}
                        >
                          {option.label}
                          {currentSort === option.value && (
                            <Check
                              size={16}
                              strokeWidth={3}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-100/80 dark:border-white/10 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn('px-6 lg:px-8 py-5 whitespace-nowrap', col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/80 dark:divide-white/5 bg-transparent">
            <AnimatePresence>
              {paginatedData.map((item, rowIndex) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-colors duration-300 group hover:shadow-[inset_4px_0_0_0_#6366f1]',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-6 lg:px-8 py-5 whitespace-nowrap text-[15px] text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors',
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                          ? String(item[col.accessorKey])
                          : null}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>

            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                    <span className="text-gray-500 dark:text-gray-400 text-[15px] font-bold">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-gray-500 dark:text-gray-400 text-[15px] font-bold"
                >
                  No data available matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && data.length > 0 && (
        <div className="flex flex-col xl:flex-row items-center justify-between border-t border-gray-100/80 dark:border-white/10 bg-transparent p-6 lg:p-8 gap-6">
          {/* Left side: Results text & dropdown */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="text-[15px] font-bold text-gray-700 dark:text-gray-300">
              Results: {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
            </div>

            <div className="relative" ref={itemsPerPageRef}>
              <button
                onClick={() => setIsItemsPerPageOpen(!isItemsPerPageOpen)}
                className="flex items-center justify-between gap-3 bg-white/80 dark:bg-white/5 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-bold text-[14px] rounded-xl pl-4 pr-3 py-2.5 outline-none cursor-pointer border border-gray-200/80 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20"
              >
                {itemsPerPage}
                <ChevronDown
                  size={14}
                  strokeWidth={3}
                  className={cn(
                    'text-gray-500 dark:text-gray-400 transition-transform duration-300',
                    isItemsPerPageOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isItemsPerPageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 mb-2 w-24 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-1.5"
                  >
                    <div className="flex flex-col gap-1">
                      {perPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setItemsPerPage(option);
                            setCurrentPage(1);
                            setIsItemsPerPageOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-center px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200',
                            itemsPerPage === option
                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10'
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side: Pagination Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-[42px] h-[42px] flex items-center justify-center rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-[42px] h-[42px] flex items-center justify-center rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
