@echo off
setlocal
cd /d "%~dp0"

:: Ensure Git and Git Credential Manager are available in PATH
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\ucrt64\bin;%PATH%"

echo ========================================================
echo   Pushing ASL Bridge AI to GitHub
echo   Repository: https://github.com/mohammadaadil0114912-debug/Final-Year-Project.git
echo   Branch:     main
echo ========================================================
echo.
echo Git Credential Manager will open your default browser to sign in to GitHub.
echo Please click "Authorize Git Credential Manager" in the browser if prompted.
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Project pushed successfully to GitHub!
) else (
    echo.
    echo [INFO] Push ended with exit code %ERRORLEVEL%.
)

echo.
pause
