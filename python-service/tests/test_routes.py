import pytest
import json
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.routes import app

@pytest.fixture
def client():
    """Create a test client for the app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'UP'

@patch('app.routes.get_connection')
def test_get_statuses(mock_get_connection, client):
    """Test getting all statuses."""
    # Mock the database connection and cursor
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_get_connection.return_value = mock_conn
    
    # Mock the cursor fetchall method to return test data
    mock_cursor.fetchall.return_value = [
        {'id': 1, 'status': 'In Progress', 'task_id': 1, 'created_at': None, 'updated_at': None},
        {'id': 2, 'status': 'Completed', 'task_id': 2, 'created_at': None, 'updated_at': None}
    ]
    
    # Make the request
    response = client.get('/api/statuses')
    
    # Verify the response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['id'] == 1
    assert data[0]['status'] == 'In Progress'
    assert data[0]['task_id'] == 1
    assert data[1]['id'] == 2
    assert data[1]['status'] == 'Completed'
    assert data[1]['task_id'] == 2

@patch('app.routes.get_connection')
def test_create_status(mock_get_connection, client):
    """Test creating a new status."""
    # Mock the database connection and cursor
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_get_connection.return_value = mock_conn
    
    # Mock the cursor lastrowid
    mock_cursor.lastrowid = 3
    
    # Make the request with the correct parameter names
    response = client.post('/api/statuses', 
                          data=json.dumps({'task_id': 3, 'status_name': 'New Status'}),
                          content_type='application/json')
    
    # Verify the response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['id'] == 3
    assert data['status_name'] == 'New Status'
    assert data['task_id'] == 3

@patch('app.routes.get_connection')
def test_create_status_missing_data(mock_get_connection, client):
    """Test creating a status with missing data."""
    # Make the request with missing task_id
    response = client.post('/api/statuses', 
                          data=json.dumps({'status_name': 'New Status'}),
                          content_type='application/json')
    
    # Verify the response
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
