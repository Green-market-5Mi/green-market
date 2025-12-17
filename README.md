# Green Market

Monorepo front + API logistique pour Green Market. Le front React (Vite + TypeScript) consomme l'API Express qui gère l'authentification JWT, le catalogue produits et les commandes (rôles, notifications email, Swagger).

## Structure
- `client/` : SPA React 19 (Vite, React Router 7).
- `server/` : API Node.js/Express + Postgres (Pool `pg`, Swagger).

## Prérequis
- Node.js 18+ recommandé.
- Postgres accessible (ex. Supabase) et URL de connexion.

## Installation rapide
```bash
git clone <repo>
cd green-market

# Front
cd client && npm install

# API
cd ../server && npm install
```

## Variables d'environnement (API)
Créez `server/.env` :
```env
PORT=3001
BASE_URL=http://localhost:3001/api/v1
DATABASE_URL=postgres://user:password@host:5432/greenmarket
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1h

# Notifications (facultatif)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mailer@example.com
SMTP_PASS=motdepasseSMTP
MAIL_FROM="GreenMarket <mailer@example.com>"
MAIL_DEFAULT_TO=ops@example.com
```

## Lancement en développement
Dans deux terminaux :
```bash
# API
cd server
npm run dev

# Front
cd client
npm run dev
```
API : http://localhost:3001/api/v1

Front (Vite) : http://localhost:5173

Swagger : http://localhost:3001/api-docs

## Tests
API :
```bash
cd server
npm test
```

## Build
- Front : `cd client && npm run build`
- API : `cd server && npm run start` (après build TS via `npm run dev` ou tsx si besoin)

## Notes
- Les rôles prévus : ADMIN, LOGISTICS, CUSTOMER_SERVICE.
- La route `POST /api/v1/auth/register` nécessite un token ADMIN (promouvoir un compte via SQL au démarrage).
