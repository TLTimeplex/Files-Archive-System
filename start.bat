@echo off
start "api"    cmd /c "cd api    && set PORT=3000 && npm start"
start "client" cmd /c "cd client && set PORT=2000 && npm start"
start "proxy"  cmd /c "cd proxy  && npm start"