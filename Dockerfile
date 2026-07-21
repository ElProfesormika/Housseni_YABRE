FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

RUN npm ci && npm ci --prefix client && npm ci --prefix server

COPY . .

RUN npm run build --prefix client

FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/

RUN npm ci --omit=dev && npm ci --prefix server --omit=dev

COPY server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 8080

CMD ["npm", "run", "start", "--prefix", "server"]
