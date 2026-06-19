'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { socketManager } from '@/lib/socket';
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
  profilePhotoUrl?: string;
  permissions: Record<
    string,
    { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }
  >;
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
      if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') {
        try {
          await apiRefreshToken();
        } catch (err) {
          console.error('Initial token refresh failed:', err);
        }
      }
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

  const login = useCallback(async (credentials: any): Promise<User | undefined> => {
    const response = await apiLogin(credentials);
    const userData = response.data?.user;
    if (userData) {
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
      }
    }
    return userData;
  }, []);

  const logout = useCallback(async () => {
    socketManager.disconnect();
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
  }, []);

  const refresh = useCallback(async () => {
    await apiRefreshToken();
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

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
