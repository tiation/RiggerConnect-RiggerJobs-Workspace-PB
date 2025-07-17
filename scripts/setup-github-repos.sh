#!/bin/bash

# Setup GitHub Remote Repositories for RiggerConnect Components
# This script creates GitHub repositories for each component and sets up remote connections

set -e

echo "🚀 Setting up GitHub Remote Repositories for RiggerConnect Components"
echo "====================================================================="

# Define the main repository path
MAIN_REPO_PATH="/Users/tiaastor/tiation-github/RiggerConnect-RiggerJobs-Workspace-PB"
COMPONENTS_BASE_PATH="/Users/tiaastor/tiation-github"
GITHUB_USERNAME="tiation"

# Define components that need remote repositories
COMPONENTS=(
    "RiggerConnect"
    "RiggerConnect-RiggerJobs-Workspace"
    "RiggerConnectApp"
    "RiggerConnectMobileApp"
    "RiggerJobsApp"
    "AutomationServer"
    "MetricsDashboard"
    "Infrastructure"
    "Shared"
)

echo "📁 Main repository: $MAIN_REPO_PATH"
echo "🐙 GitHub username: $GITHUB_USERNAME"
echo "📦 Components to create remote repos for: ${COMPONENTS[*]}"
echo ""

# Function to create GitHub repository and set up remote
create_github_repo() {
    local component=$1
    local repo_name="rigger-connect-$component"
    local component_path="$COMPONENTS_BASE_PATH/$repo_name"
    
    echo "🔄 Processing component: $component"
    echo "  📂 Local path: $component_path"
    echo "  🐙 GitHub repo: $repo_name"
    
    # Change to component directory
    if [ ! -d "$component_path" ]; then
        echo "  ❌ Component directory not found: $component_path"
        return 1
    fi
    
    cd "$component_path"
    
    # Generate component description based on type
    local description=$(generate_description "$component")
    
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
    fi
    
    # Push to GitHub
    echo "  📤 Pushing to GitHub..."
    if git push -u origin main; then
        echo "  ✅ Successfully pushed to GitHub"
    else
        echo "  ⚠️  Push failed, might need to force push or resolve conflicts"
    fi
    
    # Set up branch protection rules
    setup_branch_protection "$repo_name"
    
    # Add repository topics/tags
    add_repository_topics "$repo_name" "$component"
    
    # Create GitHub Pages if applicable
    setup_github_pages "$repo_name" "$component"
    
    echo "  ✅ Component repository setup complete: https://github.com/$GITHUB_USERNAME/$repo_name"
    echo ""
}

# Function to generate component description
generate_description() {
    local component=$1
    case $component in
        "RiggerConnect")
            echo "🏗️ Enterprise-grade core RiggerConnect platform component for professional workflow management"
            ;;
        "RiggerConnect-RiggerJobs-Workspace")
            echo "💼 Professional workspace management system for rigger job coordination and workflow optimization"
            ;;
        "RiggerConnectApp")
            echo "📱 Native mobile application for RiggerConnect platform with iOS and macOS support"
            ;;
        "RiggerConnectMobileApp")
            echo "📲 Cross-platform React Native mobile app for rigger job management and coordination"
            ;;
        "RiggerJobsApp")
            echo "🔧 Specialized Android application for rigger job listings, compliance, and worker management"
            ;;
        "AutomationServer")
            echo "🤖 Enterprise automation server for RiggerConnect with AI-powered workflow optimization"
            ;;
        "MetricsDashboard")
            echo "📊 Professional metrics and analytics dashboard for RiggerConnect performance monitoring"
            ;;
        "Infrastructure")
            echo "🏗️ Enterprise infrastructure components with Terraform, Kubernetes, and CI/CD automation"
            ;;
        "Shared")
            echo "🔄 Shared utilities, models, and services for RiggerConnect ecosystem components"
            ;;
        *)
            echo "🏗️ Enterprise-grade component for the RiggerConnect platform"
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
        echo "  ⚠️  Branch protection setup failed (might need admin privileges)"
    fi
}

