import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaNodeJs, FaJava, FaPython } from 'react-icons/fa';

const AddTodoForm = ({ onTaskAdded, nodeServiceUrl = 'http://localhost:4000', javaServiceUrl = 'http://localhost:8080' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [serviceStatus, setServiceStatus] = useState({
    node: false,
    java: false,
    python: false
  });
  
  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusName, setStatusName] = useState('Pending');

  useEffect(() => {
    fetchCategories();
    checkServicesHealth();
  }, []);

  const checkServicesHealth = async () => {
    try {
      // Check Node.js service
      const nodeStatus = await axios.get(`${nodeServiceUrl}/api/health`, { timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      
      // Check Java service
      const javaStatus = await axios.get(`${javaServiceUrl}/api/health`, { timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      
      // Check Python service
      const pythonStatus = await axios.get('http://localhost:5000/api/health', { timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      
      setServiceStatus({
        node: nodeStatus,
        java: javaStatus,
        python: pythonStatus
      });
    } catch (error) {
      console.error('Error checking services health:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${nodeServiceUrl}/api/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please make sure the Node.js service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setLoading(true);
      console.log(`Adding category to Node.js service at ${nodeServiceUrl}...`);
      const response = await axios.post(`${nodeServiceUrl}/api/categories`, {
        name: categoryName
      });
      
      console.log('Category added successfully:', response.data);
      setCategories([...categories, response.data]);
      setCategoryName('');
      setSuccess('Category added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding category:', err);
      setError(`Failed to add category: ${err.message}. Please check if Node.js service is running.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedCategory) return;

    try {
      setLoading(true);
      // Step 1: Add task to Java service
      console.log(`Adding task to Java service at ${javaServiceUrl}...`);
      const taskResponse = await axios.post(`${javaServiceUrl}/api/tasks`, {
        title: taskTitle,
        description: taskDescription,
        categoryId: parseInt(selectedCategory)
      });

      console.log('Task added successfully:', taskResponse.data);

      // Step 2: Add status to Python service
      if (taskResponse.data && taskResponse.data.id) {
        console.log(`Adding status to Python service for task ID ${taskResponse.data.id}...`);
        await axios.post('http://localhost:5000/api/statuses', {
          task_id: taskResponse.data.id,
          status_name: statusName
        });
        console.log('Status added successfully');
      }

      setTaskTitle('');
      setTaskDescription('');
      setStatusName('Pending');
      setSuccess('Task added successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Notify parent component that a task was added
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error('Error adding task:', err);
      setError(`Failed to add task: ${err.message}. Please check if all microservices are running.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {!serviceStatus.node || !serviceStatus.java || !serviceStatus.python ? (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Service Status Warning</Alert.Heading>
          <p>Some microservices are not running. This may affect functionality.</p>
          <div>
            <p><FaNodeJs className="me-2" /> Node.js Service: {serviceStatus.node ? 'Running' : 'Not Running'}</p>
            <p><FaJava className="me-2" /> Java Service: {serviceStatus.java ? 'Running' : 'Not Running'}</p>
            <p><FaPython className="me-2" /> Python Service: {serviceStatus.python ? 'Running' : 'Not Running'}</p>
          </div>
          <Button variant="primary" onClick={checkServicesHealth} className="mt-2">Refresh Status</Button>
        </Alert>
      ) : null}

      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white d-flex align-items-center">
              <FaNodeJs className="me-2" size={20} />
              <h4 className="mb-0">Add New Category</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddCategory}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Categories are managed by the Node.js service
                  </Form.Text>
                </Form.Group>
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Category'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <FaJava className="me-2" size={20} />
              <h4 className="mb-0">Add New Task</h4>
            </Card.Header>
            <Card.Body>
              {categories.length === 0 ? (
                <Alert variant="warning">
                  Please create a category first before adding tasks.
                </Alert>
              ) : (
                <Form onSubmit={handleAddTask}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Categories from Node.js service
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter task title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      Tasks are managed by the Java service
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter task description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={statusName}
                      onChange={(e) => setStatusName(e.target.value)}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <FaPython className="me-1" /> Statuses are managed by the Python service
                    </Form.Text>
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Task'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        {success && (
          <Col xs={12} className="mt-3">
            <Alert variant="success">{success}</Alert>
          </Col>
        )}

        {error && (
          <Col xs={12} className="mt-3">
            <Alert variant="danger">{error}</Alert>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AddTodoForm;
