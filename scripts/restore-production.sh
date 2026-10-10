#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SPORTS35_ENV_FILE:-$ROOT_DIR/.env.production}"
COMPOSE_FILE="$ROOT_DIR/docker-compose.production.yml"
DB_BACKUP="${1:-}"
STORAGE_BACKUP="${2:-}"

[[ -f "$ENV_FILE" ]] || { echo "Missing production environment file: $ENV_FILE" >&2; exit 1; }
[[ -f "$DB_BACKUP" ]] || { echo "Usage: restore-production.sh DB_BACKUP.sql.gz STORAGE_BACKUP.tar.gz" >&2; exit 1; }
[[ -f "$STORAGE_BACKUP" ]] || { echo "Usage: restore-production.sh DB_BACKUP.sql.gz STORAGE_BACKUP.tar.gz" >&2; exit 1; }

compose() {
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

echo "This replaces the selected production database and uploaded storage."
echo "Confirm the current system has been backed up before continuing."
read -r -p "Type RESTORE to continue: " confirmation
[[ "$confirmation" == "RESTORE" ]] || { echo "Restore cancelled."; exit 1; }

cat "$DB_BACKUP" | compose exec -T postgres sh -c 'pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
compose exec -T app tar -xzf - -C /var/www/html/storage/app/public < "$STORAGE_BACKUP"
compose exec -T app php artisan storage:link
compose exec -T app php artisan optimize:clear

echo "Restore completed. Re-run the post-deployment checklist and verify the application manually."
