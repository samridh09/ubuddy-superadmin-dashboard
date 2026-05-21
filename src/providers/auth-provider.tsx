'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import axiosClient from '@/lib/axios';
import { authManager } from '@/lib/auth-manager';
import { forceLogout } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api';
import { useInactivityTimer } from '@/hooks/use-inactivity-timer';
import type { UserProfile } from '@/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (access: string, refresh: string, user: UserProfile) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkSession = useCallback(async () => {
    if (!authManager.isAuthenticated()) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data: res } = await axiosClient.get(API_ENDPOINTS.user.me);
      if (res.success) {
        setIsAuthenticated(true);
        setUser(res.data);
      } else {
        throw new Error('Session invalid');
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      // Don't force logout here — axios interceptor handles 401s
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state and show deferred logout reason toast
  useEffect(() => {
    checkSession();

    const reason = localStorage.getItem('logout_reason');
    if (reason) {
      toast.error(reason, { position: 'top-center' });
      localStorage.removeItem('logout_reason');
    }
  }, [checkSession]);

  // Monitor inactivity only for logged-in users
  useInactivityTimer(isAuthenticated);

  const login = useCallback((access: string, refresh: string, userData: UserProfile) => {
    authManager.setTokens(access, refresh, userData.role);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('schoolId', userData.school_id);

    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    forceLogout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
