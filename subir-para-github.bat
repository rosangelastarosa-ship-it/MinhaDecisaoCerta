@echo off
chcp 65001 >nul
cd /d "C:\Users\Rosangela\.gemini\antigravity-ide\scratch\gourmet-studio"
echo ========================================================
echo       ENVIANDO GOURMET STUDIO PARA O GITHUB
echo ========================================================
echo.
git push -u origin main
echo.
echo ========================================================
echo Se apareceu uma janelinha ou aba do navegador,
echo clique em "Authorize" para confirmar o login.
echo ========================================================
echo.
pause
