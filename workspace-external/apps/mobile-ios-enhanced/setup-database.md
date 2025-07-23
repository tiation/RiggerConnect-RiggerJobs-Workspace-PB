# 🗄️ Database Setup Instructions

Your Supabase connection is working, but you need to set up the database tables. Follow these steps:

## 🚀 Quick Setup

1. **Open your Supabase Dashboard**:
   ```
   https://ekerxpltgkxerpxsuowm.supabase.co/project/default
   ```

2. **Go to SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Or go directly to: https://ekerxpltgkxerpxsuowm.supabase.co/project/default/sql

3. **Apply the Database Schema**:
   - Copy the entire contents of `database-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)

4. **Verify Tables Were Created**:
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `workers`
     - `employers` 
     - `job_listings`
     - `job_applications`
     - `skills`
     - `certifications`
     - `work_experience`
     - `ratings`
     - `messages`

## 🧪 Test the Setup

After applying the schema, run:
```bash
./test-connection.sh
```

You should see all tables showing as "EXISTS" instead of "NOT FOUND".

## 📊 Optional: Add Sample Data

If you want to test with sample data:

1. Go back to the SQL Editor
2. Copy and paste this sample data:

```sql
-- Sample employers
INSERT INTO employers (company_name, contact_name, email, phone_number, industry, location) VALUES
('Mining Corp Australia', 'John Smith', 'john@miningcorp.com.au', '+61400000001', 'Mining', '{"city": "Perth", "state": "WA", "country": "Australia", "latitude": -31.9505, "longitude": 115.8605}'),
('Construction Plus', 'Sarah Johnson', 'sarah@constructionplus.com.au', '+61400000002', 'Construction', '{"city": "Sydney", "state": "NSW", "country": "Australia", "latitude": -33.8688, "longitude": 151.2093}');

-- Sample job listings (you'll need to get employer IDs first)
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
);
```

3. Run the sample data SQL

## 🎯 Next Steps

Once your database is set up:

1. **Build the iOS App**:
   ```bash
   # Open in Xcode
   open RiggerHireApp.xcodeproj
   ```

2. **Test Authentication**:
   - Build and run RiggerHubApp
   - Try creating a new user account
   - Check your Supabase dashboard → Authentication → Users

3. **Test Job Search**:
   - If you added sample data, you should see jobs in the app
   - Try searching and filtering

## 🚨 Common Issues

### "Permission denied" errors
- Make sure Row Level Security policies are applied (included in schema)
- Check that you're using the correct anon key

### Tables not appearing
- Refresh the Table Editor page
- Check for SQL errors in the execution log

### Authentication not working
- Verify your Supabase URL and anon key are correct
- Check that auth is enabled in your project settings

## 📞 Need Help?

If you encounter issues:
1. Check the Supabase logs: Dashboard → Logs
2. Run `./test-connection.sh` to verify connectivity
3. Check the iOS app logs in Xcode console

Your Supabase credentials are already configured correctly:
- URL: `https://ekerxpltgkxerpxsuowm.supabase.co`
- Key: `eyJhbG...` (anon key is working)

The only missing step is applying the database schema!
