'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/user';
import { UserRole } from '@/types/navigation';
import { DEFAULT_PREVIEW_USER } from '@/lib/navigation-config';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '@/lib/api-client';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendUserToProfile(backendUser: any): UserProfile {
  const roleMap: Record<string, UserRole> = {
    administrator: 'admin',
    admin: 'admin',
    agent: 'agent',
    employee: 'employee',
  };

  const mappedRole: UserRole = roleMap[backendUser.role] || 'admin';

  return {
    id: backendUser.id,
    name: backendUser.name || 'User',
    email: backendUser.email,
    role: mappedRole,
    status: 'online',
    department: backendUser.department || 'General',
    title: backendUser.title || (mappedRole === 'admin' ? 'Administrator' : mappedRole === 'agent' ? 'Support Agent' : 'Employee'),
    avatarUrl: backendUser.avatarUrl || undefined,
    phone: backendUser.phone || undefined,
    bio: backendUser.bio || undefined,
    timezone: 'America/New_York (UTC-5)',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_PREVIEW_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const refreshUser = useCallback(async () => {
    const existingToken = getStoredToken();
    if (!existingToken) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.auth.me();
      if (userData) {
        const profile = mapBackendUserToProfile(userData);
        setUser(profile);
        setToken(existingToken);
        setIsAuthenticated(true);
      }
    } catch {
      removeStoredToken();
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res && res.accessToken) {
        setStoredToken(res.accessToken);
        setToken(res.accessToken);
        const profile = mapBackendUserToProfile(res.user);
        setUser(profile);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout request errors
    } finally {
      removeStoredToken();
      setToken(null);
      setUser(DEFAULT_PREVIEW_USER);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
