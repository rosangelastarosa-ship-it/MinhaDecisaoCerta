@echo off
chcp 65001 >nul
cd /d "%~dp0pinterest_bot"
title Publicador Automático de Pins - Minha Decisão Certa
cls
echo ================================================================
echo    INICIANDO ROBÔ PUBLICADOR DE PINS NO PINTEREST
echo    Minha Decisão Certa (minhadecisaocerta.com.br)
echo ================================================================
echo.
echo As imagens em 'pinterest_bot/minhas_fotos' serão publicadas com
echo os títulos, descrições com SEO e links oficiais de afiliado!
echo.
node postar.js
echo.
pause
