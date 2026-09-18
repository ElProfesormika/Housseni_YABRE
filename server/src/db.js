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

  CREATE TABLE IF NOT EXISTS skill_sections (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    items TEXT NOT NULL DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    percentage INTEGER DEFAULT 70,
    icon TEXT DEFAULT '',
    icon_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    section_id INTEGER REFERENCES skill_sections(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    gallery_urls TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
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
    current INTEGER DEFAULT 0,
    description TEXT,
    long_description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS page_banners (
    page_key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS kiffs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'autre',
    description TEXT NOT NULL DEFAULT '',
    long_description TEXT DEFAULT '',
    url TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    featured INTEGER DEFAULT 1,
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

function guessSkillIcon(name) {
  const raw = String(name || '').toLowerCase();
  if (raw.includes('python')) return 'python';
  if (raw.includes('pandas')) return 'pandas';
  if (raw.includes('numpy')) return 'numpy';
  if (raw.includes('pyspark') || raw.includes('spark')) return 'spark';
  if (raw.includes('postgres')) return 'postgresql';
  if (raw.includes('sql')) return 'sql';
  if (raw.includes('airflow')) return 'airflow';
  if (raw.includes('docker')) return 'docker';
  if (raw.includes('kubernetes') || raw.includes('k8s')) return 'kubernetes';
  if (raw.includes('linux') || raw.includes('bash')) return 'linux';
  if (raw.includes('aws') || raw.includes('amazon')) return 'aws';
  if (raw.includes('git')) return 'git';
  if (raw.includes('react')) return 'react';
  if (raw.includes('flask')) return 'flask';
  if (raw.includes('fastapi')) return 'fastapi';
  if (raw.includes('java')) return 'java';
  if (raw.includes('matlab')) return 'matlab';
  if (raw.includes('scikit') || raw.includes('sklearn')) return 'scikitlearn';
  if (raw.includes('xgboost') || raw.includes('deep') || raw.includes('llm') || raw.includes('xai') || raw.includes('learning')) return 'ml';
  if (raw.includes('etl') || raw.includes('pipeline') || raw.includes('airflow') || raw.includes('orchestration')) return 'etl';
  if (raw.includes('qualité') || raw.includes('validation') || raw.includes('doublon') || raw.includes('manquante') || raw.includes('schéma') || raw.includes('schema')) return 'quality';
  if (raw.includes('lake') || raw.includes('warehouse') || raw.includes('parquet') || raw.includes('json') || raw.includes('csv') || raw.includes('star')) return 'architecture';
  if (raw.includes('ci/cd') || raw.includes('cicd')) return 'cicd';
  if (raw.includes('r ') || raw === 'r') return 'r';
  if (raw.includes('mongodb')) return 'mongodb';
  return 'code';
}

function guessSkillPct(name) {
  const raw = String(name || '').toLowerCase();
  if (raw.includes('python') || raw.includes('sql') || raw.includes('git')) return 82;
  if (raw.includes('pandas') || raw.includes('numpy') || raw.includes('docker') || raw.includes('linux')) return 78;
  if (raw.includes('spark') || raw.includes('airflow') || raw.includes('aws')) return 72;
  if (raw.includes('kubernetes') || raw.includes('react') || raw.includes('fastapi')) return 68;
  if (raw.includes('xgboost') || raw.includes('deep') || raw.includes('matlab')) return 65;
  return 70;
}

const DEFAULT_SKILL_SECTIONS = [
  ['Data Engineering', 'Conception de pipelines ETL/ELT\nIngestion et transformation de données\nContrôle de qualité et automatisation des traitements'],
  ['Programmation & Data Processing', 'Python\nPandas\nNumPy\nPySpark'],
  ['Bases de données', 'SQL avancé\nPostgreSQL\nModélisation relationnelle\nOptimisation des requêtes'],
  ['Big Data & Orchestration', 'Apache Spark\nApache Airflow\nTraitement distribué\nOrchestration de workflows'],
  ['Cloud & DevOps', 'AWS (S3, EC2, RDS, IAM)\nDocker\nKubernetes\nLinux/Bash\nGit/GitHub\nCI/CD'],
  ['Data Architecture', 'Data Lake\nData Warehouse\nETL/ELT\nStar Schema\nCSV, JSON, Parquet'],
  ['Data Quality', 'Validation des données\nGestion des valeurs manquantes\nDétection des doublons\nContrôle de schéma'],
  ['Machine Learning / IA', 'Scikit-learn\nXGBoost\nDeep Learning\nReinforcement Learning\nFederated Learning\nXAI / SHAP'],
  ['Calcul scientifique et autre langages', 'MATLAB\nPCA\nRPCA\nTraitement du signal\nOptimisation\nOR-Tools\nR\nJAVA'],
  ['Logiciels & outils', 'FastAPI\nFlask\nReact\nWebSocket'],
  ['Méthodes', 'Conception expérimentale\nAnalyse de données\nPrototypage\nDocumentation technique\nWorkflows reproductibles'],
];

async function expandSkillCardsFromSections() {
  const grouped = await queryOne('SELECT COUNT(*)::int AS c FROM skills WHERE section_id IS NOT NULL');
  if (grouped?.c) return;
  const sections = await query('SELECT id, items FROM skill_sections ORDER BY sort_order, id');
  const withItems = sections.filter((s) => String(s.items || '').trim());
  if (!withItems.length) return;
  await query('DELETE FROM skills WHERE section_id IS NULL');
  for (const sec of withItems) {
    const lines = String(sec.items)
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const name = lines[i];
      await query(
        `INSERT INTO skills (name, percentage, icon, description, sort_order, section_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, guessSkillPct(name), guessSkillIcon(name), '', i, sec.id]
      );
    }
  }
}

export async function initDb() {
  await pool.query(SCHEMA);
  await pool.query(`ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon_url TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE skills ADD COLUMN IF NOT EXISTS section_id INTEGER`);
  await pool.query(`ALTER TABLE education ADD COLUMN IF NOT EXISTS current INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT ''`);
  const count = await queryOne('SELECT COUNT(*)::int AS c FROM skill_sections');
  if (!count?.c) {
    for (let i = 0; i < DEFAULT_SKILL_SECTIONS.length; i++) {
      await query('INSERT INTO skill_sections (title, items, sort_order) VALUES ($1, $2, $3)', [
        DEFAULT_SKILL_SECTIONS[i][0],
        DEFAULT_SKILL_SECTIONS[i][1],
        i,
      ]);
    }
  }
  await expandSkillCardsFromSections();
}
