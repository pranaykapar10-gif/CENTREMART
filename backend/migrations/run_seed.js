import { seedProducts } from '../seed.js';

async function run() {
  try {
    await seedProducts();
    console.log('Seeding finished.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
