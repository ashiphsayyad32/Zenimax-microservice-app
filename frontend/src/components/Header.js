import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { FaNodeJs, FaJava, FaPython } from 'react-icons/fa';
import axios from 'axios';

/**
 * Header component displays the application header with service status indicators.
 * It shows the health status of all three microservices (Node.js, Java, Python).
 */
const Header = () => {
  // State to track the status of each microservice
  const [serviceStatus, setServiceStatus] = useState({
    node: false,
    java: false,
    python: false
  });

  /**
   * Helper function to check the health of a single service
   * @param {string} url - The health endpoint URL to check
   * @returns {boolean} - Whether the service is up or down
   */
  const checkServiceHealth = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 3000 });
      return response.status === 200 && response.data.status === 'UP';
    } catch (error) {
      console.error(`Health check failed for ${url}:`, error);
      return false;
    }
  };

  /**
   * Checks the health status of all microservices
   */
  const checkServicesHealth = useCallback(async () => {
    try {
      // Check Node.js service (port 4000)
      const nodeStatus = await checkServiceHealth('http://localhost:4000/api/health');
      
      // Check Java service (port 8080)
      const javaStatus = await checkServiceHealth('http://localhost:8080/api/health');
      
      // Check Python service (port 5000)
      const pythonStatus = await checkServiceHealth('http://localhost:5000/api/health');
      
      // Update service status state
      setServiceStatus({
        node: nodeStatus,
        java: javaStatus,
        python: pythonStatus
      });
    } catch (error) {
      console.error('Error checking services health:', error);
    }
  }, []); // Empty dependency array as this doesn't depend on any props or state

  useEffect(() => {
    // Check services health on component mount
    checkServicesHealth();
    
    // Set up interval to check health every 30 seconds
    const interval = setInterval(checkServicesHealth, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [checkServicesHealth]); // Now this is safe because checkServicesHealth is memoized

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Application title */}
        <Navbar.Brand href="#" className="text-white fw-bold">Todo Microservice App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {/* Service status indicators */}
            <div className="d-flex align-items-center ms-3">
              {/* Node.js service status */}
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.node ? 'status-up' : 'status-down'}`}></div>
                <FaNodeJs className="me-1 text-white" />
                <span className="text-white">Node.js</span>
                <Badge bg={serviceStatus.node ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.node ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-light">(Port 4000)</small>
              </div>
              
              {/* Java service status */}
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.java ? 'status-up' : 'status-down'}`}></div>
                <FaJava className="me-1 text-white" />
                <span className="text-white">Java</span>
                <Badge bg={serviceStatus.java ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.java ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-light">(Port 8080)</small>
              </div>
              
              {/* Python service status */}
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.python ? 'status-up' : 'status-down'}`}></div>
                <FaPython className="me-1 text-white" />
                <span className="text-white">Python</span>
                <Badge bg={serviceStatus.python ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.python ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-light">(Port 5000)</small>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
