output "pipeline_url" {
description = "URL of the CodePipeline pipeline"
value       = "https://console.aws.amazon.com/codepipeline/home?region=${var.aws_region}#/view/${aws_codepipeline.app_pipeline.name}"
}

output "artifact_bucket" {
description = "Name of the S3 bucket used to store artifacts"
value       = aws_s3_bucket.ci_cd_artifacts.id
}

output "codebuild_project" {
description = "Name of the CodeBuild project"
value       = aws_codebuild_project.app_build.name
}

output "codedeploy_app" {
description = "Name of the CodeDeploy application"
value       = aws_codedeploy_app.app_deploy.name
}

