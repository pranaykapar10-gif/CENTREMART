'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context for Dark Mode Support
 */
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 * Wraps application to provide theme context
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Determine system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve the actual theme to use
  const resolveTheme = (themeValue: Theme): 'light' | 'dark' => {
    if (themeValue === 'system') {
      return getSystemTheme();
    }
    return themeValue;
  };

  // Apply theme to document
  const applyTheme = (themeValue: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (themeValue === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Initialize theme from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = (savedTheme || 'system') as Theme;
    const resolved = initialTheme === 'system' ? getSystemTheme() : initialTheme;

    // Apply immediately to prevent flash
    applyTheme(resolved);
    
    // Update state after applying theme
    Promise.resolve().then(() => {
      setThemeState(initialTheme);
      setResolvedTheme(resolved);
      setMounted(true);
    });

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (initialTheme === 'system') {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle theme changes
  const handleSetTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Dispatch custom event for theme changes
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme, resolved } }));
  };

  // Toggle between light and dark
  const handleToggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    handleSetTheme(newTheme);
  };

  // Prevent flash of wrong theme
  // Always provide the context to avoid components calling `useTheme`
  // outside of a provider during hydration. While the actual resolved
  // theme may update after mount, exposing a safe default prevents
  // runtime errors in client components rendered before the effect runs.
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: handleSetTheme,
        toggleTheme: handleToggleTheme,
      }}
    >
      {/* Hide content until we've applied the correct theme to avoid FOUC */}
      <div className={mounted ? undefined : 'invisible'}>{children}</div>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
