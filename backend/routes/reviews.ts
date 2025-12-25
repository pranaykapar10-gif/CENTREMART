import express, { Response } from 'express';
import { pool } from '../server';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await pool.query(
            `SELECT r.*, u.name as user_name, u.avatar_url 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = $1 AND r.status = 'approved' 
             ORDER BY r.created_at DESC`,
            [productId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// 2. Post a review
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { product_id, rating, title, comment } = req.body;
        const userId = req.user.id;

        // Check if user already reviewed this product
        const existing = await pool.query(
            'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
            [product_id, userId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Check if user actually bought the product (optional but recommended)
        const purchase = await pool.query(
            `SELECT oi.id 
             FROM order_items oi 
             JOIN orders o ON oi.order_id = o.id 
             WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'delivered'`,
            [userId, product_id]
        );

        const isVerified = purchase.rows.length > 0;

        const result = await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [product_id, userId, rating, title, comment, isVerified, 'approved'] // Auto-approving for now
        );

        // Update product rating average
        await pool.query(
            `UPDATE products 
             SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1 AND status = 'approved'),
                 review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1 AND status = 'approved')
             WHERE id = $1`,
            [product_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Post Review Error:', error);
        res.status(500).json({ error: 'Failed to post review' });
    }
});

// 3. Mark review as helpful/unhelpful
router.post('/:id/vote', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'helpful' or 'unhelpful'

        if (type === 'helpful') {
            await pool.query('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1', [id]);
        } else if (type === 'unhelpful') {
            await pool.query('UPDATE reviews SET unhelpful_count = unhelpful_count + 1 WHERE id = $1', [id]);
        }

        res.json({ message: 'Vote recorded' });
    } catch (error) {
        console.error('Vote Review Error:', error);
        res.status(500).json({ error: 'Failed to record vote' });
    }
});

export default router;
