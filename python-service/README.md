# Python Microservice for Statuses

This service handles the Status data for the Todo App microservices architecture.

## Features

- GET /api/statuses - Get all statuses
- POST /api/statuses - Create a new status
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

- Python 3.8 or higher
- MySQL 8.0 or higher
- Required Python packages (see requirements.txt)

### Steps

1. Make sure MySQL is running and the database is initialized
2. Navigate to the python-service directory
3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   python run.py
   ```
5. The service will be available at http://localhost:5000

## API Examples

### Get all statuses

```
GET http://localhost:5000/api/statuses
```

### Create a new status

```
POST http://localhost:5000/api/statuses
Content-Type: application/json

{
  "task_id": 1,
  "status": "completed"
}
```
