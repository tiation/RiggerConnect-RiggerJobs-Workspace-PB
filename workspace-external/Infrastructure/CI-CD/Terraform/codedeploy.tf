resource "aws_codedeploy_app" "app_deploy" {
name = "riggerconnect-deploy"
}

resource "aws_codedeploy_deployment_group" "app_deploy_group" {
app_name               = aws_codedeploy_app.app_deploy.name
deployment_group_name  = "riggerconnect-deploy-group"
service_role_arn      = aws_iam_role.codedeploy_role.arn

deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
}

auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
}
}

# IAM role for CodeDeploy
resource "aws_iam_role" "codedeploy_role" {
name = "riggerconnect-codedeploy-role"

assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
    {
        Sid = ""
        Effect = "Allow"
        Principal = {
        Service = "codedeploy.amazonaws.com"
        }
        Action = "sts:AssumeRole"
    }
    ]
})
}

