terraform {
  backend "s3" {
    bucket         = "zenimax-terraform-state-1"
    key            = "terraform.tfstate"
    region         = "us-east-1"

  }
}