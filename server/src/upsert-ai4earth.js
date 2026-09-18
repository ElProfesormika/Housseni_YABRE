import 'dotenv/config';
import { initDb, query } from './db.js';

/**
 * Ajoute / met à jour SmartWasteAI (AI4Earth) SANS écraser le reste des données.
 * N’insère les réglages d’accueil que s’ils sont absents.
 */
export async function upsertAi4Earth() {
  await initDb();

  const title = 'SmartWasteAI — AI4Earth (SmartAIthon 2026)';
  const description =
    'Framework IA fédéré et explicable pour la gestion prédictive des déchets urbains — team leader Housséni YABRE (SmartAIthon 2026, Round 2).';
  const longDescription = `SmartWasteAI (équipe AI4Earth) — SmartAIthon 2026, Round 2.

Cadre IA fédéré et explicable pour la collecte urbaine prédictive, avec intégration du secteur informel.

Pipeline : 40 bacs virtuels sur 4 districts → télémétrie MQTT → DCPI (priorité dynamique) → OR-Tools (tournées) → dashboard React (carte live, prévisions, KPI, Digital Twin).

Contributions : WQS (qualité de tri), DCPI, Federated Learning, XAI (SHAP), Digital Twin, bridge waste-pickers.

Stack : FastAPI, TimescaleDB, MQTT, XGBoost, OR-Tools, React/Vite, simulateur edge.

Rôle : Team Leader — Housséni YABRE.`;
  const image = 'https://github.com/user-attachments/assets/cafb254a-6d01-485a-b768-51446b43ff5f';
  const url = 'https://github.com/ElProfesormika/AI4Earth';
  const tags = 'AI,SmartAIthon,Federated Learning,XAI,MQTT,FastAPI,React,OR-Tools,Research';

  const existing = await query('SELECT id FROM projects WHERE title = $1 OR project_url = $2 LIMIT 1', [
    title,
    url,
  ]);

  if (existing.length) {
    await query(
      `UPDATE projects SET
         description = $1,
         long_description = $2,
         image_url = CASE WHEN image_url IS NULL OR image_url = '' THEN $3 ELSE image_url END,
         project_url = $4,
         repo_url = $4,
         tags = $5,
         featured = 1,
         sort_order = -25
       WHERE id = $6`,
      [description, longDescription, image, url, tags, existing[0].id]
    );
    console.log('✅ Projet SmartWasteAI / AI4Earth mis à jour (id', existing[0].id + ')');
  } else {
    const rows = await query(
      `INSERT INTO projects
         (title, description, long_description, image_url, project_url, repo_url, tags, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$5,$6,1,-25)
       RETURNING id`,
      [title, description, longDescription, image, url, tags]
    );
    console.log('✅ Projet SmartWasteAI / AI4Earth ajouté (id', rows[0].id + ')');
  }

  const homeDefaults = [
    ['hero_badge', 'Stage Data Engineer'],
    ['hero_greeting', 'Bonjour, je suis'],
    ['hero_contact_label', 'Proposer un stage'],
    ['home_cta_title', 'Un stage Data Engineer'],
    [
      'home_cta_text',
      'Stage de fin d’études de 6 mois (mars 2027) : pipelines, qualité des données et mise en production.',
    ],
    ['home_cta_button', 'Me contacter pour un stage'],
  ];

  for (const [key, value] of homeDefaults) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO NOTHING`,
      [key, value]
    );
  }
  console.log('✅ Réglages accueil présents (non écrasés si déjà définis).');
}

const isMain = process.argv[1]?.endsWith('upsert-ai4earth.js');
if (isMain) {
  upsertAi4Earth()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
