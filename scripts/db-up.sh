#!/usr/bin/env bash
# Démarre PostgreSQL pour le portfolio (sans docker compose)
set -e

CONTAINER_NAME="portfolio-postgres"
IMAGE="postgres:16-alpine"
PORT="${PGPORT:-5432}"

if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "✅ PostgreSQL déjà en cours ($CONTAINER_NAME)"
  exit 0
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "▶ Démarrage du conteneur existant…"
  docker start "$CONTAINER_NAME"
else
  echo "▶ Création du conteneur PostgreSQL…"
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER=portfolio \
    -e POSTGRES_PASSWORD=portfolio \
    -e POSTGRES_DB=portfolio \
    -p "${PORT}:5432" \
    -v portfolio_pg_data:/var/lib/postgresql/data \
    "$IMAGE"
fi

echo "⏳ Attente de PostgreSQL…"
for i in $(seq 1 30); do
  if docker exec "$CONTAINER_NAME" pg_isready -U portfolio -d portfolio >/dev/null 2>&1; then
    echo "✅ PostgreSQL prêt sur localhost:${PORT}"
    echo "   DATABASE_URL=postgresql://portfolio:portfolio@localhost:${PORT}/portfolio"
    exit 0
  fi
  sleep 1
done

echo "❌ PostgreSQL n'a pas démarré à temps. Vérifiez : docker logs $CONTAINER_NAME"
exit 1
