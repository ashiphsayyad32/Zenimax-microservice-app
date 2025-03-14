@echo off
REM ================================================================
REM Test Runner Script for Zenimax Microservices Application
REM
REM This batch file automates the process of running unit tests and 
REM generating code coverage reports for all three microservices:
REM - Java service (Spring Boot)
REM - Python service (Flask)
REM - Node.js service (Express)
REM
REM The coverage reports generated are compatible with SonarQube.
REM ================================================================

echo Running tests with code coverage for all microservices...

echo.
echo ===== Java Service Tests =====
REM Navigate to Java service directory
cd java-service
REM Run Maven tests with JaCoCo coverage
REM This generates HTML, XML, and CSV reports in target/jacoco-report
call mvn clean test jacoco:report
cd ..

echo.
echo ===== Python Service Tests =====
REM Navigate to Python service directory
cd python-service
REM Install Python dependencies
pip install -r requirements.txt
REM Run pytest with coverage reporting to XML
REM The XML format is compatible with SonarQube
python -m pytest --cov=app tests/ --cov-report=xml:coverage.xml
cd ..

echo.
echo ===== Node.js Service Tests =====
REM Navigate to Node.js service directory
cd node-service
REM Install Node.js dependencies
call npm install
REM Run Jest tests with coverage
REM This generates LCOV reports in coverage/lcov-report
call npm test
cd ..

echo.
echo All tests completed. Coverage reports are available in:
echo Java:   java-service/target/jacoco-report
echo Python: python-service/coverage.xml
echo Node.js: node-service/coverage/lcov-report
