#!/bin/bash

# RiggerHub Supabase Setup Script
# This script helps you configure Supabase integration for both apps

echo "🏗️  RiggerHub Supabase Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    if command -v supabase &> /dev/null; then
        print_success "Supabase CLI is installed"
        return 0
    else
        print_warning "Supabase CLI not found. Installing..."
        
        # Install Supabase CLI
        if command -v npm &> /dev/null; then
            npm install -g @supabase/cli
            print_success "Supabase CLI installed via npm"
        elif command -v brew &> /dev/null; then
            brew install supabase
            print_success "Supabase CLI installed via Homebrew"
        else
            print_error "Please install npm or Homebrew first, then run: npm install -g @supabase/cli"
            exit 1
        fi
    fi
}

# Get Supabase project details from user
get_project_details() {
    echo ""
    print_status "Please provide your Supabase project details:"
    echo ""
    
    echo -n "Enter your Supabase Project URL (e.g., https://your-project.supabase.co): "
    read SUPABASE_URL
    
    echo -n "Enter your Supabase Anon Key: "
    read SUPABASE_ANON_KEY
    
    # Validate inputs
    if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
        print_error "Both URL and Anon Key are required!"
        exit 1
    fi
    
    # Remove trailing slash from URL if present
    SUPABASE_URL=${SUPABASE_URL%/}
    
    print_success "Project details captured"
}

# Update configuration file
update_config() {
    print_status "Updating SupabaseConfig.swift..."
    
    CONFIG_FILE="Shared/SupabaseConfig.swift"
    
    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "Configuration file not found at $CONFIG_FILE"
        exit 1
    fi
    
    # Create backup
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
    print_status "Created backup of configuration file"
    
    # Update the configuration
    sed -i '' "s|YOUR_SUPABASE_PROJECT_URL|$SUPABASE_URL|g" "$CONFIG_FILE"
    sed -i '' "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" "$CONFIG_FILE"
    
    print_success "Configuration file updated"
}

# Check if database schema needs to be applied
setup_database() {
    echo ""
    print_status "Database setup options:"
    echo "1. Apply schema from database-schema.sql (recommended for new projects)"
    echo "2. Skip database setup (if already configured)"
    echo -n "Choose option (1 or 2): "
    read DB_OPTION
    
    if [[ "$DB_OPTION" == "1" ]]; then
        print_status "Applying database schema..."
        
        if [[ -f "database-schema.sql" ]]; then
            echo ""
            print_warning "Please follow these steps:"
            echo "1. Open your Supabase dashboard: $SUPABASE_URL/project/default/sql"
            echo "2. Copy the contents of database-schema.sql"
            echo "3. Paste and execute the SQL in the Supabase SQL Editor"
            echo "4. Press Enter here when done..."
            read
            print_success "Database schema should now be applied"
        else
            print_error "database-schema.sql not found!"
            exit 1
        fi
    else
        print_status "Skipping database setup"
    fi
}

# Test connection
test_connection() {
    echo ""
    print_status "Testing connection to Supabase..."
    
    # Simple curl test to check if the endpoint is reachable
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/")
    
    if [[ "$HTTP_STATUS" == "200" ]]; then
        print_success "Connection to Supabase successful!"
    else
        print_warning "Connection test returned HTTP $HTTP_STATUS"
        print_warning "Please verify your URL and API key are correct"
    fi
}

