import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is required.');
    process.exit(1);
}

// Check if the password placeholder is still present
if (connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('Error: The connection string still contains the placeholder [YOUR-PASSWORD]. Please replace it with the actual database password.');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Supabase connections
    }
});

async function runMigrations() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, '001_create_snapshot_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration: 001_create_snapshot_tables.sql');
        await client.query(sql);

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();