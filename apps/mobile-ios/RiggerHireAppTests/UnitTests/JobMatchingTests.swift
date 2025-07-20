import XCTest
@testable import RiggerHireApp

class JobMatchingTests: XCTestCase {
    var matchingService: JobMatchingService!
    
    override func setUp() {
        super.setUp()
        matchingService = JobMatchingService()
    }
    
    override func tearDown() {
        matchingService = nil
        super.tearDown()
    }
    
    func testMatchingJobWithQualifiedWorker() {
        // Given
        let job = Job(
            id: UUID(),
            title: "Senior Crane Operator",
            requirements: ["crane-license", "5-years-experience"],
            location: "Perth, WA",
            startDate: Date(),
            salary: SalaryRange(min: 85000, max: 95000, currency: "AUD")
        )
        
        let worker = Worker(
            id: UUID(),
            name: "John Doe",
            certifications: ["crane-license"],
            experience: 6,
            location: "Perth, WA",
            availability: true
        )
        
        // When
        let isMatch = matchingService.isWorkerQualified(worker, forJob: job)
        
        // Then
        XCTAssertTrue(isMatch, "Worker should match job requirements")
    }
    
    func testMatchingJobWithUnderqualifiedWorker() {
        // Given
        let job = Job(
            id: UUID(),
            title: "Senior Crane Operator",
            requirements: ["crane-license", "10-years-experience"],
            location: "Perth, WA",
            startDate: Date(),
            salary: SalaryRange(min: 85000, max: 95000, currency: "AUD")
        )
        
        let worker = Worker(
            id: UUID(),
            name: "John Doe",
            certifications: ["crane-license"],
            experience: 5,
            location: "Perth, WA",
            availability: true
        )
        
        // When
        let isMatch = matchingService.isWorkerQualified(worker, forJob: job)
        
        // Then
        XCTAssertFalse(isMatch, "Worker should not match job requirements due to insufficient experience")
    }
    
    func testLocationBasedMatching() {
        // Given
        let job = Job(
            id: UUID(),
            title: "Rigger",
            requirements: ["rigging-license"],
            location: "Perth, WA",
            startDate: Date(),
            salary: SalaryRange(min: 75000, max: 85000, currency: "AUD")
        )
        
        let worker = Worker(
            id: UUID(),
            name: "Jane Smith",
            certifications: ["rigging-license"],
            experience: 3,
            location: "Sydney, NSW",
            availability: true
        )
        
        // When
        let isMatch = matchingService.isWorkerQualified(worker, forJob: job)
        
        // Then
        XCTAssertFalse(isMatch, "Worker should not match due to different location")
    }
}
