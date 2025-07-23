import Foundation

class JobFilters: ObservableObject {
@Published var location: String = ""
@Published var jobType: JobType? = nil
@Published var industry: Industry? = nil
@Published var experienceLevel: ExperienceLevel? = nil
@Published var salaryMin: Double? = nil
@Published var salaryMax: Double? = nil
@Published var isRemote: Bool? = nil
@Published var isUrgent: Bool? = nil
    
    // Utility function to check if any filters are active
    var hasActiveFilters: Bool {
        return !location.isEmpty ||
        jobType != nil ||
        industry != nil ||
        experienceLevel != nil ||
        salaryMin != nil ||
        salaryMax != nil ||
        isRemote != nil ||
        isUrgent != nil
    }
    
    // Initialize with default values (no filters active)
    init() {}
    
    // Initialize with specified values
    init(
        location: String = "",
        jobType: JobType? = nil,
        industry: Industry? = nil,
        experienceLevel: ExperienceLevel? = nil,
        salaryMin: Double? = nil,
        salaryMax: Double? = nil,
        isRemote: Bool? = nil,
        isUrgent: Bool? = nil
    ) {
        self.location = location
        self.jobType = jobType
        self.industry = industry
        self.experienceLevel = experienceLevel
        self.salaryMin = salaryMin
        self.salaryMax = salaryMax
        self.isRemote = isRemote
        self.isUrgent = isUrgent
    }
    
    // Reset all filters to default values
    mutating func reset() {
        location = ""
        jobType = nil
        industry = nil
        experienceLevel = nil
        salaryMin = nil
        salaryMax = nil
        isRemote = nil
        isUrgent = nil
    }
    
    // Function to check if a job matches the current filters
    func matches(_ job: Job) -> Bool {
        // Location filter
        if !location.isEmpty {
            let searchLocation = location.lowercased()
            let jobLocation = job.location.displayLocation.lowercased()
            if !jobLocation.contains(searchLocation) {
                return false
            }
        }
        
        // Job type filter
        if let filterJobType = jobType, filterJobType != job.jobType {
            return false
        }
        
        // Industry filter
        if let filterIndustry = industry, filterIndustry != job.industry {
            return false
        }
        
        // Experience level filter
        if let filterExperience = experienceLevel, filterExperience != job.experienceLevel {
            return false
        }
        
        // Salary range filter
        if let minSalary = salaryMin, job.rate < minSalary {
            return false
        }
        if let maxSalary = salaryMax, job.rate > maxSalary {
            return false
        }
        
        // Remote work filter
        if let remoteFilter = isRemote {
            if remoteFilter && !job.isRemote {
                return false
            }
        }
        
        // Urgent jobs filter
        if let urgentFilter = isUrgent {
            if urgentFilter && !job.isUrgent {
                return false
            }
        }
        
        return true
    }
}
