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
  const login = useCallback(async (email: string, _password: string) => {
    try {
      setIsLoading(true);

      // TODO: Call actual backend login endpoint
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Mock login - generate tokens
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'customer',
      };

      const accessToken = generateMockToken(mockUser);
      const refreshToken = generateMockRefreshToken(mockUser);

      storeTokens(accessToken, refreshToken, mockUser);
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
  const signup = useCallback(async (name: string, email: string, _password: string) => {
    try {
      setIsLoading(true);

      // TODO: Call actual backend signup endpoint
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await response.json();

      // Mock signup - auto login user
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role: 'customer',
      };

      const accessToken = generateMockToken(mockUser);
      const refreshToken = generateMockRefreshToken(mockUser);

      storeTokens(accessToken, refreshToken, mockUser);
      setUser(mockUser);
      setIsAuthenticated(true);

      console.log('Signup successful:', mockUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
