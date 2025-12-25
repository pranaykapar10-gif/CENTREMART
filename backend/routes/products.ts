import express, { Request, Response } from 'express';
import { pool } from '../server';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all categories
router.get('/categories', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Categories Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all products with filters
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, search, rating, inStock, page = 1 } = req.query;
        const limit = 12;
        const offset = (Number(page) - 1) * limit;

        let query = 'SELECT * FROM products WHERE status = $1';
        let params: any[] = ['active'];
        let paramCount = 1;

        if (category) {
            paramCount++;
            query += ` AND category_id = $${paramCount}`;
            params.push(category);
        }

        if (minPrice) {
            paramCount++;
            query += ` AND price >= $${paramCount}`;
            params.push(parseFloat(minPrice as string));
        }

        if (maxPrice) {
            paramCount++;
            query += ` AND price <= $${paramCount}`;
            params.push(parseFloat(maxPrice as string));
        }

        if (search) {
            paramCount++;
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (rating) {
            paramCount++;
            query += ` AND rating >= $${paramCount}`;
            params.push(parseFloat(rating as string));
        }

        if (inStock === 'true') {
            query += ` AND stock_quantity > 0`;
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

// Admin: Create product
router.post('/', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const { 
            name, description, short_description, price, category_id, stock_quantity, 
            image_url, sku, brand, cost_price, discount_price, discount_percentage,
            low_stock_threshold, seo_title, seo_description, seo_keywords
        } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const result = await pool.query(
            `INSERT INTO products (
                name, slug, description, short_description, price, category_id, 
                stock_quantity, image_url, sku, brand, cost_price, discount_price,
                discount_percentage, low_stock_threshold, seo_title, seo_description,
                seo_keywords, is_active, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, true, 'active') 
            RETURNING *`,
            [name, slug, description, short_description, price, category_id, stock_quantity, 
             image_url, sku, brand, cost_price || null, discount_price || null,
             discount_percentage || null, low_stock_threshold || 5, seo_title || name,
             seo_description || short_description || description, seo_keywords || '']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Update product
router.put('/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            name, description, short_description, price, category_id, stock_quantity, 
            image_url, status, brand, cost_price, discount_price, discount_percentage,
            low_stock_threshold, seo_title, seo_description, seo_keywords
        } = req.body;

        // Generate slug from name if name is being updated
        let slug = undefined;
        if (name) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }

        let updateQuery = 'UPDATE products SET updated_at = NOW()';
        let params: any[] = [];
        let paramCount = 0;

        const fields = {
            name, slug, description, short_description, price, category_id,
            stock_quantity, image_url, status, brand, cost_price,
            discount_price, discount_percentage, low_stock_threshold,
            seo_title, seo_description, seo_keywords
        };

        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                paramCount++;
                updateQuery += `, ${key} = $${paramCount}`;
                params.push(value);
            }
        }

        paramCount++;
        updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
        params.push(id);

        const result = await pool.query(updateQuery, params);
        
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Delete product
router.delete('/:id', verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Soft delete by setting status to inactive
        const result = await pool.query(
            'UPDATE products SET status = $1, is_active = false, updated_at = NOW() WHERE id = $2 RETURNING *',
            ['inactive', id]
        );
        
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        
        res.json({
            message: 'Product deleted successfully',
            product: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;