'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  getCurrentUser as apiGetCurrentUser,
} from '@/app/services/api/auth.api';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  permissions: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<User | undefined>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await apiGetCurrentUser();
      const userData = response.data?.user || response.data;
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: any): Promise<User | undefined> => {
    const response = await apiLogin(credentials);
    const userData = response.data?.user;
    if (userData) {
      setUser(userData);
    }
    return userData;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
  };

  const refresh = async () => {
    await apiRefreshToken();
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

