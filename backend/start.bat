@echo off
echo Starting FastAPI server...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)
uvicorn main:app --reload

