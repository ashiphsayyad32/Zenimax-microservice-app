const axios = require('axios');
const { pool } = require('../config/db');

// Get all todos (combining data from all microservices)
async function getAllTodos(req, res) {
  try {
    // Step 1: Get categories from this service (Node.js)
    console.log('Fetching categories from Node.js service database...');
    const [categories] = await pool.query('SELECT * FROM categories');
    console.log(`Found ${categories.length} categories in Node.js service database`);
    
    // Step 2: Get tasks from Java service
    console.log('Fetching tasks from Java service...');
    const javaServiceUrl = process.env.JAVA_SERVICE_URL || 'http://localhost:8080';
    const tasksResponse = await axios.get(`${javaServiceUrl}/api/tasks`);
    const tasks = tasksResponse.data;
    console.log(`Received ${tasks.length} tasks from Java service`);
    
    // Step 3: Get statuses from Python service
    console.log('Fetching statuses from Python service...');
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
    const statusesResponse = await axios.get(`${pythonServiceUrl}/api/statuses`);
    const statuses = statusesResponse.data;
    console.log(`Received ${statuses.length} statuses from Python service`);
    
    // Step 4: Combine the data
    console.log('Combining data from all three services...');
    const todos = categories.map(category => {
      const categoryTasks = tasks.filter(task => task.categoryId === category.id);
      
      const tasksWithStatus = categoryTasks.map(task => {
        const taskStatus = statuses.find(status => status.task_id === task.id) || null;
        return {
          ...task,
          status: taskStatus,
          dataSource: {
            task: 'Java Service',
            status: taskStatus ? 'Python Service' : 'Not Available'
          }
        };
      });
      
      return {
        ...category,
        tasks: tasksWithStatus,
        dataSource: 'Node.js Service'
      };
    });
    
    console.log('Successfully combined data from all services');
    res.json({
      metadata: {
        dataFlow: {
          categories: {
            source: 'Node.js Service',
            count: categories.length
          },
          tasks: {
            source: 'Java Service',
            count: tasks.length
          },
          statuses: {
            source: 'Python Service',
            count: statuses.length
          }
        },
        timestamp: new Date().toISOString()
      },
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch todos', 
      details: error.message,
      serviceErrors: {
        nodeService: error.message.includes('categories') ? error.message : null,
        javaService: error.message.includes('tasks') || error.message.includes('8080') ? error.message : null,
        pythonService: error.message.includes('statuses') || error.message.includes('5000') ? error.message : null
      }
    });
  }
}

module.exports = {
  getAllTodos
};
