@echo off
chcp 65001 >nul
title 我的专属画廊后台程序
color 0E

echo =========================================
echo.
echo   正在启动你的专属画廊，请稍等片刻...
echo.
echo   注意：请【不要关闭】这个黑色的窗口！
echo   只有保持这个窗口打开，你的画廊才能正常运行。
echo   不看的时候，把它最小化即可。
echo.
echo =========================================
echo.

:: 启动 vite 并自动在浏览器中打开
call npm run dev -- --open

pause
