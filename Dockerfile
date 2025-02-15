### base ###
FROM node:22-slim AS base
WORKDIR /app
ENV TZ=Asia/Tokyo
RUN apt-get update && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*



### tini ###
FROM base AS tini
ADD https://github.com/krallin/tini/releases/download/v0.19.0/tini-static /tini
RUN chmod +x /tini



### pnpm ###
FROM base AS pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"



### builder ###
FROM pnpm AS builder
COPY package.json pnpm-lock.yaml ./
RUN npm install -g corepack@latest && corepack enable pnpm && pnpm -v
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build



### runner ###
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
ENV TZ=Asia/Tokyo
ENV NODE_ENV=production

COPY --from=tini --chown=nonroot:nonroot /tini /tini
ENTRYPOINT ["/tini", "--", "/nodejs/bin/node"]
COPY --chown=nonroot:nonroot ./public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER node
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD [ "server.js" ]
