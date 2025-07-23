# Rigging Platform - Data Models & Entities

## Core Entities

### 1. User Profiles
**Purpose**: Central user management with role-based access control

**Attributes**:
- `id` (UUID, Primary Key)
- `email` (String, Unique, Required)
- `password_hash` (String, Required)
- `first_name` (String, Required)
- `last_name` (String, Required)
- `phone` (String, Optional)
- `profile_image_url` (String, Optional)
- `role` (Enum: 'rigger', 'client', 'admin')
- `status` (Enum: 'active', 'suspended', 'pending_verification')
- `email_verified` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `last_login` (Timestamp, Optional)

**Relationships**:
- One-to-One with RiggerProfile (if role = 'rigger')
- One-to-One with ClientProfile (if role = 'client')
- One-to-Many with JobPostings (as creator)
- One-to-Many with Bookings (as rigger or client)
- One-to-Many with Reviews (as reviewer or reviewee)
- One-to-Many with Messages

### 2. Rigger Profiles
**Purpose**: Extended profile for rigging professionals

**Attributes**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users)
- `years_experience` (Integer, Required)
- `hourly_rate` (Decimal, Optional)
- `daily_rate` (Decimal, Optional)
- `bio` (Text, Optional)
- `location_city` (String, Required)
- `location_state` (String, Required)
- `location_country` (String, Default: 'USA')
- `travel_radius_miles` (Integer, Default: 50)
- `availability_status` (Enum: 'available', 'busy', 'unavailable')
- `union_affiliation` (String, Optional)
- `insurance_verified` (Boolean, Default: false)
- `background_check_verified` (Boolean, Default: false)
- `average_rating` (Decimal, Calculated)
- `total_jobs_completed` (Integer, Default: 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Relationships**:
- One-to-One with User
- One-to-Many with RiggerSkills
- One-to-Many with RiggerCertifications
- One-to-Many with RiggerEquipment
- One-to-Many with JobApplications
- One-to-Many with Bookings (as rigger)
- One-to-Many with Reviews (as reviewee)
- One-to-Many with RiggerAvailability

### 3. Client Profiles
**Purpose**: Extended profile for clients/employers

**Attributes**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users)
- `company_name` (String, Optional)
- `company_type` (Enum: 'production_company', 'event_company', 'venue', 'individual', 'other')
- `business_license` (String, Optional)
- `insurance_info` (JSON, Optional)
- `billing_address` (JSON, Required)
- `payment_method_verified` (Boolean, Default: false)
- `average_rating` (Decimal, Calculated)
- `total_jobs_posted` (Integer, Default: 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Relationships**:
- One-to-One with User
- One-to-Many with JobPostings
- One-to-Many with Bookings (as client)
- One-to-Many with Reviews (as reviewee)

### 4. Job Postings
**Purpose**: Job opportunities posted by clients

**Attributes**:
- `id` (UUID, Primary Key)
- `client_id` (UUID, Foreign Key to ClientProfiles)
- `title` (String, Required)
- `description` (Text, Required)
- `job_type` (Enum: 'theater', 'concert', 'corporate_event', 'film_tv', 'construction', 'other')
- `location_address` (String, Required)
- `location_city` (String, Required)
- `location_state` (String, Required)
- `start_date` (Date, Required)
- `end_date` (Date, Optional)
- `start_time` (Time, Required)
- `end_time` (Time, Optional)
- `pay_rate` (Decimal, Required)
- `pay_type` (Enum: 'hourly', 'daily', 'project')
- `riggers_needed` (Integer, Default: 1)
- `experience_level` (Enum: 'entry', 'intermediate', 'advanced', 'expert')
- `special_requirements` (Text, Optional)
- `status` (Enum: 'draft', 'published', 'in_progress', 'completed', 'cancelled')
- `urgency` (Enum: 'low', 'medium', 'high', 'urgent')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `published_at` (Timestamp, Optional)
- `expires_at` (Timestamp, Optional)

**Relationships**:
- Many-to-One with ClientProfile
- One-to-Many with JobSkillRequirements
- One-to-Many with JobEquipmentRequirements
- One-to-Many with JobApplications
- One-to-Many with Bookings

### 5. Job Applications
**Purpose**: Applications submitted by riggers for job postings

**Attributes**:
- `id` (UUID, Primary Key)
- `job_posting_id` (UUID, Foreign Key to JobPostings)
- `rigger_id` (UUID, Foreign Key to RiggerProfiles)
- `cover_letter` (Text, Optional)
- `proposed_rate` (Decimal, Optional)
- `status` (Enum: 'pending', 'reviewed', 'accepted', 'rejected', 'withdrawn')
- `applied_at` (Timestamp)
- `reviewed_at` (Timestamp, Optional)
- `response_message` (Text, Optional)

**Relationships**:
- Many-to-One with JobPosting
- Many-to-One with RiggerProfile

### 6. Bookings
**Purpose**: Confirmed job assignments between clients and riggers

**Attributes**:
- `id` (UUID, Primary Key)
- `job_posting_id` (UUID, Foreign Key to JobPostings)
- `client_id` (UUID, Foreign Key to ClientProfiles)
- `rigger_id` (UUID, Foreign Key to RiggerProfiles)
- `start_datetime` (Timestamp, Required)
- `end_datetime` (Timestamp, Optional)
- `agreed_rate` (Decimal, Required)
- `total_amount` (Decimal, Calculated)
- `status` (Enum: 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')
- `special_instructions` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `completed_at` (Timestamp, Optional)

**Relationships**:
- Many-to-One with JobPosting
- Many-to-One with ClientProfile
- Many-to-One with RiggerProfile
- One-to-One with Payment
- One-to-Many with Reviews
- One-to-Many with BookingUpdates

### 7. Skills
**Purpose**: Master list of rigging skills and specializations

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String, Unique, Required)
- `category` (Enum: 'rigging', 'audio', 'lighting', 'video', 'staging', 'safety')
- `description` (Text, Optional)
- `requires_certification` (Boolean, Default: false)
- `created_at` (Timestamp)

**Relationships**:
- Many-to-Many with RiggerProfiles (through RiggerSkills)
- Many-to-Many with JobPostings (through JobSkillRequirements)

### 8. Equipment
**Purpose**: Master list of rigging equipment and tools

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String, Unique, Required)
- `category` (Enum: 'hoists', 'rigging_hardware', 'safety_equipment', 'tools', 'lighting', 'audio', 'other')
- `description` (Text, Optional)
- `requires_certification` (Boolean, Default: false)
- `created_at` (Timestamp)

