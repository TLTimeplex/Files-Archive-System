@echo off
start "api"    cmd /c "cd api    && set PORT=80   && npm start"
start "client" cmd /c "cd client && set PORT=3000 && npm start"