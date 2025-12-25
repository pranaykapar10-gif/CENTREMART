
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgresql://postgres.tmbyvapcqseqhtqxmejr:Pranay%4012345@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
