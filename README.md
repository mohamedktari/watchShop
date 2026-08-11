# WatchShop

Site e-commerce pour vendre des montres : catalogue public (FR/AR), commande sans paiement en ligne (nom, prenom, telephone, ville), espace admin pour gerer les montres et les commandes, notification par email a chaque nouvelle commande.

## Structure

- `client/` — Application Angular (site public + espace admin)
- `server/` — API Node/Express + MongoDB

## Demarrage en local

### 1. Backend

```bash
cd server
cp .env.example .env
# remplir .env (voir "Comptes a creer" ci-dessous)
npm install
npm run dev
```

Le serveur demarre sur `http://localhost:4000`. Au premier demarrage, si aucun admin n'existe en base, un compte admin est cree automatiquement avec `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (definis dans `.env`).

### 2. Frontend

```bash
cd client
npm install
npm start
```

Le site est accessible sur `http://localhost:4200`. L'espace admin est sur `http://localhost:4200/admin/login`.

## Comptes a creer (gratuits)

1. **MongoDB Atlas** (base de donnees) : https://www.mongodb.com/cloud/atlas/register
   - Creer un cluster gratuit M0
   - Creer un utilisateur de base de donnees
   - Autoriser l'acces reseau depuis n'importe ou (`0.0.0.0/0`) pour que Vercel puisse se connecter (les fonctions serverless n'ont pas d'IP fixe)
   - Copier l'URI de connexion dans `MONGODB_URI`

2. **Cloudinary** (hebergement des photos) : https://cloudinary.com/users/register/free
   - Recuperer `Cloud name`, `API Key`, `API Secret` depuis le dashboard
   - Les mettre dans `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

3. **Gmail** (envoi des emails de notification)
   - Activer la validation en 2 etapes sur le compte Gmail
   - Generer un "mot de passe d'application" : https://myaccount.google.com/apppasswords
   - Le mettre dans `GMAIL_APP_PASSWORD`, et l'adresse Gmail dans `GMAIL_USER` et `ADMIN_NOTIFICATION_EMAIL`

## Deploiement (gratuit) — tout sur Vercel

Le frontend et le backend sont deployes comme **deux projets Vercel separes**, importes depuis le meme repo GitHub. C'est le pattern standard pour un monorepo Angular + Express (deux arbres de dependances independants), et ca revient au meme resultat qu'un unique projet : tout tourne sur Vercel, plus besoin de Render.

### Backend (API) sur Vercel

1. Pousser le code sur GitHub
2. Sur https://vercel.com/new : importer le repo `watchShop`, **Root Directory = `server`**
3. Framework Preset : "Other" (le `vercel.json` + `api/index.js` du dossier `server/` gerent tout — pas de Build Command a definir)
4. Ajouter toutes les variables de `.env.example` dans Environment Variables (voir liste plus bas)
5. Deployer. Noter l'URL generee (ex: `https://watchshop-api.vercel.app`)

Le backend tourne en fonctions serverless (`server/api/index.js` enveloppe l'app Express existante). La connexion MongoDB est mise en cache entre invocations (voir `server/src/config/db.js`) pour eviter d'epuiser le quota de connexions Atlas.

### Frontend sur Vercel

1. Mettre a jour `client/src/environments/environment.prod.ts` avec l'URL du backend Vercel (`https://.../api`)
2. Pousser le code sur GitHub
3. Sur https://vercel.com/new : importer le repo `watchShop` une deuxieme fois comme nouveau projet, **Root Directory = `client`**
4. Build Command: `npm run build` — Output Directory: `dist/client/browser`
5. Deployer

### CORS

`CLIENT_URL` (variable d'env du backend) accepte une liste d'origines separees par des virgules, ex :
`http://localhost:4200,https://watch-shop-watchshop.vercel.app`
Ajouter l'URL du frontend deploye a cette liste, puis redeployer le backend pour que ca prenne effet.

### Ancien backend Render (optionnel)

Le projet a d'abord ete deploye sur Render avant de migrer vers Vercel. Le service Render peut etre supprime des que le backend Vercel est confirme fonctionnel — il n'est plus utilise par le frontend, mais rien ne force sa suppression immediate.

## Ajouter un montre / gerer les commandes

1. Se connecter sur `/admin/login` avec le compte admin seed
2. Onglet "Mes montres" : ajouter/modifier/supprimer des montres avec photos
3. Onglet "Commandes" : voir les commandes recues et changer leur statut (en attente / confirmee / annulee)

Pour ajouter d'autres comptes admin, utiliser l'endpoint protege `POST /api/admin/auth/register` (necessite d'etre deja connecte en tant qu'admin).
