# IAM role for CodePipeline
resource "aws_iam_role" "pipeline_role" {
name = "riggerconnect-pipeline-role"

assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
    {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
        Service = "codepipeline.amazonaws.com"
        }
    }
    ]
})
}

# IAM policy for pipeline role
resource "aws_iam_role_policy" "pipeline_policy" {
name = "riggerconnect-pipeline-policy"
role = aws_iam_role.pipeline_role.id

policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
    {
        Effect = "Allow"
        Action = [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObject"
        ]
        Resource = [
        aws_s3_bucket.ci_cd_artifacts.arn,
        "${aws_s3_bucket.ci_cd_artifacts.arn}/*"
        ]
    },
    {
        Effect = "Allow"
        Action = [
        "codecommit:CancelUploadArchive",
        "codecommit:GetBranch",
        "codecommit:GetCommit",
        "codecommit:GetUploadArchiveStatus",
        "codecommit:UploadArchive"
        ]
        Resource = "*"
    },
    {
        Effect = "Allow"
        Action = [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
        ]
        Resource = "*"
    }
    ]
})
}

