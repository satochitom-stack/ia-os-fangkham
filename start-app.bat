@echo off
chcp 65001 >nul
cd /d "%~dp0"

:: Ensure local tools in PATH
set "PATH=%USERPROFILE%\.local\git\cmd;%USERPROFILE%\.local\node;%PATH%"

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

