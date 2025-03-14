# Jenkins CI/CD Pipeline for React App Deployment to AWS S3

This guide explains how to set up the Jenkins pipeline for deploying the React frontend application to AWS S3.

## Prerequisites

1. Jenkins server with the following plugins installed:
   - Docker Pipeline
   - AWS Credentials
   - Pipeline
   - Git

2. AWS account with:
   - S3 bucket configured for static website hosting
   - IAM user with appropriate permissions
   - Optional: CloudFront distribution

## Jenkins Setup

### 1. Configure Jenkins Credentials

In Jenkins, go to **Manage Jenkins** > **Manage Credentials** > **Jenkins** > **Global credentials** and add:

1. **AWS Credentials**:
   - Kind: AWS Credentials
   - ID: `aws-credentials`
   - Description: AWS credentials for S3 deployment
   - Access Key ID: Your AWS access key
   - Secret Access Key: Your AWS secret key

2. **S3 Bucket Name**:
   - Kind: Secret text
   - ID: `s3-bucket-name`
   - Description: S3 bucket name for deployment
   - Secret: Your S3 bucket name

3. **CloudFront Distribution ID** (optional):
   - Kind: Secret text
   - ID: `cloudfront-distribution-id`
   - Description: CloudFront distribution ID
   - Secret: Your CloudFront distribution ID

### 2. Create Jenkins Pipeline Job

1. In Jenkins, click **New Item**
2. Enter a name (e.g., "React-App-S3-Deployment")
3. Select **Pipeline** and click **OK**
4. Configure the pipeline:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your repository URL
   - **Branch Specifier**: */main
   - **Script Path**: frontend/Jenkinsfile
5. Click **Save**

## AWS S3 Setup

1. **Create an S3 Bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name --region your-region
   ```

2. **Configure S3 Bucket for Static Website Hosting**:
   ```bash
   aws s3 website s3://your-bucket-name/ --index-document index.html --error-document index.html
   ```

3. **Set Bucket Policy for Public Access**:
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

## IAM User Setup

Create an IAM user with the following policy:

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
        "s3:DeleteObject"
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

## Pipeline Features

The Jenkins pipeline includes the following stages:

1. **Checkout**: Retrieves the code from your repository
2. **Install Dependencies**: Installs npm dependencies
3. **Lint**: Runs code linting (if configured)
4. **Test**: Runs unit tests
5. **Build**: Builds the React application
6. **Deploy to S3**: Uploads the build artifacts to S3 with appropriate cache headers
7. **Invalidate CloudFront**: Invalidates the CloudFront cache (if configured)

## Best Practices Implemented

1. **Docker-based Agents**: Uses containerized agents for consistent build environments
2. **Secure Credential Handling**: Uses Jenkins credential store for sensitive information
3. **Proper Cache Control**: Sets appropriate cache headers for different file types
4. **Conditional Stages**: Only runs CloudFront invalidation if configured
5. **Workspace Cleanup**: Cleans up workspace after build
6. **Deployment Feedback**: Provides clear feedback on deployment status

## Troubleshooting

1. **Permission Issues**: Ensure your IAM user has the correct permissions for S3 and CloudFront
2. **Build Failures**: Check the Jenkins console output for detailed error messages
3. **Deployment Issues**: Verify your S3 bucket is correctly configured for static website hosting

## Customization

You can customize the pipeline by modifying the `Jenkinsfile`:

- Change the Node.js version by updating the Docker image
- Modify environment variables for different regions or settings
- Add additional build or test steps as needed
