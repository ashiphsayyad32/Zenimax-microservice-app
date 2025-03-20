import mysql.connector
from mysql.connector import Error
from datetime import datetime
import sys
import os

# Add the parent directory to sys.path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config

# Database configuration from config
db_config = {
    'host': Config.DB_HOST,
    'user': Config.DB_USERNAME,
    'password': Config.DB_PASSWORD,
    'database': Config.DB_NAME
}

# Initialize database and create table if it doesn't exist
def initialize_database():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Create statuses table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS statuses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task_id INT NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        ''')
        
        conn.commit()
        print("Statuses table initialized")
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error initializing database: {e}")
        return False

# Get database connection
def get_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Helper function to convert MySQL datetime to string
def convert_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    return str(obj)
