# Todo App Microservices

A microservice-based todo application with the following components:

- **Node.js Service (v22)**: Handles Category data and acts as an API gateway
- **Java Service (v17)**: Handles Task data
- **Python Service**: Handles Status data
- **React Frontend**: Displays all todo details
- **MySQL Database**: Stores all data in 3 tables

## Project Structure

```
├── node-service/         # Node.js service (Categories)
├── java-service/         # Java service (Tasks)
├── python-service/       # Python service (Status)
├── frontend/             # React frontend
└── init-database.sql     # Database initialization script
```

## Database Schema

- **categories**: Managed by Node.js service
  - id (Primary Key)
  - name
  - created_at
  - updated_at

- **tasks**: Managed by Java service
  - id (Primary Key)
  - title
  - description
  - category_id (Foreign Key)
  - created_at
  - updated_at

- **statuses**: Managed by Python service
  - id (Primary Key)
  - task_id (Foreign Key)
  - status_name (e.g., "Pending", "Completed", "Failed")
  - created_at
  - updated_at

## How to Run

### Prerequisites

- Node.js v22
- Java 17 (with Maven)
- Python 3.8+
- MySQL Database

### Database Setup

The application uses a MySQL database with the following configuration:
- Host: microservices-database.cvggya6kg1r7.us-east-1.rds.amazonaws.com
- Port: 3306
- Database: todoappdb
- Username: admin
- Password: admin123

### Starting the Services

1. **Start the Java Service**:
   ```bash
   cd java-service
   mvn spring-boot:run
   ```
   The Java service will run on port 8080.

2. **Start the Python Service**:
   ```bash
   cd python-service
   pip install -r requirements.txt
   python run.py
   ```
   The Python service will run on port 5000.

3. **Start the Node.js Service**:
   ```bash
   cd node-service
   npm install
   npm start
   ```
   The Node.js service will run on port 4000.

4. **Start the React Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The React frontend will run on port 3001.

### Accessing the Application

Once all services are running, you can access the frontend at http://localhost:3000

## API Endpoints

### Node.js Service (Categories)
- GET /api/categories - Get all categories
- POST /api/categories - Create a new category
- GET /api/todos - Get all todos with tasks and statuses
- GET /health - Health check endpoint

### Java Service (Tasks)
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- GET /api/health - Health check endpoint

### Python Service (Statuses)
- GET /api/statuses - Get all statuses
- POST /api/statuses - Create a new status
- GET /api/health - Health check endpoint

## CI/CD Pipelines

The project uses GitHub Actions for continuous integration and deployment. The CI/CD process follows this sequence:

1. **Terraform Infrastructure Deployment**:
   - Deploys AWS infrastructure including EKS cluster, networking, and other resources
   - Must be run first before any service deployments
   - Manually triggered with options for apply or destroy actions

2. **Node.js Service Pipeline**:
   - Builds, tests, and deploys the Node.js service to EKS
   - Can only run after the Terraform pipeline completes
   - Can optionally trigger the Java service pipeline

3. **Java Service Pipeline**:
   - Builds, tests, and deploys the Java service to EKS
   - Can be triggered by the Node.js pipeline
   - Can optionally trigger the Python service pipeline

4. **Python Service Pipeline**:
   - Builds, tests, and deploys the Python service to EKS
   - Can be triggered by the Java pipeline
   - Can optionally trigger the React frontend pipeline

5. **React Frontend Pipeline**:
   - Builds, tests, and deploys the React frontend to S3
   - Can be triggered by the Python pipeline

### Running the CI/CD Pipelines

1. Go to the GitHub Actions tab in the repository
2. Select the "Terraform Workflow" and run it with the "apply" action
3. After Terraform completes, run the Node.js service pipeline
4. When prompted, choose whether to run the next service pipeline in the sequence

All pipelines include security scanning with Trivy and deployment to AWS.

## Troubleshooting

If you encounter any issues:

1. Make sure all services are running
2. Check the console logs for each service
3. Verify database connectivity
4. Ensure the correct ports are available (4000, 3000, 5000, 8080)

The React frontend includes a service status indicator that will show which services are currently running.
