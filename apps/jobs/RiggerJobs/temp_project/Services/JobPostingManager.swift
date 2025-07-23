import SwiftUI
import Combine

@MainActor
class JobPostingManager: ObservableObject {
    @Published var activeJobs: [JobPosting] = []
    @Published var draftJobs: [JobPosting] = []
    @Published var jobApplications: [UUID: [JobApplication]] = [:]
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    func loadActiveJobs() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await Task.sleep(nanoseconds: 500_000_000)
                activeJobs = JobPosting.mockJobs
                isLoading = false
            } catch {
                errorMessage = "Failed to load jobs: \(error.localizedDescription)"
                isLoading = false
            }
        }
    }
    
    func createJob(_ job: JobPosting) async -> Bool {
        isLoading = true
        
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            activeJobs.append(job)
            isLoading = false
            return true
        } catch {
            errorMessage = "Failed to create job: \(error.localizedDescription)"
            isLoading = false
            return false
        }
    }
    
    func updateJob(_ job: JobPosting) async -> Bool {
        isLoading = true
        
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            if let index = activeJobs.firstIndex(where: { $0.id == job.id }) {
                activeJobs[index] = job
            }
            isLoading = false
            return true
        } catch {
            errorMessage = "Failed to update job: \(error.localizedDescription)"
            isLoading = false
            return false
        }
    }
    
    func deleteJob(_ jobId: UUID) async -> Bool {
        isLoading = true
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000)
            activeJobs.removeAll { $0.id == jobId }
            jobApplications.removeValue(forKey: jobId)
            isLoading = false
            return true
        } catch {
            errorMessage = "Failed to delete job: \(error.localizedDescription)"
            isLoading = false
            return false
        }
    }
    
    func loadApplications(for jobId: UUID) {
        Task {
            do {
                try await Task.sleep(nanoseconds: 500_000_000)
                jobApplications[jobId] = JobApplication.mockApplications
            } catch {
                errorMessage = "Failed to load applications: \(error.localizedDescription)"
            }
        }
    }
}

@MainActor
class WorkerManagementManager: ObservableObject {
    @Published var workerPool: [Worker] = []
    @Published var activeWorkers: [Worker] = []
    @Published var favoriteWorkers: [Worker] = []
    @Published var workerRatings: [UUID: WorkerRating] = [:]
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    func loadWorkerPool() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await Task.sleep(nanoseconds: 500_000_000)
                workerPool = Worker.mockWorkers
                activeWorkers = Array(workerPool.prefix(5))
                favoriteWorkers = Array(workerPool.filter { $0.rating >= 4.5 }.prefix(3))
                isLoading = false
            } catch {
                errorMessage = "Failed to load worker pool: \(error.localizedDescription)"
                isLoading = false
            }
        }
    }
    
    func hireWorker(_ worker: Worker, for jobId: UUID) async -> Bool {
        isLoading = true
        
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            // Mock hiring process
            isLoading = false
            return true
        } catch {
            errorMessage = "Failed to hire worker: \(error.localizedDescription)"
            isLoading = false
            return false
        }
    }
    
    func rateWorker(_ workerId: UUID, rating: Double, comment: String) async -> Bool {
        isLoading = true
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000)
            workerRatings[workerId] = WorkerRating(
                workerId: workerId,
                rating: rating,
                comment: comment,
                date: Date()
            )
            isLoading = false
            return true
        } catch {
            errorMessage = "Failed to rate worker: \(error.localizedDescription)"
            isLoading = false
            return false
        }
    }
}

// MARK: - Models

struct JobPosting: Identifiable, Codable {
    let id: UUID
    let title: String
    let company: String
    let location: String
    let salary: Double
    let jobType: JobType
    let experienceLevel: ExperienceLevel
    let description: String
    let requirements: [String]
    let postedDate: Date
    let isActive: Bool
    
