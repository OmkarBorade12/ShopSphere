@echo off
echo Starting ShopSphere System...
echo ===================================
echo Make sure MySQL is running and a database named 'shopsphere_db' exists!
echo (Or update server/.env with your credentials)
echo ===================================

start cmd /k "cd server && npm run dev"
start cmd /k "cd client && npm run dev"

echo Backend and Frontend servers are starting...
echo Frontend will be at http://localhost:5173
echo Backend will be at http://localhost:5000
pause
