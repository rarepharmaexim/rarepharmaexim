@echo off
title Scroll Video Animation
echo Starting local server at http://localhost:8080/ ...
start "" "http://localhost:8080/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080 -Root "%~dp0"
pause

