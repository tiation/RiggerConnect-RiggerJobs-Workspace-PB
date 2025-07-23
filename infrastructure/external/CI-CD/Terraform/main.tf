provider "aws" {
region = "us-east-1"
}

resource "aws_s3_bucket" "ci_cd_artifacts" {
bucket = "riggerconnect-ci-cd-artifacts"
acl    = "private"
}

resource "aws_codepipeline" "app_pipeline" {
name = "RiggerConnectPipeline"

artifact_store {
    location = aws_s3_bucket.ci_cd_artifacts.bucket
    type     = "S3"
}

role_arn = aws_iam_role.pipeline_role.arn

stage {
    name = "Source"

    action {
    name             = "Source"
    category         = "Source"
    owner           = "AWS"
    provider         = "CodeCommit"
    version          = "1"
    configuration    = {
        RepositoryName = "RiggerConnect"
        BranchName     = "main"
    }
    output_artifacts = ["source_output"]
    }
}

stage {
    name = "Build"

    action {
    name             = "Build"
    category         = "Build"
    owner           = "AWS"
    provider        = "CodeBuild"
    version         = "1"
    input_artifacts = ["source_output"]
    output_artifacts = ["build_output"]
    configuration   = {
        ProjectName = aws_codebuild_project.app_build.name
    }
    }
}

stage {
    name = "Deploy"

    action {
    name            = "Deploy"
    category        = "Deploy"
    owner           = "AWS"
    provider        = "CodeDeploy"
    version         = "1"
    input_artifacts = ["build_output"]
    configuration  = {
        ApplicationName = aws_codedeploy_app.app_deploy.name
        DeploymentGroupName = aws_codedeploy_deployment_group.app_deploy_group.name
    }
    }
}
}

# VPC Configuration
resource "aws_vpc" "main" {
cidr_block           = var.vpc_cidr
enable_dns_hostnames = true
enable_dns_support   = true

tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
}
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
name = "${var.environment}-cluster"

setting {
    name  = "containerInsights"
    value = "enabled"
}
}

# RDS Instance
resource "aws_db_instance" "main" {
identifier           = "${var.environment}-db"
allocated_storage    = 20
storage_type        = "gp2"
engine              = "postgres"
engine_version      = "13.7"
instance_class      = var.rds_instance_class
multi_az           = var.environment == "prod" ? true : false
skip_final_snapshot = true

tags = {
    Environment = var.environment
}
}

# Auto Scaling Configuration
resource "aws_appautoscaling_target" "ecs_target" {
max_capacity       = var.max_capacity
min_capacity       = var.min_capacity
resource_id        = "service/${aws_ecs_cluster.main.name}/${var.environment}-service"
scalable_dimension = "ecs:service:DesiredCount"
service_namespace  = "ecs"
}

