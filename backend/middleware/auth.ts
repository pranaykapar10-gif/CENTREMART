import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Middleware to verify JWT token and optionally check for admin role.
 * Supports ADMIN_FORCE_TOKEN for emergency/CI access.
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    // 1. Check for ADMIN_FORCE_TOKEN bypass
    const forceToken = process.env.ADMIN_FORCE_TOKEN;
    if (forceToken && token === forceToken) {
        req.user = { role: 'admin', id: 'system', email: 'admin@system.local' };
        return next();
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * Middleware to restrict access to admin users only.
 * Must be used AFTER verifyToken.
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
};