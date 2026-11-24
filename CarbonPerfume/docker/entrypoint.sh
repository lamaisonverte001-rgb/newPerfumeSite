#!/bin/sh
set -e

echo "🌿 [Carbon Perfume] Application des migrations PostgreSQL (Prisma)..."
npx prisma migrate deploy

echo "🔍 [Carbon Perfume] Vérification du catalogue initial..."
PERFUME_COUNT=$(node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.perfume.count()
  .then((count) => {
    process.stdout.write(String(count));
    return prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
')

if [ "$PERFUME_COUNT" = "0" ]; then
  echo "✨ [Carbon Perfume] Table Perfume vide — lancement du seed initial..."
  node prisma/seed.cjs
else
  echo "✓ [Carbon Perfume] Catalogue déjà présent ($PERFUME_COUNT créations en base)."
fi

echo "🚀 [Carbon Perfume] Démarrage du serveur Next.js sur le port ${PORT:-3000}..."
exec node server.js
