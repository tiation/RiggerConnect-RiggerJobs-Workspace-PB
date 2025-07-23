import Foundation

struct WorkerEligibility {
    static func isEligible(worker: WorkerProfile, job: Job) -> Bool {
        // Check certifications
        guard worker.certifications.contains(job.requiredCertification) else { return false }
        // Check insurance
        guard worker.insuranceStatus.isValid else { return false }
        return true
    }
}

import Foundation

/// Protocol defining worker eligibility requirements
protocol EligibilityValidating {
    func validateWorkerEligibility(_ worker: Worker) -> EligibilityResult
    func checkAvailability(_ worker: Worker, for job: Job) -> Bool
    func validateRequirements(_ worker: Worker, against requirements: JobRequirements) -> Bool
}

/// Manages worker eligibility rules and validation
final class WorkerEligibility: EligibilityValidating {
    
    private let minimumRating: Double
    private let maximumActiveJobs: Int
    
    init(minimumRating: Double = 4.0,
        maximumActiveJobs: Int = 3) {
        self.minimumRating = minimumRating
        self.maximumActiveJobs = maximumActiveJobs
    }
    
    func validateWorkerEligibility(_ worker: Worker) -> EligibilityResult {
        guard worker.isActive else {
            return .ineligible(reason: "Worker account is inactive")
        }
        
        guard worker.rating >= minimumRating else {
            return .ineligible(reason: "Rating below minimum requirement")
        }
        
        guard worker.activeJobs.count < maximumActiveJobs else {
            return .ineligible(reason: "Maximum active jobs limit reached")
        }
        
        return .eligible
    }
    
    func checkAvailability(_ worker: Worker, for job: Job) -> Bool {
        let jobTimeRange = job.startTime...job.endTime
        
        return !worker.activeJobs.contains(where: { activeJob in
            let activeJobRange = activeJob.startTime...activeJob.endTime
            return jobTimeRange.overlaps(activeJobRange)
        })
    }
    
    func validateRequirements(_ worker: Worker, against requirements: JobRequirements) -> Bool {
        let hasRequiredCertifications = requirements.certifications.isSubset(of: Set(worker.certifications))
        let hasRequiredSkills = requirements.skills.isSubset(of: Set(worker.skills))
        let hasRequiredExperience = worker.yearsOfExperience >= requirements.minimumExperience
        
        return hasRequiredCertifications && hasRequiredSkills && hasRequiredExperience
    }
}

// MARK: - Supporting Types

struct Worker {
    let id: UUID
    let rating: Double
    let isActive: Bool
    let certifications: [String]
    let skills: [String]
    let yearsOfExperience: Int
    let activeJobs: [Job]
}

struct Job {
    let id: UUID
    let startTime: Date
    let endTime: Date
    let requirements: JobRequirements
}

struct JobRequirements {
    let certifications: Set<String>
    let skills: Set<String>
    let minimumExperience: Int
}

enum EligibilityResult {
    case eligible
    case ineligible(reason: String)
}

