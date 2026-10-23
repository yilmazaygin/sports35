# Sports35 — Spor Salonu Web Uygulaması

Modern, performanslı spor salonu web sitesi ve yönetim paneli.

Yerel kurulum aşağıdaki «Hızlı Başlangıç» bölümündedir. Sıfır bir Ubuntu sunucusunda Nginx Proxy Manager ile canlıya alma, dosyanın sonundaki «Canlıya alma» bölümündedir. Canlıda `docker-compose.yml` kullanılmaz.

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

Production seed işlemi, bilinen bir varsayılan hesap oluşturmaz. İlk production hesabı için `SPORTS35_ADMIN_EMAIL` ve `SPORTS35_ADMIN_PASSWORD` değerleri source control dışında, güvenli ortam değişkenleri olarak sağlanmalıdır; bu değerler eksikse seed işlemi durur. İsteğe bağlı görünen ad `SPORTS35_ADMIN_NAME` ile verilir.

### Yönetici hesapları

Panele giren her hesap aynı yetkiye sahiptir. Rol yoktur ve panelden yeni hesap açılamaz. Hesap açma, şifre değiştirme ve silme uygulama kabında yapılır.

```bash
docker compose exec app php artisan admin:create "Ad Soyad" yonetici@ornek.com --password='en-az-8-karakter'
docker compose exec app php artisan admin:password yonetici@ornek.com --password='yeni-sifre'
docker compose exec app php artisan admin:delete yonetici@ornek.com
```

Şifreyi komut satırına yazmadan sormak için `--password` verilmez. Bu çalıştırma bir terminal ister:

```bash
docker compose exec -it app php artisan admin:create "Ad Soyad" yonetici@ornek.com
docker compose exec -it app php artisan admin:password yonetici@ornek.com
```

`admin:delete` silmeden önce onay ister. Onayı atlamak için komuta `--force` eklenir. Son aktif hesap silinemez; önce yeni bir hesap açılır, sonra eskisi silinir.

Production kabında aynı komutlar şu önekle çalışır:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec app php artisan admin:password yonetici@ornek.com --password='yeni-sifre'
```

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

## Canlıya alma

Bu bölüm, yeni kurulmuş bir Ubuntu Server üzerinde siteyi Docker ile ayağa kaldırır. TLS sertifikasını ve 80/443 portlarını Nginx Proxy Manager tutar. Sports35 kendi Nginx’ini yalnızca Docker ağına açar; internete Postgres, Redis, PHP-FPM veya SSR portu vermez.

Aşağıdaki adresleri kendi alan adınızla değiştirin:

| Ne | Örnek | Sizde |
|---|---|---|
| Ziyaretçi sitesi | `alanadiniz.com` | A kaydı sunucu IP’sine |
| Yönetim | `admin.alanadiniz.com` | A kaydı aynı IP’ye |
| www | `www.alanadiniz.com` | A kaydı aynı IP’ye, sonra ana domaine yönlenir |

Üretimde panel `/admin` yolu değildir. `APP_ENV=production` iken ziyaretçi rotaları `PUBLIC_DOMAIN`, panel rotaları `ADMIN_DOMAIN` host’una bağlıdır. İkisi de aynı konteynere gider; Nginx Proxy Manager host adına göre ayırır.

Sunucu GitHub’daki commit’i çeker. `docker-compose.proxy.yml`, `docker/nginx/behind-proxy.conf` ve bu bölüm makinede durup uzak dalda yoksa, önce bu değişiklikleri dalınıza commit edip push edin.

### 1. Sunucuyu hazırlayın

Root veya `sudo` yetkili bir kullanıcıyla bağlanın. Saat dilimini ve temel paketleri kurun:

```bash
sudo apt update
sudo apt upgrade -y
sudo timedatectl set-timezone Europe/Istanbul
sudo apt install -y ca-certificates curl git ufw
```

İmaj derlemesi (Node ve Composer) 1 GB RAM’li bir makinede bellek yüzünden düşebilir. 2 GB takas ekleyin:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Güvenlik duvarında yalnızca SSH, HTTP ve HTTPS açık kalsın. Panel arayüzü (81) bir sonraki adımda yalnızca bu makinenin localhost’una bağlanır; 81’i UFW ile dünyaya açmayın. Docker, yayınladığı portlarda UFW’yi deler. Bu yüzden Sports35 port yayınlamaz, Proxy Manager 81’i `127.0.0.1` üzerinde tutar.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### 2. Docker Engine kurun

Resmi Docker deposunu ekleyin. `VERSION_CODENAME` Ubuntu 24.04’te `noble`, 26.04’te o sürümün kod adıdır.

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

`apt update` depo satırında `no Release file` derse depo o Ubuntu kod adını henüz taşımıyordur. O zaman depo satırını silip Docker’ın kurulum betiğini kullanın:

```bash
sudo rm -f /etc/apt/sources.list.d/docker.list
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
```

Grubun uygulanması için oturumu kapatıp yeniden SSH ile girin. Sonra sürümü kontrol edin. Compose 2.24 veya daha yenisi gerekir; güncel Docker paketinde bu vardır.

```bash
docker version
docker compose version
```

### 3. Ortak Docker ağını oluşturun

Proxy Manager ile Sports35 ayrı Compose projeleridir. İkisi de `webproxy` adlı ağa girer. Ağ bir kez oluşturulur:

```bash
docker network create webproxy
```

### 4. Nginx Proxy Manager’ı kurun

```bash
sudo mkdir -p /opt/nginx-proxy-manager
sudo chown "$USER":"$USER" /opt/nginx-proxy-manager
cd /opt/nginx-proxy-manager
```

Bu dizine `docker-compose.yml` yazın:

```yaml
services:
  app:
    image: jc21/nginx-proxy-manager:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "127.0.0.1:81:81"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - webproxy

