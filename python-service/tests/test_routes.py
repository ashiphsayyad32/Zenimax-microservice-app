import unittest
import json
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from app.database import get_connection

"""
Unit tests for the Python service API routes.

These tests verify the functionality of the Flask API endpoints using unittest
and mock objects to simulate database connections. This allows testing the API
logic in isolation without requiring an actual database connection.

The tests cover:
- GET /api/statuses - Retrieving all statuses
- POST /api/statuses - Creating a new status
- GET /api/health - Health check endpoint
"""
class TestRoutes(unittest.TestCase):
    def setUp(self):
        """
        Set up the test environment before each test.
        Creates a test client for the Flask application.
        """
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.routes.get_connection')
    def test_get_statuses(self, mock_get_connection):
        """
        Test the GET /api/statuses endpoint.
        
        This test mocks the database connection and cursor to return predefined
        status data, then verifies that the API correctly processes and returns
        this data.
        
        Args:
            mock_get_connection: A mocked version of the get_connection function
        """
        # Setup mock database connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_connection.return_value = mock_conn
        
        # Mock the cursor fetchall to return test data
        mock_cursor.fetchall.return_value = [
            {'id': 1, 'task_id': 1, 'status': 'In Progress', 'created_at': None, 'updated_at': None},
            {'id': 2, 'task_id': 2, 'status': 'Completed', 'created_at': None, 'updated_at': None}
        ]
        
        # Make the request to the API
        response = self.app.get('/api/statuses')
        
        # Check the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['status'], 'In Progress')
        self.assertEqual(data[1]['status'], 'Completed')
        
        # Verify the mock was called correctly
        mock_get_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with("SELECT * FROM statuses")
        mock_cursor.fetchall.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('app.routes.get_connection')
    def test_create_status(self, mock_get_connection):
        """
        Test the POST /api/statuses endpoint.
        
        This test mocks the database connection and cursor to simulate creating
        a new status, then verifies that the API correctly processes the request
        and returns the expected response.
        
        Args:
            mock_get_connection: A mocked version of the get_connection function
        """
        # Setup mock database connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_connection.return_value = mock_conn
        
        # Set the lastrowid property to simulate an insert
        mock_cursor.lastrowid = 3
        
        # Test data to send
        test_data = {
            'task_id': 3,
            'status_name': 'New Status'
        }
        
        # Make the request to the API
        response = self.app.post('/api/statuses', 
                                json=test_data,
                                content_type='application/json')
        
        # Check the response
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 3)
        self.assertEqual(data['task_id'], 3)
        self.assertEqual(data['status_name'], 'New Status')
        
        # Verify the mock was called correctly
        mock_get_connection.assert_called_once()
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    def test_health_check(self):
        """
        Test the GET /api/health endpoint.
        
        This test verifies that the health check endpoint returns the expected
        status code and response body.
        """
        # Make the request to the API
        response = self.app.get('/api/health')
        
        # Check the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'UP')

if __name__ == '__main__':
    unittest.main()
