@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo     ENVIANDO MINHA DECISÃO CERTA PARA O GITHUB
echo ========================================================
echo.
set /p REPO_URL="Cole o link do seu repositorio GitHub (ou aperte ENTER se ja configurou): "
if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
)
git push -u origin main
echo.
echo ========================================================
echo Concluido!
echo ========================================================
pause
