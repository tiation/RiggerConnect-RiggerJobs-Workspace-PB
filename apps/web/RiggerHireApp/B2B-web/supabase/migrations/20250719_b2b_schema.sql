-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- Create enum for subscription status
CREATE TYPE subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'unpaid'
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  abn TEXT NOT NULL UNIQUE,
  address JSONB,
  primary_contact_name TEXT,
  primary_contact_phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_tier subscription_tier DEFAULT 'FREE',
  subscription_status subscription_status,
  subscription_current_period_end TIMESTAMP WITH TIME ZONE,
  worksafe_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  settings JSONB DEFAULT '{}'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Create payments table for tracking invoices and payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id),
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  invoice_pdf TEXT,
  hosted_invoice_url TEXT
);

-- Create subscription_features table for tracking feature access
CREATE TABLE IF NOT EXISTS subscription_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier subscription_tier NOT NULL,
  feature_key TEXT NOT NULL,
  feature_value JSONB DEFAULT '{}'::JSONB,
  UNIQUE(tier, feature_key)
);

-- Create RLS policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;

-- Businesses policies
CREATE POLICY "Public businesses are viewable by everyone" 
ON businesses FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own business" 
ON businesses FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own business" 
ON businesses FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id 
  FROM business_members 
  WHERE business_id = id AND role = 'admin'
));

-- Payments policies
CREATE POLICY "Users can view their business payments"
ON payments FOR SELECT
USING (auth.uid() IN (
  SELECT user_id
  FROM business_members
  WHERE business_id = payments.business_id
));

-- Subscription features policies
CREATE POLICY "Everyone can view subscription features"
ON subscription_features FOR SELECT
USING (true);

-- Functions
CREATE OR REPLACE FUNCTION check_subscription_features(business_id UUID, feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  business_tier subscription_tier;
BEGIN
  -- Get the business's subscription tier
  SELECT subscription_tier INTO business_tier
  FROM businesses
  WHERE id = business_id;
  
  -- Check if the feature exists for the tier
  RETURN EXISTS (
    SELECT 1
    FROM subscription_features
    WHERE tier = business_tier
    AND feature_key = check_subscription_features.feature_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
