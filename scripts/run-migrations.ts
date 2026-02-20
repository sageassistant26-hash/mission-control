/**
 * run-migrations.ts
 * Runs all pending DB migrations.
 * Run: npx tsx scripts/run-migrations.ts
 */
import { getDb, closeDb } from '../src/lib/db/index';

console.log('🔄 Running migrations...');
const db = getDb();
console.log('✅ Migrations complete!');
closeDb();
