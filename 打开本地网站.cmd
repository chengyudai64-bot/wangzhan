@echo off
cd /d "%~dp0"
start "1-09 local server" powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-site.ps1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8099/?local=1"
exit
