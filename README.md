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
   - Autoriser l'acces reseau depuis n'importe ou (`0.0.0.0/0`) pour que Render puisse se connecter
   - Copier l'URI de connexion dans `MONGODB_URI`

2. **Cloudinary** (hebergement des photos) : https://cloudinary.com/users/register/free
   - Recuperer `Cloud name`, `API Key`, `API Secret` depuis le dashboard
   - Les mettre dans `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

3. **Gmail** (envoi des emails de notification)
   - Activer la validation en 2 etapes sur le compte Gmail
   - Generer un "mot de passe d'application" : https://myaccount.google.com/apppasswords
   - Le mettre dans `GMAIL_APP_PASSWORD`, et l'adresse Gmail dans `GMAIL_USER` et `ADMIN_NOTIFICATION_EMAIL`

## Deploiement (gratuit)

### Backend sur Render

1. Pousser le code sur GitHub (dossier `server/`)
2. Sur https://render.com : New > Web Service, connecter le repo, Root Directory = `server`
3. Build Command: `npm install` — Start Command: `npm start`
4. Ajouter toutes les variables de `.env.example` dans l'onglet Environment
5. Deployer. Noter l'URL generee (ex: `https://watchshop-api.onrender.com`)

Note : le palier gratuit de Render met le service en veille apres 15 min d'inactivite. La premiere requete apres une pause peut prendre ~30-50s.

### Frontend sur Vercel ou Netlify

1. Mettre a jour `client/src/environments/environment.prod.ts` avec l'URL Render (`https://.../api`)
2. Pousser le code sur GitHub (dossier `client/`)
3. Sur Vercel/Netlify : importer le repo, Root Directory = `client`
4. Build Command: `npm run build` — Output Directory: `dist/client/browser`
5. Deployer

### Mettre a jour CORS

Une fois le frontend deploye, mettre son URL dans la variable `CLIENT_URL` sur Render (redeployer le backend pour que ca prenne effet).

## Ajouter un montre / gerer les commandes

1. Se connecter sur `/admin/login` avec le compte admin seed
2. Onglet "Mes montres" : ajouter/modifier/supprimer des montres avec photos
3. Onglet "Commandes" : voir les commandes recues et changer leur statut (en attente / confirmee / annulee)

Pour ajouter d'autres comptes admin, utiliser l'endpoint protege `POST /api/admin/auth/register` (necessite d'etre deja connecte en tant qu'admin).
