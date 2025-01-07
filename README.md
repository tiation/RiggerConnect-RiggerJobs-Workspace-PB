# RiggerConnect-RiggerJobs-Workspace

Developer Documentation

File: /Documentation/RiggerConnect/DeveloperDocs/DeveloperGuide.md

# **RiggerConnect & RiggerJobs: Developer Guide**

Welcome to the developer guide for RiggerConnect and RiggerJobs. This documentation will walk you through the architecture, setup process, coding conventions, and key workflows to help streamline development.

---

## **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Setup Instructions](#setup-instructions)
3. [Coding Standards](#coding-standards)
4. [Key Workflows](#key-workflows)
5. [API Integration](#api-integration)
6. [Automation & CI/CD](#automation--cicd)
7. [Testing Strategy](#testing-strategy)
8. [FAQs](#faqs)

---

## **Architecture Overview**

The system consists of two apps (**RiggerConnect** and **RiggerJobs**) and an **AutomationServer** backend.

### Components:
1. **RiggerConnect App**  
   - Public-facing app for businesses to book riggers and manage jobs.  
   - Built with **Android (Kotlin)** and **iOS (Swift)**.  
   - Uses **Stripe** for payments and **Firebase** for notifications.

2. **RiggerJobs App**  
   - Internal app for workers (riggers, crane operators) to find jobs.  
   - Provides onboarding, job tracking, and payment summaries.  
   - Built with **Android (Java)** and **iOS (Swift)**.

3. **AutomationServer**  
   - Central backend for automation, compliance checks, worker-job matching, and payment processing.  
   - Built with **Node.js** and uses **MongoDB** for data storage.

---

## **Setup Instructions**

### Prerequisites
- **Backend**: Node.js (v16+), MongoDB (v5+), AWS CLI.  
- **Mobile Apps**: Android Studio, Xcode (v13+).  
- **CI/CD**: GitHub Actions, Fastlane, Terraform.

### Clone the Repository
```bash
git clone https://github.com/your-org/RiggerConnect.git
cd RiggerConnect

Backend Setup
	1.	Navigate to the /AutomationServer directory.
	2.	Install dependencies:

npm install


	3.	Create a .env file:

PORT=3000
MONGO_URI=mongodb://localhost:27017/riggerconnect
AWS_S3_BUCKET=rigger-documents
STRIPE_SECRET_KEY=your-stripe-key


	4.	Start the server:

npm start



Mobile Apps Setup
	1.	Android: Open the /RiggerConnectApp or /RiggerJobsApp directory in Android Studio.
	•	Configure Firebase and Stripe in the app/build.gradle file.
	2.	iOS: Open the respective .xcodeproj in Xcode.
	•	Set up Firebase and Stripe via CocoaPods.

Coding Standards
	1.	Backend:
	•	Use ES6+ features for JavaScript.
	•	Follow Airbnb JavaScript Style Guide.
	•	Enforce linting with ESLint and formatting with Prettier.
	2.	Mobile Apps:
	•	Use MVVM for frontend architecture.
	•	Write reusable and modular UI components.
	•	Document code using Markdown-style comments.
	3.	General:
	•	Use meaningful variable names and avoid magic numbers.
	•	Always write unit tests for business logic.

Key Workflows

Worker-Job Matching
	1.	Job is posted via RiggerConnect.
	2.	Backend processes the job requirements and matches workers:
	•	Location proximity.
	•	Certification compliance.
	•	Worker availability and feedback score.
	3.	Worker receives job offers on the RiggerJobs app.

Payment Automation
	1.	Businesses are charged automatically via Stripe after job completion.
	2.	Workers are paid out via Stripe Connect after deductions (e.g., platform fees, taxes).

API Integration

Endpoints
	1.	Job Management:
	•	POST /jobs
	•	GET /jobs/:id
	2.	Worker Compliance:
	•	POST /workers/:id/compliance-check
	3.	Payment Processing:
	•	POST /payments
	4.	Notifications:
	•	POST /notifications

Authentication
	•	Use JWT for secure API access.
	•	Ensure tokens are short-lived and refreshed regularly.

Automation & CI/CD
	1.	Automation Tools:
	•	Document Processing: AWS S3 for storage and Lambda for automated OCR.
	•	Worker Ranking: AI-powered ranking using compliance, availability, and feedback metrics.
	2.	CI/CD Pipelines:
	•	Backend: GitHub Actions with automated testing and deployment to AWS.
	•	Mobile Apps: Fastlane for building and publishing.

Testing Strategy
	1.	Unit Tests:
	•	Backend: Mocha/Chai.
	•	Mobile Apps: XCTest (iOS) and JUnit (Android).
	2.	Integration Tests:
	•	Test API endpoints with Postman.
	3.	E2E Tests:
	•	Use Cypress for web and mobile simulation.
	4.	Performance Tests:
	•	Run load tests using Apache JMeter.

FAQs

Q: How is worker compliance ensured?
A: The backend automatically verifies certifications and insurance validity before job assignments.

Q: Can businesses request custom features?
A: Yes, use the Feature Request form in the RiggerConnect app.

Q: How do I contribute to development?
A: Fork the repository and follow the contribution guidelines in /Documentation/Contributing.md.

Thank you for contributing to RiggerConnect!

Would you like additional technical documentation (e.g., API reference, system architecture)?
