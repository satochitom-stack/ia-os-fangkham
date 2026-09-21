@echo off
chcp 65001 >nul
cd /d "C:\Users\Windows11\.gemini\antigravity\scratch\internal-audit-app"

:: Check if port 5173 is already running
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    start http://localhost:5173
    exit /b
)

:: If not running, start it minimized
start "IA-OS-Server" /min cmd /c "npm run dev -- --host"
timeout /t 3 /nobreak >nul
start http://localhost:5173