**Relationships**:
- Many-to-Many with RiggerProfiles (through RiggerEquipment)
- Many-to-Many with JobPostings (through JobEquipmentRequirements)

### 9. Certifications
**Purpose**: Professional certifications and licenses

**Attributes**:
- `id` (UUID, Primary Key)
- `name` (String, Unique, Required)
- `issuing_organization` (String, Required)
- `description` (Text, Optional)
- `validity_period_months` (Integer, Optional)
- `created_at` (Timestamp)

**Relationships**:
- Many-to-Many with RiggerProfiles (through RiggerCertifications)

### 10. Reviews & Ratings
**Purpose**: Feedback system for both riggers and clients

**Attributes**:
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key to Bookings)
- `reviewer_id` (UUID, Foreign Key to Users)
- `reviewee_id` (UUID, Foreign Key to Users)
- `rating` (Integer, 1-5, Required)
- `review_text` (Text, Optional)
- `review_type` (Enum: 'rigger_review', 'client_review')
- `is_public` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Relationships**:
- Many-to-One with Booking
- Many-to-One with User (reviewer)
- Many-to-One with User (reviewee)

## Junction Tables

### RiggerSkills
- `rigger_id` (UUID, Foreign Key)
- `skill_id` (UUID, Foreign Key)
- `proficiency_level` (Enum: 'beginner', 'intermediate', 'advanced', 'expert')
- `years_experience` (Integer, Optional)

### RiggerCertifications
- `rigger_id` (UUID, Foreign Key)
- `certification_id` (UUID, Foreign Key)
- `obtained_date` (Date, Required)
- `expiry_date` (Date, Optional)
- `certificate_number` (String, Optional)

### RiggerEquipment
- `rigger_id` (UUID, Foreign Key)
- `equipment_id` (UUID, Foreign Key)
- `owns_equipment` (Boolean, Default: false)
- `proficiency_level` (Enum: 'beginner', 'intermediate', 'advanced', 'expert')

### JobSkillRequirements
- `job_posting_id` (UUID, Foreign Key)
- `skill_id` (UUID, Foreign Key)
- `required_level` (Enum: 'beginner', 'intermediate', 'advanced', 'expert')
- `is_mandatory` (Boolean, Default: true)

### JobEquipmentRequirements
- `job_posting_id` (UUID, Foreign Key)
- `equipment_id` (UUID, Foreign Key)
- `is_provided` (Boolean, Default: false)
- `is_mandatory` (Boolean, Default: true)
