import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import axios from 'axios';

// Mock axios to avoid actual API calls during tests
jest.mock('axios');

describe('Header Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the application title correctly', () => {
    render(<Header />);
    const titleElement = screen.getByText(/Todo Microservice App/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders service status indicators', () => {
    render(<Header />);
    
    // Check if service names are displayed
    expect(screen.getByText(/Node.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Java/i)).toBeInTheDocument();
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
    
    // Check if port information is displayed
    expect(screen.getByText(/\(Port 4000\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\(Port 8080\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\(Port 5000\)/i)).toBeInTheDocument();
  });

  test('displays DOWN status initially before API responses', () => {
    render(<Header />);
    
    // Initially all services should show as DOWN
    const downStatuses = screen.getAllByText('DOWN');
    expect(downStatuses).toHaveLength(3);
  });
});