# Create sample data (optional)
create_sample_data() {
    echo ""
    echo -n "Would you like to create sample data for testing? (y/n): "
    read CREATE_SAMPLE
    
    if [[ "$CREATE_SAMPLE" =~ ^[Yy]$ ]]; then
        print_status "Creating sample data file..."
        
        cat > sample-data.sql << EOF
-- Sample data for testing RiggerHub apps
-- Execute this in your Supabase SQL Editor after running the main schema

-- Sample employers
INSERT INTO employers (company_name, contact_name, email, phone_number, industry, location) VALUES
('Mining Corp Australia', 'John Smith', 'john@miningcorp.com.au', '+61400000001', 'Mining', '{"city": "Perth", "state": "WA", "country": "Australia", "latitude": -31.9505, "longitude": 115.8605}'),
('Construction Plus', 'Sarah Johnson', 'sarah@constructionplus.com.au', '+61400000002', 'Construction', '{"city": "Sydney", "state": "NSW", "country": "Australia", "latitude": -33.8688, "longitude": 151.2093}'),
('Industrial Solutions WA', 'Mike Brown', 'mike@industrialwa.com.au', '+61400000003', 'Industrial', '{"city": "Perth", "state": "WA", "country": "Australia", "latitude": -31.9505, "longitude": 115.8605}');

-- Sample job listings
INSERT INTO job_listings (
    employer_id, title, description, job_type, industry, location,
    salary_min, salary_max, salary_currency, required_skills, required_certifications,
    contact_email, is_urgent
) VALUES
(
    (SELECT id FROM employers WHERE company_name = 'Mining Corp Australia' LIMIT 1),
    'Senior Rigger - Mining Operations',
    'Experienced rigger required for mining operations in Western Australia. Must have strong safety record and crane operation experience.',
    'Full Time',
    'Mining',
    '{"city": "Kalgoorlie", "state": "WA", "country": "Australia", "display_location": "Kalgoorlie, WA"}',
    45.00, 65.00, 'AUD',
    ARRAY['Rigging', 'Crane Operation', 'Safety Procedures', 'Heavy Lifting'],
    ARRAY['White Card', 'Rigging License', 'Working at Heights'],
    'john@miningcorp.com.au',
    true
),
(
    (SELECT id FROM employers WHERE company_name = 'Construction Plus' LIMIT 1),
    'Crane Operator - Commercial Construction',
    'Seeking qualified crane operator for high-rise construction project in Sydney CBD. Must have current licenses and minimum 3 years experience.',
    'Contract',
    'Construction',
    '{"city": "Sydney", "state": "NSW", "country": "Australia", "display_location": "Sydney CBD, NSW"}',
    50.00, 70.00, 'AUD',
    ARRAY['Crane Operation', 'Construction Safety', 'Load Calculations'],
    ARRAY['Crane License', 'White Card', 'Construction Induction'],
    'sarah@constructionplus.com.au',
    false
);

-- Sample skills
INSERT INTO skills (name, category) VALUES
('Tower Crane Operation', 'Crane Operation'),
('Mobile Crane Operation', 'Crane Operation'),
('Advanced Rigging', 'Rigging'),
('Load Calculations', 'Technical Skills'),
('Safety Management', 'Safety'),
('Team Leadership', 'Soft Skills');
EOF
        
        print_success "Sample data file created: sample-data.sql"
        print_status "You can execute this in your Supabase SQL Editor to add test data"
    fi
}

# Generate environment file for development
create_env_file() {
    print_status "Creating .env file for development..."
    
    cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Development settings
ENVIRONMENT=development
DEBUG=true
EOF
    
    print_success ".env file created"
    print_warning "Remember to add .env to your .gitignore file!"
}

# Main setup flow
main() {
    echo "This script will help you set up Supabase integration for RiggerHub apps."
    echo ""
    
    # Check prerequisites
    check_supabase_cli
    
    # Get project details
    get_project_details
    
    # Update configuration
    update_config
    
    # Setup database
    setup_database
    
    # Test connection
    test_connection
    
    # Create sample data
    create_sample_data
    
    # Create environment file
    create_env_file
    
    echo ""
    print_success "🎉 Supabase setup complete!"
    echo ""
    print_status "Next steps:"
    echo "1. Open the Xcode project"
    echo "2. Build and run either RiggerHireApp or RiggerHubApp"
    echo "3. Test authentication and basic functionality"
    echo ""
    print_status "Useful links:"
    echo "• Supabase Dashboard: $SUPABASE_URL/project/default"
    echo "• API Documentation: $SUPABASE_URL/project/default/api"
    echo "• Database Tables: $SUPABASE_URL/project/default/editor"
    echo ""
}

# Run main function
main
