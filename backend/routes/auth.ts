import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../server';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name', [email, hashedPassword, name]
        );

        const token = jwt.sign(
            { id: result.rows[0].id, role: 'customer' }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '7d' }
        );

        res.json({
            user: result.rows[0],
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role || 'customer' }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '7d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Profile
router.get('/profile', verifyToken, async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, name, email, phone, avatar_url, status, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile
router.put('/profile', verifyToken, async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, phone, avatar_url } = req.body;

        const result = await pool.query(
            'UPDATE users SET name = $1, phone = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, phone, avatar_url',
            [name, phone, avatar_url, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;