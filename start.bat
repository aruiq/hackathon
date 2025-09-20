@echo off
echo ====================================================
echo 🇦🇺 Australian Retail Analytics SaaS Platform
echo ====================================================
echo.

REM Check Python version
echo Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python not found
    echo Please install Python 3.6+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python environment check passed
echo.

REM Check project files
if not exist "public\index.html" (
    echo ❌ Error: public\index.html not found
    echo Please ensure all project files are in the correct location
    pause
    exit /b 1
)

echo ✅ Project files check passed
echo.

echo 🚀 Starting server...
echo Tip: Press Ctrl+C to stop the server
echo.

REM Start Python server
python server.py

if %errorlevel% neq 0 (
    echo.
    echo ❌ Server startup failed, trying with python3...
    python3 server.py
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Server startup failed
        echo Please check error messages or try manual startup
        echo.
        echo Troubleshooting suggestions:
        echo 1. Ensure Python version is 3.6+
        echo 2. Check if ports 8000-8050 are occupied
        echo 3. Try running as administrator
        echo 4. Check firewall settings
        echo.
    )
)

pause
