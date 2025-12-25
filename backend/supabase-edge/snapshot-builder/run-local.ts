import dotenv from 'dotenv';
dotenv.config();

import { buildSnapshot } from './index';

(async () => {
  try {
    const res = await buildSnapshot(true);
    console.log('Local snapshot build result:', res);
  } catch (e) {
    console.error('Local build failed:', e);
  }
})();
