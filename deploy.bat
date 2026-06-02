@echo off
chcp 65001 >nul
cd /d "C:\Users\Dell\deepseek-glass"

echo =============================================
echo   DeepSeek Glass - iOS 26 iMessage Edition
echo =============================================
echo.

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Building project (check for errors)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo BUILD FAILED! Please check errors above.
    pause
    exit /b 1
)

echo.
echo [3/4] Build passed! Committing to git...
git add .
git commit -m "feat: iOS 26 iMessage glass UI redesign"

echo.
echo [4/4] Ready for GitHub push!
echo.
echo =============================================
echo   NEXT STEPS (manual):
echo =============================================
echo.
echo 1. Create a repo on https://github.com/new
echo    (public, empty, NO README)
echo.
echo 2. Run these commands in terminal:
echo    git remote add origin https://github.com/YOURNAME/REPO.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Go to https://vercel.com
echo    Import repo -> Deploy (no env vars needed)
echo.
echo =============================================
pause
