export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'url'
  | 'image'
  | 'images'
  | 'file'
  | 'date'
  | 'select';

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  accept?: string;
  optionsResource?: string;
  optionsLabel?: string;
  hint?: string;
  min?: number;
  max?: number;
}

export const crudConfigs: Record<string, { label: string; fields: FieldConfig[]; listColumns: string[] }> = {
  projects: {
    label: 'Projet',
    listColumns: ['title', 'tags', 'featured'],
    fields: [
      { key: 'title', label: 'Titre', required: true },
      { key: 'description', label: 'Résumé (liste)', type: 'textarea', required: true },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'image_url', label: 'Image de couverture', type: 'image' },
      { key: 'gallery_urls', label: 'Galerie (plusieurs images)', type: 'images' },
      {
        key: 'video_url',
        label: 'Vidéo du projet',
        type: 'file',
        accept: 'video/mp4,video/webm,video/quicktime,video/*',
      },
      { key: 'project_url', label: 'Lien démo', type: 'url' },
      { key: 'repo_url', label: 'Lien GitHub', type: 'url' },
      { key: 'tags', label: 'Tags (séparés par virgule)' },
      { key: 'featured', label: 'Mis en avant', type: 'checkbox' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  experiences: {
    label: 'Expérience',
    listColumns: ['role', 'company', 'start_date'],
    fields: [
      { key: 'role', label: 'Poste / rôle', required: true },
      { key: 'company', label: 'Entreprise', required: true },
      { key: 'location', label: 'Lieu' },
      { key: 'start_date', label: 'Date début', type: 'date', required: true },
      { key: 'end_date', label: 'Date fin', type: 'date' },
      { key: 'current', label: 'En cours', type: 'checkbox' },
      { key: 'description', label: 'Résumé (liste)', type: 'textarea', required: true },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  skills: {
    label: 'Compétence',
    listColumns: ['name', 'percentage', 'section_id'],
    fields: [
      { key: 'section_id', label: 'Groupe / section', type: 'select', optionsResource: 'skill-sections', optionsLabel: 'title', required: true },
      { key: 'name', label: 'Nom', required: true },
      { key: 'description', label: 'Description courte', type: 'textarea' },
      { key: 'percentage', label: 'Niveau (%)', type: 'number', required: true, min: 0, max: 100 },
      {
        key: 'icon',
        label: 'Clé de logo',
        placeholder: 'python, pandas, docker, aws, kubernetes…',
        hint: 'Nom du logo Devicon / Lucide. Laissez vide si vous uploadez une image.',
      },
      { key: 'icon_url', label: 'Logo personnalisé (image)', type: 'image' },
      { key: 'sort_order', label: 'Ordre dans la section', type: 'number' },
    ],
  },
  'skill-sections': {
    label: 'Groupe de compétences',
    listColumns: ['title', 'sort_order'],
    fields: [
      { key: 'title', label: 'Titre du groupe', required: true, placeholder: 'Data Engineering' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  certifications: {
    label: 'Certification',
    listColumns: ['title', 'issuer', 'date'],
    fields: [
      { key: 'title', label: 'Titre', required: true },
      { key: 'issuer', label: 'Organisme' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'credential_url', label: 'Lien certificat', type: 'url' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  education: {
    label: 'Formation',
    listColumns: ['degree', 'school', 'end_date'],
    fields: [
      { key: 'school', label: 'Établissement', required: true },
      { key: 'degree', label: 'Diplôme', required: true },
      { key: 'field', label: 'Spécialité' },
      { key: 'start_date', label: 'Début', type: 'date' },
      { key: 'end_date', label: 'Fin (si terminée)', type: 'date' },
      { key: 'current', label: 'Formation en cours', type: 'checkbox' },
      { key: 'description', label: 'Résumé (liste)', type: 'textarea' },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  kiffs: {
    label: 'Kiff',
    listColumns: ['title', 'category'],
    fields: [
      { key: 'title', label: 'Titre', required: true },
      {
        key: 'category',
        label: 'Catégorie (entreprise, labo, article, autre)',
        required: true,
        placeholder: 'entreprise',
      },
      { key: 'description', label: 'Résumé court', type: 'textarea', required: true },
      { key: 'long_description', label: 'Détail / pourquoi ce coup de cœur', type: 'textarea' },
      { key: 'url', label: 'Lien', type: 'url' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'featured', label: 'Mis en avant', type: 'checkbox' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
  'social-links': {
    label: 'Réseau social',
    listColumns: ['platform', 'url'],
    fields: [
      { key: 'platform', label: 'Plateforme', required: true },
      { key: 'url', label: 'URL', type: 'url', required: true },
      { key: 'icon', label: 'Icône (linkedin, github, twitter…)' },
      { key: 'sort_order', label: 'Ordre', type: 'number' },
    ],
  },
};
