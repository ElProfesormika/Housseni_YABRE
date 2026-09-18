import 'dotenv/config';
import { initDb, query } from './db.js';

/**
 * Remplace les tirets longs (—) par " - " dans les textes, sans supprimer de lignes.
 */
export async function scrubEmDashes() {
  await initDb();

  const jobs = [
    ['profile', ['title', 'tagline', 'about_title', 'about_text', 'skills_intro']],
    ['projects', ['title', 'description', 'long_description', 'tags']],
    ['experiences', ['company', 'role', 'description', 'long_description']],
    ['education', ['school', 'degree', 'field', 'description', 'long_description']],
    ['certifications', ['title', 'issuer', 'long_description']],
    ['skills', ['name', 'description']],
    ['kiffs', ['title', 'category', 'description', 'long_description']],
    ['site_settings', ['value']],
  ];

  let total = 0;
  for (const [table, cols] of jobs) {
    for (const col of cols) {
      const rows = await query(
        `UPDATE ${table}
         SET ${col} = REPLACE(${col}, '—', ' - ')
         WHERE ${col} LIKE '%—%'
         RETURNING 1`
      );
      total += rows.length;
    }
  }

  const defaults = [
    [
      'contact_sought_title',
      'Profil recherché',
    ],
    [
      'contact_sought_text',
      'Housséni YABRE recherche un stage de fin d’études de 6 mois, orienté recherche (laboratoire, R&D ou équipe data / IA), pour préparer un doctorat en IA appliquée après le diplôme d’ingénieur.',
    ],
    [
      'home_cta_text',
      'Stage de 4ᵉ année de cycle ingénieur, orienté recherche (labo / R&D) - puis doctorat en IA appliquée.',
    ],
  ];
  for (const [key, value] of defaults) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO NOTHING`,
      [key, value]
    );
  }

  console.log(`✅ Tirets longs nettoyés (${total} champs). Réglages contact présents si absents.`);
}

const isMain = process.argv[1]?.endsWith('scrub-emdashes.js');
if (isMain) {
  scrubEmDashes()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
