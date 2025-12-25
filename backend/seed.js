import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export async function seedProducts() {
    try {
        console.log('Seeding sample products...');

        const products = [{
                name: 'Wireless Headphones',
                slug: 'wireless-headphones',
                sku: 'WH-001',
                description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
                price: 149.99,
                quantity: 50,
                featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
            },
            {
                name: 'Smart Watch',
                slug: 'smart-watch',
                sku: 'SW-001',
                description: 'Advanced fitness tracking and notifications on your wrist',
                price: 299.99,
                quantity: 30,
                featured_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
            },
            {
                name: 'USB-C Cable',
                slug: 'usb-c-cable',
                sku: 'USBC-001',
                description: 'Fast charging and data transfer USB-C cable',
                price: 19.99,
                quantity: 200,
                featured_image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
            },
            {
                name: 'Portable Speaker',
                slug: 'portable-speaker',
                sku: 'PS-001',
                description: 'Waterproof Bluetooth speaker with 360-degree sound',
                price: 89.99,
                quantity: 45,
                featured_image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
            },
            {
                name: 'Phone Stand',
                slug: 'phone-stand',
                sku: 'PS-002',
                description: 'Adjustable phone stand for desk and table',
                price: 24.99,
                quantity: 100,
                featured_image: 'https://images.unsplash.com/photo-1605558924456-a53c2c84c012?w=500&h=500&fit=crop',
            },
            {
                name: '4K Webcam',
                slug: '4k-webcam',
                sku: 'W-001',
                description: 'Professional 4K webcam with auto-focus and noise reduction',
                price: 199.99,
                quantity: 25,
                featured_image: 'https://images.unsplash.com/photo-1598888129605-76f0ee26e980?w=500&h=500&fit=crop',
            },
            {
                name: 'Keyboard',
                slug: 'mechanical-keyboard',
                sku: 'KB-001',
                description: 'RGB mechanical keyboard with custom switches',
                price: 129.99,
                quantity: 35,
                featured_image: 'https://images.unsplash.com/photo-1587829191301-c82b5b8fcc88?w=500&h=500&fit=crop',
            },
            {
                name: 'Mouse',
                slug: 'wireless-mouse',
                sku: 'M-001',
                description: 'Ergonomic wireless mouse with precision tracking',
                price: 49.99,
                quantity: 60,
                featured_image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
            },
        ];

        // ensure an 'Uncategorized' category exists and get its id
        const { rows } = await pool.query(
            `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
            ['Uncategorized', 'uncategorized']
        );
        const categoryId = rows[0].id;

        for (const product of products) {
            await pool.query(
                `INSERT INTO products (name, slug, sku, description, price, stock_quantity, image_url, status, category_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`, [
                    product.name,
                    product.slug,
                    product.sku || product.slug,
                    product.description,
                    product.price,
                    product.quantity || 0,
                    product.featured_image || null,
                    'active',
                    categoryId,
                ]
            );
        }

        console.log('Sample products seeded successfully!');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}