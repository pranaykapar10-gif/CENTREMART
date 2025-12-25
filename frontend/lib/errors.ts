/**
 * Error Handling and Logging Utilities
 */

/**
 * Error logging service
 */
export interface ErrorLog {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private endpoint = process.env.NEXT_PUBLIC_ERROR_LOG_ENDPOINT;

  /**
   * Log an error
   */
  log(error: Error | string, context?: Record<string, unknown>, severity: ErrorLog['severity'] = 'medium') {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      severity,
    };

    this.logs.push(errorLog);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console.error('[ErrorLogger]', errorLog);

    // Report to external service if critical
    if (severity === 'critical' && this.endpoint) {
      this.reportToService(errorLog);
    }
  }

  /**
   * Report error to external service
   */
  private reportToService(errorLog: ErrorLog) {
    if (!this.endpoint) return;

    navigator.sendBeacon(
      this.endpoint,
      JSON.stringify(errorLog)
    );
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Global error logger instance
 */
export const errorLogger = new ErrorLogger();

/**
 * Set up global error handlers
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    errorLogger.log(
      event.error || event.message,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      'high'
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.log(
      event.reason,
      { type: 'unhandledRejection' },
      'high'
    );
  });
}

/**
 * Error boundary utilities for React
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Try-catch wrapper for async functions
 */
export const asyncHandler = <T extends (...args: Parameters<T>) => Promise<unknown>>(
  fn: T
): ((...args: Parameters<T>) => Promise<unknown>) => {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.log(
        error instanceof Error ? error : String(error),
        { functionName: fn.name },
        'high'
      );
      throw error;
    }
  };
};

/**
 * Safe API call wrapper
 */
export interface SafeAPIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export const safeApiFetch = async <T,>(
  url: string,
  options?: RequestInit
): Promise<SafeAPIResponse<T>> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      errorLogger.log(
        `API Error: ${response.statusText}`,
        { url, status: response.status },
        response.status >= 500 ? 'critical' : 'medium'
      );
      return { error: response.statusText, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    errorLogger.log(
      error instanceof Error ? error : String(error),
      { url, type: 'fetch_error' },
      'high'
    );
    return { error: 'Failed to fetch', status: 0 };
  }
};

/**
 * Retry mechanism for failed requests
 */
export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export const retryAsync = async <T,>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts && shouldRetry(lastError, attempt)) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retry attempts exceeded');
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T = unknown,>(
  json: string,
  fallback?: T
): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    errorLogger.log(
      `JSON parse error: ${error}`,
      { input: json.substring(0, 100) },
      'low'
    );
    return fallback as T;
  }
};

/**
 * Safe localStorage access
 */
export const safeLocalStorage = {
  getItem: <T = unknown,>(key: string, fallback?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback ?? null;
    } catch (error) {
      errorLogger.log(`localStorage error: ${error}`, { key }, 'low');
      return fallback ?? null;
    }
  },

  setItem: (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      errorLogger.log(`localStorage error: ${error}`, { key }, 'low');
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      errorLogger.log(`localStorage error: ${error}`, { key }, 'low');
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      errorLogger.log(`localStorage clear error: ${error}`, {}, 'low');
      return false;
    }
  },
};

/**
 * Graceful degradation utilities
 */
export const withFallback = async <T,>(
  primary: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> => {
  try {
    return await primary();
  } catch (error) {
    errorLogger.log(
      error instanceof Error ? error : String(error),
      { type: 'fallback_used' },
      'medium'
    );
    return fallback instanceof Function ? await fallback() : fallback;
  }
};

/**
 * Network status utilities
 */
export const networkStatus = {
  isOnline: () => typeof navigator !== 'undefined' && navigator.onLine,

  waitForOnline: () =>
    new Promise<void>((resolve) => {
      if (networkStatus.isOnline()) {
        resolve();
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);
    }),

  onStatusChange: (callback: (isOnline: boolean) => void) => {
    if (typeof window === 'undefined') return () => {};

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },
};

/**
 * Validation helpers with error handling
 */
export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  phone: (phone: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
  },

  creditCard: (cc: string): boolean => {
    const sanitized = cc.replace(/\s/g, '');
    const regex = /^[0-9]{13,19}$/;
    return regex.test(sanitized);
  },
};
