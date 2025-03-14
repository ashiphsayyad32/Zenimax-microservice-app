/**
 * Unit tests for the Todo Controller
 * 
 * These tests verify the functionality of the Todo Controller which is responsible
 * for aggregating data from all three microservices:
 * - Categories from Node.js service (local database)
 * - Tasks from Java service
 * - Statuses from Python service
 * 
 * The tests use Jest and mock objects to simulate database connections and HTTP requests,
 * allowing testing of the controller logic in isolation without requiring actual
 * service dependencies.
 */
const { getAllTodos } = require('../controllers/todoController');
const axios = require('axios');
const { pool } = require('../config/db');

// Mock dependencies
jest.mock('axios');
jest.mock('../config/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('Todo Controller Tests', () => {
  let req, res;

  /**
   * Set up the test environment before each test
   */
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  /**
   * Test the successful data aggregation from all three services
   * 
   * This test verifies that:
   * - The controller fetches data from all three services
   * - The data is correctly combined into a unified response
   * - Tasks are correctly associated with their categories
   * - Status information is correctly associated with tasks
   */
  test('getAllTodos should fetch and combine data from all services', async () => {
    // Mock data
    const mockCategories = [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' }
    ];
    
    const mockTasks = [
      { id: 1, title: 'Task 1', categoryId: 1 },
      { id: 2, title: 'Task 2', categoryId: 2 }
    ];
    
    const mockStatuses = [
      { task_id: 1, status: 'In Progress' }
    ];

    // Setup mocks
    pool.query.mockResolvedValue([mockCategories]);
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/tasks')) {
        return Promise.resolve({ data: mockTasks });
      }
      if (url.includes('/api/statuses')) {
        return Promise.resolve({ data: mockStatuses });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Call the function
    await getAllTodos(req, res);

    // Assertions
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM categories');
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalled();
    
    // Check the structure of the response
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty('metadata');
    expect(responseData).toHaveProperty('data');
    expect(responseData.metadata.dataFlow).toHaveProperty('categories');
    expect(responseData.metadata.dataFlow).toHaveProperty('tasks');
    expect(responseData.metadata.dataFlow).toHaveProperty('statuses');
    expect(responseData.data).toHaveLength(2);
    
    // Check that tasks are correctly associated with categories
    const workCategory = responseData.data.find(cat => cat.id === 1);
    expect(workCategory.tasks).toHaveLength(1);
    expect(workCategory.tasks[0].id).toBe(1);
    expect(workCategory.tasks[0].status).toEqual({ task_id: 1, status: 'In Progress' });
  });

  /**
   * Test error handling for database errors
   * 
   * This test verifies that:
   * - The controller handles database errors gracefully
   * - The response includes appropriate error information
   * - The error is correctly identified as coming from the Node.js service
   */
  test('getAllTodos should handle errors gracefully', async () => {
    // Mock a database error
    pool.query.mockRejectedValue(new Error('Database error with categories'));

    // Call the function
    await getAllTodos(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
    
    const errorResponse = res.json.mock.calls[0][0];
    expect(errorResponse).toHaveProperty('error', 'Failed to fetch todos');
    expect(errorResponse).toHaveProperty('details', 'Database error with categories');
    expect(errorResponse.serviceErrors.nodeService).toBeTruthy();
  });

  /**
   * Test error handling for Java service errors
   * 
   * This test verifies that:
   * - The controller handles Java service errors gracefully
   * - The response includes appropriate error information
   * - The error is correctly identified as coming from the Java service
   */
  test('getAllTodos should handle Java service errors', async () => {
    // Mock successful categories query but failed Java service
    const mockCategories = [{ id: 1, name: 'Work' }];
    pool.query.mockResolvedValue([mockCategories]);
    
    // Mock Java service error
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/tasks')) {
        return Promise.reject(new Error('Cannot connect to Java service on port 8080'));
      }
      return Promise.resolve({ data: [] });
    });

    // Call the function
    await getAllTodos(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
    
    const errorResponse = res.json.mock.calls[0][0];
    expect(errorResponse).toHaveProperty('error', 'Failed to fetch todos');
    expect(errorResponse.serviceErrors.javaService).toBeTruthy();
  });
});
