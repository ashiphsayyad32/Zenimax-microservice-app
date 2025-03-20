# Zenimax Todo App Frontend

This is the React frontend for the Zenimax Todo App microservices application. It provides a user interface to interact with the Node.js, Java, and Python microservices.

## Features

- View all todos with their categories, tasks, and statuses
- Add new categories
- Add new tasks with statuses
- Real-time service status monitoring
- Responsive design with Bootstrap

## Prerequisites

Before running the frontend, make sure all three microservices are running:

1. Node.js service (port 4000) - Manages categories and aggregates data
2. Java service (port 8080) - Manages tasks
3. Python service (port 5000) - Manages statuses

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Architecture

This frontend application communicates with the Node.js service, which in turn aggregates data from the Java and Python services. The application follows a microservices architecture where:

- Node.js service manages categories and acts as an API gateway
- Java service manages tasks
- Python service manages statuses
- React frontend provides the user interface

## Technologies Used

- React 18
- Bootstrap 5
- Axios for API requests
- React Icons
- React Bootstrap components

## Project Structure

- `src/components/TodoList.js` - Displays all todos
- `src/components/AddTodoForm.js` - Form to add new categories and tasks
- `src/components/Header.js` - Application header
- `src/App.js` - Main application component
- `src/App.css` - Custom styles

## API Endpoints Used

- `GET /api/todos` - Get all todos (from Node.js service)
- `GET /api/categories` - Get all categories (from Node.js service)
- `POST /api/categories` - Create a new category (to Node.js service)
- `POST /api/tasks` - Create a new task (to Java service)
- `POST /api/statuses` - Create a new status (to Python service)
- `/health` endpoints - Check service health status

## CI/CD Pipeline

This service uses GitHub Actions for continuous integration and deployment:

### Pipeline Features

- **Automated Testing**: Runs unit tests to ensure code quality
- **Build Process**: Creates optimized production build of the React app
- **SonarQube Scan**: Performs code quality analysis
- **S3 Deployment**: Deploys the built application to AWS S3
- **Cache Control**: Sets appropriate cache headers for optimal performance

### Pipeline Workflow

1. The pipeline can be triggered manually from the GitHub Actions tab
2. The Terraform infrastructure deployment must be completed first
3. It can also be triggered automatically by the Python service pipeline
4. The workflow deploys the React frontend to an S3 bucket configured for static website hosting

### Running the Pipeline

1. Go to the GitHub Actions tab in the repository
2. Select the "React Frontend CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Click "Run workflow" to start the process

The pipeline will build, test, and deploy the React frontend to AWS S3.

## Setting Up AWS Resources

Before using the CI/CD pipeline, you need to set up the following AWS resources:

1. **S3 Bucket for Hosting**:
   ```bash
   aws s3 mb s3://your-bucket-name --region your-region
   ```

2. **Configure S3 Bucket for Static Website Hosting**:
   ```bash
   aws s3 website s3://your-bucket-name/ --index-document index.html --error-document index.html
   ```

3. **Set Bucket Policy for Public Access** (create a policy.json file):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
   
   Apply the policy:
   ```bash
   aws s3api put-bucket-policy --bucket your-bucket-name --policy file://policy.json
   ```

4. **Optional: Set Up CloudFront for CDN and HTTPS**:
   ```bash
   aws cloudfront create-distribution --origin-domain-name your-bucket-name.s3-website-your-region.amazonaws.com
   ```

### Setting Up OIDC Authentication with AWS

The workflow uses OpenID Connect (OIDC) for secure authentication with AWS, which is a best practice that eliminates the need to store long-lived AWS credentials as GitHub secrets.

1. **Create an IAM OIDC Identity Provider**:

   ```bash
   aws iam create-open-id-connect-provider \
     --url https://token.actions.githubusercontent.com \
     --client-id-list sts.amazonaws.com \
     --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
   ```

2. **Create an IAM Role with a Trust Policy**:

   Create a trust-policy.json file:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<YOUR-AWS-ACCOUNT-ID>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<YOUR-GITHUB-ORG>/<YOUR-REPO-NAME>:*"
           }
         }
       }
     ]
   }
   ```

   Create the role:
   ```bash
   aws iam create-role \
     --role-name GitHubActionsOIDCRole \
     --assume-role-policy-document file://trust-policy.json
   ```

3. **Attach a Policy to the Role**:

   Create a policy.json file for S3 and CloudFront permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:ListBucket",
           "s3:DeleteObject",
           "s3:GetBucketLocation"
         ],
         "Resource": [
           "arn:aws:s3:::your-bucket-name",
           "arn:aws:s3:::your-bucket-name/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

   Create and attach the policy:
   ```bash
   aws iam create-policy \
     --policy-name GitHubActionsS3Policy \
     --policy-document file://policy.json

   aws iam attach-role-policy \
     --role-name GitHubActionsOIDCRole \
     --policy-arn arn:aws:iam::<YOUR-AWS-ACCOUNT-ID>:policy/GitHubActionsS3Policy
   ```

### GitHub Repository Secrets

Add the following secrets to your GitHub repository:

1. `AWS_ROLE_TO_ASSUME`: The ARN of the IAM role created for OIDC authentication (e.g., `arn:aws:iam::123456789012:role/GitHubActionsOIDCRole`)
2. `AWS_REGION`: The AWS region where your S3 bucket is located (e.g., `us-east-1`)
3. `S3_BUCKET_NAME`: The name of your S3 bucket
4. `CLOUDFRONT_DISTRIBUTION_ID` (optional): Your CloudFront distribution ID if using CloudFront

### Manual Deployment

You can manually trigger the workflow from the GitHub Actions tab by selecting "Run workflow" on the "React App CI/CD Pipeline" workflow. You'll have the option to select the environment (production or staging).

### Environments

The workflow supports two environments:

1. **Production**: Used for deploying to the production S3 bucket
2. **Staging**: Can be configured to deploy to a different S3 bucket for testing

To set up environment-specific secrets, go to your GitHub repository settings, select "Environments", create "production" and "staging" environments, and add the appropriate secrets to each.

### Best Practices Implemented

The CI/CD pipeline implements several best practices:

1. **Security Scanning**: Checks for vulnerable dependencies and leaked secrets
2. **OIDC Authentication**: Uses short-lived credentials instead of long-lived access keys
3. **Proper Cache Control**: Sets appropriate cache headers for different file types
4. **Artifact Management**: Preserves build artifacts and test coverage reports
5. **Pull Request Integration**: Adds deployment URLs to pull requests for easy review
6. **Dependency Checking**: Identifies outdated dependencies
7. **Code Quality**: Runs linting when available
