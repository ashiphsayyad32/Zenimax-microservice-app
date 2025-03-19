# This block configures the AWS provider for Terraform, specifying the AWS region to be used for resource creation & management
terraform {
  required_version = ">= 1.9.7"

   required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"  
    }
  }
}
provider "aws" {
  region = var.region
}