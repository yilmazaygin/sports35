#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${BACKUP_DIR:-$ROOT_DIR/storage/app/backups}"
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"

mkdir -p "$OUTPUT_DIR"

echo "==> Database backup"
docker compose -f "$ROOT_DIR/docker-compose.yml" exec -T postgres \
    pg_dump -U "${DB_USERNAME:-sports35}" "${DB_DATABASE:-sports35}" \
    > "$OUTPUT_DIR/db-$TIMESTAMP.sql"

echo "==> Storage backup"
tar -czf "$OUTPUT_DIR/storage-$TIMESTAMP.tar.gz" \
    -C "$ROOT_DIR/storage/app/public" .

echo "Backups saved to $OUTPUT_DIR"
