@echo off
echo ================================
echo Invio Setup Checker
echo ================================
echo.

:: Check Node.js
echo [1/4] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    goto :error
) else (
    node --version
    echo [OK] Node.js installed
)
echo.

:: Check npm
echo [2/4] Checking npm...
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] npm not found!
    goto :error
) else (
    npm --version
    echo [OK] npm installed
)
echo.

:: Check Rust
echo [3/4] Checking Rust...
where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Rust/Cargo not found!
    echo.
    echo Rust is required for Tauri backend.
    echo.
    echo To install Rust:
    echo 1. Visit https://rustup.rs/
    echo 2. Download and run the installer
    echo 3. Restart your terminal
    echo 4. Run this script again
    echo.
    echo Or use winget:
    echo    winget install Rustlang.Rust.MSVC
    echo.
    goto :rust_missing
) else (
    cargo --version
    rustc --version
    echo [OK] Rust installed
)
echo.

:: Check WebView2
echo [4/4] Checking WebView2...
reg query "HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] WebView2 might not be installed
    echo.
    echo To install WebView2:
    echo    winget install Microsoft.EdgeWebView2Runtime
    echo.
    echo Or download from:
    echo    https://developer.microsoft.com/microsoft-edge/webview2/
    echo.
) else (
    echo [OK] WebView2 detected
)
echo.

:: Check node_modules
echo Checking dependencies...
if not exist "node_modules" (
    echo [INFO] Dependencies not installed
    echo.
    set /p install="Install dependencies now? (y/n): "
    if /i "%install%"=="y" (
        echo.
        echo Installing dependencies...
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo [FAIL] npm install failed!
            goto :error
        )
        echo [OK] Dependencies installed
    )
) else (
    echo [OK] Dependencies found
)
echo.

:rust_missing
echo ================================
echo Setup Status Summary
echo ================================
echo.

where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Frontend: Ready ✓
    echo Backend:  Missing Rust ✗
    echo.
    echo NEXT STEPS:
    echo 1. Install Rust from https://rustup.rs/
    echo 2. Restart terminal
    echo 3. Run: npm run tauri:dev
    echo.
    echo For now, you can test the frontend only:
    echo    npm run dev
) else (
    echo All systems ready! ✓
    echo.
    echo NEXT STEPS:
    echo.
    echo To start development:
    echo    npm run tauri:dev
    echo.
    echo To test frontend only:
    echo    npm run dev
    echo.
    echo To build for production:
    echo    npm run tauri:build
)
echo.
echo For detailed setup instructions, see SETUP.md
echo ================================
pause
exit /b 0

:error
echo.
echo ================================
echo Setup check failed!
echo Please see SETUP.md for help
echo ================================
pause
exit /b 1
