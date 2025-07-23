variable "environment" {
description = "Environment (dev/staging/prod)"
type        = string
}

variable "aws_region" {
description = "AWS region"
type        = string
default     = "us-west-2"
}

variable "vpc_cidr" {
description = "CIDR block for VPC"
type        = string
default     = "10.0.0.0/16"
}

variable "instance_type" {
description = "EC2 instance type"
type        = string
default     = "t3.medium"
}

variable "rds_instance_class" {
description = "RDS instance class"
type        = string
default     = "db.t3.medium"
}

variable "min_capacity" {
description = "Minimum number of instances"
type        = number
default     = 2
}

variable "max_capacity" {
description = "Maximum number of instances"
type        = number
default     = 10
}

