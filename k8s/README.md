# Zenimax Microservices Kubernetes Deployment Guide

This document provides instructions for deploying the Zenimax microservices application on Kubernetes. The application consists of three main services:

- **Node.js Service**: Aggregates data from Java and Python services and serves it to the frontend
- **Java Service**: Provides task management functionality
- **Python Service**: Provides user management functionality
- **MySQL Database**: Stores data for all services

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐
│             │     │              │
│  Frontend   │────▶│  Node.js API │
│             │     │              │
└─────────────┘     └──────┬───────┘
                           │
                           ▼
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
┌─────────────────┐               ┌─────────────────┐
│                 │               │                 │
│   Java API      │               │   Python API    │
│                 │               │                 │
└────────┬────────┘               └────────┬────────┘
         │                                 │
         │                                 │
         │         ┌───────────┐           │
         │         │           │           │
         └────────▶│  MySQL DB │◀──────────┘
                   │           │
                   └───────────┘
```

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl command-line tool
- Docker (for building images)
- Helm (optional, for easier installation of NGINX Ingress Controller)

## Deployment Instructions

### 1. Create Kubernetes Namespace

```bash
kubectl create namespace zenimax-app
```

### 2. Deploy MySQL Database

```bash
# Create persistent volume claim
kubectl apply -f k8s/database/pvc.yaml -n zenimax-app

# Create ConfigMap and Secret
kubectl apply -f k8s/database/configmap.yaml -n zenimax-app
kubectl apply -f k8s/database/secret.yaml -n zenimax-app

# Deploy MySQL
kubectl apply -f k8s/database/deployment.yaml -n zenimax-app
kubectl apply -f k8s/database/service.yaml -n zenimax-app

# Wait for MySQL to be ready
kubectl rollout status deployment/mysql -n zenimax-app
```

### 3. Deploy Microservices

#### Node.js Service

```bash
# Create ConfigMap and Secret
kubectl apply -f k8s/node-service/configmap.yaml -n zenimax-app
kubectl apply -f k8s/node-service/secret.yaml -n zenimax-app

# Deploy Node.js Service
kubectl apply -f k8s/node-service/deployment.yaml -n zenimax-app
kubectl apply -f k8s/node-service/service.yaml -n zenimax-app
kubectl apply -f k8s/node-service/nodeport-service.yaml -n zenimax-app

# Wait for Node.js Service to be ready
kubectl rollout status deployment/node-service -n zenimax-app
```

#### Java Service

```bash
# Create ConfigMap and Secret
kubectl apply -f k8s/java-service/configmap.yaml -n zenimax-app
kubectl apply -f k8s/java-service/secret.yaml -n zenimax-app

# Deploy Java Service
kubectl apply -f k8s/java-service/deployment.yaml -n zenimax-app
kubectl apply -f k8s/java-service/service.yaml -n zenimax-app

# Wait for Java Service to be ready
kubectl rollout status deployment/java-service -n zenimax-app
```

#### Python Service

```bash
# Create ConfigMap and Secret
kubectl apply -f k8s/python-service/configmap.yaml -n zenimax-app
kubectl apply -f k8s/python-service/secret.yaml -n zenimax-app

# Deploy Python Service
kubectl apply -f k8s/python-service/deployment.yaml -n zenimax-app
kubectl apply -f k8s/python-service/service.yaml -n zenimax-app

# Wait for Python Service to be ready
kubectl rollout status deployment/python-service -n zenimax-app
```

### 4. Deploy NGINX Ingress Controller

#### Option 1: Using our YAML files

```bash
# Create NGINX Ingress Controller namespace and resources
kubectl apply -f k8s/ingress/nginx-ingress-controller.yaml

# Wait for Ingress Controller to be ready
kubectl rollout status deployment/nginx-ingress-controller -n ingress-nginx
```

#### Option 2: Using Helm (recommended for production)

```bash
# Add the Ingress-NGINX repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install the Ingress-NGINX controller
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

### 5. Deploy Ingress Resources

```bash
# Apply main Ingress for all services
kubectl apply -f k8s/ingress/ingress.yaml -n zenimax-app

# Apply service-specific Ingress resources
kubectl apply -f k8s/ingress/node-specific-ingress.yaml -n zenimax-app
kubectl apply -f k8s/ingress/java-specific-ingress.yaml -n zenimax-app
kubectl apply -f k8s/ingress/python-specific-ingress.yaml -n zenimax-app
```

### 6. Update Local Hosts File (for local development)

Add the following entries to your hosts file:

```
127.0.0.1 microservices.local
127.0.0.1 api.microservices.local
127.0.0.1 java-api.microservices.local
127.0.0.1 python-api.microservices.local
```

- On Windows: `C:\Windows\System32\drivers\etc\hosts`
- On macOS/Linux: `/etc/hosts`

