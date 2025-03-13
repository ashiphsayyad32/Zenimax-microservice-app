import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tab, Tabs, Alert } from 'react-bootstrap';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import './App.css';

/**
 * Main App component
 * Manages the overall application layout and service health checks
 */
function App() {
  const [refreshTodos, setRefreshTodos] = useState(false);
  const [servicesStatus, setServicesStatus] = useState({
    node: false,
    java: false,
    python: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check services on component mount and every 30 seconds
    checkServices();
    const intervalId = setInterval(checkServices, 30000);
    return () => clearInterval(intervalId);
  }, []);

  /**
   * Check the health of all microservices
   */
  const checkServices = async () => {
    try {
      const nodeCheck = fetch('http://localhost:4000/api/health')
        .then(res => res.ok)
        .catch(() => false);
      
      const javaCheck = fetch('http://localhost:8080/api/health')
        .then(res => res.ok)
        .catch(() => false);
      
      const pythonCheck = fetch('http://localhost:5000/api/health')
        .then(res => res.ok)
        .catch(() => false);
      
      const [nodeStatus, javaStatus, pythonStatus] = await Promise.all([nodeCheck, javaCheck, pythonCheck]);
      
      setServicesStatus({
        node: nodeStatus,
        java: javaStatus,
        python: pythonStatus
      });

      if (!nodeStatus || !javaStatus || !pythonStatus) {
        setError('Some microservices are not running. Please start all services for full functionality.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error checking services:', err);
      setError('Failed to check microservices status.');
    }
  };

  /**
   * Handle when a new task is added to refresh the todo list
   */
  const handleTaskAdded = () => {
    setRefreshTodos(prev => !prev);
  };

  return (
    <div className="App">
      <Header />
      <Container>
        {error && (
          <Alert variant="warning" className="mt-3">
            <Alert.Heading>Service Status Warning</Alert.Heading>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Node.js Service: {servicesStatus.node ? '✅ Running' : '❌ Not Running'}<br />
              Java Service: {servicesStatus.java ? '✅ Running' : '❌ Not Running'}<br />
              Python Service: {servicesStatus.python ? '✅ Running' : '❌ Not Running'}
            </p>
          </Alert>
        )}

        <Tabs defaultActiveKey="todos" className="mb-4 mt-4">
          <Tab eventKey="todos" title="View Todos">
            <TodoList key={refreshTodos} />
          </Tab>
          <Tab eventKey="add" title="Add New">
            <AddTodoForm onTaskAdded={handleTaskAdded} nodeServiceUrl="http://localhost:4000" javaServiceUrl="http://localhost:8080" />
          </Tab>
        </Tabs>
      </Container>
      <footer className="mt-5 py-3 text-center text-muted">
        <small>
          Todo Microservice App - Node.js (4000) | Java (8080) | Python (5000)
        </small>
      </footer>
    </div>
  );
}

export default App;
