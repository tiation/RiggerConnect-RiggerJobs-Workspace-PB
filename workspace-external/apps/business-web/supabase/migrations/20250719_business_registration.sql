-- Create business_registrations table
CREATE TABLE business_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  abn TEXT NOT NULL,
  worksafe_number TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address JSONB NOT NULL,
  business_type TEXT NOT NULL,
  documents TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  document_verified BOOLEAN DEFAULT false,
  worksafe_verified BOOLEAN DEFAULT false,
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worksafe_verifications table for caching verification results
CREATE TABLE worksafe_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worksafe_number TEXT NOT NULL,
  valid BOOLEAN NOT NULL,
  verification_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_checks table for scheduled verifications
CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_registrations(id),
  worksafe_number TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completion_date TIMESTAMP WITH TIME ZONE,
  next_check_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL,
  results JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_alerts table for non-compliance notifications
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_registrations(id),
  worksafe_number TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  details JSONB NOT NULL,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_business_registrations_status ON business_registrations(status);
CREATE INDEX idx_business_registrations_worksafe_number ON business_registrations(worksafe_number);
CREATE INDEX idx_worksafe_verifications_number ON worksafe_verifications(worksafe_number);
CREATE INDEX idx_compliance_checks_status ON compliance_checks(status);
CREATE INDEX idx_compliance_checks_scheduled_date ON compliance_checks(scheduled_date);
CREATE INDEX idx_compliance_alerts_business_id ON compliance_alerts(business_id);

-- Create RLS policies
ALTER TABLE business_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksafe_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Policy for business_registrations
CREATE POLICY "Public businesses are viewable by everyone" 
  ON business_registrations FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own business registration" 
  ON business_registrations FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update business registrations" 
  ON business_registrations FOR UPDATE 
  USING (auth.role() = 'admin');

-- Policy for compliance_checks
CREATE POLICY "Admins can manage compliance checks" 
  ON compliance_checks 
  USING (auth.role() = 'admin');

CREATE POLICY "Businesses can view their own compliance checks" 
  ON compliance_checks FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM business_registrations 
      WHERE email = auth.email()
    )
  );

-- Policy for compliance_alerts
CREATE POLICY "Admins can manage compliance alerts" 
  ON compliance_alerts 
  USING (auth.role() = 'admin');

CREATE POLICY "Businesses can view their own compliance alerts" 
  ON compliance_alerts FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM business_registrations 
      WHERE email = auth.email()
    )
  );
