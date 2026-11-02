@echo off
chcp 65001 >nul
echo Preparando para enviar o site para o GitHub e Vercel...
git add index.html img/achadinhos/dispenser-detergente.jpg deploy.bat
git commit -m "fix(showcase): usar asset local para dispenser e atualizar script de deploy da Vercel" 2>nul
git push
echo.
echo Atualizando producao na Vercel...
call npx -y vercel --prod --yes
echo.
echo ========================================================
echo Pronto! O site foi publicado com sucesso na Vercel e GitHub.
echo ========================================================
pause
