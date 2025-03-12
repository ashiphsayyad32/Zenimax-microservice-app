@echo off
echo Starting Todo App Microservices...

echo.
echo Step 1: Initializing database...
call init-database.bat

echo.
echo Step 2: Starting Java Service (requires Maven and Java 17)...
echo Note: To start the Java service, open a new command prompt and run:
echo cd %cd%\java-service
echo mvn spring-boot:run

echo.
echo Step 3: Starting Python Service (requires Python 3.8+)...
echo Note: To start the Python service, open a new command prompt and run:
echo cd %cd%\python-service
echo python run.py

echo.
echo Once both services are running, you can test them with the following URLs:
echo Java Service: http://localhost:8080/api/tasks
echo Python Service: http://localhost:5000/api/statuses

echo.
echo Press any key to exit...
pause > nul
