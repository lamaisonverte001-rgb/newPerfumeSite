#!/bin/sh
set -e

echo "[LA MAISON VERTE] Application des migrations Prisma..."
/app/prisma-cli/node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma

echo "[LA MAISON VERTE] Vérification du catalogue initial..."
PERFUME_COUNT=$(node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.perfume.count()
  .then((count) => { console.log(count); return prisma.$disconnect(); })
  .catch((err) => { console.error(err); process.exit(1); });
')

if [ "${PERFUME_COUNT}" = "0" ]; then
  echo "[LA MAISON VERTE] Catalogue vide — lancement du seed initial..."
  node ./prisma/seed.cjs
else
  echo "[LA MAISON VERTE] Catalogue déjà peuplé (${PERFUME_COUNT} parfums)."
fi

echo "[LA MAISON VERTE] Démarrage du serveur Next.js sur le port ${PORT:-3000}..."
exec node server.js
