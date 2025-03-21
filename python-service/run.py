from app import app
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    try:
        logger.info('Starting Python Status service on port 5000')
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        logger.error(f'Error starting Python Status service: {e}')
