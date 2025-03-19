module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.31"

  cluster_name    = "${var.env}-eks-automode-cluster"
  cluster_version = "1.32"

  # Network Configuration
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = false

  cluster_security_group_id = module.eks_automode_sg.security_group_id


  # Optional: Adds the current caller identity as an administrator via cluster access entry
  enable_cluster_creator_admin_permissions = true

  cluster_compute_config = {
    enabled    = true
    node_pools = ["general-purpose", "system"]
  }

  iam_role_arn =aws_iam_role.cluster.arn
  node_iam_role_name =aws_iam_role.node.name

  tags = {
    Name        = "${var.env}-eks-cluster"
    Environment = var.env
    AutoMode    = "enabled"
    ManagedBy   = "terraform"
  }
}