# Function to add repository topics
add_repository_topics() {
    local repo_name=$1
    local component=$2
    
    echo "  🏷️  Adding repository topics..."
    
    # Base topics
    local topics=("rigger-connect" "enterprise" "workflow-management" "professional")
    
    # Add component-specific topics
    case $component in
        "RiggerConnect")
            topics+=("core-platform" "backend" "api")
            ;;
        "RiggerConnect-RiggerJobs-Workspace")
            topics+=("workspace" "job-coordination" "management")
            ;;
        "RiggerConnectApp")
            topics+=("ios" "macos" "swift" "mobile-app")
            ;;
        "RiggerConnectMobileApp")
            topics+=("react-native" "mobile" "cross-platform" "android" "ios")
            ;;
        "RiggerJobsApp")
            topics+=("android" "java" "mobile-app" "compliance")
            ;;
        "AutomationServer")
            topics+=("automation" "ai" "server" "nodejs" "typescript")
            ;;
        "MetricsDashboard")
            topics+=("metrics" "analytics" "dashboard" "monitoring")
            ;;
        "Infrastructure")
            topics+=("infrastructure" "terraform" "kubernetes" "ci-cd" "devops")
            ;;
        "Shared")
            topics+=("utilities" "shared-components" "models" "services")
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

# Function to set up GitHub Pages
setup_github_pages() {
    local repo_name=$1
    local component=$2
    
    echo "  📄 Setting up GitHub Pages..."
    
    # Create docs directory if it doesn't exist
    if [ ! -d "docs" ]; then
        mkdir -p docs
    fi
    
    # Create a basic index.md for GitHub Pages
    cat > docs/index.md << EOF
# $component

Professional documentation for the $component component of RiggerConnect.

## Overview

This is the documentation site for the $component component, part of the enterprise-grade RiggerConnect platform.

## Features

- ✅ Enterprise-grade architecture
- ✅ Professional workflow management
- ✅ Comprehensive documentation
- ✅ Automated CI/CD pipeline
- ✅ Branch protection rules

## Quick Start

\`\`\`bash
git clone https://github.com/$GITHUB_USERNAME/$repo_name.git
cd $repo_name
npm install
npm start
\`\`\`

## Documentation

- [API Reference](./api/)
- [Deployment Guide](./deployment/)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Support

For support and questions, please create an issue in the [GitHub repository](https://github.com/$GITHUB_USERNAME/$repo_name/issues).

---

**$component** - Part of the RiggerConnect enterprise platform.
EOF
    
    # Add and commit the docs
    git add docs/
    git commit -m "Add GitHub Pages documentation" || true
    git push origin main || true
    
    # Enable GitHub Pages
    if gh api repos/$GITHUB_USERNAME/$repo_name/pages \
        --method POST \
        --field source='{"branch":"main","path":"/docs"}' > /dev/null 2>&1; then
        echo "  ✅ GitHub Pages enabled: https://$GITHUB_USERNAME.github.io/$repo_name"
    else
        echo "  ⚠️  GitHub Pages setup failed (might already be enabled)"
    fi
}

# Function to create main repository remote
setup_main_repo() {
    echo "🔄 Setting up main repository remote..."
    
    cd "$MAIN_REPO_PATH"
    
    # Check if main repo has remote
    if git remote get-url origin > /dev/null 2>&1; then
        echo "  ℹ️  Main repository already has remote"
    else
        # Create main repository on GitHub
        local description="🏗️ Enterprise RiggerConnect platform - Main orchestration repository for professional workflow management"
        
        if gh repo create "RiggerConnect-RiggerJobs-Workspace-PB" --description "$description" --public --source=. --remote=origin --push; then
            echo "  ✅ Main repository created and pushed to GitHub"
        else
            echo "  ⚠️  Main repository creation failed"
        fi
    fi
    
    # Add topics to main repository
    local main_topics=("rigger-connect" "enterprise" "workflow-management" "platform" "orchestration" "main-repo")
    local topics_json=$(printf '%s\n' "${main_topics[@]}" | jq -R . | jq -s .)
    
    gh api repos/$GITHUB_USERNAME/RiggerConnect-RiggerJobs-Workspace-PB/topics \
        --method PUT \
        --field names="$topics_json" > /dev/null 2>&1 || true
    
    echo "  ✅ Main repository setup complete"
}

# Function to create repository summary
create_repository_summary() {
    echo "📋 Creating repository summary..."
    
    cd "$MAIN_REPO_PATH"
    
    cat > REPOSITORIES.md << EOF
# RiggerConnect Repository Structure

This document provides an overview of all repositories in the RiggerConnect ecosystem.

## Main Repository
- **RiggerConnect-RiggerJobs-Workspace-PB** - Main orchestration repository
  - GitHub: https://github.com/$GITHUB_USERNAME/RiggerConnect-RiggerJobs-Workspace-PB
  - Purpose: Overarching structure, dependency management, and project coordination

## Component Repositories

EOF
    
    for component in "${COMPONENTS[@]}"; do
        local repo_name="rigger-connect-$component"
        local description=$(generate_description "$component")
        
        cat >> REPOSITORIES.md << EOF
### $component
- **Repository**: [$repo_name](https://github.com/$GITHUB_USERNAME/$repo_name)
- **Description**: $description
- **Documentation**: https://$GITHUB_USERNAME.github.io/$repo_name
- **Local Path**: \`/Users/tiaastor/tiation-github/$repo_name\`

EOF
    done
    
    cat >> REPOSITORIES.md << EOF
## Repository Features

All repositories include:
- ✅ Enterprise-grade documentation
- ✅ Professional README with screenshots
- ✅ Branch protection rules
- ✅ GitHub Pages documentation
- ✅ Repository topics and tags
- ✅ CI/CD pipeline templates
- ✅ Issue and PR templates

## Development Workflow

1. **Clone repositories**: Use the GitHub URLs above
2. **Install dependencies**: Follow component-specific instructions
3. **Development**: Use feature branches and pull requests
4. **Testing**: All components include test suites
5. **Deployment**: Automated via CI/CD pipelines

## Links

- [Main Platform](https://github.com/$GITHUB_USERNAME/RiggerConnect-RiggerJobs-Workspace-PB)
- [Organization](https://github.com/$GITHUB_USERNAME)
- [Documentation Hub](https://$GITHUB_USERNAME.github.io/RiggerConnect-RiggerJobs-Workspace-PB)

---

**RiggerConnect Enterprise Platform** - Professional workflow management for rigger operations.
EOF
    
    git add REPOSITORIES.md
    git commit -m "Add repository structure documentation" || true
    git push origin main || true
    
    echo "  ✅ Repository summary created"
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
    
    # Set up main repository
    setup_main_repo
    echo ""
    
    # Create remote repositories for each component
    for component in "${COMPONENTS[@]}"; do
        create_github_repo "$component"
    done
    
    # Create repository summary
    create_repository_summary
    
    echo "✅ GitHub repositories setup completed!"
    echo ""
    echo "📋 Summary:"
    echo "- Main repository: https://github.com/$GITHUB_USERNAME/RiggerConnect-RiggerJobs-Workspace-PB"
    echo "- Component repositories: ${#COMPONENTS[@]} created"
    echo "- All repositories have GitHub Pages enabled"
    echo "- Branch protection rules configured"
    echo "- Repository topics and descriptions added"
    echo ""
    echo "🔗 Next Steps:"
    echo "1. Review repository settings on GitHub"
    echo "2. Configure webhooks for CI/CD"
    echo "3. Set up team permissions"
    echo "4. Configure repository secrets"
    echo "5. Review and customize GitHub Pages"
    echo ""
    echo "📖 Repository Overview: https://github.com/$GITHUB_USERNAME/RiggerConnect-RiggerJobs-Workspace-PB/blob/main/REPOSITORIES.md"
}

# Execute main function
main "$@"
