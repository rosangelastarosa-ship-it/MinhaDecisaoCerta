@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo     ENVIANDO MINHA DECISÃO CERTA PARA O GITHUB
echo ========================================================
echo.
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Nenhum repositorio remoto configurado ainda.
    echo.
    set /p REPO_URL="Cole o link do seu repositorio GitHub (HTTPS): "
    if not "%REPO_URL%"=="" (
        git remote add origin %REPO_URL%
    )
) else (
    echo Repositorio remoto atual:
    git remote -v
    echo.
    set /p REPO_URL="Aperte ENTER para usar este, ou cole uma NOVA URL: "
    if not "%REPO_URL%"=="" (
        git remote remove origin 2>nul
        git remote add origin %REPO_URL%
    )
)
echo.
echo Adicionando e confirmando alteracoes...
git add .
git commit -m "Atualizacao Minha Decisao Certa" 2>nul
echo.
echo Enviando para o GitHub...
git push -u origin main
echo.
echo ========================================================
echo Se apareceu uma janelinha ou aba do navegador,
echo clique em "Authorize" para confirmar o login.
echo ========================================================
echo Concluido!
pause
