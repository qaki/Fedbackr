@echo off
echo Starting ReviewPilot Servers...
echo.

echo Starting Backend Server...
start "ReviewPilot Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "ReviewPilot Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
