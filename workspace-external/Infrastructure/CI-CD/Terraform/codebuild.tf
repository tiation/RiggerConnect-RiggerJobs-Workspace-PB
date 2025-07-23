resource "aws_codebuild_project" "app_build" {
name          = "riggerconnect-build"
description   = "Builds RiggerConnect Android app"
build_timeout = "30"
service_role  = aws_iam_role.codebuild_role.arn

artifacts {
    type = "CODEPIPELINE"
}

environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:3.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
    name  = "ENV"
    value = var.environment
    }
}

source {
    type = "CODEPIPELINE"
    buildspec = "buildspec.yml"
}

logs_config {
    cloudwatch_logs {
    group_name = "riggerconnect-build-logs"
    status     = "ENABLED"
    }
}
}

# IAM role for CodeBuild
resource "aws_iam_role" "codebuild_role" {
name = "riggerconnect-codebuild-role"

assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
    {
        Effect = "Allow"
        Principal = {
        Service = "codebuild.amazonaws.com"
        }
        Action = "sts:AssumeRole"
    }
    ]
})
}

