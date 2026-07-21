import 'dotenv/config';
import { initDb, query } from './db.js';

const IMG = '/assets/images';

export async function migrateContent() {
  await initDb();

  await query(
    `UPDATE profile SET
      title = $1, tagline = $2, about_title = $3, about_text = $4, skills_intro = $5,
      avatar_url = $6, about_image_url = $7, skills_image_url = $8, updated_at = NOW()
    WHERE id = 1`,
    [
      'Data Engineer & Ingénieur IA',
      'Housséni YABRE — pipelines de données & systèmes IA',
      'Je suis Housséni YABRE',
      `Étudiant en cycle ingénieur à l'UTT, Housséni YABRE se spécialise en Data Engineering et Intelligence Artificielle : pipelines ETL, architectures cloud, modèles ML/DL et mise en production de solutions data-driven.

Mon objectif : transformer des données brutes en insights actionnables et en produits IA robustes.

À moyen terme, j'ambitionne de poursuivre en recherche après le diplôme d'ingénieur, avec un focus sur l'IA appliquée (apprentissage robuste, optimisation, systèmes intelligents et IA pour l'industrie).`,
      'Stack orientée ingestion, transformation, modélisation et déploiement.',
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
    `UPDATE education SET image_url = $1, long_description = $2
     WHERE school ILIKE '%UTT%' OR school ILIKE '%Troyes%'`,
    [`${IMG}/mato2.png`, `Formation Data Engineering & IA — Housséni YABRE, UTT.`]
  );

  await query(`UPDATE site_settings SET value = $1 WHERE key = 'site_name'`, [
    'Housséni YABRE — Data Engineer & IA',
  ]);
  await query(`UPDATE site_settings SET value = $1 WHERE key = 'footer_text'`, [
    '© 2026 Housséni YABRE. Tous droits réservés.',
  ]);

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
