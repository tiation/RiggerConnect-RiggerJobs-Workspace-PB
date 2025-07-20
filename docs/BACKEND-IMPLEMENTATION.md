# RiggerHub Backend Implementation Guide

## 🏗️ **Architecture Overview**

### **Technology Stack**
```javascript
const backendStack = {
  runtime: 'Node.js 18+',
  framework: 'Express.js',
  language: 'TypeScript',
  database: 'PostgreSQL 14+',
  orm: 'Prisma',
  authentication: 'JWT + Refresh Tokens',
  fileStorage: 'AWS S3',
  cache: 'Redis',
  queues: 'Bull Queue (Redis)',
  ai: 'OpenAI GPT-4 API',
  payments: 'Stripe',
  deployment: 'Docker + AWS ECS/Lambda'
}
```

### **Project Structure**
```
rigger-hub-backend/
├── src/
│   ├── controllers/         # Route handlers
│   ├── middleware/         # Express middleware
│   ├── models/            # Database models (Prisma)
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   ├── validators/        # Input validation
│   ├── types/             # TypeScript types
│   └── config/            # Configuration files
├── prisma/                # Database schema and migrations
├── tests/                 # Test files
├── docs/                  # API documentation
└── docker/               # Docker configuration
```

---

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Users table (both workers and companies)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('worker', 'company')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Worker profiles
CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_photo_url TEXT,
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_coordinates POINT,
    work_types TEXT[] NOT NULL,
    experience_years INTEGER DEFAULT 0,
    hourly_rate_min DECIMAL(8,2),
    hourly_rate_max DECIMAL(8,2),
    hourly_rate_preferred DECIMAL(8,2),
    skills TEXT[],
    availability JSONB,
    safety_score DECIMAL(5,2) DEFAULT 100.00,
    incident_count INTEGER DEFAULT 0,
    training_hours INTEGER DEFAULT 0,
    resume_url TEXT,
    ai_resume_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Company profiles
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    abn VARCHAR(20) UNIQUE NOT NULL,
    abn_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    website VARCHAR(255),
    company_size VARCHAR(20),
    industry VARCHAR(50),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_postcode VARCHAR(10),
    contact_person_first_name VARCHAR(100),
    contact_person_last_name VARCHAR(100),
    contact_person_position VARCHAR(100),
    subscription_plan VARCHAR(50) DEFAULT 'trial',
    subscription_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Job postings
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    work_type VARCHAR(50) NOT NULL,
    location_address VARCHAR(255),
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_coordinates POINT,
    start_date DATE,
    end_date DATE,
    estimated_hours INTEGER,
    required_experience INTEGER DEFAULT 0,
    required_certifications TEXT[],
    required_skills TEXT[],
    hourly_rate DECIMAL(8,2) NOT NULL,
    overtime_rate DECIMAL(8,2),
    payment_terms VARCHAR(50) DEFAULT 'weekly',
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'filled', 'closed')),
    ai_generated BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Worker certifications
CREATE TABLE worker_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    certification_type VARCHAR(100) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    license_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'rejected')),
    document_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_hourly_rate DECIMAL(8,2),
    available_from DATE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'interview', 'hired', 'rejected')),
    company_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(job_id, worker_id)
);
```

---

## 🔐 **Authentication System**

### **JWT Implementation**
```typescript
// src/services/auth.service.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

interface TokenPayload {
  userId: string
  userType: 'worker' | 'company'
  email: string
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
  private readonly JWT_EXPIRES_IN = '15m'
  private readonly JWT_REFRESH_EXPIRES_IN = '7d'

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    })
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN
    })
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.JWT_SECRET) as TokenPayload
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.JWT_REFRESH_SECRET) as TokenPayload
  }
}
```

### **Authentication Middleware**
```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    userType: 'worker' | 'company'
    email: string
  }
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const authService = new AuthService()
    const decoded = authService.verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export const requireUserType = (userType: 'worker' | 'company') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.userType !== userType) {
      return res.status(403).json({ error: `${userType} access required` })
    }
    next()
  }
}
```

---

## 🤖 **AI Integration Services**

### **Resume Generation Service**
```typescript
// src/services/ai-resume.service.ts
import OpenAI from 'openai'
import { WorkerProfile } from '@prisma/client'

