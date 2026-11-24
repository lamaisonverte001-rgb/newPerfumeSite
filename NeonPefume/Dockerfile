# ==============================================================================
# Stage 1: Installation des dépendances complètes
# ==============================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ==============================================================================
# Stage 2: Installation isolée de la CLI Prisma (migrations en production)
# ==============================================================================
FROM node:22-alpine AS prisma-cli
RUN apk add --no-cache libc6-compat openssl
WORKDIR /prisma-cli
RUN npm init -y >/dev/null 2>&1 && npm install --no-audit --no-fund prisma@6.19.3

# ==============================================================================
# Stage 3: Build Prisma Client, Seed JS & Next.js Standalone
# ==============================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Génère le client Prisma (natif + linux-musl-openssl-3.0.x)
RUN npx prisma generate

# Compile le script de seed en JS autonome pour une exécution ultra-rapide au démarrage
RUN npx esbuild prisma/seed.ts \
  --bundle \
  --platform=node \
  --format=cjs \
  --external:@prisma/client \
  --outfile=prisma/seed.cjs

# Build de production Next.js (output: 'standalone')
RUN npm run build

# ==============================================================================
# Stage 4: Image de production minimale (utilisateur non-root)
# ==============================================================================
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Fichiers statiques et serveur standalone Next.js
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Migrations Prisma, schéma, client généré, seed compilé et CLI Prisma autonome
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=prisma-cli --chown=nextjs:nodejs /prisma-cli /app/prisma-cli

# Script d'entrée (migrations + seed conditionnel + démarrage serveur)
COPY --chown=nextjs:nodejs docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker/entrypoint.sh"]
