FROM node:24-alpine AS base
WORKDIR /app

FROM base as builder
COPY package*.json ./
COPY hybrid-media-api/package*.json hybrid-media-api/
COPY hybrid-auth-server/package*.json hybrid-auth-server/
COPY hybrid-upload-server/package*.json hybrid-upload-server/
RUN npm ci

COPY . .

RUN npm run build

FROM base AS prod
ENV NODE_ENV=production

COPY --from=builder /app/hybrid-media-api/node_modules ./hybrid-media-api/node_modules
COPY --from=builder /app/hybrid-media-api/dist ./hybrid-media-api

COPY --from=builder /app/hybrid-auth-server/node_modules ./hybrid-auth-server/node_modules
COPY --from=builder /app/hybrid-auth-server/dist ./hybrid-auth-server

COPY --from=builder /app/hybrid-upload-server/node_modules ./hybrid-upload-server/node_modules
COPY --from=builder /app/hybrid-upload-server/dist ./hybrid-upload-server

FROM base AS dev
COPY package*.json ./
COPY hybrid-media-api/package*.json hybrid-media-api/
COPY hybrid-auth-server/package*.json hybrid-auth-server/
COPY hybrid-upload-server/package*.json hybrid-upload-server/
RUN npm ci

COPY . .