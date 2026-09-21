@echo off
chcp 65001 >nul
title IA-OS Launcher
cd /d "%~dp0"

:: Ensure local tools in PATH
set "PATH=%USERPROFILE%\.local\git\cmd;%USERPROFILE%\.local\node;%PATH%"

:: Check if port 5173 is currently listening
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    start "" /b cmd /c "npm run dev -- --host"
    timeout /t 2 /nobreak >nul
)

:: Open default browser to the web app
start http://localhost:5173/
exit

