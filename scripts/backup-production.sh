#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SPORTS35_ENV_FILE:-$ROOT_DIR/.env.production}"
COMPOSE_FILE="$ROOT_DIR/docker-compose.production.yml"
OUTPUT_DIR="${BACKUP_DIR:-$ROOT_DIR/storage/app/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"

[[ -f "$ENV_FILE" ]] || { echo "Missing production environment file: $ENV_FILE" >&2; exit 1; }
mkdir -p "$OUTPUT_DIR"

compose() {
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

echo "==> Checking production services"
compose ps --status running

echo "==> PostgreSQL dump"
compose exec -T postgres sh -c 'pg_dump -Fc -U "$POSTGRES_USER" "$POSTGRES_DB"' \
    > "$OUTPUT_DIR/db-$TIMESTAMP.dump"

echo "==> Uploaded storage archive"
compose exec -T app tar -czf - -C /var/www/html/storage/app/public . \
    > "$OUTPUT_DIR/storage-$TIMESTAMP.tar.gz"

echo "==> Backup manifest"
{
    echo "created_at=$TIMESTAMP"
    echo "git_revision=$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo unavailable)"
    compose ps --format json
} > "$OUTPUT_DIR/manifest-$TIMESTAMP.txt"

sha256sum "$OUTPUT_DIR"/*"$TIMESTAMP"* > "$OUTPUT_DIR/SHA256SUMS-$TIMESTAMP.txt"
find "$OUTPUT_DIR" -type f -mtime "+$RETENTION_DAYS" -delete

echo "Backup completed: $OUTPUT_DIR"
