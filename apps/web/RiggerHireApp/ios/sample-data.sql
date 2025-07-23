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
