@echo off
echo Creating MongoDB database and collection...

mongosh < setup_db.js

echo.
echo Setup finished.
pause