'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { refreshSnapshot } from '@/lib/search/smartSearch';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        // Try a background refresh
        refreshSnapshot().catch(() => {});
      }).catch(() => {});
    } else {
      // Fallback: manual refresh of snapshot
      refreshSnapshot().catch(() => {});
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation />
        {children}
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
}
