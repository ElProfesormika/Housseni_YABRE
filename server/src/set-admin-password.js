import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, query } from './db.js';

/**
 * Met à jour le hash admin à partir de ADMIN_EMAIL / ADMIN_PASSWORD.
 * Usage : ADMIN_PASSWORD='...' node src/set-admin-password.js
 */
export async function setAdminPassword() {
  await initDb();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD sont requis');
  }
  if (password.length < 8) {
    throw new Error('Mot de passe trop court (min. 8 caractères)');
  }
  const hash = bcrypt.hashSync(password, 10);
  const updated = await query(
    `UPDATE admin_users SET password_hash = $1 WHERE email = $2 RETURNING email`,
    [hash, email]
  );
  if (!updated.length) {
    await query('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [email, hash]);
    console.log(`✅ Compte admin créé : ${email}`);
  } else {
    console.log(`✅ Mot de passe admin mis à jour : ${email}`);
  }
}

const isMain = process.argv[1]?.endsWith('set-admin-password.js');
if (isMain) {
  setAdminPassword()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
