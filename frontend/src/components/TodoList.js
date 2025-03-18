import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaNodeJs, FaJava, FaPython, FaDatabase } from 'react-icons/fa';

/**
 * TodoList Component
 * 
 * Displays the list of todos fetched from the Node.js service, which aggregates data from:
 * - Categories from Node.js service
 * - Tasks from Java service
 * - Statuses from Python service
 */
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch todos when component mounts
    fetchTodos();
  }, []);

  /**
   * Fetches todos from the Node.js service which aggregates data from all microservices
   */
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/todos');
      setTodos(response.data.data || []);
      setMetadata(response.data.metadata || null);
      setError(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError(error.response?.data || { error: 'Failed to fetch todos' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Returns a badge component based on the status name
   * @param {Object} status - The status object from the Python service
   * @returns {JSX.Element} - A Badge component with appropriate styling
   */
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">No Status</Badge>;
    
    const statusName = status.status || 'Unknown';
    
    switch(statusName.toLowerCase()) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'in progress':
        return <Badge bg="primary">In Progress</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="info">{statusName}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Todos</Alert.Heading>
        <p>{error.error}</p>
        {error.details && <p>Details: {error.details}</p>}
        {error.serviceErrors && (
          <div>
            <p><strong>Service Errors:</strong></p>
            <ul>
              {error.serviceErrors.nodeService && <li><FaNodeJs /> Node.js Service: {error.serviceErrors.nodeService}</li>}
              {error.serviceErrors.javaService && <li><FaJava /> Java Service: {error.serviceErrors.javaService}</li>}
              {error.serviceErrors.pythonService && <li><FaPython /> Python Service: {error.serviceErrors.pythonService}</li>}
            </ul>
          </div>
        )}
        <button className="btn btn-primary mt-3" onClick={fetchTodos}>Try Again</button>
      </Alert>
    );
  }

  if (todos.length === 0) {
    return <Alert variant="info">No todos found. Add some categories and tasks to get started!</Alert>;
  }

  return (
    <div className="todo-list">
      {metadata && (
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">Data Flow Visualization</h5>
          </Card.Header>
          <Card.Body>
            <div className="data-flow-diagram">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <div className="service-box node">
                    <FaNodeJs size={30} />
                    <h5>Node.js Service</h5>
                    <p>Categories: {metadata.dataFlow.categories.count}</p>
                    <small>Data Source: <FaDatabase /> MySQL Database</small>
                  </div>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="service-box java">
                    <FaJava size={30} />
                    <h5>Java Service</h5>
                    <p>Tasks: {metadata.dataFlow.tasks.count}</p>
                    <small>Data Source: <FaDatabase /> MySQL Database</small>
                  </div>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="service-box python">
                    <FaPython size={30} />
                    <h5>Python Service</h5>
                    <p>Statuses: {metadata.dataFlow.statuses.count}</p>
                    <small>Data Source: <FaDatabase /> MySQL Database</small>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <p><strong>Last Updated:</strong> {new Date(metadata.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <h3 className="mb-4">Todo List</h3>
      
      {todos.map((category) => (
        <Card key={category.id} className="mb-4 shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{category.name}</h5>
              <small className="text-muted">
                <FaNodeJs className="me-1" /> Data from Node.js Service
              </small>
            </div>
            <Badge bg="primary" pill>{category.tasks.length} Tasks</Badge>
          </Card.Header>
          
          <ListGroup variant="flush">
            {category.tasks.length === 0 ? (
              <ListGroup.Item className="text-muted">No tasks in this category</ListGroup.Item>
            ) : (
              category.tasks.map((task) => (
                <ListGroup.Item key={task.id}>
                  <div className="task-container">
                    <div className="task-content d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <div className="fw-bold">{task.description}</div>
                        <div className="data-source-inline">
                          <FaJava className="me-1 text-primary" /> 
                          <small className="text-muted">Task from Java Service</small>
                        </div>
                      </div>
                      
                      <div className="status-container">
                        {task.status && (
                          <div className="data-source-inline mb-1">
                            <FaPython className="me-1 text-success" /> 
                            <small className="text-muted">Status from Python Service</small>
                          </div>
                        )}
                        <div>{getStatusBadge(task.status)}</div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      ))}
    </div>
  );
};

export default TodoList;
