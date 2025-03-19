variable "env" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
}

variable "private_subnets" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
}

variable "public_subnets" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway"
  type        = bool
}

variable "single_nat_gateway" {
  description = "Use single NAT Gateway"
  type        = bool
}

variable "map_public_ip_on_launch" {
  description = "Auto-assign public IP on launch"
  type        = bool
}

variable "public_inbound_acl_rules" {
  description = "Public subnet inbound ACL rules"
  type        = list(map(string))
}

variable "public_outbound_acl_rules" {
  description = "Public subnet outbound ACL rules"
  type        = list(map(string))
}

variable "private_inbound_acl_rules" {
  description = "Private subnet inbound ACL rules"
  type        = list(map(string))
}

variable "private_outbound_acl_rules" {
  description = "Private subnet outbound ACL rules"
  type        = list(map(string))
}
variable "ami" {
  description = "AMI ID"
  type        = string
}