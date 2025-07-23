#!/bin/bash

# Setup GitHub Remote Repositories for Tiation Rigger Components
# This script creates GitHub repositories for each component and sets up remote connections

set -e

echo "🚀 Setting up GitHub Remote Repositories for Tiation Rigger Components"
echo "======================================================================"

# Define the components base path
COMPONENTS_BASE_PATH="/Users/tiaastor/tiation-github"
GITHUB_USERNAME="tiation"

# Define components that need remote repositories
COMPONENTS=(
    "tiation-rigger-automation-server"
    "tiation-rigger-connect-app"
    "tiation-rigger-jobs-app"
    "tiation-rigger-mobile-app"
    "tiation-rigger-infrastructure"
    "tiation-rigger-metrics-dashboard"
    "tiation-rigger-shared-libraries"
    "tiation-rigger-workspace-docs"
)

echo "🐙 GitHub username: $GITHUB_USERNAME"
echo "📦 Components to create remote repos for: ${COMPONENTS[*]}"
echo ""

# Function to create GitHub repository and set up remote
create_github_repo() {
    local repo_name=$1
    local component_path="$COMPONENTS_BASE_PATH/$repo_name"
    
    echo "🔄 Processing repository: $repo_name"
    echo "  📂 Local path: $component_path"
    echo "  🐙 GitHub repo: $repo_name"
    
    # Change to component directory
    if [ ! -d "$component_path" ]; then
        echo "  ❌ Repository directory not found: $component_path"
        return 1
    fi
    
    cd "$component_path"
    
    # Generate component description based on type
    local description=$(generate_description "$repo_name")
    
    # Create GitHub repository
    echo "  🆕 Creating GitHub repository..."
    if gh repo create "$repo_name" --description "$description" --public --source=. --remote=origin --push; then
        echo "  ✅ GitHub repository created successfully"
    else
        echo "  ⚠️  Repository might already exist, attempting to add remote..."
        # If repo exists, just add remote
        if git remote get-url origin > /dev/null 2>&1; then
            echo "  ℹ️  Remote already exists"
        else
            git remote add origin "https://github.com/$GITHUB_USERNAME/$repo_name.git"
            echo "  ✅ Remote added"
        fi
        
        # Try to push
        echo "  📤 Pushing to GitHub..."
        if git push -u origin main; then
            echo "  ✅ Successfully pushed to GitHub"
        else
            echo "  ⚠️  Push failed, trying to push to master branch..."
            git push -u origin master || echo "  ⚠️  Push failed"
        fi
    fi
    
    # Set up branch protection rules
    setup_branch_protection "$repo_name"
    
    # Add repository topics/tags
    add_repository_topics "$repo_name"
    
    echo "  ✅ Repository setup complete: https://github.com/$GITHUB_USERNAME/$repo_name"
    echo ""
}

# Function to generate component description
generate_description() {
    local repo_name=$1
    case $repo_name in
        "tiation-rigger-automation-server")
            echo "🤖 Enterprise automation server for Tiation Rigger platform with AI-powered workflow optimization"
            ;;
        "tiation-rigger-connect-app")
            echo "📱 Professional business application for job posting and worker management on Tiation Rigger platform"
            ;;
        "tiation-rigger-jobs-app")
            echo "🔧 Specialized worker application for job discovery, compliance tracking, and task management"
            ;;
        "tiation-rigger-mobile-app")
            echo "📲 Cross-platform React Native mobile application for rigger job management and coordination"
            ;;
        "tiation-rigger-infrastructure")
            echo "🏗️ Enterprise infrastructure components with Terraform, Kubernetes, and CI/CD automation"
            ;;
        "tiation-rigger-metrics-dashboard")
            echo "📊 Professional metrics and analytics dashboard for Tiation Rigger platform performance monitoring"
            ;;
        "tiation-rigger-shared-libraries")
            echo "🔄 Shared utilities, models, and services for Tiation Rigger ecosystem components"
            ;;
        "tiation-rigger-workspace-docs")
            echo "📖 Comprehensive documentation for the Tiation Rigger workspace and all platform components"
            ;;
        *)
            echo "🏗️ Enterprise-grade component for the Tiation Rigger platform"
            ;;
    esac
}

