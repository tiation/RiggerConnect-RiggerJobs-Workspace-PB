import Foundation

enum TestEnvironment {
    static let apiBaseURL = "https://test-api.riggerhireapp.com"
    static let testEmployerEmail = "test@employer.com"
    static let testWorkerEmail = "test@worker.com"
    
    // Test data timeouts
    static let defaultTimeout: TimeInterval = 5.0
    static let networkTimeout: TimeInterval = 10.0
    
    // Test coverage thresholds
    struct CoverageThresholds {
        static let overall: Double = 80.0
        static let critical: Double = 90.0
    }
}

struct TestData {
    static let jobRequirements = [
        "crane-license",
        "rigging-license",
        "dogger-license",
        "elevated-work-platform-license"
    ]
    
    static let locations = [
        "Perth, WA",
        "Sydney, NSW",
        "Melbourne, VIC",
        "Brisbane, QLD"
    ]
    
    static let sampleJob = Job(
        id: UUID(),
        title: "Test Crane Operator",
        requirements: ["crane-license", "5-years-experience"],
        location: "Perth, WA",
        startDate: Date(),
        salary: SalaryRange(min: 85000, max: 95000, currency: "AUD")
    )
    
    static let sampleWorker = Worker(
        id: UUID(),
        name: "Test Worker",
        certifications: ["crane-license"],
        experience: 5,
        location: "Perth, WA",
        availability: true
    )
}

// Mock network responses
struct MockResponses {
    static let successfulLogin = """
        {
            "token": "test-token",
            "user": {
                "id": "test-user-id",
                "email": "test@example.com",
                "role": "employer"
            }
        }
        """
    
    static let jobsList = """
        {
            "jobs": [
                {
                    "id": "job-1",
                    "title": "Senior Rigger",
                    "location": "Perth, WA"
                },
                {
                    "id": "job-2",
                    "title": "Crane Operator",
                    "location": "Sydney, NSW"
                }
            ]
        }
        """
}
