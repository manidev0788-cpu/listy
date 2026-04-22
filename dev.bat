@echo off
cd /d "%~dp0"
call "%~dp0node_modules\.bin\next.cmd" dev --turbopack
