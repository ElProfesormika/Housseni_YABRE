import 'dotenv/config';
import { initDb, query, queryOne } from './db.js';

const IMG = '/assets/images';

export async function migrateContent() {
  await initDb();

  const existingProfile = await queryOne('SELECT avatar_url, about_image_url FROM profile WHERE id = 1');
  if (
    existingProfile &&
    `${existingProfile.avatar_url || ''}${existingProfile.about_image_url || ''}`.includes('/uploads/')
  ) {
    console.log('migrate-content: ignoré (médias /uploads déjà en base, pas d’écrasement).');
    return;
  }

  await query(
    `UPDATE profile SET
      title = $1, tagline = $2, about_title = $3, about_text = $4, skills_intro = $5,
      avatar_url = $6, about_image_url = $7, skills_image_url = $8, updated_at = NOW()
    WHERE id = 1`,
    [
      'Étudiant ingénieur · Aspirant chercheur en IA',
      'Vers un doctorat en IA appliquée — stage de fin d’études orienté recherche',
      'Je suis Housséni YABRE',
      `Étudiant en cycle ingénieur à l’Université de Technologie de Troyes (UTT), je me spécialise en Data Engineering et Intelligence Artificielle.

Mon projet professionnel : enchaîner sur un doctorat (thèse) après le diplôme d’ingénieur, avec un focus sur l’IA appliquée — apprentissage robuste, systèmes intelligents, et méthodes data pour des problèmes scientifiques ou industriels.

Je recherche actuellement un stage de fin d’études de 6 mois orienté recherche (labo, R&D, ou équipe data/IA académique) afin de consolider une démarche scientifique et préparer mon entrée en thèse.`,
      'Outils et méthodes que je mobilise pour expérimenter, prototyper et documenter des approches data & IA.',
      `${IMG}/ma_photo-removebg.png`,
      `${IMG}/mato2.png`,
      `${IMG}/DATA_SCIENCE_IMG.webp`,
    ]
  );

  const projectImages = [
    `${IMG}/DATA_SCIENCE_IMG.webp`,
    `${IMG}/AWS.img.jpeg`,
    `${IMG}/ML.jpeg`,
    `${IMG}/Python.analyse.predictive.jpeg`,
    `${IMG}/Docker.jpeg`,
    `${IMG}/SQL.jpeg`,
  ];

  const projectLongByTitle = {
    'Détection de cibles hyperspectrales': `Projet académique UTT (Sept 2024 – Jan 2025) sous la supervision de M. Ahmad BITAR.\n\nApproche RPCA couplée au dictionnaire de cibles pour la détection hyperspectrale — pipeline de traitement matriciel, extraction de signatures et validation sur données réelles.\n\nCompétences mobilisées : Python, algèbre linéaire, traitement du signal, Data Engineering appliqué à l'imagerie.`,
    'Déploiement AWS scalable': `Architecture cloud hautement disponible sur AWS — Housséni YABRE.\n\nConception d'une infrastructure scalable : load balancing, auto-scaling, bases de données managées et bonnes pratiques DevOps pour la mise en production.`,
    'Chatbot R1 DeepSeek': `Chatbot local basé sur le modèle open source R1 de DeepSeek.\n\nIngénierie IA : inference locale, gestion du contexte, interface conversationnelle et optimisation des ressources.`,
    'Agent IA — veille Telegram': `Agent autonome de veille technologique IA avec envoi automatique vers un bot Telegram.\n\nScraping, agrégation, filtrage et notification — pipeline data + LLM.`,
  };

  const projects = await query('SELECT id, title, description FROM projects ORDER BY sort_order');
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const long =
      projectLongByTitle[p.title] ||
      `${p.description}\n\nProjet réalisé par Housséni YABRE — Data Engineer & Ingénieur IA. Pipeline de données, rigueur méthodologique et orientation production.`;
    await query('UPDATE projects SET image_url = $1, long_description = $2 WHERE id = $3', [
      projectImages[i % projectImages.length],
      long,
      p.id,
    ]);
  }

  const githubProjects = [
    {
      title: 'HIGHLIGHT+ — Détection intelligente de micro-fuites de méthane',
      description:
        'Système IA Teacher-Student (GP + RL) pour optimiser les trajectoires de drones et détecter des micro-fuites de méthane.',
      longDescription:
        `Projet concours Natran x Fondation UTT : conception d'un système de détection de micro-fuites de méthane piloté par IA.

Architecture Teacher-Student :
- Teacher : planification stratégique basée sur Processus Gaussiens.
- Student : pilotage tactique par apprentissage par renforcement profond.
- Distillation de connaissance pour transférer l'expertise du Teacher vers le Student.

Résultats reportés dans le dépôt : amélioration majeure du temps de détection, meilleure précision de localisation et meilleure efficacité énergétique par rapport à des baselines naïves.

Ce projet illustre l'orientation recherche de Housséni YABRE vers l'IA appliquée à des systèmes physiques et critiques.`,
      image: `${IMG}/ML.jpeg`,
      tags: 'Python,Gaussian Process,Reinforcement Learning,Drone,Research,AI',
      url: 'https://github.com/ElProfesormika/Projet_HIGHLIGHT-_Natran_-_UTT',
      featured: 1,
      order: -20,
    },
    {
      title: "HydroTrack — Supervision et détection de fuites d'eau",
      description:
        "Plateforme data/IA temps réel : détection d'anomalies (IsolationForest), confirmation par capteurs pression et localisation physique des fuites.",
      longDescription:
        `HydroTrack combine machine learning, modélisation physique et visualisation cartographique.

Pipeline décisionnel :
Relevés compteurs -> score ML -> confirmation capteurs pression -> localisation métrique de fuite.

Stack observée : FastAPI, React, WebSocket, scikit-learn, Leaflet/Chart, scripts d'ingestion.
Le projet montre une capacité à relier la science des données, l'ingénierie logicielle et les contraintes métier/physiques.

C'est un excellent socle pour une trajectoire recherche en IA appliquée aux systèmes cyber-physiques.`,
      image: `${IMG}/DATA_SCIENCE_IMG.webp`,
      tags: 'FastAPI,React,Machine Learning,IsolationForest,WebSocket,Data Engineering',
      url: 'https://github.com/ElProfesormika/HydroTrack',
      featured: 1,
      order: -19,
    },
    {
      title: 'IF29 — Détection de profils atypiques sur X (Twitter)',
      description:
        'Projet data science à grande échelle : comparaison non supervisée (Isolation Forest) vs supervisée (XGBoost) sur 643k profils.',
      longDescription:
        `Projet académique IF29 (Groupe 3) sur la détection de profils atypiques à partir de données Twitter agrégées.

Éléments marquants :
- Pipeline MongoDB -> agrégation utilisateurs -> features engineering.
- Réduction de dimension (ACP), normalisation et comparaison méthodique des modèles.
- Analyse critique des performances (prévention de la circularité, protocole d'évaluation robuste).

Le projet met en avant la rigueur expérimentale et l'esprit scientifique, en cohérence avec l'ambition de poursuivre en recherche IA.`,
      image: `${IMG}/Python.analyse.predictive.jpeg`,
      tags: 'Jupyter,Isolation Forest,XGBoost,PCA,MongoDB,Data Science',
      url: 'https://github.com/ElProfesormika/PROJET_IF29-GR03',
      featured: 1,
      order: -18,
    },
    {
      title: 'MY_IA — Assistant IA SMART & IKIGAI',
      description:
        "Application web IA pour assister la définition d'objectifs SMART/IKIGAI avec analyse LLM et génération PDF.",
      longDescription:
        `Application full-stack légère centrée sur l'expérience utilisateur et l'exploitation d'API IA.

Fonctions principales :
- Formulaires SMART / IKIGAI.
- Analyse de contenu via modèle LLM (Hugging Face).
- Génération de rapports PDF.

Ce projet montre la capacité de Housséni YABRE à prototyper rapidement des produits IA orientés usage, du backend Flask à l'interface web.`,
      image: `${IMG}/AWS.img.jpeg`,
      tags: 'Flask,LLM,HuggingFace,PDF,Web App,Product AI',
      url: 'https://github.com/ElProfesormika/MY_IA',
      featured: 0,
      order: -17,
    },
  ];

  for (const p of githubProjects) {
    const existing = await query('SELECT id FROM projects WHERE title = $1 LIMIT 1', [p.title]);
    if (existing.length) {
      await query(
        `UPDATE projects
         SET description = $1, long_description = $2, image_url = $3, project_url = $4, repo_url = $5,
             tags = $6, featured = $7, sort_order = $8
         WHERE id = $9`,
        [p.description, p.longDescription, p.image, p.url, p.url, p.tags, p.featured, p.order, existing[0].id]
      );
    } else {
      await query(
        `INSERT INTO projects
         (title, description, long_description, image_url, project_url, repo_url, tags, featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.title, p.description, p.longDescription, p.image, p.url, p.url, p.tags, p.featured, p.order]
      );
    }
  }

  const certImages = {
    'Cloud Web Application Builder': `${IMG}/AWS.img.jpeg`,
    'Introduction à Docker': `${IMG}/Docker.jpeg`,
    'Astuces SQL pour la Data Science': `${IMG}/SQL.jpeg`,
    'Les Fondements du Machine Learning': `${IMG}/ML.jpeg`,
    'Analyse Prédictive avec Python': `${IMG}/Python.analyse.predictive.jpeg`,
    'Forum Data Days': `${IMG}/data.days.jpeg`,
  };

  for (const [title, url] of Object.entries(certImages)) {
    await query('UPDATE certifications SET image_url = $1 WHERE title = $2', [url, title]);
  }

  await query(
    `UPDATE certifications SET long_description = COALESCE(issuer, 'Formation') || ' — certification Housséni YABRE, Data Engineer & IA.'
     WHERE long_description IS NULL OR long_description = ''`
  );

  await query(
    `UPDATE experiences SET image_url = $1, long_description = $2
     WHERE company ILIKE '%UTT%' OR company ILIKE '%Troyes%'`,
    [`${IMG}/DATA_SCIENCE_IMG.webp`, `Parcours Data Engineering & IA — Housséni YABRE à l'UTT.`]
  );

  await query(
    `UPDATE education SET image_url = $1, long_description = $2, current = 1
     WHERE school ILIKE '%UTT%' OR school ILIKE '%Troyes%'`,
    [`${IMG}/mato2.png`, `Formation Data Engineering & IA — Housséni YABRE, UTT. Cycle ingénieur en cours.`]
  );

  const banners = [
    ['about', 'À propos', `${IMG}/mato2.png`, 0],
    ['skills', 'Compétences', `${IMG}/DATA_SCIENCE_IMG.webp`, 1],
    ['parcours', 'Parcours', `${IMG}/DATA_SCIENCE_IMG.webp`, 2],
    ['projects', 'Projets', `${IMG}/ML.jpeg`, 3],
    ['certifications', 'Certifications', `${IMG}/AWS.img.jpeg`, 4],
    ['contact', 'Contact', `${IMG}/ma_photo-removebg.png`, 5],
    ['kiffs', 'Mes kiff', `${IMG}/Python.analyse.predictive.jpeg`, 6],
  ];
  for (const [page_key, label, image_url, sort_order] of banners) {
    await query(
      `INSERT INTO page_banners (page_key, label, image_url, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (page_key) DO UPDATE SET
         label = EXCLUDED.label,
         sort_order = EXCLUDED.sort_order,
         image_url = CASE
           WHEN page_banners.image_url IS NULL OR page_banners.image_url = '' THEN EXCLUDED.image_url
           ELSE page_banners.image_url
         END`,
      [page_key, label, image_url, sort_order]
    );
  }

  const kiffsSeed = [
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
      'Labos et équipes IA / data qui incarnent l’excellence de la recherche publique française — un modèle pour une thèse.',
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
  for (const k of kiffsSeed) {
    const existing = await query('SELECT id FROM kiffs WHERE title = $1 LIMIT 1', [k[0]]);
    if (existing.length) {
      await query(
        `UPDATE kiffs SET category=$1, description=$2, long_description=$3, url=$4,
           image_url = CASE WHEN image_url IS NULL OR image_url = '' THEN $5 ELSE image_url END,
           featured=$6, sort_order=$7
         WHERE id=$8`,
        [k[1], k[2], k[3], k[4], k[5], k[6], k[7], existing[0].id]
      );
    } else {
      await query(
        `INSERT INTO kiffs (title, category, description, long_description, url, image_url, featured, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        k
      );
    }
  }

  await query(`UPDATE site_settings SET value = $1 WHERE key = 'site_name'`, [
    'Housséni YABRE — Recherche IA & Data',
  ]);
  await query(`UPDATE site_settings SET value = $1 WHERE key = 'footer_text'`, [
    '© 2026 Housséni YABRE. Tous droits réservés.',
  ]);

  const skillMeta = [
    {
      match: 'Python',
      icon: 'python',
      description: 'Expérimentation, scripts de recherche et prototypes ML.',
    },
    {
      match: 'SQL',
      icon: 'sql',
      description: 'Requêtage, agrégation et préparation de jeux de données.',
    },
    {
      match: 'Spark',
      icon: 'spark',
      description: 'Traitement à l’échelle pour analyses et pipelines batch.',
    },
    {
      match: 'Talend',
      icon: 'etl',
      description: 'Ingestion et transformation de données structurées.',
    },
    {
      match: 'Machine Learning',
      icon: 'ml',
      description: 'Modélisation, évaluation et approches apprentissage / LLM.',
    },
    {
      match: 'AWS',
      icon: 'aws',
      description: 'Environnements reproductibles et déploiement d’expériences.',
    },
    {
      match: 'Git',
      icon: 'git',
      description: 'Versionning, collaboration et traçabilité des expériences.',
    },
    {
      match: 'Power BI',
      icon: 'powerbi',
      description: 'Visualisation et communication des résultats.',
    },
    {
      match: 'HTML',
      icon: 'code',
      description: 'Interfaces légères pour démonstrateurs et outils internes.',
    },
  ];

  for (const s of skillMeta) {
    await query(
      `UPDATE skills
       SET icon = $1,
           description = CASE
             WHEN description IS NULL OR description = '' THEN $2
             ELSE description
           END
       WHERE name ILIKE $3`,
      [s.icon, s.description, `%${s.match}%`]
    );
  }

  await query(
    `UPDATE experiences SET description = $1
     WHERE company ILIKE '%UTT%' OR company ILIKE '%Troyes%'`,
    [
      'Formation data engineering & IA — préparation d’une trajectoire recherche / thèse en IA appliquée.',
    ]
  );

  await query(
    `UPDATE education SET description = $1
     WHERE school ILIKE '%UTT%' OR school ILIKE '%Troyes%'`,
    [
      'Spécialisation data engineering et intelligence artificielle — ambition doctorat en IA appliquée.',
    ]
  );

  console.log('✅ Contenu migré (Housséni YABRE + images).');
}

const isMain = process.argv[1]?.endsWith('migrate-content.js');
if (isMain) {
  migrateContent()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
