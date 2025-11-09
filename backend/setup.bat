@echo off
echo Setting up Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Python not found. Please install Python 3.10+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo Setup complete! To start the server, run:
echo   venv\Scripts\activate
echo   uvicorn main:app --reload
echo.
pause

