# Todo App Microservices

A microservice-based todo application with the following components:

- **Node.js Service (v22)**: Handles Category data and acts as an API gateway
- **Java Service (v17)**: Handles Task data
- **Python Service**: Handles Status data
- **React Frontend**: Displays all todo details
- **MySQL Database**: Stores all data in 3 tables

## Project Structure

```
├── docker-compose.yml    # Docker Compose configuration
├── node-service/         # Node.js service (Categories)
├── java-service/         # Java service (Tasks)
├── python-service/       # Python service (Status)
└── frontend/             # React frontend
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
  - status (e.g., "pending", "in-progress", "completed")
  - created_at
  - updated_at

## How to Run

1. Make sure you have Docker and Docker Compose installed
2. Clone this repository
3. Run the following command to start all services:

```bash
docker-compose up -d
```

4. Access the frontend at http://localhost:80

## API Endpoints

### Node.js Service (Categories)
- GET /api/categories - Get all categories
- POST /api/categories - Create a new category
- GET /api/todos - Get all todos with tasks and statuses

### Java Service (Tasks)
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task

### Python Service (Statuses)
- GET /api/statuses - Get all statuses
- POST /api/statuses - Create a new status
