import { useState, useMemo, useEffect } from 'react';
import { User, Role, usersService } from '@/services/admin/users.service';

export const useUsersLogic = (initialUsers: User[], initialRoles: Role[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(initialUsers.length === 0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedUsers, fetchedRoles] = await Promise.all([
          usersService.getUsers(),
          usersService.getRoles()
        ]);
        if (isMounted) {
          if (fetchedUsers && fetchedUsers.length > 0) setUsers(fetchedUsers);
          if (fetchedRoles && fetchedRoles.length > 0) setRoles(fetchedRoles);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (initialUsers.length === 0) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [initialUsers.length]);

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm));
      const matchesRole = currentFilter === 'ALL' || user.role?.name === currentFilter;
      return matchesSearch && matchesRole;
    });

    result.sort((a, b) => {
      switch (currentSort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name_asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name_desc':
          return b.fullName.localeCompare(a.fullName);
        default:
          return 0;
      }
    });

    return result;
  }, [users, searchTerm, currentSort, currentFilter]);

  return {
    users,
    roles,
    searchTerm,
    setSearchTerm,
    currentSort,
    setCurrentSort,
    currentFilter,
    setCurrentFilter,
    filteredUsers,
    isLoading,
  };
};