    init(id: UUID, title: String, company: String, location: String, salary: Double, 
         jobType: JobType, experienceLevel: ExperienceLevel, description: String, 
         requirements: [String], postedDate: Date, isActive: Bool = true) {
        self.id = id
        self.title = title
        self.company = company
        self.location = location
        self.salary = salary
        self.jobType = jobType
        self.experienceLevel = experienceLevel
        self.description = description
        self.requirements = requirements
        self.postedDate = postedDate
        self.isActive = isActive
    }
    
    enum JobType: String, Codable, CaseIterable {
        case fullTime = "fullTime"
        case contract = "contract"
        case temporary = "temporary"
        case casual = "casual"
        
        var displayName: String {
            switch self {
            case .fullTime: return "Full Time"
            case .contract: return "Contract"
            case .temporary: return "Temporary"
            case .casual: return "Casual"
            }
        }
    }
    
    enum ExperienceLevel: String, Codable, CaseIterable {
        case entry = "entry"
        case intermediate = "intermediate"
        case senior = "senior"
        case expert = "expert"
        
        var displayName: String {
            switch self {
            case .entry: return "Entry Level"
            case .intermediate: return "Intermediate"
            case .senior: return "Senior"
            case .expert: return "Expert"
            }
        }
    }
}

struct JobApplication: Identifiable, Codable {
    let id: UUID
    let jobId: UUID
    let applicantName: String
    let applicantEmail: String
    let status: ApplicationStatus
    let appliedDate: Date
    let experience: String
    
    enum ApplicationStatus: String, Codable, CaseIterable {
        case pending = "pending"
        case reviewed = "reviewed"
        case interviewed = "interviewed"
        case hired = "hired"
        case rejected = "rejected"
        
        var displayName: String {
            switch self {
            case .pending: return "Pending"
            case .reviewed: return "Reviewed"
            case .interviewed: return "Interviewed"
            case .hired: return "Hired"
            case .rejected: return "Rejected"
            }
        }
        
        var color: Color {
            switch self {
            case .pending: return .yellow
            case .reviewed: return .blue
            case .interviewed: return .purple
            case .hired: return .green
            case .rejected: return .red
            }
        }
    }
}

struct Worker: Identifiable, Codable {
    let id: UUID
    let name: String
    let email: String
    let phone: String
    let skills: [String]
    let experience: Int // years
    let rating: Double
    let hourlyRate: Double
    let location: String
    let availability: AvailabilityStatus
    let certifications: [String]
    let lastActive: Date
    
    enum AvailabilityStatus: String, Codable, CaseIterable {
        case available = "available"
        case busy = "busy"
        case unavailable = "unavailable"
        
        var displayName: String {
            switch self {
            case .available: return "Available"
            case .busy: return "Busy"
            case .unavailable: return "Unavailable"
            }
        }
        
        var color: Color {
            switch self {
            case .available: return .green
            case .busy: return .yellow
            case .unavailable: return .red
            }
        }
    }
    
    static var mockWorkers: [Worker] {
        return [
            Worker(
                id: UUID(),
                name: "John Smith",
                email: "john.smith@email.com",
                phone: "+61 400 123 456",
                skills: ["Rigging", "Crane Operation", "Safety Management"],
                experience: 8,
                rating: 4.8,
                hourlyRate: 55.0,
                location: "Perth, WA",
                availability: .available,
                certifications: ["HR License", "Rigger Level 3", "EWP"],
                lastActive: Date().addingTimeInterval(-3600)
            ),
            Worker(
                id: UUID(),
                name: "Sarah Wilson",
                email: "sarah.wilson@email.com",
                phone: "+61 400 789 012",
                skills: ["Dogging", "Crane Spotting", "Load Calculation"],
                experience: 5,
                rating: 4.6,
                hourlyRate: 48.0,
                location: "Karratha, WA",
                availability: .busy,
                certifications: ["Dogger License", "Safety Training", "First Aid"],
                lastActive: Date().addingTimeInterval(-7200)
            )
        ]
    }
}

struct WorkerRating: Identifiable {
    let id = UUID()
    let workerId: UUID
    let rating: Double
    let comment: String
    let date: Date
}
