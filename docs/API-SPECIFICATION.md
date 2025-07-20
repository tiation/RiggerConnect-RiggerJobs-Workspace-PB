# RiggerHub API Specification

## 🏗️ **Complete API Architecture for Construction Workforce Platform**

### **System Overview**
- **Frontend**: Next.js marketing site + business portal
- **Mobile Apps**: React Native (iOS/Android) 
- **Backend**: Node.js/TypeScript with Express
- **Database**: PostgreSQL with Prisma ORM
- **AI Services**: OpenAI GPT-4 for content generation
- **Payments**: Stripe for processing
- **Compliance**: WorkSafe WA integration
- **File Storage**: AWS S3 or Google Cloud Storage

---

## 📱 **1. Authentication & User Management**

### **POST** `/api/auth/register/worker`
Register new worker account
```json
{
  "email": "john.doe@email.com",
  "password": "securePassword123",
  "phone": "+61412345678",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1985-03-15",
  "workTypes": ["rigger", "dogger"],
  "location": {
    "city": "Perth",
    "state": "WA", 
    "postcode": "6000"
  }
}
```

### **POST** `/api/auth/register/company`
Register new company account
```json
{
  "email": "hiring@company.com",
  "password": "companyPass123",
  "companyName": "ABC Construction",
  "abn": "12345678901",
  "phone": "+61812345678",
  "address": {
    "street": "123 Construction St",
    "city": "Perth",
    "state": "WA",
    "postcode": "6000"
  },
  "contactPerson": {
    "firstName": "Jane",
    "lastName": "Smith",
    "position": "HR Manager"
  }
}
```

### **POST** `/api/auth/login`
```json
{
  "email": "user@email.com",
  "password": "password123",
  "userType": "worker" | "company"
}
```

---

## 👷 **2. Worker Profile Management**

### **GET** `/api/workers/profile/{workerId}`
Get worker profile
```json
{
  "id": "worker_123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+61412345678",
  "workTypes": ["rigger", "dogger"],
  "experience": 8,
  "hourlyRate": {
    "min": 45,
    "max": 65,
    "preferred": 55
  },
  "location": {
    "city": "Perth",
    "state": "WA",
    "coordinates": [-31.9505, 115.8605]
  },
  "availability": {
    "monday": { "available": true, "hours": "07:00-17:00" },
    "tuesday": { "available": true, "hours": "07:00-17:00" }
  },
  "certifications": [
    {
      "id": "cert_1",
      "type": "Rigging License",
      "issuer": "WorkSafe WA",
      "number": "R123456",
      "issueDate": "2020-01-15",
      "expiryDate": "2025-01-15",
      "verified": true,
      "documentUrl": "https://storage.../cert1.pdf"
    }
  ],
  "safetyRecord": {
    "score": 98.5,
    "incidentCount": 0,
    "lastIncident": null,
    "trainingHours": 120
  },
  "resume": {
    "aiGenerated": true,
    "lastUpdated": "2024-01-15T10:00:00Z",
    "downloadUrl": "https://storage.../resume.pdf"
  }
}
```

### **PUT** `/api/workers/profile/{workerId}`
Update worker profile

### **POST** `/api/workers/{workerId}/resume/generate`
AI-generate professional resume
```json
{
  "includePhoto": true,
  "templateStyle": "professional" | "modern" | "construction",
  "sections": ["summary", "experience", "certifications", "skills", "safety"]
}
```

### **POST** `/api/workers/{workerId}/certifications`
Upload new certification
```json
{
  "type": "Crane Operator License",
  "issuer": "WorkSafe WA", 
  "number": "CO789123",
  "issueDate": "2023-06-01",
  "expiryDate": "2026-06-01",
  "documentFile": "base64_encoded_file"
}
```

---

## 🏢 **3. Company Management**

### **GET** `/api/companies/profile/{companyId}`
Get company profile

### **PUT** `/api/companies/profile/{companyId}`
Update company profile

### **GET** `/api/companies/{companyId}/subscription`
Get subscription details
```json
{
  "plan": "professional",
  "status": "active",
  "billingCycle": "monthly",
  "amount": 19900,
  "currency": "AUD",
  "nextBilling": "2024-02-15T00:00:00Z",
  "features": {
    "maxJobPostings": -1,
    "aiJobGeneration": true,
    "advancedAnalytics": true,
    "prioritySupport": true
  }
}
```

---

## 💼 **4. Job Management**

### **POST** `/api/jobs`
Create new job posting
```json
{
  "companyId": "comp_123",
  "title": "Senior Rigger - High Rise Construction", 
  "description": "We are seeking an experienced rigger...",
  "workType": "rigger",
  "location": {
    "address": "Perth CBD Construction Site",
    "city": "Perth",
    "state": "WA",
    "coordinates": [-31.9505, 115.8605]
  },
  "duration": {
    "startDate": "2024-02-01",
    "endDate": "2024-05-01",
    "estimatedHours": 480
  },
  "requirements": {
    "experience": 5,
    "certifications": ["rigging_license", "white_card"],
    "skills": ["crane_operation", "safety_management"]
  },
  "compensation": {
    "hourlyRate": 60,
    "overtimeRate": 90,
    "paymentTerms": "weekly"
  },
  "urgency": "high" | "medium" | "low",
  "aiGenerated": false
}
```

### **POST** `/api/jobs/generate`
AI-generate job posting from basic requirements
```json
{
  "companyId": "comp_123",
  "basicRequirements": {
    "workType": "rigger",
    "experience": "5+ years",
    "location": "Perth CBD",
    "duration": "3 months",
    "hourlyRate": 60
  },
  "tone": "professional" | "friendly" | "urgent",
  "includeCompanyInfo": true
}
```

