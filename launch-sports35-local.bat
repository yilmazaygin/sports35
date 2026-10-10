@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
set "SITE_URL=http://localhost:3001"
set "VITE_URL=http://127.0.0.1:5173"
set "PHP_FALLBACK=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
set "COMPOSER_FALLBACK=%LOCALAPPDATA%\Programs\Composer\composer.bat"
set "COMPOSER_PHAR_FALLBACK=%LOCALAPPDATA%\Programs\Composer\composer.phar"
set "PG_BIN=C:\Program Files\PostgreSQL\17\bin"
set "PG_DATA=%LOCALAPPDATA%\Sports35\PostgreSQL17\data"
set "PG_LOG=%LOCALAPPDATA%\Sports35\PostgreSQL17\postgresql.log"
set "LOCAL_PG_ADMIN_PASSWORD=Sports35LocalAdmin2026"
set "LOCAL_DB_PASSWORD=Sports35Local2026"

echo.
echo Sports35 native local launcher
echo =============================

where php >nul 2>&1
if not errorlevel 1 (
    set "PHP_CLI=php"
) else if exist "%PHP_FALLBACK%" (
    set "PHP_CLI=%PHP_FALLBACK%"
) else (
    goto :php_missing
)

where composer >nul 2>&1
if not errorlevel 1 (
    set "COMPOSER_MODE=command"
) else if exist "%COMPOSER_FALLBACK%" (
    set "COMPOSER_MODE=bat"
) else if exist "%COMPOSER_PHAR_FALLBACK%" (
    set "COMPOSER_MODE=phar"
) else (
    goto :composer_missing
)

where node >nul 2>&1
if errorlevel 1 goto :node_missing
where npm >nul 2>&1
if errorlevel 1 goto :node_missing

if not exist "%PG_BIN%\pg_isready.exe" goto :postgres_missing
if not exist "%PG_BIN%\pg_ctl.exe" goto :postgres_missing
if not exist "%PG_BIN%\psql.exe" goto :postgres_missing

rem These overrides live only in this launcher process and its children.
set "APP_URL=%SITE_URL%"
set "DB_CONNECTION=pgsql"
set "DB_HOST=127.0.0.1"
set "DB_PORT=5433"
set "DB_DATABASE=sports35_local"
set "DB_USERNAME=sports35_local"
set "DB_PASSWORD=%LOCAL_DB_PASSWORD%"
set "SESSION_DRIVER=file"
set "CACHE_STORE=file"
set "QUEUE_CONNECTION=sync"

"%PG_BIN%\pg_isready.exe" -h 127.0.0.1 -p 5433 -U postgres >nul 2>&1
if errorlevel 1 (
    if not exist "%PG_DATA%\PG_VERSION" goto :postgres_data_missing
    echo Starting the native PostgreSQL 17 instance on port 5433...
    "%PG_BIN%\pg_ctl.exe" -D "%PG_DATA%" -l "%PG_LOG%" start -w
    if errorlevel 1 goto :postgres_start_failed
)

"%PG_BIN%\pg_isready.exe" -h 127.0.0.1 -p 5433 -U postgres >nul 2>&1
if errorlevel 1 goto :postgres_not_ready

if not exist "vendor\autoload.php" (
    echo Installing PHP dependencies...
    if /i "%COMPOSER_MODE%"=="command" call composer install --no-interaction --prefer-dist
    if /i "%COMPOSER_MODE%"=="bat" call "%COMPOSER_FALLBACK%" install --no-interaction --prefer-dist
    if /i "%COMPOSER_MODE%"=="phar" "%PHP_CLI%" "%COMPOSER_PHAR_FALLBACK%" install --no-interaction --prefer-dist
    if errorlevel 1 goto :composer_failed
)

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install --no-audit --no-fund
    if errorlevel 1 goto :frontend_failed
)

findstr /r /b "APP_KEY=." ".env" >nul 2>&1
if errorlevel 1 (
    echo Generating the Laravel application key...
    "%PHP_CLI%" artisan key:generate --force
    if errorlevel 1 goto :setup_failed
)

if not exist "public\storage" (
    echo Creating the public storage link...
    "%PHP_CLI%" artisan storage:link
    if errorlevel 1 goto :setup_failed
)

echo Checking the local database schema...
"%PHP_CLI%" artisan migrate --force
if errorlevel 1 goto :setup_failed

set "PGPASSWORD=%LOCAL_DB_PASSWORD%"
set "ADMIN_EXISTS="
pushd "%PG_BIN%"
for /f "delims=" %%A in ('psql.exe -h 127.0.0.1 -p 5433 -U sports35_local -d sports35_local -Atqc "SELECT 1 FROM users WHERE email='admin@sports35.test'"') do set "ADMIN_EXISTS=%%A"
popd
set "PGPASSWORD="
if not "!ADMIN_EXISTS!"=="1" (
    echo Seeding the initial local application data...
    "%PHP_CLI%" artisan db:seed --force
    if errorlevel 1 goto :setup_failed
)

netstat -ano | findstr /r /c:":3001 .*LISTENING" >nul 2>&1
if errorlevel 1 (
    echo Starting Laravel on %SITE_URL% ...
    start "Sports35 PHP" /min "%ComSpec%" /k ""%PHP_CLI%" artisan serve --host=127.0.0.1 --port=3001"
)

netstat -ano | findstr /r /c:":5173 .*LISTENING" >nul 2>&1
if errorlevel 1 (
    echo Starting the Vite development server...
    start "Sports35 Vite" /min "%ComSpec%" /k "npm run dev -- --host 127.0.0.1"
)

echo Waiting for %SITE_URL% ...
set "READY="
for /l %%N in (1,1,60) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%SITE_URL%' -TimeoutSec 3; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } } catch {} ; exit 1" >nul 2>&1
    if not errorlevel 1 (
        set "READY=1"
        goto :ready
    )
    timeout /t 1 /nobreak >nul
)

if not defined READY goto :not_reachable

:ready
echo.
echo Sports35 native site is ready: %SITE_URL%
if /i "%~1"=="--no-browser" exit /b 0
start "" "%SITE_URL%"
exit /b 0

:php_missing
echo ERROR: PHP 8.4 was not found. Install or repair the native PHP runtime.
goto :failure

:composer_missing
echo ERROR: Composer was not found. Install or repair the native Composer runtime.
goto :failure

:node_missing
echo ERROR: Node.js/npm is required for the Vite frontend.
goto :failure

:postgres_missing
echo ERROR: PostgreSQL 17 command-line tools were not found at %PG_BIN%.
goto :failure

:postgres_data_missing
echo ERROR: The dedicated native PostgreSQL data directory is missing:
echo %PG_DATA%
goto :failure

:postgres_start_failed
echo ERROR: The native PostgreSQL instance could not be started.
echo Review %PG_LOG% for details.
goto :failure

:postgres_not_ready
echo ERROR: PostgreSQL did not become ready on port 5433.
goto :failure

:composer_failed
echo ERROR: Composer dependency installation failed.
goto :failure

:frontend_failed
echo ERROR: Frontend dependency installation failed.
goto :failure

:setup_failed
echo ERROR: Native Laravel setup failed. Review the command output above.
goto :failure

:not_reachable
echo ERROR: Laravel started, but %SITE_URL% did not become reachable.
goto :failure

:failure
echo.
pause
exit /b 1
