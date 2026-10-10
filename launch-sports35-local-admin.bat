@echo off
setlocal

cd /d "%~dp0"
call "%~dp0launch-sports35-local.bat" --no-browser
if errorlevel 1 exit /b 1

start "" "http://localhost:3001/admin/login"
exit /b 0