### **GET** `/api/jobs`
Search and filter jobs
```json
// Query parameters:
// ?workType=rigger&location=Perth&minRate=50&maxDistance=50&sortBy=rate
```

### **GET** `/api/jobs/{jobId}/matches`
Get AI-matched workers for job
```json
{
  "jobId": "job_123",
  "matches": [
    {
      "workerId": "worker_456", 
      "matchScore": 95.8,
      "distance": 12.5,
      "availability": "immediate",
      "hourlyRate": 58,
      "experience": 8,
      "safetyScore": 98.5,
      "reasons": [
        "Perfect skill match",
        "Excellent safety record", 
        "Available immediately",
        "Competitive rate"
      ]
    }
  ]
}
```

### **POST** `/api/jobs/{jobId}/applications`
Worker applies for job
```json
{
  "workerId": "worker_456",
  "coverLetter": "I am interested in this position...",
  "hourlyRate": 58,
  "availableFrom": "2024-02-01",
  "message": "Optional personal message"
}
```

---

## 🤖 **5. AI Services**

### **POST** `/api/ai/resume/generate`
Generate professional resume for worker
```json
{
  "workerId": "worker_123",
  "style": "professional",
  "includePhoto": true,
  "customSections": ["achievements", "projects"]
}
```

### **POST** `/api/ai/job/generate` 
Generate job posting from basic info
```json
{
  "companyId": "comp_123",
  "requirements": "Need rigger for 3 month project in Perth CBD, $60/hr",
  "tone": "professional",
  "includeUrgency": true
}
```

### **POST** `/api/ai/match/score`
Calculate match score between worker and job
```json
{
  "workerId": "worker_123",
  "jobId": "job_456"
}
```

---

## 💳 **6. Payment Processing**

### **POST** `/api/payments/setup-intent`
Create payment setup intent for subscription
```json
{
  "companyId": "comp_123",
  "planId": "professional_monthly"
}
```

### **POST** `/api/payments/process-hire`
Process payment for successful hire
```json
{
  "jobId": "job_123",
  "workerId": "worker_456", 
  "feeType": "placement" | "subscription",
  "amount": 29900,
  "currency": "AUD"
}
```

### **GET** `/api/payments/invoices/{companyId}`
Get billing history

---

## 🛡️ **7. Compliance & Safety**

### **POST** `/api/compliance/worksafe/report`
Submit incident report to WorkSafe WA
```json
{
  "jobId": "job_123",
  "workerId": "worker_456",
  "incidentType": "near_miss" | "injury" | "property_damage",
  "description": "Detailed incident description",
  "date": "2024-01-15T14:30:00Z",
  "location": "Perth CBD Construction Site",
  "witnesses": ["witness1@email.com"],
  "severity": "low" | "medium" | "high"
}
```

### **GET** `/api/compliance/certifications/verify`
Verify worker certifications
```json
// Query: ?workerId=worker_123&certificationType=rigging_license
```

### **POST** `/api/compliance/audit-trail`
Log compliance actions
```json
{
  "action": "certification_verified",
  "entityId": "worker_123",
  "details": { "certificationType": "rigging_license" },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## 📊 **8. Analytics & Reporting**

### **GET** `/api/analytics/company/{companyId}/dashboard`
Company analytics dashboard
```json
{
  "period": "last_30_days",
  "metrics": {
    "jobsPosted": 15,
    "applications": 87,
    "hires": 12,
    "averageTimeToHire": 2.3,
    "costPerHire": 450.00,
    "workerSatisfaction": 4.8
  },
  "trends": {
    "applicationRate": "+15%",
    "hireSuccess": "+8%"
  }
}
```

### **GET** `/api/analytics/worker/{workerId}/dashboard` 
Worker analytics dashboard
```json
{
  "period": "last_30_days",
  "metrics": {
    "jobsApplied": 23,
    "interviews": 8,
    "jobsWon": 5,
    "averageHourlyRate": 58.50,
    "totalEarnings": 12450.00,
    "safetyScore": 98.5
  }
}
```

---

## 🔄 **9. Real-time Features**

### **WebSocket** `/ws/notifications`
Real-time notifications
```json
{
  "type": "new_job_match",
  "workerId": "worker_123",
  "data": {
    "jobId": "job_456",
    "matchScore": 95.8,
    "jobTitle": "Senior Rigger Position"
  }
}
```

### **WebSocket** `/ws/messages`
Direct messaging between workers and companies
```json
{
  "conversationId": "conv_123",
  "from": "worker_456",
  "to": "comp_789",
  "message": "I'm interested in discussing this position",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🌐 **10. External Integrations**

### **WorkSafe WA API Integration**
- Incident reporting
- Certification verification
- Safety compliance tracking
- Training requirements

### **Australian Business Register**
- ABN verification
- Company details validation

### **Stripe Payment Processing**
- Subscription management
- Payment processing
- Invoice generation
- Webhook handling

### **OpenAI Integration**
- Resume generation
- Job posting creation
- Content optimization
- Matching algorithms

---

## 🔒 **Security & Privacy**

### **Authentication**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) for companies

### **Data Protection**
- End-to-end encryption for sensitive data
- GDPR/Privacy Act compliance
- Automated data retention policies
- Secure file upload with virus scanning

### **API Security**
- Rate limiting per endpoint
- Input validation and sanitization
- SQL injection prevention
- OWASP security compliance

---

This comprehensive API serves as the backbone for the entire RiggerHub ecosystem, supporting workers, companies, and compliance requirements while maintaining security and scalability! 🚀