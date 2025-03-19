@echo off
echo Initializing database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < init-database.sql
echo Database initialization completed.
