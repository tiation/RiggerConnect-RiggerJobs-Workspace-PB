# Database Solution: Supabase for Rigging Platform

## Why Supabase?

Based on your preference for open-source solutions and considering your existing VPS infrastructure at supabase.sxc.codes, Supabase is the recommended database solution for the rigging platform.

### Key Benefits:

1. **Open Source**: Supabase is completely open-source and can be self-hosted
2. **PostgreSQL Foundation**: Built on PostgreSQL, providing ACID compliance and robust data integrity
3. **Built-in Authentication**: Integrated user management with role-based access control
4. **Real-time Features**: WebSocket connections for live updates (job postings, messages)
5. **API Generation**: Automatic REST and GraphQL APIs from your database schema
6. **File Storage**: Built-in file storage for profile images, documents, certificates
7. **Edge Functions**: Serverless functions for custom business logic

## Database Architecture

### Core Tables Structure for PostgreSQL/Supabase:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    profile_image_url TEXT,
    role TEXT CHECK (role IN ('rigger', 'client', 'admin')) NOT NULL,
    status TEXT CHECK (status IN ('active', 'suspended', 'pending_verification')) DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Rigger profiles
CREATE TABLE public.rigger_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    years_experience INTEGER NOT NULL,
    hourly_rate DECIMAL(10,2),
    daily_rate DECIMAL(10,2),
    bio TEXT,
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL,
    location_country TEXT DEFAULT 'USA',
    travel_radius_miles INTEGER DEFAULT 50,
    availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'unavailable')) DEFAULT 'available',
    union_affiliation TEXT,
    insurance_verified BOOLEAN DEFAULT FALSE,
    background_check_verified BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client profiles
CREATE TABLE public.client_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    company_name TEXT,
    company_type TEXT CHECK (company_type IN ('production_company', 'event_company', 'venue', 'individual', 'other')),
    business_license TEXT,
    insurance_info JSONB,
    billing_address JSONB NOT NULL,
    payment_method_verified BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_jobs_posted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Integration with Your Infrastructure

### Self-Hosted Setup on supabase.sxc.codes (93.127.167.157)

Your existing Supabase VPS can host the complete stack:
- PostgreSQL database
- Supabase API server
- Authentication services
- Real-time engine
- Storage backend

### Development Workflow:
1. **Local Development**: Use Supabase CLI for local development
2. **Staging**: Deploy to your supabase.sxc.codes instance
3. **CI/CD**: Integrate with your GitLab instance at gitlab.sxc.codes
4. **Monitoring**: Connect to Grafana at grafana.sxc.codes for database monitoring

## Security Considerations

### Row Level Security (RLS) Policies:
```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rigger_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Example policy: Riggers can only update their own profile
CREATE POLICY "Riggers can update own profile" ON public.rigger_profiles
    FOR UPDATE USING (auth.uid() = user_id);
```

## Performance Optimizations

### Recommended Indexes:
```sql
-- User lookup indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Location-based searches for riggers
CREATE INDEX idx_rigger_location ON public.rigger_profiles(location_city, location_state);
CREATE INDEX idx_rigger_availability ON public.rigger_profiles(availability_status);

-- Job posting searches
CREATE INDEX idx_job_postings_location ON public.job_postings(location_city, location_state);
CREATE INDEX idx_job_postings_status ON public.job_postings(status);
CREATE INDEX idx_job_postings_dates ON public.job_postings(start_date, end_date);
```

## Migration Strategy

1. **Phase 1**: Set up core user management and authentication
2. **Phase 2**: Implement rigger and client profiles
3. **Phase 3**: Add job posting and application functionality
4. **Phase 4**: Integrate booking and payment systems
5. **Phase 5**: Add advanced features (messaging, reviews, analytics)

## Backup and Recovery

- Automated daily backups to your backup infrastructure
- Point-in-time recovery capabilities
- Cross-VPS replication for high availability
- Integration with your existing monitoring at grafana.sxc.codes

This solution aligns with your open-source preferences while leveraging your existing infrastructure for a robust, scalable rigging platform.
