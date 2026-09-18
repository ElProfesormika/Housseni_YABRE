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
      'Étudiant ingénieur · Data Engineer',
      'Stage de fin d’études Data Engineer — pipelines, qualité des données, mise en production (mars 2027)',
      'Je suis Housséni YABRE',
      `Étudiant en cycle ingénieur à l’Université de Technologie de Troyes (UTT), je me spécialise en Data Engineering et Intelligence Artificielle.

Mon cœur de métier : concevoir et industrialiser des pipelines de données (ingestion, validation, transformation, exposition), garantir la qualité des flux et les rendre disponibles pour l’analytics et l’IA.

Je recherche un stage de fin d’études de 6 mois (Bac +5), à partir de mars 2027, en tant que Data Engineer.`,
      'Outils que je mobilise pour ingérer, transformer, fiabiliser et exposer des données en production.',
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

  const skillsCount = await queryOne('SELECT COUNT(*)::int AS c FROM skills');
  if (!skillsCount?.c) {
    const skills = [
      ['Python', 82, 'python', 'Scripts, notebooks et services Python pour les pipelines de données.', 0],
      ['SQL / PostgreSQL', 82, 'sql', 'Requêtage, agrégation et préparation de jeux de données.', 1],
      ['Apache Spark', 72, 'spark', 'Traitement à l’échelle pour analyses et pipelines batch.', 2],
      ['Docker', 78, 'docker', 'Conteneurisation des traitements et des services.', 3],
      ['AWS', 72, 'aws', 'Stockage, compute et services data cloud.', 4],
      ['Git / GitHub', 82, 'git', 'Versionning, collaboration et traçabilité.', 5],
    ];
    for (const s of skills) {
      await query(
        'INSERT INTO skills (name, percentage, icon, description, sort_order) VALUES ($1, $2, $3, $4, $5)',
        s
      );
    }
  }

  const skillSectionsCount = await queryOne('SELECT COUNT(*)::int AS c FROM skill_sections');
  if (!skillSectionsCount?.c) {
    const skillSections = [
      ['Data Engineering', 'Conception de pipelines ETL/ELT\nIngestion et transformation de données\nContrôle de qualité et automatisation des traitements', 0],
      ['Programmation & Data Processing', 'Python\nPandas\nNumPy\nPySpark', 1],
      ['Bases de données', 'SQL avancé\nPostgreSQL\nModélisation relationnelle\nOptimisation des requêtes', 2],
      ['Big Data & Orchestration', 'Apache Spark\nApache Airflow\nTraitement distribué\nOrchestration de workflows', 3],
      ['Cloud & DevOps', 'AWS (S3, EC2, RDS, IAM)\nDocker\nKubernetes\nLinux/Bash\nGit/GitHub\nCI/CD', 4],
      ['Data Architecture', 'Data Lake\nData Warehouse\nETL/ELT\nStar Schema\nCSV, JSON, Parquet', 5],
      ['Data Quality', 'Validation des données\nGestion des valeurs manquantes\nDétection des doublons\nContrôle de schéma', 6],
      ['Machine Learning / IA', 'Scikit-learn\nXGBoost\nDeep Learning\nReinforcement Learning\nFederated Learning\nXAI / SHAP', 7],
      ['Calcul scientifique et autre langages', 'MATLAB\nPCA\nRPCA\nTraitement du signal\nOptimisation\nOR-Tools\nR\nJAVA', 8],
      ['Logiciels & outils', 'FastAPI\nFlask\nReact\nWebSocket', 9],
      ['Méthodes', 'Conception expérimentale\nAnalyse de données\nPrototypage\nDocumentation technique\nWorkflows reproductibles', 10],
    ];
    for (const s of skillSections) {
      await query('INSERT INTO skill_sections (title, items, sort_order) VALUES ($1, $2, $3)', s);
    }
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
      'Formation en data engineering, machine learning et mise en production de pipelines data.',
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
      1,
      'Spécialisation data engineering et data science.',
      0,
    ],
  ];
  for (const e of education) {
    await query(
      'INSERT INTO education (school, degree, field, start_date, end_date, current, description, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      e
    );
  }

  const banners = [
    ['about', 'À propos', `${IMG}/mato2.png`, 0],
    ['skills', 'Compétences', `${IMG}/DATA_SCIENCE_IMG.webp`, 1],
    ['parcours', 'Parcours', `${IMG}/DATA_SCIENCE_IMG.webp`, 2],
    ['projects', 'Projets', `${IMG}/ML.jpeg`, 3],
    ['certifications', 'Certifications', `${IMG}/AWS.img.jpeg`, 4],
    ['contact', 'Contact', `${IMG}/ma_photo-removebg.png`, 5],
    ['kiffs', 'Mes kiff', `${IMG}/Python.analyse.predictive.jpeg`, 6],
  ];
  for (const b of banners) {
    await query(
      'INSERT INTO page_banners (page_key, label, image_url, sort_order) VALUES ($1,$2,$3,$4)',
      b
    );
  }

  const kiffs = [
    [
      'Google DeepMind',
      'entreprise',
      'Référence mondiale en recherche IA fondamentale et appliquée.',
      'Coup de cœur pour la culture scientifique, les publications ouvertes et l’ambition de résoudre des problèmes difficiles avec rigueur.',
      'https://deepmind.google/',
      `${IMG}/ML.jpeg`,
      1,
      0,
    ],
    [
      'Inria',
      'labo',
      'Institut national de recherche en sciences et technologies du numérique.',
      'Labos et équipes data / logiciel qui incarnent l’excellence du numérique public français.',
      'https://www.inria.fr/',
      `${IMG}/DATA_SCIENCE_IMG.webp`,
      1,
      1,
    ],
    [
      'Attention Is All You Need',
      'article',
      'L’article fondateur des Transformers (Vaswani et al., 2017).',
      'Un papier qui a redéfini le deep learning moderne — lecture indispensable pour comprendre l’architecture derrière les LLM.',
      'https://arxiv.org/abs/1706.03762',
      `${IMG}/Python.analyse.predictive.jpeg`,
      1,
      2,
    ],
  ];
  for (const k of kiffs) {
    await query(
      `INSERT INTO kiffs (title, category, description, long_description, url, image_url, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      k
    );
  }

  const settings = [
    ['site_name', 'Housséni YABRE — Data Engineer'],
    ['footer_text', '© 2026 Housséni YABRE. Tous droits réservés.'],
    ['contact_form_enabled', 'true'],
    ['theme_accent', '#06b6d4'],
    ['header_role', 'Data Engineer · UTT'],
    ['kiffs_public', 'true'],
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
