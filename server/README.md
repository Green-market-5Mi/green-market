# GreenMarket Orders API

API REST Node.js/Express pour la logistique GreenMarket (auth, produits, commandes) avec MySQL, JWT, Swagger, rôles.

## Stack
- Node.js / Express
- MySQL (mysql2/promise)
- Authentification : JWT + bcryptjs
- Swagger : swagger-ui-express + swagger-jsdoc
- CORS, dotenv

## Prérequis
- Node.js (>= 18 recommandé)
- MySQL/MariaDB accessible

## Installation
```bash
npm install
```

## Configuration
Créez un fichier `.env` (ou copiez `.env.example`) :
```
PORT=3001
BASE_URL=http://localhost:3001/api/v1
DB_HOST=localhost
DB_PORT=3306
DB_USER=gm_user
DB_PASSWORD=motdepasseSolide!
DB_NAME=greenmarket
DB_CONN_LIMIT=10
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1h
```

## Base de données (schéma)
Tables : users, products, orders, order_lines.

## Démarrage
- Dev (watch) :
```bash
npm run dev
```
- Prod :
```bash
npm start
```

Healthcheck : http://localhost:3001/api/v1/health
Swagger UI : http://localhost:3001/api-docs

## Rôles et droits
- **ADMIN** : création de comptes, accès complet.
- **LOGISTICS** : lecture/écriture commandes (création, statut/tracking), mise à jour stock produits, lecture produits.
- **CUSTOMER_SERVICE** : lecture commandes et produits uniquement.

> La route `POST /api/v1/auth/register` est protégée : token ADMIN requis. Pour amorcer, promouvoir un premier user en ADMIN via SQL puis se connecter pour obtenir le token.

## Endpoints principaux (v1)
- Auth :
  - POST /api/v1/auth/register (ADMIN)
  - POST /api/v1/auth/login
- Products :
  - GET /api/v1/products (ADMIN, LOGISTICS, CUSTOMER_SERVICE)
  - POST /api/v1/products (ADMIN, LOGISTICS)
  - PATCH /api/v1/products/{id} (ADMIN, LOGISTICS)
  - PATCH /api/v1/products/{id}/stock (ADMIN, LOGISTICS)
  - DELETE /api/v1/products/{id} (ADMIN)
- Orders :
  - GET /api/v1/orders (ADMIN, LOGISTICS, CUSTOMER_SERVICE)
  - GET /api/v1/orders/{id} (ADMIN, LOGISTICS, CUSTOMER_SERVICE)
  - POST /api/v1/orders (ADMIN, LOGISTICS)
  - PATCH /api/v1/orders/{id} (ADMIN, LOGISTICS)
  - DELETE /api/v1/orders/{id} (ADMIN)

