'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Shield, User as UserIcon, Settings, MoreVertical } from 'lucide-react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import UserAvatar from '@/components/ui/admin/UserAvatar';
import { User } from '@/services/admin/users.service';

interface Props {
  filteredUsers: User[];
  setSearchTerm: (term: string) => void;
  currentSort: string;
  setCurrentSort: (sort: string) => void;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  filterOptions: { label: string; value: string }[];
  isLoading?: boolean;
}

export function UsersTable({
  filteredUsers,
  setSearchTerm,
  currentSort,
  setCurrentSort,
  currentFilter,
  setCurrentFilter,
  filterOptions,
  isLoading
}: Props) {
  const sortOptions = [
    { label: 'Newest Joined', value: 'newest' },
    { label: 'Oldest Joined', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
  ];

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'User',
        cell: (user) => (
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.fullName}
              src={user.profile?.profilePhotoUrl}
              size="lg"
              className="shadow-sm border-2 border-white dark:border-[#111111]"
            />
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{user.fullName}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                {user.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: (user) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">{user.phone || '-'}</span>
        ),
      },
      {
        header: 'Role',
        cell: (user) => (
          <div className="flex items-center gap-2.5">
            {user.role?.name === 'SUPER_ADMIN' ? (
              <Shield
                size={16}
                className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            ) : user.role?.name === 'ADMIN' ? (
              <Settings
                size={16}
                className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />
            ) : (
              <UserIcon size={16} className="text-gray-500" />
            )}
            <span className="font-extrabold text-[11px] uppercase tracking-wider bg-gray-100/80 dark:bg-white/5 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
              {user.role?.name || 'UNKNOWN'}
            </span>
          </div>
        ),
      },
      {
        header: 'Status',
        cell: (user) => (
          <span
            className={`px-3 py-1.5 text-[11px] font-extrabold tracking-wider rounded-lg border shadow-sm backdrop-blur-sm inline-flex items-center gap-1.5 ${
              user.isActive
                ? 'bg-emerald-100/80 border-emerald-200/50 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-100/80 border-red-200/50 dark:bg-red-500/10 dark:border-red-500/20 text-red-700 dark:text-red-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
            ></span>
            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        ),
      },
      {
        header: 'Joined',
        cell: (user) => (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
          </span>
        ),
      },
      {
        header: 'Actions',
        cell: (user) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${user.id}`}
              className="px-4 py-2 min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20 transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/10 active:scale-95"
            >
              View Profile
            </Link>
            <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:scale-95">
              <MoreVertical size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="hidden sm:block">
        <DataTable
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Search by name, email, or phone..."
          onSearch={setSearchTerm}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          filterOptions={filterOptions}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          isLoading={isLoading}
        />
      </div>
      
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4 mt-4">
        {/* Mobile Search/Sort */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4 space-y-3">
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
            placeholder="Search users..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Cards */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold bg-white/80 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">No users found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={user.fullName}
                  src={user.profile?.profilePhotoUrl}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Role</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-xs truncate block">{user.role?.name || 'UNKNOWN'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Phone</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-xs truncate block">{user.phone || '-'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Status</span>
                  <span className={`font-bold text-xs ${user.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block mb-0.5">Joined</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-xs truncate block">{format(new Date(user.createdAt), 'MMM dd')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20"
                >
                  View Profile
                </Link>
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
