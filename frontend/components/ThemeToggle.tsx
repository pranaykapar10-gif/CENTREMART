'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';

/**
 * Theme Toggle Button Component
 * Displays current theme and allows switching between light/dark modes
 */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-ring"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current theme: ${resolvedTheme}`}
    >
      {/* Sun Icon - Visible in Light Mode */}
      <Sun
        size={20}
        className="absolute text-warning-500 rotate-0 scale-100 transition-all dark:scale-0 dark:-rotate-90"
      />

      {/* Moon Icon - Visible in Dark Mode */}
      <Moon
        size={20}
        className="absolute text-primary-400 rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0"
      />
    </button>
  );
}
