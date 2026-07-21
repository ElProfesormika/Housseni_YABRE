import 'dotenv/config';
import { initDb, query } from './db.js';
import { seedDatabase } from './seed.js';
import { migrateContent } from './migrate-content.js';

const TABLES = [
  'contact_messages',
  'social_links',
  'skills',
  'projects',
  'experiences',
  'certifications',
  'education',
  'site_settings',
  'admin_users',
  'profile',
];

export async function resetPortfolio() {
  await initDb();

  for (const table of TABLES) {
    await query(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
  }

  await seedDatabase();
  await migrateContent();

  console.log('✅ Portfolio réinitialisé pour Housséni YABRE.');
}

const isMain = process.argv[1]?.endsWith('reset.js');
if (isMain) {
  resetPortfolio()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
