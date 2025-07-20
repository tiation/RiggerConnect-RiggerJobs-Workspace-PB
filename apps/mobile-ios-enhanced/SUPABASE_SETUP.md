# 🏗️ Supabase Setup Guide for RiggerHub Apps

This guide will walk you through connecting your RiggerHub apps to Supabase backend.

## 📋 Prerequisites

Before starting, ensure you have:
- [Xcode 15.0+](https://developer.apple.com/xcode/)
- [Supabase account](https://supabase.com) (free tier is fine)
- Basic understanding of iOS development

## 🚀 Quick Setup (Automated)

The fastest way to set up Supabase integration:

```bash
./setup-supabase.sh
```

This script will:
- Install Supabase CLI (if needed)
- Prompt for your project credentials
- Update configuration files
- Test the connection
- Create sample data (optional)

## 🔧 Manual Setup

If you prefer to set up manually or the script doesn't work:

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the details:
   - **Name**: RiggerHub
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users (Australia/Singapore for WA users)
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Your public API key

### Step 3: Update Configuration

1. Open `Shared/SupabaseConfig.swift`
2. Replace the placeholder values:

```swift
static let url = "https://your-project-id.supabase.co"
static let anonKey = "your-anon-key-here"
```

### Step 4: Set Up Database Schema

1. Go to your Supabase dashboard → **SQL Editor**
2. Copy the contents of `database-schema.sql`
3. Paste into the SQL Editor
4. Click **Run** to execute the schema

### Step 5: Configure Row Level Security (RLS)

The schema includes RLS policies, but verify they're enabled:

1. Go to **Authentication** → **Policies**
2. Ensure policies are created for all tables
3. Test with a sample user account

### Step 6: Set Up Storage (Optional)

For profile images and document uploads:

1. Go to **Storage** → **Buckets**
2. The schema creates these buckets:
   - `profile-images` (public)
   - `certification-documents` (private)
   - `company-logos` (public)
3. Configure upload policies as needed

## 🧪 Testing Your Setup

### 1. Connection Test

```bash
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     https://your-project.supabase.co/rest/v1/workers
```

Expected response: `[]` (empty array)

### 2. App Testing

1. Open the Xcode project
2. Build and run **RiggerHubApp**
3. Try to create a new account
4. Check the Supabase dashboard → **Authentication** → **Users**
5. Verify the new user appears

### 3. Database Testing

1. Go to **Table Editor** in Supabase
2. Check that tables were created:
   - `workers`
   - `employers`
   - `job_listings`
   - `job_applications`
   - etc.

## 📊 Sample Data (Optional)

To test with sample data:

1. After setting up the schema, run `sample-data.sql` in the SQL Editor
2. This creates:
   - 3 sample employers
   - 2 sample job listings
   - 6 sample skills

## 🔐 Security Configuration

### Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `com.tiation.riggerhub://`
   - **Redirect URLs**: Add your app's custom URL scheme
   - Enable email confirmations for production

### API Settings

1. Go to **Settings** → **API**
2. Configure CORS if needed for web testing
3. Set up service role key for admin operations (keep secret!)

### RLS Policies

Key policies included in schema:
- Workers can only edit their own profiles
- Employers can only manage their own jobs
- Applications are visible to relevant parties only
- Public can view active job listings

## 🚨 Troubleshooting

### Common Issues

**1. "Authentication failed" error**
- Check your anon key is correct
- Ensure the Supabase URL doesn't have trailing slash
- Verify your project is not paused

**2. "Profile creation failed"**
- Check RLS policies are enabled
- Ensure user is authenticated before creating profile
- Verify table schemas match your models

**3. "Connection timeout"**
- Check internet connection
- Verify Supabase project is running
- Try different network (sometimes corporate networks block Supabase)

**4. "Missing table" errors**
- Ensure database schema was applied completely
- Check for SQL errors in the schema execution
- Verify all tables exist in Table Editor

### Debug Mode

Enable debug logging by updating `SupabaseService.swift`:

```swift
private init() {
    // Add this for debugging
    print("Supabase URL: \(baseURL)")
    print("API Key: \(apiKey.prefix(10))...") // Only show first 10 chars
}
```

### Reset Setup

If you need to start over:

1. Drop all tables in Supabase SQL Editor:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

2. Re-run the schema script
3. Update your configuration again

## 📱 App-Specific Configuration

### RiggerHubApp (Workers)

Main features that need Supabase:
- User registration/login
- Profile management
- Job searching and applications
- Skills and certifications

### RiggerHireApp (Employers)

Main features that need Supabase:
- Company account creation
- Job posting management
- Application review
- Messaging with workers

## 🔄 Environment Management

### Development vs Production

Create separate Supabase projects for:
- **Development**: For testing and development
- **Production**: For live app in App Store

Use different configurations:

```swift
#if DEBUG
static let url = "https://dev-project.supabase.co"
#else
static let url = "https://prod-project.supabase.co"
#endif
```

### Environment Variables

For sensitive data, consider using Xcode build configurations:

1. Create `Config.xcconfig` files for each environment
2. Add Supabase credentials there
3. Reference in Swift code via `Bundle`

## 🎯 Next Steps

After successful setup:

1. **Test Core Features**: Registration, login, profile creation
2. **Add Sample Data**: Use the sample data script for testing
3. **Configure Push Notifications**: Set up with Supabase Edge Functions
4. **Set Up Analytics**: Add usage tracking
5. **Deploy to TestFlight**: Test with real users

## 📞 Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the [troubleshooting section](#-troubleshooting) above
3. Check GitHub Issues for this project
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Your environment details

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Swift Documentation](https://github.com/supabase-community/supabase-swift)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript/introduction)

---

**Need help?** The setup script (`./setup-supabase.sh`) automates most of these steps and includes connection testing.
