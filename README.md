# Housséni YABRE — Portfolio

Portfolio professionnel de **Housséni YABRE**, étudiant ingénieur à l’Université de Technologie de Troyes (UTT), spécialisé en **Data Engineering** et **Intelligence Artificielle**.

Le site présente le parcours, les compétences, les projets et les certifications — avec une interface moderne, responsive, et un espace d’administration privé pour la gestion du contenu.

---

## À propos

Housséni YABRE conçoit des pipelines de données, des architectures cloud et des systèmes IA orientés production. Son ambition : transformer des données brutes en produits data-driven robustes, et poursuivre vers la recherche en IA appliquée.

Ce dépôt contient l’application complète du portfolio (interface publique + API).

---

## Fonctionnalités

- Pages dédiées : Accueil, À propos, Compétences, Parcours, Projets, Certifications, Contact
- Fiches détail pour les projets, expériences, formations et certifications
- Thème clair / sombre
- Formulaire de contact
- Panneau d’administration (accès par URL directe, hors navigation publique)
- Contenu dynamique stocké en base PostgreSQL

---

## Stack technique

| Couche | Technologies |
|--------|----------------|
| Frontend | React, TypeScript, Vite, React Router |
| Backend | Node.js, Express |
| Données | PostgreSQL |
| Authentification | JWT |
| Déploiement | Docker · Railway |

---

## Structure du projet

```
portfolio-react/
├── client/     # Application React (site public + admin)
├── server/     # API Express et accès PostgreSQL
├── scripts/    # Utilitaires locaux (base de données)
└── Dockerfile  # Image de production
```

---

## Développement local

Prérequis : **Node.js 20+** et une instance **PostgreSQL**.

```bash
npm run setup    # dépendances + initialisation
npm run dev      # mode développement
```

La configuration sensible (connexion base, secrets, identifiants admin) se fait via un fichier d’environnement local, **non versionné**. Un modèle est fourni côté serveur : copiez-le, renseignez vos valeurs, et ne le commitez jamais.

---

## Production

L’application est conçue pour tourner derrière un reverse-proxy / PaaS (ex. Railway) :

- build frontend intégré à l’image Docker
- API et site statique servis par le même processus Node
- seed automatique au premier démarrage si la base est vide

Les secrets et URLs de production se configurent uniquement dans l’environnement d’hébergement, jamais dans le dépôt.

---

## Scripts utiles

| Commande | Rôle |
|----------|------|
| `npm run setup` | Installation et initialisation |
| `npm run dev` | Développement (client + API) |
| `npm run build` | Build de production du client |
| `npm start` | Démarrage du serveur |
| `npm run db:seed` | Initialisation du contenu |
| `npm run db:migrate` | Mise à jour du contenu |

---

## Licence & contact

© Housséni YABRE — Tous droits réservés.

Pour une opportunité (stage, collaboration, projet data / IA), utilisez le formulaire de contact du site.
