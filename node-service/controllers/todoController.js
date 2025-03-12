const axios = require('axios');
const { pool } = require('../config/db');

// Get all todos (combining data from all microservices)
async function getAllTodos(req, res) {
  try {
    // Get categories from this service
    const [categories] = await pool.query('SELECT * FROM categories');
    
    // Get tasks from Java service
    const javaServiceUrl = process.env.JAVA_SERVICE_URL || 'http://localhost:8080';
    const tasksResponse = await axios.get(`${javaServiceUrl}/api/tasks`);
    const tasks = tasksResponse.data;
    
    // Get statuses from Python service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
    const statusesResponse = await axios.get(`${pythonServiceUrl}/api/statuses`);
    const statuses = statusesResponse.data;
    
    // Combine the data
    const todos = categories.map(category => {
      const categoryTasks = tasks.filter(task => task.categoryId === category.id);
      
      const tasksWithStatus = categoryTasks.map(task => {
        const taskStatus = statuses.find(status => status.task_id === task.id) || null;
        return {
          ...task,
          status: taskStatus
        };
      });
      
      return {
        ...category,
        tasks: tasksWithStatus
      };
    });
    
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
  }
}

module.exports = {
  getAllTodos
};
