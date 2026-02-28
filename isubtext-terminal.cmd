@echo off
title iSubtext Dev Terminal

REM czarne tło + biały tekst (wpisywane komendy)
color 0F

REM przejście do projektu
cd /d C:\projekty\isubtext

REM kolorowy prompt (niebieski), potem reset koloru
prompt $E[94m(iSubtext)$P$G $E[0m

cls
echo.
echo ===============================
echo        iSubtext DEV
echo ===============================
echo.

cmd