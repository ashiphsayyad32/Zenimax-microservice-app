env = "dev"
region = "us-east-1"
cidr = "10.0.0.0/16"
azs = ["us-east-1a", "us-east-1b", "us-east-1c"]
private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
public_subnets = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
enable_nat_gateway = true
single_nat_gateway = true
map_public_ip_on_launch = false
public_inbound_acl_rules = [{ "cidr_block" : "0.0.0.0/0", "from_port" : 80, "protocol" : "tcp", "rule_action" : "allow", "rule_number" : 100, "to_port" : 80 }]

public_outbound_acl_rules = [{ "cidr_block" : "0.0.0.0/0", "from_port" : 80, "protocol" : "tcp", "rule_action" : "allow", "rule_number" : 101, "to_port" : 80 }]

private_inbound_acl_rules = [{ "cidr_block" : "0.0.0.0/0", "from_port" : 80, "protocol" : "tcp", "rule_action" : "allow", "rule_number" : 102, "to_port" : 80 }]

private_outbound_acl_rules = [{ "cidr_block" : "0.0.0.0/0", "from_port" : 80, "protocol" : "tcp", "rule_action" : "allow", "rule_number" : 103, "to_port" : 80 }]

ami = "ami-0e1bed4f06a3b463d"