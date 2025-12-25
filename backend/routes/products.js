import express from 'express';
import { pool } from '../index.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get all products with filters
router.get('/', async(req, res) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1 } = req.query;
        const limit = 12;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products WHERE status = $1';
        let params = ['active'];
        let paramCount = 1;

        if (category) {
            paramCount++;
            query += ` AND category_id = $${paramCount}`;
            params.push(category);
        }

        if (minPrice) {
            paramCount++;
            query += ` AND price >= $${paramCount}`;
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            paramCount++;
            query += ` AND price <= $${paramCount}`;
            params.push(parseFloat(maxPrice));
        }

        if (search) {
            paramCount++;
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get product by ID
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [
            id,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (admin only)
router.post('/', verifyToken, async(req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            quantity,
            categoryId,
            images,
        } = req.body;

        const result = await pool.query(
            'INSERT INTO products (name, slug, description, price, quantity, category_id, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [name, slug, description, price, quantity, categoryId, JSON.stringify(images), 'active']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;