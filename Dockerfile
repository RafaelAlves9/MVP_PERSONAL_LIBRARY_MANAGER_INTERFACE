# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

# Instala dependências de forma determinística
COPY package*.json ./
RUN npm ci

# Copia o resto do código e builda artefatos estáticos
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Servidor estático leve para os artefatos Vite
RUN npm install -g serve@14.2.3

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

