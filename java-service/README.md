# Java Microservice for Tasks

This service handles the Task data for the Todo App microservices architecture.

## Features

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- GET /health - Health check endpoint

## Database

This service connects to a MySQL database with the following configuration:
- Host: localhost
- Port: 3306
- Database: todoappdb
- Username: root
- Password: root

## How to Run

### Prerequisites

- Java 17 or higher
- Maven
- MySQL 8.0 or higher

### Steps

1. Make sure MySQL is running and the database is initialized
2. Navigate to the java-service directory
3. Run the following command to build the application:
   ```
   mvn clean package
   ```
4. Run the following command to start the application:
   ```
   java -jar target/java-service-0.0.1-SNAPSHOT.jar
   ```
5. The service will be available at http://localhost:8080

## API Examples

### Get all tasks

```
GET http://localhost:8080/api/tasks
```

### Create a new task

```
POST http://localhost:8080/api/tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Description of the new task",
  "categoryId": 1
}
```
