/**
 * Security Utilities for Express Backend
 * Input validation, CSRF protection, rate limiting, secure headers, password hashing
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

/**
 * Input validation schemas and utilities
 */
export const validators = {
  /**
   * Email validation
   */
  isEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
   */
  isStrongPassword: (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  /**
   * Phone validation
   */
  isPhone: (phone: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
  },

  /**
   * URL validation
   */
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Credit card validation (Luhn algorithm)
   */
  isCreditCard: (cc: string): boolean => {
    const sanitized = cc.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Sanitize string input
   */
  sanitizeString: (input: string): string => {
    return input
      .replace(/[<>\"']/g, '') // Remove HTML chars
      .trim()
      .substring(0, 1000); // Limit length
  },

  /**
   * Sanitize object recursively
   */
  sanitizeObject: (obj: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        sanitized[key] = validators.sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = validators.sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    });

    return sanitized;
  },
};

/**
 * CSRF Token management
 */
export class CSRFTokenManager {
  private tokens: Map<string, { token: string; createdAt: number }> = new Map();
  private tokenExpiry = 3600000; // 1 hour

  /**
   * Generate new CSRF token
   */
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(sessionId, { token, createdAt: Date.now() });
    return token;
  }

  /**
   * Verify CSRF token
   */
  verifyToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);

    if (!stored) return false;

    // Check expiry
    if (Date.now() - stored.createdAt > this.tokenExpiry) {
      this.tokens.delete(sessionId);
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(stored.token),
      Buffer.from(token)
    );
  }

  /**
   * Revoke token
   */
  revokeToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }

  /**
   * Clean expired tokens
   */
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now - data.createdAt > this.tokenExpiry) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

/**
 * Rate limiting with sliding window
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];

    // Remove old requests outside window
    const recentRequests = timestamps.filter((t) => now - t < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    const recentRequests = timestamps.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

/**
 * Password hashing and comparison
 */
export const passwordSecurity = {
  /**
   * Hash password with bcrypt (using crypto as fallback for demo)
   */
  hashPassword: async (password: string, saltRounds = 10): Promise<string> => {
    // In production, use bcryptjs package
    // For demo purposes, using simple hashing
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  },

  /**
   * Verify password
   */
  verifyPassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    const [salt, hash] = hashedPassword.split(':');
    const computed = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
  },
};

/**
 * JWT token management
 */
export class JWTManager {
  private secret: string;
  private expiresIn = '24h';

  constructor(secret: string = process.env.JWT_SECRET || 'dev-secret') {
    this.secret = secret;
  }

  /**
   * Create JWT token payload (simplified - use jsonwebtoken in production)
   */
  createToken(payload: Record<string, unknown>): string {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ).toString('base64');

    const body = Buffer.from(JSON.stringify(payload)).toString('base64');

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${body}`)
      .digest('base64');

    return `${header}.${body}.${signature}`;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): Record<string, unknown> | null {
    try {
      const [header, body, signature] = token.split('.');

      const computedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${header}.${body}`)
        .digest('base64');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(body, 'base64').toString());
      return payload;
    } catch {
      return null;
    }
  }
}

/**
 * Express middleware for security
 */

/**
 * CSRF protection middleware
 */
export const csrfProtection = (csrfManager: CSRFTokenManager) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const sessionId = (req.session as any)?.id || req.ip;

    // Generate token for GET requests
    if (req.method === 'GET') {
      const token = csrfManager.generateToken(sessionId);
      res.locals.csrfToken = token;
    }

    // Verify token for POST/PUT/DELETE requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = req.body._csrf || req.headers['x-csrf-token'];

      if (!token || !csrfManager.verifyToken(sessionId, token as string)) {
        return res.status(403).json({ error: 'CSRF token invalid' });
      }
    }

    next();
  };
};

/**
 * Rate limiting middleware
 */
export const rateLimitMiddleware = (limiter: RateLimiter) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = (req.user as any)?.id || req.ip;

    if (!limiter.isAllowed(identifier)) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: 60,
      });
    }

    res.locals.remainingRequests = limiter.getRemaining(identifier);
    next();
  };
};

/**
 * Input validation middleware
 */
export const validateInput = (schema: Record<string, (val: unknown) => boolean>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Record<string, string> = {};

      Object.keys(schema).forEach((key) => {
        const value = req.body[key];
        if (!schema[key](value)) {
          errors[key] = `Invalid ${key}`;
        }
      });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Sanitize input
      req.body = validators.sanitizeObject(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid input' });
    }
  };
};

/**
 * Secure headers middleware (helmet-like)
 */
export const secureHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

/**
 * CORS configuration
 */
export const corsConfig = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://techstore.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

/**
 * Encryption utilities for sensitive data
 */
export const encryption = {
  /**
   * Encrypt sensitive data
   */
  encrypt: (data: string, key = process.env.ENCRYPTION_KEY || 'dev-key'): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key.padEnd(32, '0'), 'utf-8'), iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${encrypted.toString('hex')}:${tag.toString('hex')}`;
  },

  /**
   * Decrypt sensitive data
   */
  decrypt: (encrypted: string, key = process.env.ENCRYPTION_KEY || 'dev-key'): string => {
    try {
      const [ivHex, dataHex, tagHex] = encrypted.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const data = Buffer.from(dataHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key.padEnd(32, '0'), 'utf-8'), iv);
      decipher.setAuthTag(tag);
      
      return decipher.update(data) + decipher.final('utf-8');
    } catch {
      throw new Error('Decryption failed');
    }
  },
};
