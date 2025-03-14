# Configuration settings for the Python service

class Config:
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
    
    # Database settings
    DB_HOST = 'microservices-db.czg5d44n2tyl.us-east-1.rds.amazonaws.com'
    DB_USER = 'admin'
    DB_PASSWORD = 'admin123'
    DB_NAME = 'todoappdb'
