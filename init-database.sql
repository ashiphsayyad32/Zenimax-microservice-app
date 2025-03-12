-- Initialize the database and tables for the Todo App

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todoappdb;

-- Use the database
USE todoappdb;

-- Create the categories table (managed by Node.js service)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the tasks table (managed by Java service)
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the statuses table (managed by Python service)
CREATE TABLE IF NOT EXISTS statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO categories (name) VALUES ('Work'), ('Personal'), ('Shopping');

INSERT INTO tasks (title, description, category_id) VALUES 
('Complete project proposal', 'Finish the proposal document by Friday', 1),
('Buy groceries', 'Milk, eggs, bread, and vegetables', 3),
('Go to the gym', 'Cardio and strength training', 2);

INSERT INTO statuses (task_id, status) VALUES 
(1, 'in-progress'),
(2, 'pending'),
(3, 'completed');
