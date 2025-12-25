import stripe from 'stripe';
import express from 'express';
import { pool } from '../index.js';
import verifyToken from '../middleware/auth.js';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post('/checkout', verifyToken, async(req, res) => {
    try {
        const { id: userId } = req.user;
        const { items, shippingAddress, billingAddress } = req.body;

        // Get cart items with product details
        const cartItems = await pool.query(
            `SELECT ci.quantity, p.id, p.name, p.price, p.featured_image 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.user_id = $1`, [userId]
        );

        const lineItems = cartItems.rows.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    image: item.featured_image,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`,
            customer_email: req.user.email,
            metadata: {
                userId,
            },
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async(req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripeClient.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;

            // Create order in database
            const orderResult = await pool.query(
                'INSERT INTO orders (user_id, status, total, payment_status) VALUES ($1, $2, $3, $4) RETURNING id', [userId, 'processing', session.amount_total / 100, 'paid']
            );

            // Clear cart
            await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        }

        res.json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

export default router;