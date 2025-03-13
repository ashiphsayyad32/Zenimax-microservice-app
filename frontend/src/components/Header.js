import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { FaNodeJs, FaJava, FaPython } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
  const [serviceStatus, setServiceStatus] = useState({
    node: false,
    java: false,
    python: false
  });

  useEffect(() => {
    checkServicesHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkServicesHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkServicesHealth = async () => {
    try {
      // Check Node.js service (port 4000)
      const nodeStatus = await checkServiceHealth('http://localhost:4000/api/health');
      
      // Check Java service (port 8080)
      const javaStatus = await checkServiceHealth('http://localhost:8080/api/health');
      
      // Check Python service (port 5000)
      const pythonStatus = await checkServiceHealth('http://localhost:5000/api/health');
      
      setServiceStatus({
        node: nodeStatus,
        java: javaStatus,
        python: pythonStatus
      });
    } catch (error) {
      console.error('Error checking services health:', error);
    }
  };

  const checkServiceHealth = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 3000 });
      return response.status === 200 && response.data.status === 'UP';
    } catch (error) {
      console.error(`Health check failed for ${url}:`, error);
      return false;
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#">Zenimax Todo App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <div className="d-flex align-items-center ms-3">
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.node ? 'status-up' : 'status-down'}`}></div>
                <FaNodeJs className="me-1" />
                <span>Node.js</span>
                <Badge bg={serviceStatus.node ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.node ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-muted">(Port 4000)</small>
              </div>
              
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.java ? 'status-up' : 'status-down'}`}></div>
                <FaJava className="me-1" />
                <span>Java</span>
                <Badge bg={serviceStatus.java ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.java ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-muted">(Port 8080)</small>
              </div>
              
              <div className="service-status">
                <div className={`status-indicator ${serviceStatus.python ? 'status-up' : 'status-down'}`}></div>
                <FaPython className="me-1" />
                <span>Python</span>
                <Badge bg={serviceStatus.python ? 'success' : 'danger'} className="ms-1">
                  {serviceStatus.python ? 'UP' : 'DOWN'}
                </Badge>
                <small className="ms-1 text-muted">(Port 5000)</small>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
