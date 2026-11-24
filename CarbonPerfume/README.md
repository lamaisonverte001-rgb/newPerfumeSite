# CARBON PERFUME — Maison de Haute Parfumerie de Niche

Application web e-commerce complète dédiée à la maison **CARBON PERFUME** (personnalisable via une constante unique dans [`src/config/brand.ts`](./src/config/brand.ts)), alliant direction artistique éditoriale, flacon **3D procédural interactif en temps réel (Three.js / React Three Fiber)**, tunnel de commande transactionnel et back-office administrateur reliés à **PostgreSQL 16**.

---

## Stack Technique

- **Framework** : Next.js 16 (App Router), React 19, TypeScript (`strict: true`)
- **UI & Design System** : Tailwind CSS v4, primitives Radix UI (`shadcn/ui`), Lucide React, Sonner
- **Typographie** : `Cormorant Garamond` (titres éditoriaux) & `Plus Jakarta Sans` (interface & textes)
- **Scène 3D Temps Réel** : `three`, `@react-three/fiber`, `@react-three/drei` (verre physique PBR, liquide & ménisque, tube plongeur, bouchon laqué noir & or, étiquette blason sur `CanvasTexture`, éclairage studio autonome `<Lightformer>`)
- **Animations & Scroll** : `motion` (Framer Motion) & `lenis`
- **État & Validation** : Zustand (panier persistant), React Hook Form + Zod v4
- **Base de données & ORM** : PostgreSQL 16 + Prisma ORM (migrations SQL + seed idempotent)
- **Conteneurisation** : Docker multi-stage (`output: "standalone"`, utilisateur non-root) + Docker Compose + Adminer

---

## 1. Démarrage Clé en Main avec Docker (Recommandé)

Une seule commande suffit pour construire l'application, démarrer **PostgreSQL 16**, appliquer automatiquement les migrations Prisma, peupler le catalogue des **6 créations** et lancer le serveur de production ainsi qu'**Adminer** :

```bash
cd CarbonPerfume
docker compose up --build
```

Une fois les conteneurs démarrés :

| Service | URL | Description |
| :--- | :--- | :--- |
| **Boutique E-Commerce** | `http://localhost:3000` | Accueil 3D, collection, fiches parfums, quiz olfactif, panier & checkout |
| **Back-Office Admin** | `http://localhost:3000/admin` | Gestion des commandes, ajustement des prix & stocks en direct, inscrits newsletter |
| **Adminer (PostgreSQL)** | `http://localhost:8080` | Interface web d'exploration de la base PostgreSQL |

Pour arrêter la stack :

```bash
docker compose down
```

---

## 2. Développement Local (Hors Docker pour Next.js)

### Prérequis
- **Node.js 22+** et `npm`
- Une instance **PostgreSQL 16** accessible localement (vous pouvez lancer uniquement la base via `docker compose up -d db`)

### Installation & lancement

```bash
cd CarbonPerfume

# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Installer les dépendances
npm install

# 3. Démarrer PostgreSQL (si vous utilisez le conteneur db uniquement)
docker compose up -d db

# 4. Appliquer les migrations Prisma et peupler le catalogue (idempotent)
npx prisma migrate deploy
npm run db:seed

# 5. Lancer le serveur de développement Next.js
npm run dev
```

L'application est alors disponible sur `http://localhost:3000`.

---

## 3. Accès au Back-Office `/admin` & à Adminer

### Mini Back-Office (`/admin`)
- **URL** : `http://localhost:3000/admin`
- **Mot de passe par défaut** (défini via `ADMIN_PASSWORD` dans `.env` / `docker-compose.yml`) :
  ```text
  carbon-atelier-2026
  ```
- **Fonctionnalités** :
  - Authentification protégée par cookie `HTTP-only` signé (`HMAC-SHA256`).
  - Suivi des commandes et modification de statut en direct (`PENDING`, `PAID`, `PREPARING`, `SHIPPED`, `CANCELLED`).
  - Édition instantanée des **prix TTC** et des **stocks** (50 ml & 100 ml) directement dans PostgreSQL.
  - Consultation de la liste des inscrits à la newsletter.

### Explorateur PostgreSQL Adminer (`:8080`)
- **URL** : `http://localhost:8080`
- **Système** : `PostgreSQL`
- **Serveur** : `db`
- **Utilisateur** : `carbon`
- **Mot de passe** : `carbon_secret_2026`
- **Base de données** : `carbon_perfume`

---

## 4. Personnalisation de la Marque

Le nom de la maison, l'origine d'atelier, le logo, le seuil de livraison offerte (120 €) et les finitions du flacon 3D sont centralisés dans :

- [`src/config/brand.ts`](./src/config/brand.ts) (`BRAND_CONFIG`)
