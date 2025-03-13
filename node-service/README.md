# Node.js Microservice for Todo App

This service handles the Category data and acts as an API gateway for the Todo App microservices architecture.

## Features

- GET /api/categories - Get all categories
- POST /api/categories - Create a new category
- GET /api/todos - Get all todos (combines data from all microservices)
- GET /health - Health check endpoint

## Database

This service connects to a MySQL database with the following configuration:
- Host: microservices-database.cvggya6kg1r7.us-east-1.rds.amazonaws.com
- Port: 3306
- Database: todoappdb
- Username: admin
- Password: admin123

## How to Run

### Prerequisites

- Node.js 14.x or higher
- MySQL 8.0 or higher

### Steps

1. Make sure MySQL is running and the database is initialized
2. Navigate to the node-service directory
3. Copy `.env.example` to `.env` and update the values if needed:
   ```
   cp .env.example .env
   ```
4. Install the required packages:
   ```
   npm install
   ```
5. Run the application:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```
6. The service will be available at http://localhost:3000

## API Examples

### Get all categories

```
GET http://localhost:3000/api/categories
```

### Create a new category

```
POST http://localhost:3000/api/categories
Content-Type: application/json

{
  "name": "New Category"
}
```

### Get all todos (combined data)

```
GET http://localhost:3000/api/todos
```

## Dependencies

- express - Web framework
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- mysql2 - MySQL client
- axios - HTTP client for making requests to other microservices