export class AIResumeService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async generateResume(workerProfile: WorkerProfile): Promise<string> {
    const prompt = this.buildResumePrompt(workerProfile)
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume writer specializing in construction industry roles. 
                     Create compelling, ATS-friendly resumes that highlight safety, experience, and certifications.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI Resume Generation Error:', error)
      throw new Error('Failed to generate resume')
    }
  }

  private buildResumePrompt(profile: WorkerProfile): string {
    return `
Create a professional resume for a construction worker with the following details:

**Personal Information:**
- Name: ${profile.first_name} ${profile.last_name}
- Location: ${profile.location_city}, ${profile.location_state}
- Experience: ${profile.experience_years} years

**Work Types:** ${profile.work_types.join(', ')}
**Skills:** ${profile.skills.join(', ')}
**Safety Score:** ${profile.safety_score}/100

**Requirements:**
1. Use professional construction industry language
2. Emphasize safety record and certifications
3. Include quantifiable achievements where possible
4. Optimize for ATS systems
5. Keep to 1-2 pages maximum
6. Include sections: Summary, Experience, Skills, Certifications, Safety Record

Format as clean, professional resume content ready for PDF generation.
    `
  }
}
```

### **Job Posting AI Service**
```typescript
// src/services/ai-job-posting.service.ts
export class AIJobPostingService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async generateJobPosting(requirements: string, workType: string, urgency: string): Promise<string> {
    const prompt = `
Create a compelling job posting for a construction ${workType} position.

**Basic Requirements:** ${requirements}
**Urgency Level:** ${urgency}

**Guidelines:**
1. Create an engaging title
2. Write compelling introduction paragraph
3. List key responsibilities
4. Specify essential requirements (licenses, experience, skills)
5. Mention safety requirements and WorkSafe WA compliance
6. Include benefits and compensation details
7. Add company culture elements
8. Use Australian English and construction industry terminology
9. Optimize for attracting quality applications
10. Keep professional but approachable tone

Format as complete job posting ready for publication.
    `

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR professional specializing in construction industry recruitment in Australia.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI Job Posting Generation Error:', error)
      throw new Error('Failed to generate job posting')
    }
  }
}
```

---

## 📊 **Job Matching Algorithm**

### **Smart Matching Service**
```typescript
// src/services/job-matching.service.ts
export interface JobMatch {
  jobId: string
  workerId: string
  matchScore: number
  distance: number
  reasons: string[]
}

export class JobMatchingService {
  async findMatchingWorkers(jobId: string, limit: number = 50): Promise<JobMatch[]> {
    const job = await this.getJobDetails(jobId)
    const workers = await this.getAvailableWorkers(job.work_type, job.location_coordinates)
    
    const matches: JobMatch[] = []
    
    for (const worker of workers) {
      const score = await this.calculateMatchScore(job, worker)
      const distance = this.calculateDistance(job.location_coordinates, worker.location_coordinates)
      const reasons = this.generateMatchReasons(job, worker, score)
      
      matches.push({
        jobId: job.id,
        workerId: worker.id,
        matchScore: score,
        distance,
        reasons
      })
    }
    
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  }

  private async calculateMatchScore(job: any, worker: any): Promise<number> {
    let score = 0
    const maxScore = 100

    // Work type match (30 points)
    if (worker.work_types.includes(job.work_type)) {
      score += 30
    }

    // Experience level (20 points)
    const experienceRatio = Math.min(worker.experience_years / job.required_experience, 1)
    score += experienceRatio * 20

    // Skills match (20 points)
    const skillsMatch = this.calculateSkillsMatch(job.required_skills, worker.skills)
    score += skillsMatch * 20

    // Certifications match (15 points)
    const certsMatch = await this.calculateCertificationsMatch(job.required_certifications, worker.id)
    score += certsMatch * 15

    // Rate compatibility (10 points)
    const rateMatch = this.calculateRateMatch(job.hourly_rate, worker.hourly_rate_min, worker.hourly_rate_max)
    score += rateMatch * 10

    // Safety score bonus (5 points)
    const safetyBonus = Math.min(worker.safety_score / 100, 1) * 5
    score += safetyBonus

    return Math.min(score, maxScore)
  }

