@echo off
start "api"    cmd /c "cd api    && npm i && set PORT=3000 && npm start"
start "client" cmd /c "cd client && npm i && set PORT=2000 && npm start"
start "proxy"  cmd /c "cd proxy  && npm i && npm start"