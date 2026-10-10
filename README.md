# Sports35 — Spor Salonu Web Uygulaması

Modern, performanslı spor salonu web sitesi ve yönetim paneli.

## Teknoloji

- **Backend:** Laravel 13 + Inertia.js
- **Frontend:** React 18 + Tailwind CSS
- **Veritabanı:** PostgreSQL 16
- **Cache/Session/Queue:** Redis 7
- **Sunucu:** Nginx + PHP 8.4-FPM (Docker)

## Hızlı Başlangıç

### Gereksinimler

- Docker & Docker Compose
- Node.js 20+ (frontend build için)

### Kurulum

```bash
# 1. Ortam dosyası
cp .env.example .env

# 2. Docker servislerini başlat
docker compose build
docker compose up -d

# 3. Uygulama anahtarı ve veritabanı
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan storage:link

# 4. Frontend build
npm install
npm run build
```

### Erişim

| Ortam | URL |
|-------|-----|
| Ziyaretçi sitesi (local) | http://localhost:3001 |
| Yönetim paneli (local) | http://localhost:3001/admin/login |
| Ziyaretçi (subdomain) | http://sports35.test:3001 |
| Admin (subdomain) | http://admin.sports35.test:3001 |

Subdomain testi için `/etc/hosts` dosyasına ekleyin:

```
127.0.0.1 sports35.test admin.sports35.test
```

### Yerel Admin Hesabı

Geliştirme ve test ortamlarında yerel çalışma kolaylığı için seed işlemi bir geliştirme admin hesabı oluşturabilir. Bu hesap ve bilgileri production ortamında kullanılmamalıdır ve bu belgede paylaşılmamaktadır.

Production seed işlemi, bilinen bir varsayılan hesap oluşturmaz. Production için `SPORTS35_OWNER_EMAIL` ve `SPORTS35_OWNER_PASSWORD` değerleri source control dışında, güvenli ortam değişkenleri olarak sağlanmalıdır; bu değerler eksikse seed işlemi durur.

## Geliştirme

```bash
# Frontend hot-reload
npm run dev

# Loglar
docker compose logs -f app
```

## Mimari

```
domainim.com          → Ziyaretçi arayüzü (TR/EN)
admin.domainim.com    → Yönetim paneli
```

Local geliştirmede subdomain yerine path tabanlı routing kullanılır:
- `/` → Public site
- `/admin/*` → Admin panel

## Proje Yapısı

```
app/Http/Controllers/
  Public/          # Ziyaretçi site controller'ları
  Admin/           # Yönetim paneli controller'ları
resources/js/
  Pages/Public/    # Ziyaretçi sayfaları
  Pages/Admin/     # Admin sayfaları
  Components/Public/
  Layouts/
lang/tr/           # Türkçe çeviriler
lang/en/           # İngilizce çeviriler
docker/            # Docker yapılandırmaları
```

## Yedekleme

```bash
# Docker ortamında (önerilen)
chmod +x scripts/backup.sh
./scripts/backup.sh

# Artisan komutu (app container içinde)
docker compose exec app php artisan app:backup

# Manuel
docker compose exec postgres pg_dump -U sports35 sports35 > backup.sql
tar -czf storage-backup.tar.gz -C storage/app/public .
```

Yedekler varsayılan olarak `storage/app/backups/` dizinine kaydedilir.

## Canlıya Alma (Production)

### Ortam Değişkenleri

`.env` dosyasında production değerlerini ayarlayın:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domainim.com
```

### SSL ve Nginx

1. `docker/nginx/production.conf` şablonunu sunucunuza kopyalayın
2. `domainim.com` ve `admin.domainim.com` alan adlarını güncelleyin
3. Let's Encrypt ile sertifika alın:

```bash
certbot certonly --nginx -d domainim.com -d www.domainim.com
certbot certonly --nginx -d admin.domainim.com
```

4. Nginx yapılandırmasını yeniden yükleyin

### Deploy Adımları

```bash
docker compose -f docker-compose.yml up -d --build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan storage:link
npm ci && npm run build
```

### SEO

- `/sitemap.xml` — Dinamik site haritası
- `/robots.txt` — Arama motoru yönergeleri
- JSON-LD `HealthClub` şeması tüm public sayfalarda

## Tamamlanan Özellikler

- Admin: Çalışma saatleri, üyelik fiyatları, kampanyalar, özel günler
- Admin: Blog (WYSIWYG), medya kütüphanesi, galeri, değişimler
- Admin: Site ayarları, sosyal medya gönderileri (manuel feed)
- Public: Ana sayfa, hizmetler, galeri, değişimler, blog, iletişim, hesaplayıcılar
- TR/EN çoklu dil desteği
- Görsel optimizasyonu (upload sırasında)
- Yedekleme scripti ve artisan komutu
