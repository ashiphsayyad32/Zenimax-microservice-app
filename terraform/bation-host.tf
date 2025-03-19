# This module provisions an Bastion Host(EC2) for secure connection.

module "bastion_host" {
  source  = "terraform-aws-modules/ec2-instance/aws"

  name                                 = "${var.env}-eks-automode-bastion-host"
  ami                                  = var.ami 
  instance_type                        = "t2.medium"
  associate_public_ip_address          = true
  vpc_security_group_ids               = [module.bastion_sg.security_group_id]
  subnet_id                            = module.vpc.public_subnets[0]

  tags = {
    name         = "${var.env}-eks-automode-bastion-host"
    environment  = var.env
    "created by" = "terraform"
  }
}