  private calculateSkillsMatch(requiredSkills: string[], workerSkills: string[]): number {
    if (requiredSkills.length === 0) return 1
    
    const matchedSkills = requiredSkills.filter(skill => 
      workerSkills.some(workerSkill => 
        workerSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    return matchedSkills.length / requiredSkills.length
  }

  private calculateDistance(jobLocation: any, workerLocation: any): number {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(jobLocation.lat - workerLocation.lat)
    const dLon = this.toRadians(jobLocation.lng - workerLocation.lng)
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(workerLocation.lat)) * 
              Math.cos(this.toRadians(jobLocation.lat)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180)
  }
}
```

---

## 🛡️ **WorkSafe WA Integration**

### **Compliance Service**
```typescript
// src/services/worksafe-compliance.service.ts
export class WorkSafeComplianceService {
  private readonly WORKSAFE_API_BASE = process.env.WORKSAFE_API_BASE
  private readonly WORKSAFE_API_KEY = process.env.WORKSAFE_API_KEY

  async submitIncidentReport(incidentData: any): Promise<string> {
    try {
      const response = await fetch(`${this.WORKSAFE_API_BASE}/incidents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WORKSAFE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          incident_type: incidentData.type,
          description: incidentData.description,
          date_occurred: incidentData.date,
          location: incidentData.location,
          involved_parties: incidentData.parties,
          severity: incidentData.severity,
          immediate_actions: incidentData.actions
        })
      })

      const result = await response.json()
      return result.incident_number
    } catch (error) {
      console.error('WorkSafe incident reporting error:', error)
      throw new Error('Failed to submit incident report')
    }
  }

  async verifyCertification(certificationNumber: string, type: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.WORKSAFE_API_BASE}/certifications/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WORKSAFE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          certificate_number: certificationNumber,
          certificate_type: type
        })
      })

      const result = await response.json()
      return result.valid === true
    } catch (error) {
      console.error('WorkSafe certification verification error:', error)
      return false
    }
  }
}
```

---

## 💳 **Payment Processing**

### **Stripe Integration**
```typescript
// src/services/payment.service.ts
import Stripe from 'stripe'

export class PaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    })
  }

  async createCustomer(companyId: string, email: string, name: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        companyId
      }
    })
    return customer.id
  }

  async createSubscription(customerId: string, planId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })
  }

  async processPlacementFee(companyId: string, amount: number, jobId: string): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'aud',
      metadata: {
        companyId,
        jobId,
        type: 'placement_fee'
      }
    })

    return paymentIntent.client_secret!
  }

  async handleWebhook(body: string, signature: string): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
    }
  }
}
```

---

## 📡 **API Controllers**

### **Job Controller Example**
```typescript
// src/controllers/job.controller.ts
import { Request, Response } from 'express'
import { JobService } from '../services/job.service'
import { AIJobPostingService } from '../services/ai-job-posting.service'
import { JobMatchingService } from '../services/job-matching.service'

export class JobController {
  private jobService: JobService
  private aiJobPostingService: AIJobPostingService
  private matchingService: JobMatchingService

  constructor() {
    this.jobService = new JobService()
    this.aiJobPostingService = new AIJobPostingService()
    this.matchingService = new JobMatchingService()
  }

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.user!
      const jobData = req.body
      
      const job = await this.jobService.createJob({
        ...jobData,
        companyId
      })
      
      res.status(201).json({
        success: true,
        data: job
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  async generateJobWithAI(req: Request, res: Response): Promise<void> {
    try {
      const { basicRequirements, workType, urgency } = req.body
      
      const generatedContent = await this.aiJobPostingService.generateJobPosting(
        basicRequirements,
        workType,
        urgency
      )
      
      res.json({
        success: true,
        data: {
          generatedContent,
          aiGenerated: true
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  async getJobMatches(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params
      const { limit = 50 } = req.query
      
      const matches = await this.matchingService.findMatchingWorkers(
        jobId,
        Number(limit)
      )
      
      res.json({
        success: true,
        data: matches
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}
```

---

## 🔧 **Environment Configuration**

### **Environment Variables**
```bash
# .env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/riggerhub"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-southeast-2"
AWS_S3_BUCKET="riggerhub-documents"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# WorkSafe WA
WORKSAFE_API_BASE="https://api.worksafe.wa.gov.au"
WORKSAFE_API_KEY="your-worksafe-api-key"

# Redis
REDIS_URL="redis://localhost:6379"

# Application
NODE_ENV="development"
PORT=3001
API_BASE_URL="https://api.riggerhub.com.au"
```

---

## 🚀 **Deployment Configuration**

### **Docker Setup**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: riggerhub
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

This comprehensive backend implementation provides a solid foundation for the RiggerHub platform, with all major features including AI integration, payment processing, WorkSafe WA compliance, and advanced job matching capabilities.