networks:
  webproxy:
    name: webproxy
    external: true
```

Başlatın:

```bash
docker compose up -d
docker compose ps
```

`app` konteyneri `Up` olmalı. Yönetim arayüzü sunucuda `127.0.0.1:81` dinler. Kendi bilgisayarınızdan SSH tüneli açın (bu komut sunucuda değil, sizin makinenizde çalışır):

```bash
ssh -L 8181:127.0.0.1:81 KULLANICI@SUNUCU_IP
```

Tarayıcıda `http://127.0.0.1:8181` adresini açın. İlk giriş:

- E-posta: `admin@example.com`
- Şifre: `changeme`

Girer girmez kullanıcıyı ve şifreyi değiştirin. Bu varsayılan hesap internete açık bırakılmaz; 81 portu localhost’ta olsa bile tüneli açık unutmayın.

Proxy host kayıtlarını site ayağa kalktıktan sonra, 8. adımda ekleyin. Sertifika isteği için 80 portunun internetten bu sunucuya ulaşması ve DNS A kayıtlarının yayılmış olması gerekir.

### 5. Kodu çekin

Depo özel ise önce bir deploy key veya kişisel erişim token’ı tanımlayın. Herkese açık klon:

```bash
sudo mkdir -p /opt/sports35
sudo chown "$USER":"$USER" /opt/sports35
git clone https://github.com/yilmazaygin/sports35.git /opt/sports35
cd /opt/sports35
git checkout CANLIYA_ALACAGINIZ_DAL
chmod +x scripts/prod scripts/*.sh
```

`./scripts/prod` üretim Compose dosyalarının ikisini birden çağırır. Bundan sonraki Sports35 komutları `/opt/sports35` içinden çalışır.

### 6. Ortam dosyasını yazın

```bash
cd /opt/sports35
cp .env.production.example .env.production
chmod 600 .env.production
```

Bir düzenleyiciyle `.env.production` dosyasını doldurun. Yer tutucuları olduğu gibi bırakmayın.

```bash
openssl rand -base64 32
```

Bu komutu üç kez çalıştırın. Çıktıları sırasıyla `DB_PASSWORD`, `REDIS_PASSWORD` ve `SPORTS35_ADMIN_PASSWORD` yapın. Değer tırnak, boşluk veya `#` içerirse değeri çift tırnak içine alın.

Şunları kendi alan adınıza çevirin:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://alanadiniz.com
PUBLIC_DOMAIN=alanadiniz.com
ADMIN_DOMAIN=admin.alanadiniz.com
TRUSTED_PROXIES=*
SESSION_SECURE_COOKIE=true
SPORTS35_ADMIN_EMAIL=sizin@alanadiniz.com
MAIL_FROM_ADDRESS=no-reply@alanadiniz.com
```

`APP_URL` şema ile yazılır. `PUBLIC_DOMAIN` ve `ADMIN_DOMAIN` yazılmaz; `https://` ve yol olmaz, başında `www` olmaz.

`APP_KEY` henüz geçerli değil. İmajı derleyip anahtarı üretin, çıktıyı dosyaya yapıştırın:

