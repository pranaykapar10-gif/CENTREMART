'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { errorLogger } from '@/lib/errors';

/**
 * Error Boundary Component
 * Catches and displays errors with graceful fallback
 */
export class ErrorBoundary extends React.Component<
  {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorLogger.log(error, { errorInfo }, 'critical');
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, () =>
          this.setState({ hasError: false })
        ) || <DefaultErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false })} />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Something went wrong
          </h1>

          <p className="text-center text-gray-600 mb-6">
            An unexpected error occurred. Please try again or contact support.
          </p>

          <details className="bg-gray-50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
            <summary className="cursor-pointer font-mono text-sm text-gray-600">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try again
            </button>

            <Link
              href="/"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Async error boundary wrapper for async operations
 */
export function useAsyncError() {
  const [, setError] = React.useState();

  React.useEffect(() => {
    if (setError) {
      setError(undefined);
    }
  }, []);

  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}
