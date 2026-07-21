export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'url' | 'image' | 'date';

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
}

export const crudConfigs: Record<string, { label: string; fields: FieldConfig[]; listColumns: string[] }> = {
  projects: {
    label: 'Projet',
    listColumns: ['title', 'tags', 'featured'],
    fields: [
      { key: 'title', label: 'Titre', required: true },
      { key: 'description', label: 'Résumé (liste)', type: 'textarea', required: true },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
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
    listColumns: ['name', 'percentage'],
    fields: [
      { key: 'name', label: 'Nom', required: true },
      { key: 'percentage', label: 'Niveau (%)', type: 'number', required: true },
      { key: 'icon', label: 'Icône (github, linkedin, code, python…)' },
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
      { key: 'end_date', label: 'Fin', type: 'date' },
      { key: 'description', label: 'Résumé (liste)', type: 'textarea' },
      { key: 'long_description', label: 'Description détaillée (page)', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
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
