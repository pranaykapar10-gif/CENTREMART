// JWT token management and authentication utilities

// Manual JWT decode without external dependency
const manualJwtDecode = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as DecodedToken;
  } catch {
    return null;
  }
};

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'staff';
}

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Generate mock JWT token (normally done by backend)
export const generateMockToken = (user: User, expiresIn: number = 3600): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };

  // Simple base64 encoding (this is a mock - real JWTs are cryptographically signed)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Generate mock refresh token (longer expiry for refresh)
export const generateMockRefreshToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const encodedPayload = btoa(JSON.stringify(payload));
  return `refresh.${encodedPayload}.mock`;
};

// Store tokens in localStorage
export const storeTokens = (accessToken: string, refreshToken: string, user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Retrieve access token
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Retrieve refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

// Retrieve stored user
export const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = manualJwtDecode(token);
    if (!decoded) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Decode token to get payload
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return manualJwtDecode(token);
  } catch {
    return null;
  }
};

// Clear all auth data
export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Get Authorization header
export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Validate token is still valid
export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
};

// Refresh token by calling backend (mock implementation)
export const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    // TODO: Call actual backend endpoint to refresh token
    // const response = await fetch('/api/auth/refresh', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ refreshToken }),
    // });
    // const data = await response.json();
    // return data;

    // Mock: generate new tokens
    const user = getStoredUser();
    if (!user) return null;

    const newAccessToken = generateMockToken(user);
    const newRefreshToken = generateMockRefreshToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};