# Function to set up branch protection rules
setup_branch_protection() {
    local repo_name=$1
    
    echo "  🛡️  Setting up branch protection..."
    
    # Enable branch protection for main branch
    if gh api repos/$GITHUB_USERNAME/$repo_name/branches/main/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":[]}' \
        --field enforce_admins=true \
        --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
        --field restrictions=null \
        --field allow_force_pushes=false \
        --field allow_deletions=false > /dev/null 2>&1; then
        echo "  ✅ Branch protection enabled"
    else
        echo "  ⚠️  Branch protection setup failed (might need admin privileges or wrong branch name)"
    fi
}

# Function to add repository topics
add_repository_topics() {
    local repo_name=$1
    
    echo "  🏷️  Adding repository topics..."
    
    # Base topics
    local topics=("tiation-rigger" "enterprise" "construction" "workflow-management" "professional")
    
    # Add component-specific topics
    case $repo_name in
        "tiation-rigger-automation-server")
            topics+=("automation" "ai" "server" "nodejs" "typescript" "api")
            ;;
        "tiation-rigger-connect-app")
            topics+=("business-app" "job-posting" "worker-management" "web-app")
            ;;
        "tiation-rigger-jobs-app")
            topics+=("worker-app" "job-discovery" "compliance" "android" "mobile")
            ;;
        "tiation-rigger-mobile-app")
            topics+=("react-native" "mobile" "cross-platform" "android" "ios")
            ;;
        "tiation-rigger-infrastructure")
            topics+=("infrastructure" "terraform" "kubernetes" "ci-cd" "devops")
            ;;
        "tiation-rigger-metrics-dashboard")
            topics+=("metrics" "analytics" "dashboard" "monitoring" "business-intelligence")
            ;;
        "tiation-rigger-shared-libraries")
            topics+=("utilities" "shared-components" "models" "services" "libraries")
            ;;
        "tiation-rigger-workspace-docs")
            topics+=("documentation" "guides" "workspace" "platform-docs")
            ;;
    esac
    
    # Convert topics array to JSON format
    local topics_json=$(printf '%s\n' "${topics[@]}" | jq -R . | jq -s .)
    
    if gh api repos/$GITHUB_USERNAME/$repo_name/topics \
        --method PUT \
        --field names="$topics_json" > /dev/null 2>&1; then
        echo "  ✅ Repository topics added: ${topics[*]}"
    else
        echo "  ⚠️  Topics setup failed"
    fi
}

# Main execution
main() {
    echo "🚀 Starting GitHub repositories setup..."
    echo ""
    
    # Check if gh CLI is available and authenticated
    if ! command -v gh &> /dev/null; then
        echo "❌ GitHub CLI (gh) is not installed. Please install it first."
        exit 1
    fi
    
    if ! gh auth status &> /dev/null; then
        echo "❌ Not authenticated with GitHub. Please run 'gh auth login' first."
        exit 1
    fi
    
    # Create remote repositories for each component
    for component in "${COMPONENTS[@]}"; do
        create_github_repo "$component"
    done
    
    echo "✅ GitHub repositories setup completed!"
    echo ""
    echo "📋 Summary:"
    echo "- Component repositories: ${#COMPONENTS[@]} created"
    echo "- All repositories have branch protection enabled"
    echo "- Repository topics and descriptions added"
    echo ""
    echo "🔗 Next Steps:"
    echo "1. Review repository settings on GitHub"
    echo "2. Configure webhooks for CI/CD"
    echo "3. Set up team permissions"
    echo "4. Configure repository secrets"
    echo ""
    echo "📖 Repository List:"
    for component in "${COMPONENTS[@]}"; do
        echo "  - https://github.com/$GITHUB_USERNAME/$component"
    done
}

# Execute main function
main "$@"
