FROM node:24-alpine AS builder
WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/hybrid-media-api/node_modules ./hybrid-media-api/node_modules
COPY --from=builder /app/hybrid-media-api/dist ./hybrid-media-api

COPY --from=builder /app/hybrid-auth-server/node_modules ./hybrid-auth-server/node_modules
COPY --from=builder /app/hybrid-auth-server/dist ./hybrid-auth-server

COPY --from=builder /app/hybrid-upload-server/node_modules ./hybrid-upload-server/node_modules
COPY --from=builder /app/hybrid-upload-server/dist ./hybrid-upload-server
