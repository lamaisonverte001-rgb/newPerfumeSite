# ==============================================================================
# Stage 1: Dependencies
# ==============================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --foreground-scripts

# ==============================================================================
# Stage 2: Isolated Prisma CLI for production migrations
# ==============================================================================
FROM node:22-alpine AS prisma-cli
RUN apk add --no-cache libc6-compat openssl
WORKDIR /prisma-cli
RUN npm init -y && npm install prisma@6.19.3 --foreground-scripts

# ==============================================================================
# Stage 3: Builder (Prisma Client + Seed Bundle + Next.js Standalone)
# ==============================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate && \
    ./node_modules/.bin/esbuild prisma/seed.ts \
      --bundle \
      --platform=node \
      --target=node22 \
      --external:@prisma/client \
      --outfile=prisma/seed.cjs && \
    npm run build

# ==============================================================================
# Stage 4: Production Runner (Non-root user)
# ==============================================================================
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV HOME=/tmp
ENV PATH="/prisma-cli/node_modules/.bin:${PATH}"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Prisma schema, migrations, compiled seed, generated client, and Prisma CLI + deps
COPY --from=prisma-cli --chown=nextjs:nodejs /prisma-cli/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy startup entrypoint
COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/docker/entrypoint.sh"]
