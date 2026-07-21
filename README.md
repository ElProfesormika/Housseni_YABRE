# Portfolio — Housséni YABRE

Portfolio React avec **panneau admin**, **PostgreSQL** (Railway) et **mode clair / sombre**.

## Fonctionnalités

- Pages séparées : Accueil, À propos, Compétences, Parcours, Projets, Certifications, Contact
- Pages détail cliquables (projets, expériences, formation, certifications)
- Profil orienté **Data Engineer & Ingénieur IA**
- Nom complet **Housséni YABRE** sur tout le site
- Thème **clair** et **sombre** (bouton soleil/lune dans le header)
- Admin CRUD complet + upload d’images
- Base **PostgreSQL** (compatible Railway)

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Node.js, Express 5, **PostgreSQL** (`pg`) |
| Auth | JWT |

## Installation locale

### 1. PostgreSQL

**Option A — script npm (recommandé, sans docker compose) :**

```bash
cd portfolio-react
npm run db:up
```

**Option B — Docker Compose** (si le plugin est installé) :

```bash
docker compose up -d
```

**Option C — PostgreSQL système (Ubuntu) :**

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER portfolio WITH PASSWORD 'portfolio';"
sudo -u postgres psql -c "CREATE DATABASE portfolio OWNER portfolio;"
```

Si `docker compose up -d` affiche `unknown shorthand flag: 'd'`, utilisez **Option A**.

### 2. Variables d’environnement

```bash
cp server/.env.example server/.env
```

`server/.env` :

```env
DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio
PORT=3001
JWT_SECRET=votre-secret-long
ADMIN_EMAIL=housseni.yabre@utt.fr
ADMIN_PASSWORD=ChangeMe2025!
CLIENT_URL=http://localhost:5173
```

### 3. Dépendances & seed

```bash
npm run install:all
npm run db:up          # démarre Postgres si besoin
npm run seed --prefix server
```

Ou tout en une commande :

```bash
npm run setup
```

### 4. Lancement

```bash
npm run dev
```

- Site : http://localhost:5173  
- Admin : http://localhost:5173/admin  
- API : http://localhost:3001  

## Déploiement Railway

### 1. Créer le projet

1. Nouveau projet Railway
2. Ajouter un service **PostgreSQL** (plugin)
3. Ajouter un service **Web** depuis ce repo (`portfolio-react`)

### 2. Variables sur le service Web

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Référence `${{Postgres.DATABASE_URL}}` (variable Railway du plugin Postgres) |
| `DATABASE_SSL` | `true` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Secret long aléatoire |
| `ADMIN_EMAIL` | Votre email admin |
| `ADMIN_PASSWORD` | Mot de passe fort |
| `CLIENT_URL` | URL publique du site (ex. `https://votre-app.up.railway.app`) |
| `PORT` | `3001` (ou laisser Railway injecter `PORT`) |

### 3. Commandes Railway (service Web)

**Build :**

```bash
npm run install:all && npm run build --prefix client
```

**Start :**

```bash
npm run start --prefix server
```

Au premier démarrage, si la base est vide, le seed s’exécute automatiquement.

**Migration contenu (images, textes) :**

```bash
npm run migrate --prefix server
```

### 4. Structure recommandée

- **1 service Postgres** (données persistantes)
- **1 service Node** (API + fichiers `client/dist` en production)

Les uploads admin sont dans `server/uploads/` — pour la production, envisagez un volume Railway ou un stockage S3.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Client + API en développement |
| `npm run build` | Build React |
| `npm run seed --prefix server` | Initialiser PostgreSQL |
| `npm run migrate --prefix server` | Mettre à jour images & textes Housséni YABRE |
| `docker compose up -d` | PostgreSQL local |

## Identifiants admin par défaut

Voir `server/.env` — changez le mot de passe après la première connexion (Paramètres admin).

## Structure

```
portfolio-react/
├── client/           # React (pages publiques + admin)
├── server/           # API Express + PostgreSQL
├── docker-compose.yml
└── README.md
```
