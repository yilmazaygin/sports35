# Sports35 production deployment preparation

The step-by-step Ubuntu Server install, including Nginx Proxy Manager, is in the root `README.md` (`Canlıya alma` section). Follow that. This file is the older standalone-TLS checklist. It still says the panel lives at `/admin` and mentions removed public URLs such as `/hizmetler`. Production routing uses `PUBLIC_DOMAIN` and `ADMIN_DOMAIN`, and the Proxy Manager path is `docker-compose.production.yml` plus `docker-compose.proxy.yml`.

This repository contains a separate production path. The existing `docker-compose.yml` and local `.env` remain development-only.

## Required inputs before deployment

1. A VPS with Docker Engine/Compose, a firewall allowing only SSH and HTTP/HTTPS, and enough disk for database, uploads, logs, and backups.
2. A DNS record for the public domain pointing to the VPS. The current production template uses the existing `/admin` path; an admin subdomain is optional and not required.
3. A copied `.env.production` containing unique secrets. Start from `.env.production.example`; never commit the copied file.
4. A real `APP_KEY` generated with `php artisan key:generate --show` before the first deployment and stored in the secret manager or protected server file.
5. A unique `SPORTS35_ADMIN_EMAIL` and `SPORTS35_ADMIN_PASSWORD`. Production seeding refuses to create the development account when these are missing. Later accounts, password changes, and deletions use `admin:create`, `admin:password`, and `admin:delete` inside the app container.
6. SMTP credentials and a verified sender address.
7. A certificate strategy such as Let's Encrypt, with certificates available under `/etc/letsencrypt` before enabling the HTTPS Nginx service.

## Production deployment sequence

```bash
cp .env.production.example .env.production
# Edit .env.production using a protected editor; do not commit it.

docker compose --env-file .env.production -f docker-compose.production.yml build --pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d postgres redis
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan migrate --force
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan db:seed --force
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan storage:link
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan config:cache
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan route:cache
docker compose --env-file .env.production -f docker-compose.production.yml run --rm app php artisan view:cache
docker compose --env-file .env.production -f docker-compose.production.yml up -d
docker compose --env-file .env.production -f docker-compose.production.yml restart worker
```

The production image installs PHP dependencies with `--no-dev --optimize-autoloader`, builds the frontend during the image build, and enables OPcache with timestamp validation disabled. The application and worker use the same immutable image; uploaded storage and database data are named volumes.

## Network and security model

Only Nginx publishes ports 80 and 443. PostgreSQL, Redis, PHP-FPM, the Inertia render service, and the queue worker remain on the private Compose network. Do not add host port mappings for PostgreSQL, Redis, or the render service. The render service serves the initial HTML, including headings and image text, before the browser runs JavaScript. PHP reaches it at `http://ssr:13714`.

Nginx redirects HTTP to HTTPS and provides TLS 1.2/1.3, HSTS on HTTPS responses, CSP, frame protection, MIME sniffing protection, a referrer policy, a permissions policy, upload limits, immutable static-asset caching, and `no-store` behavior for admin responses. Replace every `example.com` placeholder and certificate path in `docker/nginx/production.conf` before deployment. HSTS must not be enabled at a domain until HTTPS is confirmed working.

The CSP permits the current self-hosted build, Bunny Fonts, and Google Maps frames used by the existing contact content. If the approved map provider changes, update CSP deliberately and retest. Do not add `unsafe-eval` without a concrete compatibility reason.

If a reverse proxy or CDN is added in front of Nginx, configure Laravel's trusted-proxy behavior for the known proxy addresses and verify HTTPS URL generation. Do not trust arbitrary forwarded headers.

## Mail verification

Use `MAIL_MAILER=smtp`, the provider hostname/port/security mode, a dedicated SMTP username/password, `MAIL_EHLO_DOMAIN`, and a verified `MAIL_FROM_ADDRESS`. Keep `MAIL_PASSWORD` outside source control. Send a controlled test message, then inspect Laravel and worker logs for failures. Do not use the local `log` mailer in production.

## Backups and restore

Run `scripts/backup-production.sh` from a host with access to the Compose project. It creates a PostgreSQL custom-format dump, an uploaded-storage archive, a manifest, and SHA-256 checksums. Set `BACKUP_DIR` to a local staging directory and copy completed backups to an off-server destination such as encrypted object storage. Keep at least daily backups for 14 days, plus a longer monthly retention according to the business decision.

At least once before launch and regularly afterward, restore into an isolated stack using `scripts/restore-production.sh db-<timestamp>.dump storage-<timestamp>.tar.gz`, then verify the homepage, admin login, uploaded media, and a database query. A backup is not considered valid until a restore has succeeded. On Linux, grant the scripts execute permission with `chmod +x scripts/*.sh`.

## Monitoring and operations

- Run `scripts/production-healthcheck.sh` from a scheduled host check for `/up`, HTTPS headers, container state, failed jobs, and disk usage.
- Configure Docker/container logs with host rotation; do not allow unbounded JSON logs.
- Alert on failed queue jobs, database/Redis health, backup age, disk usage, and certificate expiry.
- Keep Laravel `LOG_LEVEL=warning` initially and raise it temporarily while diagnosing an incident.
- Review `storage/logs/laravel.log`, Nginx error logs, and worker output without exposing them publicly.

## Pre-deployment checklist

- [ ] DNS record and firewall rules are ready; only SSH/HTTP/HTTPS are exposed.
- [ ] `.env.production` is protected, not committed, and contains no development values.
- [ ] `APP_KEY`, database, Redis, SMTP, and admin account secrets are unique and stored safely.
- [ ] `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, and production domains are correct.
- [ ] Real Sports35 contact, address, pricing, and hours are approved.
- [ ] SMTP sender/domain is verified and a test mailbox is available.
- [ ] Certificate issuance/renewal is ready before HTTPS is enabled.
- [ ] Backup destination, retention, checksums, and restore operator are assigned.
- [ ] A production build, migration review, and dependency audits have passed.

## Post-deployment checklist

- [ ] Homepage, `/hizmetler`, contact, calculators, and HTTPS redirect work.
- [ ] Admin login works. Account creation, password changes, and deletion are done with the server commands, and the panel has no account-management screen.
- [ ] Media upload, storage URLs, and blog sanitization work.
- [ ] Response headers, cache behavior, TLS, and lack of debug leakage are verified.
- [ ] Queue jobs process and failed-job monitoring is active.
- [ ] A backup completes, checksums verify, and a restore test has been recorded.
- [ ] No development credentials, local domains, debug pages, or public database/Redis ports remain.

## Inputs still required from Sports35

The domain names, VPS provider/region, SMTP provider and sender, approved privacy/consent text, real business contact information, retention policy, backup destination, and named production admin must be supplied before the real deployment.
