import pg from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is required.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testTrigger() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // 1. Insert a new product
    const slug = `test-product-${Date.now()}`;
    console.log(`Inserting product: ${slug}`);
    
    // Ensure category exists
    const catRes = await client.query("SELECT id FROM categories LIMIT 1");
    let catId = catRes.rows[0]?.id;
    if (!catId) {
        const newCat = await client.query("INSERT INTO categories (name, slug) VALUES ('Test Cat', 'test-cat') RETURNING id");
        catId = newCat.rows[0].id;
    }

    const insertRes = await client.query(
      `INSERT INTO products (name, slug, sku, description, price, stock_quantity, category_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      ['Test Product', slug, slug, 'A test product', 99.99, 10, catId, 'active']
    );
    const newProductId = insertRes.rows[0].id;
    console.log(`Inserted product ID: ${newProductId}`);

    // 2. Check the queue
    console.log('Checking products_changes_queue...');
    const queueRes = await client.query(
      `SELECT * FROM products_changes_queue WHERE product_id = $1`,
      [String(newProductId)]
    );

    if (queueRes.rows.length > 0) {
      console.log('SUCCESS: Found entry in queue:', queueRes.rows[0]);
    } else {
      console.error('FAILURE: No entry found in queue for the new product.');
    }

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await client.end();
  }
}

testTrigger();
