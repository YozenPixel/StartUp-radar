# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY backend/tsconfig*.json ./backend/
COPY backend/prisma.config.ts ./backend/
COPY backend/prisma ./backend/prisma/

# Installation des dépendances
RUN npm install

# Copie des sources backend
COPY backend/src ./backend/src

# Génération du client Prisma et compilation NestJS
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY backend/prisma.config.ts ./backend/
COPY backend/prisma ./backend/prisma/

# Installation des dépendances de production
RUN npm install --omit=dev

# Copie du build compilé et du client Prisma
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "dist/main.js"]