## Accessing the Services

After deployment, you can access the services through the following URLs:

### Main Endpoints (via Ingress)

- **Node.js API**: http://microservices.local/api/node/
- **Java API**: http://microservices.local/api/java/
- **Python API**: http://microservices.local/api/python/

### Business-specific Endpoints

- **Todo Management (Node.js)**: http://microservices.local/api/todos/
- **Category Management (Node.js)**: http://microservices.local/api/categories/
- **Task Management (Java)**: http://microservices.local/api/tasks/
- **User Management (Python)**: http://microservices.local/api/users/

### Service-specific Subdomains

- **Node.js API**: http://api.microservices.local/todos/
- **Java API**: http://java-api.microservices.local/tasks/
- **Python API**: http://python-api.microservices.local/users/

### Direct NodePort Access (Node.js only)

- **Node.js API**: http://[node-ip]:30080/

## Monitoring and Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n zenimax-app
```

### View Pod Logs

```bash
kubectl logs -f deployment/node-service -n zenimax-app
kubectl logs -f deployment/java-service -n zenimax-app
kubectl logs -f deployment/python-service -n zenimax-app
```

### Check Ingress Status

```bash
kubectl get ingress -n zenimax-app
```

### Test Service Connectivity

```bash
# Test Node.js service
kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl -- curl http://node-service:4000/health -n zenimax-app

# Test Java service
kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl -- curl http://java-service:8080/actuator/health -n zenimax-app

# Test Python service
kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl -- curl http://python-service:5000/health -n zenimax-app
```

## Cleaning Up

To remove all resources:

```bash
# Delete all resources in the zenimax-app namespace
kubectl delete namespace zenimax-app

# Delete the NGINX Ingress Controller
kubectl delete namespace ingress-nginx
```

## Development and Testing

### Running Unit Tests

#### Java Service

```bash
# Navigate to the Java service directory
cd java-service

# Run tests with Maven
mvn test

# Run tests with code coverage (JaCoCo)
mvn clean test jacoco:report

# View coverage report
# The report will be available at: target/jacoco-report/index.html
```

#### Python Service

```bash
# Navigate to the Python service directory
cd python-service

# Install dependencies
pip install -r requirements.txt

# Run tests
python -m pytest

# Run tests with code coverage
python -m pytest --cov=app tests/ --cov-report=xml:coverage.xml

# View coverage report
# The XML report will be available at: coverage.xml
```

#### Node.js Service

```bash
# Navigate to the Node.js service directory
cd node-service

# Install dependencies
npm install

# Run tests
npm test

# View coverage report
# The report will be available at: coverage/lcov-report/index.html
```

### Running All Tests with Coverage

For convenience, you can run all tests with coverage using the provided batch file:

```bash
# From the root directory
./run_tests_with_coverage.bat
```

### SonarQube Integration

The coverage reports generated by the test commands are compatible with SonarQube:

- Java: JaCoCo XML report at `java-service/target/jacoco-report/jacoco.xml`
- Python: Coverage XML report at `python-service/coverage.xml`
- Node.js: LCOV report at `node-service/coverage/lcov.info`

To use these reports with SonarQube, configure your SonarQube project to use these paths.

## Building Docker Images

```bash
# Build Java service image
cd java-service
docker build -t zenimax/java-service:latest .

# Build Node.js service image
cd node-service
docker build -t zenimax/node-service:latest .

# Build Python service image
cd python-service
docker build -t zenimax/python-service:latest .
```

## Local Development

### Running Services Locally

#### Java Service

```bash
# Navigate to the Java service directory
cd java-service

# Run with Maven
mvn spring-boot:run

# The service will be available at http://localhost:8080
```

#### Python Service

```bash
# Navigate to the Python service directory
cd python-service

# Install dependencies
pip install -r requirements.txt

# Run the service
python run.py

# The service will be available at http://localhost:5000
```

#### Node.js Service

```bash
# Navigate to the Node.js service directory
cd node-service

# Install dependencies
npm install

# Run the service
npm start

# The service will be available at http://localhost:4000
```

## Customization

### Scaling Services

To scale a service to multiple replicas:

```bash
kubectl scale deployment node-service --replicas=3 -n zenimax-app
kubectl scale deployment java-service --replicas=3 -n zenimax-app
kubectl scale deployment python-service --replicas=3 -n zenimax-app
```

### Environment Configuration

Modify the ConfigMaps and Secrets in each service's directory to change environment variables.

## Production Considerations

For production deployments, consider:

1. Using Helm charts for easier management
2. Implementing proper SSL/TLS certificates
3. Setting up proper resource limits and requests
4. Configuring horizontal pod autoscaling
5. Setting up proper monitoring and logging
6. Using a managed database service instead of containerized MySQL
7. Implementing a CI/CD pipeline for automated deployments
