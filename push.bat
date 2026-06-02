@echo off
chcp 65001 >nul
cd /d "C:\Users\Dell\deepseek-glass"

echo ============================================
echo   DeepSeek Glass - Push to GitHub
echo ============================================
echo.

echo Adding GitHub remote...
git remote add origin https://github.com/Eugenia527/deepseek-glass.git

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
echo You may be prompted for your GitHub credentials.
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo   SUCCESS! Code pushed to GitHub!
    echo ============================================
    echo.
    echo Next: Go to https://vercel.com
    echo Login with GitHub - Import repo "deepseek-glass"
    echo Click Deploy - Done in 2 minutes!
    echo.
) else (
    echo.
    echo Push failed. Check your GitHub credentials.
    echo Try: https://github.com/Eugenia527/deepseek-glass
)

pause
