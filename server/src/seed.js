import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, query, queryOne } from './db.js';

const IMG = '/assets/images';

export async function seedDatabase() {
  await initDb();
  const hasProfile = await queryOne('SELECT id FROM profile WHERE id = 1');
  if (hasProfile) return false;

  await query(
    `INSERT INTO profile (
      id, first_name, last_name, title, tagline, about_title, about_text,
      skills_intro, email, phone, location, avatar_url, about_image_url, skills_image_url
    ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      'Housséni',
      'YABRE',
      'Data Engineer & Ingénieur IA',
      'Housséni YABRE — pipelines de données & systèmes IA',
      'Je suis Housséni YABRE',
      `Étudiant en cycle ingénieur à l'UTT, Housséni YABRE se spécialise en Data Engineering et Intelligence Artificielle : pipelines ETL, architectures cloud, modèles ML/DL et mise en production de solutions data-driven. Après le diplôme d'ingénieur, il ambitionne de poursuivre vers la recherche en IA appliquée.`,
      'Stack orientée ingestion, transformation, modélisation et déploiement — du batch au near-real-time.',
      'housseni.yabre@utt.fr',
      '+33 7 45 46 57 46',
      'Troyes, France',
      `${IMG}/ma_photo-removebg.png`,
      `${IMG}/mato2.png`,
      `${IMG}/DATA_SCIENCE_IMG.webp`,
    ]
  );

  const socials = [
    ['linkedin', 'https://www.linkedin.com/in/houss%C3%A9ni-yabre-8b2751246/', 'linkedin', 0],
    ['github', 'https://github.com/ElProfesormika', 'github', 1],
  ];
  for (const s of socials) {
    await query('INSERT INTO social_links (platform, url, icon, sort_order) VALUES ($1, $2, $3, $4)', s);
  }

  const skills = [
    ['Python / Scikit-learn / R / C', 70, 'python', 0],
    ['SQL / NoSQL', 75, 'database', 1],
    ['Spark / Hadoop', 55, 'server', 2],
    ['ETL : Talend Open Studio', 45, 'workflow', 3],
    ['Machine Learning / Deep Learning / LLM', 75, 'brain', 4],
    ['AWS / Docker', 60, 'cloud', 5],
    ['Git / GitHub', 65, 'git', 6],
    ['Power BI', 60, 'chart', 7],
    ['HTML/CSS & PHP', 70, 'code', 8],
  ];
  for (const s of skills) {
    await query('INSERT INTO skills (name, percentage, icon, sort_order) VALUES ($1, $2, $3, $4)', s);
  }

  const projects = [
    ['Détection de cibles hyperspectrales', 'Projet UTT (Sept 2024 – Jan 2025) : RPCA couplé au dictionnaire de cibles.', '', '', '', 'RPCA,Python,UTT', 1, 0],
    ['Déploiement AWS scalable', "Déploiement d'une application hautement disponible et scalable sur AWS.", '', '', '', 'AWS,DevOps', 1, 1],
    ['Chatbot R1 DeepSeek', 'Chatbot local basé sur le modèle open source R1 de DeepSeek.', '', '', '', 'LLM,Python', 1, 2],
    ['Analyse exploratoire Python + Tableau', 'Exploration et visualisation avec Pandas, Matplotlib, Seaborn.', '', '', '', 'Python,EDA', 1, 3],
    ['Prédiction des ventes (ML)', 'Régression, forêts aléatoires, XGBoost — métriques RMSE.', '', '', '', 'ML,XGBoost', 1, 4],
    ["Détection d'anomalies financières", 'Clustering K-means, DBSCAN sur données financières.', '', '', '', 'ML,Clustering', 1, 5],
    ['Agent IA — veille Telegram', 'Agent IA pour scraper les news IA vers un chatbot Telegram.', '', '', '', 'LLM,Automation', 1, 6],
    ['Visualisation IRIS', 'Récupération et traitement de données pour visualisation.', '', '', '', 'Python,Viz', 0, 7],
    ['Prédiction de dépression (ML)', 'Régression logistique et SVM.', '', '', '', 'ML,SVM', 0, 8],
    ['Analyse logs Apache NASA', 'Requêtage, récupération et analyse de données en ligne.', '', '', '', 'Data,Logs', 0, 9],
    ['Scraping Dark Web', 'Scraping et comparaison pour détecter annonces similaires.', '', '', '', 'Scraping,Python', 0, 10],
  ];
  for (const p of projects) {
    await query(
      'INSERT INTO projects (title, description, image_url, project_url, repo_url, tags, featured, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      p
    );
  }

  const certs = [
    ['Cloud Web Application Builder', 'AWS Academy', '2024', '', '', 0],
    ['Introduction à Docker', 'Formation', '2024', '', '', 1],
    ['Astuces SQL pour la Data Science', 'Formation', '2024', '', '', 2],
    ['Les Fondements du Machine Learning', 'Formation', '2024', '', '', 3],
    ['Analyse Prédictive avec Python', 'Formation', '2024', '', '', 4],
    ['Forum Data Days', 'Participation', '2024', '', '', 5],
  ];
  for (const c of certs) {
    await query(
      'INSERT INTO certifications (title, issuer, date, image_url, credential_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      c
    );
  }

  const experiences = [
    [
      'Université de Technologie de Troyes',
      'Cycle ingénieur — Data Engineering & IA',
      'Troyes',
      '2023',
      null,
      1,
      'Formation en data engineering, machine learning et ingénierie des données.',
      0,
    ],
  ];
  for (const e of experiences) {
    await query(
      'INSERT INTO experiences (company, role, location, start_date, end_date, current, description, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      e
    );
  }

  const education = [
    [
      'Université de Technologie de Troyes',
      'Cycle ingénieur',
      'Data Engineering & IA',
      '2023',
      '2026',
      'Spécialisation data engineering et intelligence artificielle.',
      0,
    ],
  ];
  for (const e of education) {
    await query(
      'INSERT INTO education (school, degree, field, start_date, end_date, description, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      e
    );
  }

  const settings = [
    ['site_name', 'Housséni YABRE — Data Engineer & IA'],
    ['footer_text', '© 2026 Housséni YABRE. Tous droits réservés.'],
    ['contact_form_enabled', 'true'],
    ['theme_accent', '#06b6d4'],
  ];
  for (const s of settings) {
    await query('INSERT INTO site_settings (key, value) VALUES ($1, $2)', s);
  }

  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = bcrypt.hashSync(password, 10);
  await query('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [email, hash]);

  console.log('✅ PostgreSQL initialisé avec les données de Housséni YABRE.');
  console.log(`   Admin : ${email} / ${password}`);

  const { migrateContent } = await import('./migrate-content.js');
  await migrateContent();
  return true;
}

const isMain = process.argv[1]?.endsWith('seed.js');
if (isMain) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
