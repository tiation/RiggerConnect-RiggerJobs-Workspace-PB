#!/bin/bash

# Simple Supabase Connection Test
# Run this after setting up your configuration

echo "🧪 Testing Supabase Connection"
echo "=============================="

# Check if config file exists
CONFIG_FILE="Shared/SupabaseConfig.swift"
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration file not found: $CONFIG_FILE"
    exit 1
fi

# Extract URL and key from config file
SUPABASE_URL=$(grep 'static let url' "$CONFIG_FILE" | sed 's/.*= *"\([^"]*\)".*/\1/')
SUPABASE_KEY=$(grep 'static let anonKey' "$CONFIG_FILE" | sed 's/.*= *"\([^"]*\)".*/\1/')

# Check if values are still placeholders
if [[ "$SUPABASE_URL" == *"YOUR_SUPABASE"* ]] || [[ "$SUPABASE_KEY" == *"YOUR_SUPABASE"* ]]; then
    echo "❌ Configuration not completed. Please update $CONFIG_FILE with your Supabase credentials."
    echo ""
    echo "You need to:"
    echo "1. Create a Supabase project at https://supabase.com"
    echo "2. Get your project URL and anon key from Settings > API"
    echo "3. Update the values in $CONFIG_FILE"
    echo ""
    echo "Or run: ./setup-supabase.sh"
    exit 1
fi

echo "🔗 Testing connection to: $SUPABASE_URL"
echo ""

# Test basic connectivity
echo "1. Testing basic connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    "$SUPABASE_URL/rest/v1/")

if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ Basic connectivity: SUCCESS"
else
    echo "❌ Basic connectivity: FAILED (HTTP $HTTP_STATUS)"
    echo "   Check your URL and API key"
    exit 1
fi

# Test specific tables
echo ""
echo "2. Testing database tables..."

tables=("workers" "employers" "job_listings" "job_applications")
for table in "${tables[@]}"; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/$table?select=count")
    
    if [[ "$HTTP_STATUS" == "200" ]]; then
        echo "✅ Table '$table': EXISTS"
    else
        echo "❌ Table '$table': NOT FOUND (HTTP $HTTP_STATUS)"
        echo "   Run database-schema.sql in your Supabase SQL Editor"
    fi
done

# Test authentication endpoint
echo ""
echo "3. Testing authentication..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "apikey: $SUPABASE_KEY" \
    "$SUPABASE_URL/auth/v1/settings")

if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ Authentication endpoint: ACCESSIBLE"
else
    echo "❌ Authentication endpoint: FAILED (HTTP $HTTP_STATUS)"
fi

# Test storage (if buckets exist)
echo ""
echo "4. Testing storage..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    "$SUPABASE_URL/storage/v1/bucket")

if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ Storage endpoint: ACCESSIBLE"
else
    echo "⚠️  Storage endpoint: Limited access (expected for anon key)"
fi

echo ""
echo "🎉 Connection test completed!"
echo ""
echo "Next steps:"
echo "1. Open Xcode project"
echo "2. Build and run RiggerHubApp"
echo "3. Try creating a user account"
echo "4. Check Supabase dashboard for new user"
echo ""
echo "Useful links:"
echo "• Dashboard: $SUPABASE_URL/project/default"
echo "• Table Editor: $SUPABASE_URL/project/default/editor"
echo "• Authentication: $SUPABASE_URL/project/default/auth/users"
