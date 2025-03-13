from flask import request, jsonify
from datetime import datetime
from app import app
from app.database import get_connection, convert_datetime, initialize_database

# Initialize database on startup
initialize_database()

# Routes
@app.route('/api/statuses', methods=['GET'])
def get_statuses():
    try:
        conn = get_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM statuses")
        statuses = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Convert datetime objects to strings
        for status in statuses:
            if 'created_at' in status and status['created_at']:
                status['created_at'] = convert_datetime(status['created_at'])
            if 'updated_at' in status and status['updated_at']:
                status['updated_at'] = convert_datetime(status['updated_at'])
        
        return jsonify(statuses)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statuses', methods=['POST'])
def create_status():
    try:
        data = request.get_json()
        
        if not data or 'task_id' not in data or 'status_name' not in data:
            return jsonify({'error': 'Task ID and status_name are required'}), 400
        
        conn = get_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        query = "INSERT INTO statuses (task_id, status) VALUES (%s, %s)"
        cursor.execute(query, (data['task_id'], data['status_name']))
        
        status_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'id': status_id,
            'task_id': data['task_id'],
            'status_name': data['status_name'],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'UP'}), 200
