import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Header from '../../components/Header';

// Mock axios
jest.mock('axios');

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the app title correctly', () => {
    // Mock axios responses
    axios.get.mockResolvedValue({ status: 200, data: { status: 'UP' } });
    
    render(<Header />);
    
    // Check if the app title is rendered
    const titleElement = screen.getByText('Todo Microservice App');
    expect(titleElement).toBeInTheDocument();
  });

  test('displays service statuses correctly when all services are up', async () => {
    // Mock successful responses for all services
    axios.get.mockImplementation((url) => {
      return Promise.resolve({ status: 200, data: { status: 'UP' } });
    });
    
    render(<Header />);
    
    // Wait for the status checks to complete
    await waitFor(() => {
      // Check if Node.js service status is displayed as UP
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getAllByText('UP')[0]).toBeInTheDocument();
      
      // Check if Java service status is displayed as UP
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getAllByText('UP')[1]).toBeInTheDocument();
      
      // Check if Python service status is displayed as UP
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getAllByText('UP')[2]).toBeInTheDocument();
    });
    
    // Verify axios was called three times (once for each service)
    expect(axios.get).toHaveBeenCalledTimes(3);
  });

  test('displays service statuses correctly when services are down', async () => {
    // Mock failed responses for all services
    axios.get.mockRejectedValue(new Error('Service unavailable'));
    
    render(<Header />);
    
    // Wait for the status checks to complete
    await waitFor(() => {
      // Check if Node.js service status is displayed as DOWN
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getAllByText('DOWN')[0]).toBeInTheDocument();
      
      // Check if Java service status is displayed as DOWN
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getAllByText('DOWN')[1]).toBeInTheDocument();
      
      // Check if Python service status is displayed as DOWN
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getAllByText('DOWN')[2]).toBeInTheDocument();
    });
    
    // Verify axios was called three times (once for each service)
    expect(axios.get).toHaveBeenCalledTimes(3);
  });

  test('displays mixed service statuses correctly', async () => {
    // Mock mixed responses (Node.js up, Java down, Python up)
    axios.get.mockImplementation((url) => {
      if (url.includes('4000')) {
        return Promise.resolve({ status: 200, data: { status: 'UP' } });
      } else if (url.includes('8080')) {
        return Promise.reject(new Error('Service unavailable'));
      } else if (url.includes('5000')) {
        return Promise.resolve({ status: 200, data: { status: 'UP' } });
      }
    });
    
    render(<Header />);
    
    // Wait for the status checks to complete
    await waitFor(() => {
      // Check if Node.js service status is displayed as UP
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getAllByText('UP')[0]).toBeInTheDocument();
      
      // Check if Java service status is displayed as DOWN
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getByText('DOWN')).toBeInTheDocument();
      
      // Check if Python service status is displayed as UP
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getAllByText('UP')[1]).toBeInTheDocument();
    });
    
    // Verify axios was called three times (once for each service)
    expect(axios.get).toHaveBeenCalledTimes(3);
  });
});
