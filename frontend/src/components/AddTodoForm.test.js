import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodoForm from './AddTodoForm';
import axios from 'axios';

// Mock axios to avoid actual API calls during tests
jest.mock('axios');

describe('AddTodoForm Component', () => {
  const mockOnTaskAdded = jest.fn();
  const mockCategories = [
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the initial axios calls
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/categories')) {
        return Promise.resolve({ data: mockCategories });
      }
      if (url.includes('/api/health')) {
        return Promise.resolve({ data: { status: 'UP' }, status: 200 });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders the form elements correctly', async () => {
    render(<AddTodoForm onTaskAdded={mockOnTaskAdded} />);
    
    // Wait for the component to load categories
    await waitFor(() => {
      // Check for category form
      expect(screen.getByText('Add New Category')).toBeInTheDocument();
      expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
      
      // Check for task form
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
      expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    });
  });

  test('loads and displays categories in the dropdown', async () => {
    render(<AddTodoForm onTaskAdded={mockOnTaskAdded} />);
    
    // Wait for categories to load
    await waitFor(() => {
      const categorySelect = screen.getByLabelText(/Category/i);
      expect(categorySelect).toBeInTheDocument();
      
      // Check if both categories are in the dropdown
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });
  });

  test('allows adding a new category', async () => {
    // Mock the post request for adding a category
    axios.post.mockResolvedValueOnce({ 
      data: { id: 3, name: 'New Category' } 
    });
    
    render(<AddTodoForm onTaskAdded={mockOnTaskAdded} />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    });
    
    // Fill in the category name
    const categoryInput = screen.getByLabelText(/Category Name/i);
    await userEvent.type(categoryInput, 'New Category');
    
    // Submit the form
    const addCategoryButton = screen.getByText('Add Category');
    fireEvent.click(addCategoryButton);
    
    // Verify the API was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/categories'),
        { name: 'New Category' }
      );
    });
  });

  test('shows success message after adding a category', async () => {
    // Mock the post request for adding a category
    axios.post.mockResolvedValueOnce({ 
      data: { id: 3, name: 'New Category' } 
    });
    
    render(<AddTodoForm onTaskAdded={mockOnTaskAdded} />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    });
    
    // Fill in the category name and submit
    const categoryInput = screen.getByLabelText(/Category Name/i);
    await userEvent.type(categoryInput, 'New Category');
    
    const addCategoryButton = screen.getByText('Add Category');
    fireEvent.click(addCategoryButton);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
    });
  });
});
