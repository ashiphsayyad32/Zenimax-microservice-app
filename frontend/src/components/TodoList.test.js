import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TodoList from './TodoList';
import axios from 'axios';

// Mock axios to avoid actual API calls during tests
jest.mock('axios');

describe('TodoList Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('displays loading spinner initially', () => {
    // Mock the axios get to return a promise that doesn't resolve immediately
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<TodoList />);
    
    // Check if loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays empty state message when no todos are returned', async () => {
    // Mock successful response with empty data
    axios.get.mockResolvedValue({
      data: {
        data: [],
        metadata: null
      }
    });
    
    render(<TodoList />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText(/No todos found/i)).toBeInTheDocument();
    });
  });

  test('displays todos when data is returned', async () => {
    // Mock successful response with sample data
    const mockTodos = {
      data: {
        data: [
          {
            id: 1,
            name: 'Work',
            tasks: [
              {
                id: 101,
                description: 'Complete project',
                status: { status: 'In Progress' }
              }
            ]
          }
        ],
        metadata: {
          dataFlow: {
            categories: { count: 1 },
            tasks: { count: 1 },
            statuses: { count: 1 }
          },
          timestamp: new Date().toISOString()
        }
      }
    };
    
    axios.get.mockResolvedValue(mockTodos);
    
    render(<TodoList />);
    
    // Wait for the component to finish loading and display the todo
    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Complete project')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });
});
