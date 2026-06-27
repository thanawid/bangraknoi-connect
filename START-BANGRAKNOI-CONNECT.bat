@echo off
chcp 65001 > nul
title Bangraknoi Connect
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1"
if errorlevel 1 (
  echo.
  echo ไม่สามารถเปิดเว็บได้ กรุณาตรวจสอบว่า port 4173 ยังว่างอยู่
  pause
)
