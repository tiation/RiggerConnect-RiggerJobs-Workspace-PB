#!/bin/bash

# Apply Database Schema via Supabase CLI
echo "🗄️  Applying RiggerHub Database Schema"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Extract Supabase details from config
CONFIG_FILE="Shared/SupabaseConfig.swift"
if [[ ! -f "$CONFIG_FILE" ]]; then
    print_error "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

SUPABASE_URL=$(grep 'static let url' "$CONFIG_FILE" | sed 's/.*= *"\([^"]*\)".*/\1/')
SUPABASE_KEY=$(grep 'static let anonKey' "$CONFIG_FILE" | sed 's/.*= *"\([^"]*\)".*/\1/')

# Extract project reference from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

print_status "Project Reference: $PROJECT_REF"
print_status "Supabase URL: $SUPABASE_URL"

# Check if schema file exists
if [[ ! -f "database-schema.sql" ]]; then
    print_error "Database schema file not found: database-schema.sql"
    exit 1
fi

# Apply the schema using curl (since supabase CLI doesn't have direct SQL execution)
print_status "Applying database schema..."

# Create a temporary file with proper headers and SQL
TEMP_SQL=$(mktemp)
cat database-schema.sql > "$TEMP_SQL"

# Use curl to execute the SQL via REST API
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" \
    -X POST \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    -H "Content-Type: application/vnd.pgrst.object+json" \
    -d @"$TEMP_SQL" \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

# Clean up temp file
rm "$TEMP_SQL"

# Since direct SQL execution via REST API isn't straightforward, let's use a different approach
print_status "Using alternative method to apply schema..."

# Create a simple SQL execution function
apply_sql_via_psql() {
    local sql_file="$1"
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client (psql) not found. Installing..."
        
        if command -v brew &> /dev/null; then
            brew install postgresql
        else
            print_error "Please install PostgreSQL client manually"
            return 1
        fi
    fi
    
    print_status "Attempting to connect to Supabase database..."
    
    # Extract connection details
    DB_HOST="$PROJECT_REF.supabase.co"
    DB_PORT="6543"
    DB_NAME="postgres"
    DB_USER="postgres"
    
    print_status "Connection details:"
    print_status "  Host: $DB_HOST"
    print_status "  Port: $DB_PORT"
    print_status "  Database: $DB_NAME"
    print_status "  User: $DB_USER"
    
    echo ""
    print_warning "You'll need your database password (not the anon key!)"
    print_status "Find it in your Supabase Dashboard > Settings > Database > Connection parameters"
    echo ""
    
    # Prompt for database password
    echo -n "Enter your Supabase database password: "
    read -s DB_PASSWORD
    echo ""
    
    if [[ -z "$DB_PASSWORD" ]]; then
        print_error "Password cannot be empty"
        return 1
    fi
    
    print_status "Applying schema to database..."
    
    # Apply the schema
    PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -d "$DB_NAME" \
        -U "$DB_USER" \
        -f "$sql_file" \
        -v ON_ERROR_STOP=1
    
    if [[ $? -eq 0 ]]; then
        print_success "Database schema applied successfully!"
        return 0
    else
        print_error "Failed to apply database schema"
        return 1
    fi
}

# Try the direct psql approach
if apply_sql_via_psql "database-schema.sql"; then
    echo ""
    print_success "🎉 Database setup completed!"
    
    # Test the connection
    print_status "Testing database connection..."
    ./test-connection.sh
    
else
    echo ""
    print_warning "Alternative method: Use Supabase Dashboard"
    print_status "If the CLI method didn't work, you can:"
    print_status "1. Open: $SUPABASE_URL/project/default/sql"
    print_status "2. Copy contents of database-schema.sql"
    print_status "3. Paste and execute in the SQL Editor"
    echo ""
    
    # Ask if user wants to create sample data
    echo -n "Would you like to create a sample data file for manual insertion? (y/n): "
    read CREATE_SAMPLE
    
    if [[ "$CREATE_SAMPLE" =~ ^[Yy]$ ]]; then
        create_sample_data
    fi
fi

create_sample_data() {
    print_status "Creating sample data file..."
    
    cat > sample-data.sql << 'EOF'
-- Sample data for RiggerHub
-- Execute this after the main schema

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
),
(
    (SELECT id FROM employers WHERE company_name = 'Industrial Solutions WA' LIMIT 1),
    'Industrial Rigger - Manufacturing',
    'Industrial rigger needed for heavy machinery installation and maintenance. Experience with overhead cranes preferred.',
    'Full Time',
    'Industrial',
    '{"city": "Perth", "state": "WA", "country": "Australia", "display_location": "Perth Industrial Area, WA"}',
    40.00, 55.00, 'AUD',
    ARRAY['Industrial Rigging', 'Machinery Installation', 'Maintenance'],
    ARRAY['Rigging License', 'Forklift License', 'Safety Induction'],
    'mike@industrialwa.com.au',
    false
);

-- Sample skills
INSERT INTO skills (name, category) VALUES
('Tower Crane Operation', 'Crane Operation'),
('Mobile Crane Operation', 'Crane Operation'),
('Advanced Rigging', 'Rigging'),
('Load Calculations', 'Technical Skills'),
('Safety Management', 'Safety'),
('Team Leadership', 'Soft Skills'),
('Heavy Lifting', 'Rigging'),
('Equipment Maintenance', 'Equipment Operation');
EOF
    
    print_success "Sample data file created: sample-data.sql"
    print_status "You can execute this in your Supabase SQL Editor after applying the main schema"
}
