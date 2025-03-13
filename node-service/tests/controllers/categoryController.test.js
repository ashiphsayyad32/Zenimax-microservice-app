const { getAllCategories, getCategoryById, createCategory } = require('../../controllers/categoryController');
const db = require('../../config/db');

// Mock the database module
jest.mock('../../config/db');

describe('Category Controller Tests', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories successfully', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database query response
      const mockCategories = [
        { id: 1, name: 'Work' },
        { id: 2, name: 'Personal' }
      ];
      
      db.query.mockImplementation((query, callback) => {
        callback(null, mockCategories);
      });

      // Call the function
      await getAllCategories(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle database errors', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database error
      db.query.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null);
      });

      // Call the function
      await getAllCategories(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID successfully', async () => {
      // Mock request and response objects
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database query response
      const mockCategory = { id: 1, name: 'Work' };
      
      db.query.mockImplementation((query, params, callback) => {
        callback(null, [mockCategory]);
      });

      // Call the function
      await getCategoryById(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 404 when category not found', async () => {
      // Mock request and response objects
      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock empty result
      db.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      // Call the function
      await getCategoryById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });

    it('should handle database errors', async () => {
      // Mock request and response objects
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database error
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      // Call the function
      await getCategoryById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      // Mock request and response objects
      const req = { body: { name: 'New Category' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database query response for insert
      const mockInsertResult = { insertId: 3 };
      
      // Mock database query response for select
      const mockNewCategory = { id: 3, name: 'New Category' };

      // Mock implementation for different queries
      db.query.mockImplementationOnce((query, params, callback) => {
        callback(null, mockInsertResult);
      }).mockImplementationOnce((query, params, callback) => {
        callback(null, [mockNewCategory]);
      });

      // Call the function
      await createCategory(req, res);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewCategory);
    });

    it('should handle validation errors', async () => {
      // Mock request with missing name
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Call the function
      await createCategory(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });

    it('should handle database errors', async () => {
      // Mock request and response objects
      const req = { body: { name: 'New Category' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock database error
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      // Call the function
      await createCategory(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });
});
