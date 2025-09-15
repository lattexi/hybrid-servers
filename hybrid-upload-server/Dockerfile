FROM node:24-alpine AS base
WORKDIR /usr/local/app

FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS final
WORKDIR /usr/local/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /usr/local/app/dist ./dist
CMD ["node", "dist/index.js"]