```bash
cd /opt/sports35
./scripts/prod build --pull
./scripts/prod run --rm --no-deps app php artisan key:generate --show
```

Çıktı `base64:...` biçimindedir. `.env.production` içinde `APP_KEY=` satırının tamamını bu değerle değiştirin.

Ziyaretçi sitesi e-posta göndermez ve panelde “şifremi unuttum” yoktur. SMTP boş veya örnek host olarak kalsa sayfalar açılır. Yine de `MAIL_*` satırlarını gerçek bir kutuya çevirin; dosyada `smtp.example.com` bırakmak sonraki bir posta işinde sessizce başarısız olur. Şifre unutulursa sunucuda `admin:password` çalıştırılır.

### 7. Veritabanını kurun ve uygulamayı başlatın

DNS bu adım için şart değildir. Sertifika bir sonraki adımdadır.

```bash
cd /opt/sports35
./scripts/prod up -d postgres redis
./scripts/prod ps
```

Postgres ve Redis `healthy` olana kadar bekleyin. Sonra şemayı, ilk içeriği ve önbelleği kurun. `db:seed` boş tablolara demo fiyat ve çalışma saati yazar. Dolu kayıtların üstüne yazmaz. Yine de ilk girişten sonra fiyatın sizin tarifeniz olduğunu kontrol edin.

```bash
cd /opt/sports35
./scripts/prod run --rm app php artisan migrate --force
./scripts/prod run --rm app php artisan db:seed --force
./scripts/prod run --rm app php artisan storage:link
./scripts/prod run --rm app php artisan config:cache
./scripts/prod run --rm app php artisan route:cache
./scripts/prod run --rm app php artisan view:cache
./scripts/prod up -d
./scripts/prod restart worker
./scripts/prod ps
```

`app`, `nginx`, `postgres`, `redis`, `ssr` ve `worker` çalışıyor olmalı. `sports35_nginx` konteyneri host’ta 80 veya 443 dinlemez. Proxy Manager ona `webproxy` ağı üzerinden `sports35_nginx:80` ile ulaşır.

İlk kod volume’u imajdan kopyalanır. Sonraki `build` bu volume’u kendiliğinden güncellemez. Güncelleme adımı aşağıdadır. `sports35_sports35_storage`, `sports35_postgres_data` ve `sports35_redis_data` volume’larını silmeyin; yüklemeler ve veritabanı bunlardadır.

### 8. Proxy host ve sertifika

DNS A kayıtları sunucu IP’sini gösteriyor olsun. Kontrol:

```bash
dig +short alanadiniz.com
dig +short admin.alanadiniz.com
dig +short www.alanadiniz.com
```

Tünel hâlâ açıksa `http://127.0.0.1:8181` panelindesiniz. Değilse 4. adımdaki `ssh -L` komutunu yeniden çalıştırın.

Ziyaretçi sitesi için Hosts → Proxy Hosts → Add Proxy Host:

| Alan | Değer |
|---|---|
| Domain Names | `alanadiniz.com` |
| Scheme | `http` |
| Forward Hostname / IP | `sports35_nginx` |
| Forward Port | `80` |
| Cache Assets | kapalı |
| Block Common Exploits | açık |
| Websockets Support | kapalı |

SSL sekmesi:

- SSL Certificate: Request a new SSL Certificate
- Force SSL: açık
- HTTP/2 Support: açık
- E-posta: Let’s Encrypt’in yazacağı gerçek adres
- I Agree: işaretli

Advanced sekmesine şunu yazın. Galeri yüklemesi Proxy Manager’ın varsayılan gövde limitine takılmasın:

```nginx
client_max_body_size 40m;
```

Kaydedin. Sertifika hatası alırsanız 80 portu dışarıdan kapalıdır veya DNS henüz bu sunucuyu göstermiyordur. Sertifika gelmeden siteyi duyurmayın.

Aynı formu `admin.alanadiniz.com` için ikinci bir proxy host olarak tekrarlayın. Forward hostname yine `sports35_nginx`, port yine `80`, ayrı sertifika, Advanced’e yine `client_max_body_size 40m;`.

`www` için Hosts → Redirection Hosts → Add Redirection Host:

| Alan | Değer |
|---|---|
| Domain Names | `www.alanadiniz.com` |
| Scheme | `https` |
| Forward Domain | `alanadiniz.com` |
| HTTP Code | `301` |
| SSL | yeni sertifika, Force SSL açık |

