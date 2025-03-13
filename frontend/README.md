# Zenimax Todo App Frontend

This is the React frontend for the Zenimax Todo App microservices application. It provides a user interface to interact with the Node.js, Java, and Python microservices.

## Features

- View all todos with their categories, tasks, and statuses
- Add new categories
- Add new tasks with statuses
- Real-time service status monitoring
- Responsive design with Bootstrap

## Prerequisites

Before running the frontend, make sure all three microservices are running:

1. Node.js service (port 3000) - Manages categories and aggregates data
2. Java service (port 8080) - Manages tasks
3. Python service (port 5000) - Manages statuses

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Architecture

This frontend application communicates with the Node.js service, which in turn aggregates data from the Java and Python services. The application follows a microservices architecture where:

- Node.js service manages categories and acts as an API gateway
- Java service manages tasks
- Python service manages statuses
- React frontend provides the user interface

## Technologies Used

- React 18
- Bootstrap 5
- Axios for API requests
- React Icons
- React Bootstrap components

## Project Structure

- `src/components/TodoList.js` - Displays all todos
- `src/components/AddTodoForm.js` - Form to add new categories and tasks
- `src/components/Header.js` - Application header
- `src/App.js` - Main application component
- `src/App.css` - Custom styles

## API Endpoints Used

- `GET /api/todos` - Get all todos (from Node.js service)
- `GET /api/categories` - Get all categories (from Node.js service)
- `POST /api/categories` - Create a new category (to Node.js service)
- `POST /api/tasks` - Create a new task (to Java service)
- `POST /api/statuses` - Create a new status (to Python service)
- `/health` endpoints - Check service health status
