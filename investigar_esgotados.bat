@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Robô Investigador de Produtos Esgotados - Minha Decisão Certa
cls
echo ================================================================
echo    INICIANDO ROBÔ INVESTIGADOR DE ESTOQUE E LINKS DA SHOPEE
echo ================================================================
echo.
node scripts/investigador_esgotados.js
echo.
pause
