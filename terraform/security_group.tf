# Security group of EKS
module "eks_automode_sg" {
  source = "terraform-aws-modules/security-group/aws"
  version = "5.1.2"

  name                                 = "${var.env}-eks-automode-sg"
  description                          = "Security group for Database with custom ports open within VPC"
  vpc_id                               = module.vpc.vpc_id

  computed_ingress_with_source_security_group_id = [
      {
        rule                     = "ssh-tcp"
        source_security_group_id = "${module.bastion_sg.security_group_id}"
      },
      {
        rule                   = "https-443-tcp"
        source_security_group_id = "${module.bastion_sg.security_group_id}"
      },
      {
        rule                   = "http-80-tcp"
        source_security_group_id = "${module.bastion_sg.security_group_id}"
      }
  ]
  number_of_computed_ingress_with_source_security_group_id = 3

  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      description = "Allow all outbound traffic"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = {
    name         = "${var.env}-eks-automode-sg"
    environment  = var.env
    "created by" = "terraform"
  }
}

module "bastion_sg" {
  source = "terraform-aws-modules/security-group/aws"
  version = "5.1.2"

  name                                 = "${var.env}-bastion-sg"
  description                          = "Security group for Bastion Host with custom ports open within VPC"
  vpc_id                               = module.vpc.vpc_id

  ingress_with_cidr_blocks             = [
  {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      description = "Allow SSH from VPC"
      cidr_blocks = "0.0.0.0/0"
  }
]

  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      description = "Allow all outbound traffic"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = {
    name         = "${var.env}-bastion-sg"
    environment  = var.env
    "created by" = "terraform"
  }
}