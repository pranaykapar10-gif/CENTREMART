import express from 'express';
import { pool } from '../index.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', verifyToken, async(req, res) => {
    try {
        const { id: userId } = req.user;

        const result = await pool.query(
            `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.featured_image 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.user_id = $1`, [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to cart
router.post('/add', verifyToken, async(req, res) => {
    try {
        const { id: userId } = req.user;
        const { productId, quantity } = req.body;

        const existing = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]
        );

        if (existing.rows.length > 0) {
            const result = await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [quantity, userId, productId]
            );
            return res.json(result.rows[0]);
        }

        const result = await pool.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [userId, productId, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from cart
router.delete('/:id', verifyToken, async(req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        await pool.query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [id, userId]
        );

        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update quantity
router.put('/:id', verifyToken, async(req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const { quantity } = req.body;

        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [quantity, id, userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;