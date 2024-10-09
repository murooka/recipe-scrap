### base ###
FROM node:22-slim AS base
WORKDIR /app
ENV TZ=Asia/Tokyo



### tini ###
FROM base AS tini
ADD https://github.com/krallin/tini/releases/download/v0.19.0/tini /tini
RUN chmod +x /tini



### pnpm ###
FROM base AS pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"



### builder ###
FROM pnpm AS builder
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm -v
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN pnpm run build



### runner ###
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=tini --chown=nodejs:nodejs /tini /tini
ENTRYPOINT ["/tini", "--"]
COPY --chown=node:node ./public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD [ "node", "server.js" ]
