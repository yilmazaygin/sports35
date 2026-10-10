#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SPORTS35_ENV_FILE:-$ROOT_DIR/.env.production}"
COMPOSE_FILE="$ROOT_DIR/docker-compose.production.yml"
APP_URL="${APP_URL:?Set APP_URL or export it before running this check}"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
curl --fail --silent --show-error --location --max-time 15 "$APP_URL/up" > /dev/null
curl --fail --silent --show-error --location --max-time 15 -I "$APP_URL/" | grep -qi 'strict-transport-security'
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T app php artisan queue:failed --no-ansi
df -h

echo "Production health checks passed."
