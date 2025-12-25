// API fetch wrapper with automatic auth header injection
import { getAccessToken, getAuthHeader, isTokenExpired, refreshAccessToken } from '@/lib/auth';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

// Main API fetch wrapper
export const apiFetch = async <T,>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { skipAuth = false, headers = {}, ...restOptions } = options;

  try {
    // Add auth header if not skipped
    let authHeaders: Record<string, string> = {};
    if (!skipAuth) {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        // Try to refresh token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          return {
            success: false,
            error: 'Authentication failed',
            status: 401,
          };
        }
      }
      authHeaders = getAuthHeader();
    }

    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  }
};

// GET request
export const apiGet = <T,>(url: string, options?: FetchOptions) => {
  return apiFetch<T>(url, { ...options, method: 'GET' });
};

// POST request
export const apiPost = <T,>(
  url: string,
  body?: Record<string, unknown>,
  options?: FetchOptions
) => {
  return apiFetch<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
};

// PUT request
export const apiPut = <T,>(
  url: string,
  body?: Record<string, unknown>,
  options?: FetchOptions
) => {
  return apiFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
};

// DELETE request
export const apiDelete = <T,>(url: string, options?: FetchOptions) => {
  return apiFetch<T>(url, { ...options, method: 'DELETE' });
};

// PATCH request
export const apiPatch = <T,>(
  url: string,
  body?: Record<string, unknown>,
  options?: FetchOptions
) => {
  return apiFetch<T>(url, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
};
