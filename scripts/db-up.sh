#!/usr/bin/env bash
# Démarre PostgreSQL pour le portfolio (sans docker compose)
set -e

CONTAINER_NAME="portfolio-postgres"
IMAGE="postgres:16-alpine"
# 5433 par défaut : évite le conflit avec un PostgreSQL système sur 5432
PORT="${PGPORT:-5433}"

if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  mapped="$(docker port "$CONTAINER_NAME" 5432/tcp 2>/dev/null | head -1 | cut -d: -f2)"
  if [ -n "$mapped" ] && [ "$mapped" != "$PORT" ]; then
    echo "⚠ Conteneur actif sur le port $mapped (attendu $PORT) — recreation…"
    docker rm -f "$CONTAINER_NAME" >/dev/null
  else
    echo "✅ PostgreSQL déjà en cours ($CONTAINER_NAME) → localhost:${mapped:-$PORT}"
    exit 0
  fi
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "▶ Suppression de l'ancien conteneur (ports)…"
  docker rm -f "$CONTAINER_NAME" >/dev/null || true
fi

echo "▶ Création du conteneur PostgreSQL sur le port ${PORT}…"
if ! docker run -d \
  --name "$CONTAINER_NAME" \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_DB=portfolio \
  -p "${PORT}:5432" \
  -v portfolio_pg_data:/var/lib/postgresql/data \
  "$IMAGE"; then
  echo "❌ Impossible de démarrer le conteneur (port ${PORT} peut-être occupé)."
  exit 1
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
