import pg from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://portfolio:portfolio@localhost:5432/portfolio';

function useSsl(url) {
  if (process.env.DATABASE_SSL === 'true') return true;
  if (process.env.DATABASE_SSL === 'false') return false;
  // Railway public proxy requires SSL; private network usually does not.
  return /rlwy\.net|proxy\.rlwy/i.test(url);
}

export const pool = new Pool({
  connectionString,
  ssl: useSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    about_title TEXT NOT NULL,
    about_text TEXT NOT NULL,
    skills_intro TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    avatar_url TEXT DEFAULT '',
    about_image_url TEXT DEFAULT '',
    skills_image_url TEXT DEFAULT '',
    cv_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT DEFAULT 'link',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    percentage INTEGER NOT NULL DEFAULT 50,
    icon TEXT DEFAULT 'code',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    project_url TEXT DEFAULT '',
    repo_url TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    featured INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current INTEGER DEFAULT 0,
    description TEXT NOT NULL,
    long_description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT,
    date TEXT,
    image_url TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    school TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    long_description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    read_status INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

export async function initDb() {
  await pool.query(SCHEMA);
}
