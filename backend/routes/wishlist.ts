import express, { Response } from 'express';
import { pool } from '../server';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Get user's wishlist
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT w.*, p.name, p.price, p.image_url, p.stock_quantity, p.rating, p.review_count
             FROM wishlist w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = $1
             ORDER BY w.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Wishlist Error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// 2. Check if product is in wishlist
router.get('/check/:productId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const result = await pool.query(
            'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        res.json({ isWishlisted: result.rows.length > 0 });
    } catch (error) {
        console.error('Check Wishlist Error:', error);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
});

// 3. Add to wishlist
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { product_id } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `INSERT INTO wishlist (user_id, product_id) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id, product_id) DO NOTHING
             RETURNING *`,
            [userId, product_id]
        );

        res.status(201).json(result.rows[0] || { message: 'Already in wishlist' });
    } catch (error) {
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// 3. Remove from wishlist
router.delete('/:productId', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        await pool.query(
            'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

export default router;
