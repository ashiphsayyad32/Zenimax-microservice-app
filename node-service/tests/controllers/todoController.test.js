const { getAllTodos, createTodo, getTodoById } = require('../../controllers/todoController');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('Todo Controller Tests', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should fetch and combine data from all services successfully', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock successful responses from services
      axios.get.mockImplementation((url) => {
        if (url.includes('/api/categories')) {
          return Promise.resolve({
            data: [
              { id: 1, name: 'Work' },
              { id: 2, name: 'Personal' }
            ]
          });
        } else if (url.includes('/api/tasks')) {
          return Promise.resolve({
            data: [
              { id: 1, title: 'Task 1', categoryId: 1 },
              { id: 2, title: 'Task 2', categoryId: 2 }
            ]
          });
        } else if (url.includes('/api/statuses')) {
          return Promise.resolve({
            data: [
              { id: 1, name: 'In Progress', taskId: 1 },
              { id: 2, name: 'Completed', taskId: 2 }
            ]
          });
        }
      });

      // Call the function
      await getAllTodos(req, res);

      // Assertions
      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: 'Work',
          tasks: expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              title: 'Task 1',
              categoryId: 1,
              status: expect.objectContaining({
                id: 1,
                name: 'In Progress',
                taskId: 1
              })
            })
          ])
        })
      ]));
    });

    it('should handle errors when fetching data', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock error response
      axios.get.mockRejectedValue(new Error('Service unavailable'));

      // Call the function
      await getAllTodos(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('getTodoById', () => {
    it('should fetch a todo by ID successfully', async () => {
      // Mock request and response objects
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock successful response
      axios.get.mockImplementation((url) => {
        if (url.includes('/api/categories/1')) {
          return Promise.resolve({
            data: { id: 1, name: 'Work' }
          });
        } else if (url.includes('/api/tasks')) {
          return Promise.resolve({
            data: [
              { id: 1, title: 'Task 1', categoryId: 1 }
            ]
          });
        } else if (url.includes('/api/statuses')) {
          return Promise.resolve({
            data: [
              { id: 1, name: 'In Progress', taskId: 1 }
            ]
          });
        }
      });

      // Call the function
      await getTodoById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        name: 'Work',
        tasks: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: 'Task 1',
            status: expect.objectContaining({
              id: 1,
              name: 'In Progress'
            })
          })
        ])
      }));
    });

    it('should handle not found todo', async () => {
      // Mock request and response objects
      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock not found response
      axios.get.mockRejectedValue({ response: { status: 404 } });

      // Call the function
      await getTodoById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('createTodo', () => {
    it('should create a todo successfully', async () => {
      // Mock request and response objects
      const req = {
        body: {
          name: 'New Todo',
          tasks: [
            { title: 'New Task', description: 'Task description' }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock successful responses
      axios.post.mockImplementation((url) => {
        if (url.includes('/api/categories')) {
          return Promise.resolve({
            data: { id: 3, name: 'New Todo' }
          });
        } else if (url.includes('/api/tasks')) {
          return Promise.resolve({
            data: { id: 3, title: 'New Task', categoryId: 3 }
          });
        }
      });

      // Call the function
      await createTodo(req, res);

      // Assertions
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 3,
        name: 'New Todo',
        tasks: expect.arrayContaining([
          expect.objectContaining({
            id: 3,
            title: 'New Task'
          })
        ])
      }));
    });

    it('should handle errors when creating a todo', async () => {
      // Mock request and response objects
      const req = {
        body: {
          name: 'New Todo',
          tasks: [
            { title: 'New Task', description: 'Task description' }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock error response
      axios.post.mockRejectedValue(new Error('Failed to create todo'));

      // Call the function
      await createTodo(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });
});
