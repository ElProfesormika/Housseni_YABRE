#!/usr/bin/env bash
set -e
docker stop portfolio-postgres 2>/dev/null || true
echo "PostgreSQL arrêté (conteneur portfolio-postgres)"
