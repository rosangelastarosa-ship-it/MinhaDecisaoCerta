@echo off
echo Preparando para enviar o site...
git add .
git commit -m "Atualizando materia do Gemini e melhorias de SEO"
git push
echo.
echo Pronto! O site foi enviado para a Vercel. Pode fechar esta janela.
pause
