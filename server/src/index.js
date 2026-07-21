import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, query, queryOne } from './db.js';
import { authMiddleware } from './middleware.js';
import { seedDatabase } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Seules les images sont acceptées'));
  },
});

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const ALLOWED_TABLES = new Set([
  'skills',
  'projects',
  'experiences',
  'certifications',
  'education',
  'social_links',
]);

function crudRoutes(table, fields) {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Table non autorisée: ${table}`);
  const router = express.Router();

  router.get(
    '/',
    authMiddleware,
    asyncHandler(async (_req, res) => {
      res.json(await query(`SELECT * FROM ${table} ORDER BY sort_order`));
    })
  );

  router.post(
    '/',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const data = req.body;
      const cols = fields.filter((f) => f in data || f === 'sort_order');
      const values = cols.map((f) => (f === 'sort_order' ? data[f] ?? 0 : data[f]));
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const rows = await query(
        `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.status(201).json(rows[0]);
    })
  );

  router.put(
    '/:id',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const data = req.body;
      const cols = fields.filter((f) => f in data);
      if (!cols.length) return res.status(400).json({ error: 'Aucune donnée' });
      const sets = cols.map((f, i) => `${f} = $${i + 1}`).join(', ');
      const values = [...cols.map((f) => data[f]), req.params.id];
      const rows = await query(
        `UPDATE ${table} SET ${sets} WHERE id = $${cols.length + 1} RETURNING *`,
        values
      );
      if (!rows[0]) return res.status(404).json({ error: 'Introuvable' });
      res.json(rows[0]);
    })
  );

  router.delete(
    '/:id',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const rows = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'Introuvable' });
      res.json({ ok: true });
    })
  );

  return router;
}

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const user = await queryOne('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '7d',
    });
    res.json({ token, email: user.email });
  })
);

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ email: req.user.email });
});

app.get(
  '/api/portfolio',
  asyncHandler(async (_req, res) => {
    const profile = await queryOne('SELECT * FROM profile WHERE id = 1');
    if (!profile) {
      return res.status(404).json({ error: 'Portfolio non configuré. Lancez: npm run seed --prefix server' });
    }
    const [social_links, skills, projects, experiences, certifications, education, settingsRows] =
      await Promise.all([
        query('SELECT * FROM social_links ORDER BY sort_order'),
        query('SELECT * FROM skills ORDER BY sort_order'),
        query('SELECT * FROM projects ORDER BY sort_order'),
        query('SELECT * FROM experiences ORDER BY sort_order'),
        query('SELECT * FROM certifications ORDER BY sort_order'),
        query('SELECT * FROM education ORDER BY sort_order'),
        query('SELECT key, value FROM site_settings'),
      ]);
    const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));
    res.json({ profile, social_links, skills, projects, experiences, certifications, education, settings });
  })
);

app.get(
  '/api/admin/profile',
  authMiddleware,
  asyncHandler(async (_req, res) => {
    res.json(await queryOne('SELECT * FROM profile WHERE id = 1'));
  })
);

app.put(
  '/api/admin/profile',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const f = req.body;
    await query(
      `UPDATE profile SET
        first_name = $1, last_name = $2, title = $3, tagline = $4,
        about_title = $5, about_text = $6, skills_intro = $7,
        email = $8, phone = $9, location = $10,
        avatar_url = $11, about_image_url = $12, skills_image_url = $13, cv_url = $14,
        updated_at = NOW()
      WHERE id = 1`,
      [
        f.first_name,
        f.last_name,
        f.title,
        f.tagline,
        f.about_title,
        f.about_text,
        f.skills_intro,
        f.email,
        f.phone ?? null,
        f.location ?? null,
        f.avatar_url ?? '',
        f.about_image_url ?? '',
        f.skills_image_url ?? '',
        f.cv_url ?? '',
      ]
    );
    res.json(await queryOne('SELECT * FROM profile WHERE id = 1'));
  })
);

app.use('/api/admin/skills', crudRoutes('skills', ['name', 'percentage', 'icon', 'sort_order']));
app.use(
  '/api/admin/projects',
  crudRoutes('projects', [
    'title',
    'description',
    'long_description',
    'image_url',
    'project_url',
    'repo_url',
    'tags',
    'featured',
    'sort_order',
  ])
);
app.use(
  '/api/admin/experiences',
  crudRoutes('experiences', [
    'company',
    'role',
    'location',
    'start_date',
    'end_date',
    'current',
    'description',
    'long_description',
    'image_url',
    'sort_order',
  ])
);
app.use(
  '/api/admin/certifications',
  crudRoutes('certifications', [
    'title',
    'issuer',
    'date',
    'image_url',
    'credential_url',
    'long_description',
    'sort_order',
  ])
);
app.use(
  '/api/admin/education',
  crudRoutes('education', [
    'school',
    'degree',
    'field',
    'start_date',
    'end_date',
    'description',
    'long_description',
    'image_url',
    'sort_order',
  ])
);
app.use('/api/admin/social-links', crudRoutes('social_links', ['platform', 'url', 'icon', 'sort_order']));

app.get(
  '/api/admin/settings',
  authMiddleware,
  asyncHandler(async (_req, res) => {
    const rows = await query('SELECT key, value FROM site_settings');
    res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  })
);

app.put(
  '/api/admin/settings',
  authMiddleware,
  asyncHandler(async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        `INSERT INTO site_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, String(value)]
      );
    }
    const rows = await query('SELECT key, value FROM site_settings');
    res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  })
);

app.post('/api/admin/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Fichier manquant' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.put(
  '/api/admin/password',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Mot de passe invalide (min. 6 caractères)' });
    }
    const user = await queryOne('SELECT * FROM admin_users WHERE email = $1', [req.user.email]);
    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    await query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, user.id]);
    res.json({ ok: true });
  })
);

app.post(
  '/api/contact',
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Nom, email et message requis' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    const rows = await query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name.trim(), email.trim(), (subject || '').trim(), message.trim()]
    );
    res.status(201).json({ ok: true, id: rows[0].id });
  })
);

app.get(
  '/api/admin/messages',
  authMiddleware,
  asyncHandler(async (_req, res) => {
    res.json(await query('SELECT * FROM contact_messages ORDER BY created_at DESC'));
  })
);

app.patch(
  '/api/admin/messages/:id/read',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await query(
      'UPDATE contact_messages SET read_status = 1 WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Message introuvable' });
    res.json(rows[0]);
  })
);

app.delete(
  '/api/admin/messages/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Message introuvable' });
    res.json({ ok: true });
  })
);

app.get('/api/health', (_req, res) => res.json({ ok: true, db: 'postgresql' }));

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Erreur serveur' });
});

async function start() {
  await initDb();
  const profile = await queryOne('SELECT id FROM profile WHERE id = 1');
  if (!profile) {
    console.log('Initialisation PostgreSQL…');
    await seedDatabase();
  }
  app.listen(PORT, () => {
    console.log(`🚀 API portfolio (PostgreSQL) : http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error('Échec démarrage:', e.message);
  process.exit(1);
});
