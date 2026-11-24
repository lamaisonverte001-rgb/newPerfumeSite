# LA MAISON VERTE — Boutique E-Commerce de Haute Parfumerie

Application web e-commerce complète dédiée à la haute parfumerie contemporaine, construite avec **Next.js (App Router)**, **React 19**, **TypeScript strict**, **Three.js / React Three Fiber**, **Tailwind CSS**, **PostgreSQL 16** et **Prisma ORM**.

> **Personnalisation rapide du nom de la Maison** : modifiez la constante `BRAND_CONFIG` dans [`src/config/brand.ts`](./src/config/brand.ts) (par exemple pour passer à « MAISON SILLAGE ») — l'ensemble du site et l'étiquette du flacon 3D s'adaptent automatiquement.

---

## Fonctionnalités principales

- **Hero 3D WebGL interactif** : modélisation procédurale haute précision du flacon signature (verre épais à fond massif et dôme intérieur, jus champagne doré avec ménisque, tube plongeur transparent incurvé, col doré serti, bouchon laqué noir piano et médaillon baroque échancré courbé avec texture haute résolution générée dynamiquement). Éclairage studio 100 % autonome via `<Environment>` + `<Lightformer>`, sélecteur des créations de la Maison, bascule « Vue Studio / Vue Détail », respect de `prefers-reduced-motion` et fallback 2D automatique si WebGL est indisponible.
- **Catalogue dynamique PostgreSQL** : 6 créations Parfum Intense (`Aventus`, `Bois Altier`, `Bal d'Afrique Absolu`, `Bianco Latte`, `Musc Ravageur`, `Acqua di Gio Profondo`) avec filtres par famille olfactive, recherche instantanée et sélecteur 50 ml / 100 ml.
- **Page Produit Détaillée (`/parfums/[slug]`)** : sélection de contenance avec mise à jour temps réel du prix, du SKU et du stock en base, pyramide olfactive visuelle en 3 niveaux, indicateurs d'intensité et de tenue, et accordéons éditoriaux.
- **Quiz Olfactif Interactif** : diagnostic en 3 questions animées recommandant le parfum le plus adapté depuis la base PostgreSQL avec ajout direct au panier.
- **Tiroir Panier persistant (Zustand)** : barre de progression vers la livraison offerte (dès 120 €), modification des quantités et calcul du total en temps réel.
- **Tunnel de Commande (`/checkout`) & Confirmation (`/commande/[orderNumber]`)** : validation React Hook Form + Zod, vérification atomique et décrémentation des stocks dans une transaction `prisma.$transaction`, puis page récapitulative lue depuis PostgreSQL.
- **Back-Office Administration (`/admin`)** : authentification par mot de passe (`ADMIN_PASSWORD`) avec cookie HTTP-only signé HMAC-SHA256, gestion du statut des commandes, édition en direct des prix et des stocks dans PostgreSQL, et liste exportable des inscrits à la newsletter.

---

## Démarrage rapide avec Docker (1 commande)

Assurez-vous que Docker Desktop / Docker Engine est démarré, puis depuis le dossier `NeonPefume` :

```bash
cp .env.example .env
docker compose up --build
```

Au démarrage, le conteneur `web` :
1. Attend que PostgreSQL 16 soit prêt (`healthcheck` `pg_isready`),
2. Exécute automatiquement `prisma migrate deploy`,
3. Peuple le catalogue (6 parfums + 12 variantes 50 ml / 100 ml) si la table `Perfume` est vide,
4. Démarre l'application Next.js en mode `standalone`.

### Accès aux services

| Service | URL | Identifiants par défaut |
| :--- | :--- | :--- |
| **Boutique E-Commerce** | `http://localhost:3000` | Accès public |
| **Back-Office Admin** | `http://localhost:3000/admin` | Mot de passe : `maisonverte-admin` (variable `ADMIN_PASSWORD`) |
| **Adminer (PostgreSQL UI)** | `http://localhost:8080` | Système : `PostgreSQL` · Serveur : `db` · Utilisateur : `parfumerie` · Mot de passe : `parfumerie_secret` · Base : `maison_verte` |

Pour arrêter la stack (en conservant les données PostgreSQL) :

```bash
docker compose down
```

Pour réinitialiser complètement la base et repartir à zéro :

```bash
docker compose down -v
```

---

## Développement local (hors Docker)

1. **Lancer uniquement PostgreSQL** (ou utilisez votre instance locale) :

```bash
docker compose up -d db adminer
```

2. **Configurer l'environnement & installer les dépendances** :

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

3. **Démarrer le serveur de développement** :

```bash
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

### Scripts utiles

- `npm run dev` — serveur de développement Next.js
- `npm run typecheck` — vérification TypeScript stricte (`tsc --noEmit`)
- `npm run build` — build de production Next.js (`standalone`)
- `npm run db:migrate` — exécute `prisma migrate deploy`
- `npm run db:seed` — lance le seed idempotent (`prisma/seed.ts`)
