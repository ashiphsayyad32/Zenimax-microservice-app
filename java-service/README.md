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

## CI/CD Pipeline

This service uses GitHub Actions for continuous integration and deployment:

### Pipeline Features

- **Automated Testing**: Runs unit tests and generates code coverage reports
- **Docker Build**: Creates a Docker image for the service
- **Security Scanning**: Uses Trivy to scan for vulnerabilities in the Docker image
- **ECR Deployment**: Pushes the Docker image to Amazon ECR
- **EKS Deployment**: Deploys the service to Amazon EKS

### Pipeline Workflow

1. The pipeline can be triggered manually from the GitHub Actions tab
2. The Terraform infrastructure deployment must be completed first
3. It can also be triggered automatically by the Node.js service pipeline
4. After completion, it can optionally trigger the Python service pipeline

### Running the Pipeline

1. Go to the GitHub Actions tab in the repository
2. Select the "Java Service CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Choose whether to trigger the Python service pipeline after completion
5. Click "Run workflow" to start the process

The pipeline will build, test, and deploy the Java service to the EKS cluster.