`www` adresini ziyaretçi proxy host’una eklemeyin. Laravel `PUBLIC_DOMAIN` ile birebir host eşler; `www.alanadiniz.com` uygulama host’u olursa sayfa 404 döner.

Tarayıcıda şunları açın:

- `https://alanadiniz.com` ana sayfa
- `https://alanadiniz.com/up` sağlık ucu, gövde uygulamadan gelir
- `https://admin.alanadiniz.com/login` panel girişi

Panelde `SPORTS35_ADMIN_EMAIL` ve buna yazdığınız şifre ile girin. Girişten sonra Site Ayarları’ndan e-posta ve sosyal hesapları kaydedin. İlk seed e-posta ve sosyal link yazmaz. Fiyat ve çalışma saati boşsa demo tarife gelir; kendi tarifenizi girin.

### 9. Yedek

Yedek, depo dizinindeki `storage/app/backups/` altına düşer. Bu, konteyner volume’unun kendisi değildir. Dosyayı ayrıca sunucu dışına kopyalayın.

```bash
cd /opt/sports35
./scripts/backup-production.sh
```

Geri yükleme, yedeğin ürettiği dosya adlarıyla yapılır. Komut çalışmadan onay ister:

```bash
cd /opt/sports35
./scripts/restore-production.sh storage/app/backups/db-ZAMAN.dump storage/app/backups/storage-ZAMAN.tar.gz
```

Günlük yedek için crontab:

```bash
crontab -e
```

```cron
15 3 * * * cd /opt/sports35 && ./scripts/backup-production.sh >> /var/log/sports35-backup.log 2>&1
```

Sağlık kontrolü HSTS başlığı arar. Force SSL açıkken:

```bash
cd /opt/sports35
APP_URL=https://alanadiniz.com ./scripts/production-healthcheck.sh
```

### 10. Güncelleme

Kod değişince volume’u bilinçli yenileyin. Veritabanı ve yükleme volume’larına dokunmayın.

```bash
cd /opt/sports35
git pull
./scripts/prod build --pull
./scripts/prod stop app nginx ssr worker
./scripts/prod rm -f app nginx ssr worker
docker volume rm sports35_sports35_code
./scripts/prod up -d
./scripts/prod run --rm app php artisan migrate --force
./scripts/prod run --rm app php artisan storage:link
./scripts/prod run --rm app php artisan config:cache
./scripts/prod run --rm app php artisan route:cache
./scripts/prod run --rm app php artisan view:cache
./scripts/prod restart app worker
```

`.env.production` değiştiyse `config:cache` ve `restart` yine gerekir. `db:seed` güncellemenin parçası değildir.

Yeni yönetici, şifre ve silme:

```bash
cd /opt/sports35
./scripts/prod exec app php artisan admin:create "Ad Soyad" yonetici@alanadiniz.com --password='en-az-8-karakter'
./scripts/prod exec app php artisan admin:password yonetici@alanadiniz.com --password='yeni-sifre'
./scripts/prod exec app php artisan admin:delete yonetici@alanadiniz.com
```

Şifreyi komut satırına yazmamak için `--password` vermeyin. `exec -it` bir terminal ister. Son aktif hesap silinemez.

### SEO

- `/sitemap.xml` — Ana sayfa, galeri, yayınlanmış blog yazıları ve salon görselleri
- `/robots.txt` — Herkese açık sayfalar açık; yönetim ve hesap yolları kapalı
- `/llms.txt` — Kısa işletme kartı
- `/llms-full.txt` — Adres, saat, üyelik fiyatı ve salon ayrıntısı
- JSON-LD `ExerciseGym` / `HealthClub` şeması

### Ne yayınlanır, ne yayınlanmaz

Ziyaretçi formu, online ödeme ve herkese açık kayıt yoktur. Panel hesapları yalnızca sunucudaki artisan komutlarıyla açılır.

İlk seed boş fiyat tablosuna demo tarife yazar. Canlıya çıkmadan panelden kendi fiyatınızı, e-postanızı ve sosyal hesaplarınızı kaydedin. `.test` ile biten e-posta sitede gösterilmez.

## Tamamlanan özellikler

- Yönetim: çalışma saatleri, üyelik fiyatları, kampanyalar, özel günler, blog, medya, galeri, site ayarları
- Ziyaretçi: ana sayfa, galeri, blog, çerez sayfası, sayfa içi hesaplayıcı
- TR/EN dil desteği
- Yüklenen görsellerde yeniden kodlama
- Üretim yedeği: `scripts/backup-production.sh`
