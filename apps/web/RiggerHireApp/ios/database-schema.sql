-- RiggerHub Database Schema for Supabase
-- Execute this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE job_type AS ENUM (
    'Full Time',
    'Part Time', 
    'Contract',
    'Temporary',
    'Casual',
    'Emergency'
);

CREATE TYPE industry_type AS ENUM (
    'Mining',
    'Construction',
    'Industrial',
    'Marine & Offshore',
    'Entertainment',
    'Emergency Services',
    'Transport & Logistics'
);

CREATE TYPE experience_level AS ENUM (
    'Entry Level',
    'Junior',
    'Intermediate', 
    'Senior',
    'Expert'
);

CREATE TYPE application_status AS ENUM (
    'Open',
    'Closed',
    'Paused',
    'Filled'
);

CREATE TYPE job_application_status AS ENUM (
    'Pending',
    'Reviewed',
    'Shortlisted',
    'Interview Scheduled',
    'Offered',
    'Accepted',
    'Rejected',
    'Withdrawn'
);

CREATE TYPE availability_type AS ENUM (
    'Full Time',
    'Part Time',
    'Contract',
    'Casual',
    'Emergency Call-out'
);

CREATE TYPE shift_type AS ENUM (
    'Day Shift',
    'Night Shift',
    'Swing Shift',
    'Weekend',
    'On-call'
);

CREATE TYPE skill_category AS ENUM (
    'Rigging',
    'Crane Operation',
    'Safety',
    'Equipment Operation',
    'Technical Skills',
    'Soft Skills'
);

CREATE TYPE proficiency_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
);

-- Create tables

-- Employers table (for RiggerHireApp)
CREATE TABLE employers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    website TEXT,
    company_description TEXT,
    logo_url TEXT,
    industry industry_type NOT NULL DEFAULT 'Construction',
    location JSONB, -- {address, city, state, postal_code, country, latitude, longitude}
    is_verified BOOLEAN DEFAULT false,
    subscription_type TEXT DEFAULT 'basic',
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workers table (for RiggerHubApp)
CREATE TABLE workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    date_of_birth DATE,
    profile_image_url TEXT,
    
    -- Professional Information
    years_of_experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    location JSONB, -- {address, city, state, postal_code, country, latitude, longitude}
    
    -- Availability
    availability JSONB DEFAULT '{"is_available": true, "availability_type": "Full Time", "willing_to_relocate": false, "max_travel_distance": 50}',
    
    -- Profile Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    profile_completeness DECIMAL(3,2) DEFAULT 0.0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_jobs_completed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job listings table
CREATE TABLE job_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    
    -- Basic Info
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    
    -- Job Details
    job_type job_type DEFAULT 'Full Time',
    experience_level experience_level DEFAULT 'Intermediate',
    industry industry_type DEFAULT 'Construction',
    location JSONB, -- {address, city, state, postal_code, country, latitude, longitude, display_location}
    is_remote BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    
    -- Compensation
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency TEXT DEFAULT 'AUD',
    salary_rate_type TEXT DEFAULT 'hourly', -- hourly, daily, weekly, monthly, project
    is_salary_negotiable BOOLEAN DEFAULT false,
    benefits TEXT[] DEFAULT '{}',
    payment_terms TEXT DEFAULT 'Weekly',
    
    -- Skills and Requirements
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    required_certifications TEXT[] DEFAULT '{}',
    equipment_provided TEXT[] DEFAULT '{}',
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    duration TEXT,
    shift_details JSONB DEFAULT '{"shift_type": "Day Shift", "start_time": "07:00", "end_time": "17:00", "total_hours": 40}',
    
    -- Application Info
    application_deadline DATE,
    max_applications INTEGER,
    current_applications INTEGER DEFAULT 0,
    application_status application_status DEFAULT 'Open',
    
    -- Contact Info
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    
    -- Metadata
    posted_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_salary_range CHECK (salary_min <= salary_max OR salary_min IS NULL OR salary_max IS NULL)
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    
    -- Application Details
    cover_letter TEXT,
    proposed_rate DECIMAL(8,2),
    availability_note TEXT,
    
    -- Status and Tracking
    status job_application_status DEFAULT 'Pending',
    application_date TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    -- Notes
    employer_notes TEXT,
    worker_notes TEXT,
    
    -- Make sure a worker can only apply once per job
    UNIQUE(job_id, worker_id)
);

-- Skills table
CREATE TABLE skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category skill_category DEFAULT 'Technical Skills',
    proficiency_level proficiency_level DEFAULT 'Intermediate',
    years_of_experience INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications table  
CREATE TABLE certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    certificate_number TEXT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work experience table
CREATE TABLE work_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current_position BOOLEAN DEFAULT false,
    location TEXT,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings and reviews table
CREATE TABLE ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('worker', 'employer')),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile-images', 'profile-images', true),
    ('certification-documents', 'certification-documents', false),
    ('company-logos', 'company-logos', true);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Employers policies
