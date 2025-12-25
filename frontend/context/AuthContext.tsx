'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  generateMockToken,
  generateMockRefreshToken,
  storeTokens,
  getAccessToken,
  getStoredUser,
  clearAuth,
  isTokenExpired,
  refreshAccessToken,
  type User,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getAccessToken();

    if (storedUser && token && !isTokenExpired(token)) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  // Login handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const { user: userData, token } = data;

      const mockUser: User = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.email.split('@')[0],
        role: userData.role || 'customer',
      };

      storeTokens(token, token, mockUser); // Using same token for refresh for now as mock
      setUser(mockUser);
      setIsAuthenticated(true);

      console.log('Login successful:', mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      const { user: userData, token } = data;

      const mockUser: User = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'customer',
      };

      storeTokens(token, token, mockUser);
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile handler
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local state and storage
      const newUser = { ...user, ...updatedUser } as User;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  }, [user]);

  // Logout handler
  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    console.log('Logout successful');
  }, []);

  // Token refresh handler
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const result = await refreshAccessToken();
      if (result && user) {
        storeTokens(result.accessToken, result.refreshToken, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [user, logout]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
