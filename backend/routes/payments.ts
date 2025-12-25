import express, { Request, Response } from 'express';
import { pool } from '../server';
import { verifyToken, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import axios from 'axios';

const router = express.Router();

// eSewa Config (Sandbox by default)
const ESEWA_SECRET = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q(';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_URL = process.env.NODE_ENV === 'production' 
    ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
    : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

// Khalti Config (Sandbox by default)
const KHALTI_SECRET = process.env.KHALTI_SECRET_KEY || 'Key 05bf95cc57244045b8df5fad06748dab';
const KHALTI_URL = process.env.NODE_ENV === 'production'
    ? 'https://khalti.com/api/v2/epayment/initiate/'
    : 'https://dev.khalti.com/api/v2/epayment/initiate/';

// Helper to generate eSewa signature
const generateEsewaSignature = (total_amount: string, transaction_uuid: string, product_code: string) => {
    const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    return crypto.createHmac('sha256', ESEWA_SECRET).update(data).digest('base64');
};

// 1. eSewa Initiation
router.post('/esewa/initiate', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { amount, transaction_uuid } = req.body;
        const total_amount = amount.toString();
        
        const signature = generateEsewaSignature(total_amount, transaction_uuid, ESEWA_PRODUCT_CODE);

        const formData = {
            amount: amount,
            failure_url: `${process.env.FRONTEND_URL}/checkout?status=failed`,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: ESEWA_PRODUCT_CODE,
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${process.env.FRONTEND_URL}/api/payments/esewa/verify`,
            tax_amount: "0",
            total_amount: total_amount,
            transaction_uuid: transaction_uuid
        };

        res.json({ url: ESEWA_URL, formData });
    } catch (error) {
        console.error('eSewa Initiation Error:', error);
        res.status(500).json({ error: 'Failed to initiate eSewa payment' });
    }
});

// 2. Khalti Initiation
router.post('/khalti/initiate', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { amount, purchase_order_id, purchase_order_name } = req.body;

        const response = await axios.post(KHALTI_URL, {
            return_url: `${process.env.FRONTEND_URL}/checkout/verify-khalti`,
            website_url: process.env.FRONTEND_URL,
            amount: amount * 100, // Khalti expects paisa
            purchase_order_id,
            purchase_order_name,
            customer_info: {
                name: req.user.name || 'Customer',
                email: req.user.email,
                phone: '9800000000' // Placeholder or from user profile
            }
        }, {
            headers: { 'Authorization': KHALTI_SECRET }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Khalti Initiation Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initiate Khalti payment' });
    }
});

// 3. eSewa Verification (Callback)
router.get('/esewa/verify', async (req: Request, res: Response) => {
    const { data } = req.query;
    if (!data) return res.redirect(`${process.env.FRONTEND_URL}/checkout?status=error`);

    try {
        const decodedData = JSON.parse(Buffer.from(data as string, 'base64').toString('utf-8'));
        const { transaction_uuid, total_amount, status, transaction_code } = decodedData;

        if (status === 'COMPLETE') {
            // Update order in DB by transaction UUID stored in transaction_id
            const updateRes = await pool.query(
                'UPDATE orders SET status = $1, payment_status = $2, transaction_id = $3 WHERE id::text = $4 RETURNING id',
                ['processing', 'paid', transaction_code, transaction_uuid]
            );
            
            if (updateRes.rows.length > 0) {
                res.redirect(`${process.env.FRONTEND_URL}/order-success?id=${updateRes.rows[0].id}`);
            } else {
                res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failed`);
            }
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failed`);
        }
    } catch (error) {
        console.error('eSewa Verification Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/checkout?status=error`);
    }
});

// 4. Khalti Verification
router.post('/khalti/verify', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { pidx, purchase_order_id } = req.body;
        const VERIFY_URL = process.env.NODE_ENV === 'production'
            ? 'https://khalti.com/api/v2/epayment/lookup/'
            : 'https://dev.khalti.com/api/v2/epayment/lookup/';

        const response = await axios.post(VERIFY_URL, { pidx }, {
            headers: { 'Authorization': KHALTI_SECRET }
        });

        if (response.data.status === 'Completed') {
            // Update order in DB - find by transaction UUID (stored as order ID)
            const updateRes = await pool.query(
                'UPDATE orders SET status = $1, payment_status = $2, transaction_id = $3 WHERE id::text = $4 RETURNING id',
                ['processing', 'paid', response.data.transaction_id, purchase_order_id]
            );
            
            if (updateRes.rows.length > 0) {
                res.json({ success: true, orderId: updateRes.rows[0].id });
            } else {
                res.status(400).json({ error: 'Order not found' });
            }
        } else {
            res.status(400).json({ error: 'Payment not completed', status: response.data.status });
        }
    } catch (error: any) {
        console.error('Khalti Verification Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Verification failed' });
    }
});

export default router;