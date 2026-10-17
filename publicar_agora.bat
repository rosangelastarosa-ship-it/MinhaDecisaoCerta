@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo        MINHA DECISÃO CERTA - AGENDADOR DE ARTIGOS
echo ========================================================
echo.
echo As publicações ocorrem de forma 100%% automática na nuvem
echo a cada 2 dias pontualmente às 10:00 (Horário de Brasília).
echo.
node scripts/publisher.js
echo.
pause
