@echo off
setlocal
cd /d "%~dp0"

:: Ensure Git and Git Credential Manager are available in PATH
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\ucrt64\bin;%PATH%"

echo ========================================================
echo   ASL Bridge AI - GitHub Push and Authentication
echo   Repository: https://github.com/mohammadaadil0114912-debug/Final-Year-Project.git
echo   Branch:     main
echo ========================================================
echo.
echo [1/2] Initiating Git push to origin main...
echo Git Credential Manager will open your default browser to sign in.
echo (Click "Authorize Git Credential Manager" when prompted in your browser)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] ASL Bridge AI pushed successfully to GitHub!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Browser sign-in did not complete or was cancelled.
    echo   Starting GitHub Device Code Sign-In as alternative...
    echo ========================================================
    echo.
    "C:\Program Files\Git\ucrt64\bin\git-credential-manager.exe" github login --device
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Device authentication successful! Retrying push...
        git push -u origin main
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo [SUCCESS] ASL Bridge AI pushed successfully to GitHub!
        )
    )
)

echo.
pause
