terraform {
  backend "s3" {
    bucket         = "zenimax-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"

  }
}