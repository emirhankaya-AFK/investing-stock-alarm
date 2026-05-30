@echo off
title Borsa Alarm Premium Istasyonu
cd /d "%~dp0"
echo ==========================================
echo    BORSA ALARM PREMIUM ISTASYONU
echo ==========================================
echo.
echo Sunucu baslatiliyor, lutfen bekleyin...
echo.

:: Tarayicida uygulamayi ac (varsayilan tarayici)
start http://localhost:3000

:: Node.js sunucusunu calistir
node server.js

if %errorlevel% neq 0 (
    echo.
    echo HATA: Sunucu baslatilamadi! Node.js'in kurulu oldugundan emin olun.
    pause
)
