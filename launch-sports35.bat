@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
set "SITE_URL=http://localhost:3001"
set "DOCKER_DESKTOP_DIR=%LOCALAPPDATA%\Programs\DockerDesktop"
set "DOCKER_FALLBACK=%DOCKER_DESKTOP_DIR%\resources\bin\docker.exe"
set "DOCKER_DESKTOP_EXE=%DOCKER_DESKTOP_DIR%\Docker Desktop.exe"

echo.
echo Sports35 local launcher
echo ======================

where docker >nul 2>&1
if not errorlevel 1 (
    set "DOCKER_CLI=docker"
) else if exist "%DOCKER_FALLBACK%" (
    set "DOCKER_CLI=%DOCKER_FALLBACK%"
    set "PATH=%DOCKER_DESKTOP_DIR%\resources\bin;!PATH!"
) else (
    goto :docker_missing
)

"%DOCKER_CLI%" info >nul 2>&1
if errorlevel 1 (
    if not exist "%DOCKER_DESKTOP_EXE%" goto :docker_not_running
    echo Starting Docker Desktop...
    start "" "%DOCKER_DESKTOP_EXE%"
    echo Waiting for the Docker engine...
    for /l %%N in (1,1,60) do (
        "%DOCKER_CLI%" info >nul 2>&1
        if not errorlevel 1 goto :docker_ready
        timeout /t 2 /nobreak >nul
    )
    goto :docker_not_running
)

:docker_ready

"%DOCKER_CLI%" compose version >nul 2>&1
if errorlevel 1 goto :compose_missing

if not exist ".env" (
    if not exist ".env.example" goto :env_missing
    echo Creating .env from .env.example...
    copy /y ".env.example" ".env" >nul
)

echo Starting the existing Docker services...
"%DOCKER_CLI%" compose up -d --build
if errorlevel 1 goto :startup_failed

echo Checking Laravel dependencies...
"%DOCKER_CLI%" compose exec -T app sh -lc "test -f vendor/autoload.php"
if errorlevel 1 (
    echo Installing PHP dependencies inside the app container...
    "%DOCKER_CLI%" compose exec -T app composer install --no-interaction --prefer-dist
    if errorlevel 1 goto :setup_failed
)

for /f "tokens=1,* delims==" %%A in ('findstr /b "APP_KEY=" .env') do set "APP_KEY_VALUE=%%B"
if not defined APP_KEY_VALUE (
    echo Generating the Laravel application key...
    "%DOCKER_CLI%" compose exec -T app php artisan key:generate --force
    if errorlevel 1 goto :setup_failed
)

if not exist "public\storage" (
    echo Creating the public storage link...
    "%DOCKER_CLI%" compose exec -T app php artisan storage:link
    if errorlevel 1 goto :setup_failed
)

if not exist "node_modules\.bin\vite.cmd" (
    where npm >nul 2>&1
    if errorlevel 1 goto :node_missing
    echo Installing frontend dependencies...
    call npm install --no-audit --no-fund
    if errorlevel 1 goto :frontend_failed
)

if not exist "public\build\manifest.json" (
    where npm >nul 2>&1
    if errorlevel 1 goto :node_missing
    echo Building frontend assets...
    call npm run build
    if errorlevel 1 goto :frontend_failed
)

echo Checking the database connection and schema...
"%DOCKER_CLI%" compose exec -T app php artisan migrate --force
if errorlevel 1 goto :setup_failed

"%DOCKER_CLI%" compose exec -T app php artisan tinker --execute="exit(\App\Models\User::where('email', 'admin@sports35.test')->exists() ? 0 : 1);" >nul 2>&1
if errorlevel 1 (
    echo Seeding the initial application data...
    "%DOCKER_CLI%" compose exec -T app php artisan db:seed --force
    if errorlevel 1 goto :setup_failed
)

echo Waiting for %SITE_URL% ...
set "READY="
for /l %%N in (1,1,60) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%SITE_URL%' -TimeoutSec 3; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } } catch {} ; exit 1" >nul 2>&1
    if not errorlevel 1 (
        set "READY=1"
        goto :ready
    )
    timeout /t 2 /nobreak >nul
)

if not defined READY goto :not_reachable

:ready
echo.
echo Sports35 is ready: %SITE_URL%
if /i "%~1"=="--no-browser" exit /b 0
start "" "%SITE_URL%"
exit /b 0

:docker_missing
echo ERROR: Docker was not found on PATH. Install Docker Desktop and try again.
goto :failure

:docker_not_running
echo ERROR: Docker Desktop is not running. Start it and try again.
goto :failure

:compose_missing
echo ERROR: Docker Compose is unavailable. Update or repair Docker Desktop.
goto :failure

:env_missing
echo ERROR: .env.example is missing; cannot initialize Laravel safely.
goto :failure

:node_missing
echo ERROR: Node.js/npm is required to build the existing Vite frontend.
echo Install Node.js 20 or newer and run this launcher again.
goto :failure

:startup_failed
echo ERROR: Docker Compose could not start the existing services.
goto :failure

:setup_failed
echo ERROR: Laravel first-run setup failed. Review the command output above.
goto :failure

:frontend_failed
echo ERROR: The Vite frontend build failed. Review the command output above.
goto :failure

:not_reachable
echo ERROR: The containers started, but %SITE_URL% did not become reachable.
echo Run "docker compose logs --tail=100 app nginx" for details.
goto :failure

:failure
echo.
pause
exit /b 1