CREATE POLICY "Employers can view their own profile" ON employers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile" ON employers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Workers policies  
CREATE POLICY "Workers can view their own profile" ON workers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert their own profile" ON workers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active worker profiles" ON workers
    FOR SELECT USING (is_active = true);

-- Job listings policies
CREATE POLICY "Anyone can view active job listings" ON job_listings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Employers can manage their own job listings" ON job_listings
    FOR ALL USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

-- Job applications policies
CREATE POLICY "Workers can view their own applications" ON job_applications
    FOR SELECT USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

CREATE POLICY "Workers can create applications" ON job_applications
    FOR INSERT WITH CHECK (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can view applications for their jobs" ON job_applications
    FOR SELECT USING (job_id IN (SELECT id FROM job_listings WHERE employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())));

CREATE POLICY "Employers can update applications for their jobs" ON job_applications
    FOR UPDATE USING (job_id IN (SELECT id FROM job_listings WHERE employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())));

-- Skills policies
CREATE POLICY "Workers can manage their own skills" ON skills
    FOR ALL USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

CREATE POLICY "Public can view skills" ON skills
    FOR SELECT USING (true);

-- Certifications policies
CREATE POLICY "Workers can manage their own certifications" ON certifications
    FOR ALL USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

CREATE POLICY "Public can view certifications" ON certifications
    FOR SELECT USING (true);

-- Work experience policies
CREATE POLICY "Workers can manage their own work experience" ON work_experience
    FOR ALL USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

CREATE POLICY "Public can view work experience" ON work_experience
    FOR SELECT USING (true);

-- Ratings policies
CREATE POLICY "Anyone can view ratings" ON ratings
    FOR SELECT USING (true);

CREATE POLICY "Employers can create ratings" ON ratings
    FOR INSERT WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (
        (sender_type = 'worker' AND sender_id IN (SELECT id FROM workers WHERE user_id = auth.uid())) OR
        (sender_type = 'employer' AND sender_id IN (SELECT id FROM employers WHERE user_id = auth.uid())) OR
        job_application_id IN (
            SELECT id FROM job_applications WHERE 
            worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()) OR
            job_id IN (SELECT id FROM job_listings WHERE employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()))
        )
    );

-- Functions and triggers

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON job_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update worker's average rating
CREATE OR REPLACE FUNCTION update_worker_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE workers 
    SET average_rating = (
        SELECT COALESCE(AVG(rating::DECIMAL), 0) 
        FROM ratings 
        WHERE worker_id = COALESCE(NEW.worker_id, OLD.worker_id)
    )
    WHERE id = COALESCE(NEW.worker_id, OLD.worker_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for rating updates
CREATE TRIGGER update_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_worker_average_rating();

-- Function to update job application count
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE job_listings 
    SET current_applications = (
        SELECT COUNT(*) 
        FROM job_applications 
        WHERE job_id = COALESCE(NEW.job_id, OLD.job_id)
    )
    WHERE id = COALESCE(NEW.job_id, OLD.job_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for application count updates
CREATE TRIGGER update_application_count_trigger
    AFTER INSERT OR DELETE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_application_count();

-- Create indexes for better performance
CREATE INDEX idx_workers_location ON workers USING GIN (location);
CREATE INDEX idx_workers_skills ON workers (is_active, is_verified);
CREATE INDEX idx_job_listings_location ON job_listings USING GIN (location);
CREATE INDEX idx_job_listings_active ON job_listings (is_active, posted_date DESC);
CREATE INDEX idx_job_listings_industry ON job_listings (industry, is_active);
CREATE INDEX idx_job_applications_worker ON job_applications (worker_id, application_date DESC);
CREATE INDEX idx_job_applications_job ON job_applications (job_id, status);
CREATE INDEX idx_skills_worker ON skills (worker_id);
CREATE INDEX idx_certifications_worker ON certifications (worker_id, is_active);

-- Sample data (optional - for testing)
-- INSERT INTO employers (company_name, contact_name, email, phone_number, industry, location) VALUES
-- ('Mining Corp Australia', 'John Smith', 'john@miningcorp.com.au', '+61400000001', 'Mining', '{"city": "Perth", "state": "WA", "country": "Australia"}'),
-- ('Construction Plus', 'Sarah Johnson', 'sarah@constructionplus.com.au', '+61400000002', 'Construction', '{"city": "Sydney", "state": "NSW", "country": "Australia"}');

COMMENT ON TABLE employers IS 'Employer profiles for companies posting jobs';
COMMENT ON TABLE workers IS 'Worker profiles for rigging professionals';
COMMENT ON TABLE job_listings IS 'Job postings created by employers';
COMMENT ON TABLE job_applications IS 'Applications submitted by workers for jobs';
COMMENT ON TABLE skills IS 'Skills associated with worker profiles';
COMMENT ON TABLE certifications IS 'Professional certifications held by workers';
COMMENT ON TABLE work_experience IS 'Work history for worker profiles';
COMMENT ON TABLE ratings IS 'Ratings and reviews for completed jobs';
COMMENT ON TABLE messages IS 'Messages between workers and employers';

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
