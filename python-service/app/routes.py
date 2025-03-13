from flask import request, jsonify
from datetime import datetime
from app import app
from app.database import get_connection, convert_datetime, initialize_database

# Initialize database on startup
initialize_database()

"""
Python Service API Routes
This module defines the API endpoints for the Python microservice
which is responsible for managing status data in the Todo application.
"""

@app.route('/api/statuses', methods=['GET'])
def get_statuses():
    """
    Get all statuses from the database.
    
    Returns:
        JSON response with all statuses or error message
    """
    try:
        # Establish database connection
        conn = get_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        # Fetch all statuses from the database
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM statuses")
        statuses = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Convert datetime objects to strings for JSON serialization
        for status in statuses:
            if 'created_at' in status and status['created_at']:
                status['created_at'] = convert_datetime(status['created_at'])
            if 'updated_at' in status and status['updated_at']:
                status['updated_at'] = convert_datetime(status['updated_at'])
        
        return jsonify(statuses)
    except Exception as e:
        # Log and return any errors that occur
        print(f"Error in get_statuses: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/statuses', methods=['POST'])
def create_status():
    """
    Create a new status for a task.
    
    Expected JSON payload:
        {
            "task_id": int,
            "status_name": string
        }
    
    Returns:
        JSON response with created status or error message
    """
    try:
        # Parse request data
        data = request.get_json()
        
        # Validate required fields
        if not data or 'task_id' not in data or 'status_name' not in data:
            return jsonify({'error': 'Task ID and status_name are required'}), 400
        
        # Establish database connection
        conn = get_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Insert new status into database
        query = "INSERT INTO statuses (task_id, status) VALUES (%s, %s)"
        cursor.execute(query, (data['task_id'], data['status_name']))
        
        # Get the ID of the newly created status
        status_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        # Return the created status with timestamp
        return jsonify({
            'id': status_id,
            'task_id': data['task_id'],
            'status_name': data['status_name'],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }), 201
    except Exception as e:
        # Log and return any errors that occur
        print(f"Error in create_status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify the service is running.
    
    Returns:
        JSON response with status 'UP' to indicate service is healthy
    """
    return jsonify({'status': 'UP'}), 200
