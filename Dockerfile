# syntax=docker/dockerfile:1

# HamsterCheek production image.
#
# Three stages so the shipped image carries only what it needs, but note the
# runtime deliberately keeps the full dependency tree: `db:migrate` runs on
# startup via tsx (a dev dependency), so we do NOT prune to production-only.

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- deps: install the full dependency tree (dev deps included) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- build: compile the Next.js production bundle ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` throws unless DATABASE_URL is set — the DB layer validates it at
# module scope. But every route is dynamic (force-dynamic / dynamic params), so
# nothing actually connects during the build. This placeholder only satisfies
# the presence check; the real connection string is injected at runtime.
ENV DATABASE_URL=postgres://build:build@127.0.0.1:5432/build
RUN npm run build

# --- runner: the image we actually ship ---
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src ./src
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
