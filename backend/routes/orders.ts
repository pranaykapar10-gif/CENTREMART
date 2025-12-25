import express, { Response } from 'express';
import { pool } from '../server';
import { verifyToken, AuthRequest, isAdmin } from '../middleware/auth';

const router = express.Router();

// 1. Create a new order (COD or Payment Initiation)
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    const client = await pool.connect();
    try {
        const {
            items,
            shipping_address,
            payment_method,
            subtotal,
            shipping_cost,
            tax_amount,
            total_amount,
            customer_notes
        } = req.body;

        const userId = req.user.id;
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        await client.query('BEGIN');

        // Insert into orders table
        const orderRes = await client.query(
            `INSERT INTO orders (
                order_number, user_id, status, payment_status, 
                subtotal, shipping_cost, tax_amount, total_amount,
                shipping_address_line1, shipping_address_line2, shipping_city, 
                shipping_state, shipping_zip, shipping_country,
                billing_address_line1, billing_address_line2, billing_city,
                billing_state, billing_zip, billing_country,
                payment_method, customer_notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id`,
            [
                orderNumber, userId, 'pending', payment_method === 'cod' ? 'pending' : 'pending',
                subtotal, shipping_cost, tax_amount, total_amount,
                shipping_address.line1, shipping_address.line2 || '', shipping_address.city,
                shipping_address.state, shipping_address.zip, shipping_address.country,
                shipping_address.line1, shipping_address.line2 || '', shipping_address.city,
                shipping_address.state, shipping_address.zip, shipping_address.country,
                payment_method, customer_notes
            ]
        );

        const orderId = orderRes.rows[0].id;

        // Insert order items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (
                    order_id, product_id, variant_id, quantity, 
                    unit_price, total_price, product_name, sku
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    orderId, item.product_id, item.variant_id || null, item.quantity,
                    item.price, item.price * item.quantity, item.name, item.sku || ''
                ]
            );

            // Update stock
            await client.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart for this user
        await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
            orderNumber: orderNumber
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order Creation Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    } finally {
        client.release();
    }
});

// 2. Get user's order history
router.get('/my-orders', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// 3. Get order details
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;

        const orderRes = await pool.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const itemsRes = await pool.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [orderId]
        );

        res.json({
            ...orderRes.rows[0],
            items: itemsRes.rows
        });
    } catch (error) {
        console.error('Fetch Order Details Error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

// 4. Admin: Get all orders with filters and pagination
router.get('/admin/all', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { status, payment_status, search, page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const offset = (pageNum - 1) * limitNum;

        let query = 'SELECT * FROM orders WHERE 1=1';
        let params: any[] = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (payment_status) {
            paramCount++;
            query += ` AND payment_status = $${paramCount}`;
            params.push(payment_status);
        }

        if (search) {
            paramCount++;
            query += ` AND (order_number ILIKE $${paramCount} OR shipping_city ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
            params.push(`%${search}%`);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0].count);

        // Get paginated results
        query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limitNum, offset);

        const result = await pool.query(query, params);
        
        res.json({
            orders: result.rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Admin Fetch Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// 5. Admin: Get specific order details
router.get('/admin/:id', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const orderId = req.params.id;

        const orderRes = await pool.query(
            `SELECT o.*, u.name, u.email, u.phone 
             FROM orders o 
             LEFT JOIN users u ON o.user_id = u.id 
             WHERE o.id = $1`,
            [orderId]
        );

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const itemsRes = await pool.query(
            `SELECT oi.*, p.name as product_name, p.image_url 
             FROM order_items oi 
             LEFT JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = $1`,
            [orderId]
        );

        res.json({
            ...orderRes.rows[0],
            items: itemsRes.rows
        });
    } catch (error) {
        console.error('Admin Fetch Order Details Error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// 6. Admin: Update order status
router.put('/admin/:id', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const orderId = req.params.id;
        const {
            status,
            payment_status,
            fulfillment_status,
            tracking_number,
            admin_notes
        } = req.body;

        let updateQuery = 'UPDATE orders SET updated_at = NOW()';
        let params: any[] = [];
        let paramCount = 1;

        if (status !== undefined) {
            paramCount++;
            updateQuery += `, status = $${paramCount}`;
            params.push(status);
        }

        if (payment_status !== undefined) {
            paramCount++;
            updateQuery += `, payment_status = $${paramCount}`;
            params.push(payment_status);
        }

        if (fulfillment_status !== undefined) {
            paramCount++;
            updateQuery += `, fulfillment_status = $${paramCount}`;
            params.push(fulfillment_status);
        }

        if (tracking_number !== undefined) {
            paramCount++;
            updateQuery += `, tracking_number = $${paramCount}`;
            params.push(tracking_number);
        }

        if (admin_notes !== undefined) {
            paramCount++;
            updateQuery += `, admin_notes = $${paramCount}`;
            params.push(admin_notes);
        }

        updateQuery += ` WHERE id = $${paramCount + 1} RETURNING *`;
        params.push(orderId);

        const result = await pool.query(updateQuery, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            message: 'Order updated successfully',
            order: result.rows[0]
        });
    } catch (error) {
        console.error('Admin Update Order Error:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

export default router;
