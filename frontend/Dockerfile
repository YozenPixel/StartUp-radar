# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY frontend/tsconfig*.json ./frontend/
COPY frontend/vite.config.ts ./frontend/

RUN npm install

COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/

WORKDIR /app/frontend
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
