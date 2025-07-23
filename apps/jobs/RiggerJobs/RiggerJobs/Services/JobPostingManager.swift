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
    
    func loadActiveJobs() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000)
            activeJobs = JobPosting.mockJobs
            isLoading = false
        } catch {
            errorMessage = "Failed to load jobs: \(error.localizedDescription)"
            isLoading = false
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
    
    // Additional property for enterprise ContentView compatibility
    @Published var workers: [Worker] = []
    
    private var cancellables = Set<AnyCancellable>()
    
    func loadWorkerPool() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await Task.sleep(nanoseconds: 500_000_000)
                workerPool = Worker.mockWorkers
                workers = workerPool  // Sync for ContentView compatibility
                activeWorkers = Array(workerPool.prefix(5))
                favoriteWorkers = Array(workerPool.filter { $0.rating >= 4.5 }.prefix(3))
                isLoading = false
            } catch {
                errorMessage = "Failed to load worker pool: \(error.localizedDescription)"
                isLoading = false
            }
        }
    }
    
    func loadWorkers() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000)
            workerPool = Worker.mockWorkers
            workers = workerPool  // Sync for ContentView compatibility
            activeWorkers = Array(workerPool.prefix(5))
            favoriteWorkers = Array(workerPool.filter { $0.rating >= 4.5 }.prefix(3))
            isLoading = false
        } catch {
            errorMessage = "Failed to load worker pool: \(error.localizedDescription)"
            isLoading = false
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
    let specialization: String
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
    
    var isAvailable: Bool {
        return availability == .available
    }
    
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
                specialization: "Tower Crane Operator",
                email: "john.smith@riggers.com.au",
                phone: "+61 400 123 456",
                skills: ["Tower Crane", "Load Charts", "Safety Management", "Height Safety"],
                experience: 8,
                rating: 4.8,
                hourlyRate: 68.50,
                location: "Perth, WA",
                availability: .available,
                certifications: ["HC License", "Tower Crane Endorsement", "RIIHAN301E", "EWP Ticket"],
                lastActive: Date().addingTimeInterval(-3600)
            ),
            Worker(
                id: UUID(),
                name: "Sarah Johnson",
                specialization: "Advanced Rigger",
                email: "sarah.johnson@rigging.pro",
                phone: "+61 400 789 012",
                skills: ["Advanced Rigging", "Complex Lifts", "Load Planning", "Team Leadership"],
                experience: 6,
                rating: 4.6,
                hourlyRate: 62.00,
                location: "Fremantle, WA",
                availability: .available,
                certifications: ["RIIHAN301E", "CPCCLRG3001", "Working at Heights", "First Aid"],
                lastActive: Date().addingTimeInterval(-7200)
            ),
            Worker(
                id: UUID(),
                name: "Mike Williams",
                specialization: "Dogger/Spotter",
                email: "mike.williams@mining.com.au",
                phone: "+61 400 345 678",
                skills: ["Load Calculation", "Crane Spotting", "Safety Coordination", "Mining Operations"],
                experience: 12,
                rating: 4.9,
                hourlyRate: 58.75,
                location: "Kalgoorlie, WA",
                availability: .busy,
                certifications: ["RIIHAN308E", "White Card", "HRWL", "Mining Induction"],
                lastActive: Date().addingTimeInterval(-1800)
            ),
            Worker(
                id: UUID(),
                name: "Emma Thompson",
                specialization: "Mobile Crane Operator",
                email: "emma.thompson@cranes.net.au",
                phone: "+61 400 567 890",
                skills: ["Mobile Crane", "All Terrain Crane", "Rough Terrain", "Load Charts"],
                experience: 6,
                rating: 4.7,
                hourlyRate: 58.50,
                location: "Bunbury, WA",
                availability: .available,
                certifications: ["CN License", "CV License", "Load Chart Certified", "Safety Observer"],
                lastActive: Date().addingTimeInterval(-5400)
            ),
            Worker(
                id: UUID(),
                name: "David Chen",
                specialization: "Crane Supervisor",
                email: "david.chen@supervisors.com.au",
                phone: "+61 400 654 321",
                skills: ["Team Leadership", "Safety Management", "Project Coordination", "Training"],
                experience: 15,
                rating: 4.9,
                hourlyRate: 75.00,
                location: "Perth, WA",
                availability: .available,
                certifications: ["Crane Supervisor", "VET Training", "Safety Leadership", "Risk Assessment"],
                lastActive: Date().addingTimeInterval(-14400)
            ),
            Worker(
                id: UUID(),
                name: "Lisa Rodriguez",
                specialization: "Scaffolder",
                email: "lisa.rodriguez@scaffold.pro",
                phone: "+61 400 111 222",
                skills: ["System Scaffold", "Suspended Scaffold", "Tube & Clamp", "Safety Inspection"],
                experience: 4,
                rating: 4.4,
                hourlyRate: 52.00,
                location: "Mandurah, WA",
                availability: .available,
                certifications: ["Basic Scaffolding", "Intermediate Scaffolding", "Working at Heights", "Safety Training"],
                lastActive: Date().addingTimeInterval(-21600)
            ),
            Worker(
                id: UUID(),
                name: "Robert Anderson",
                specialization: "Slewing Crane Operator",
                email: "robert.anderson@ports.com.au",
                phone: "+61 400 333 444",
                skills: ["Port Operations", "Container Handling", "Bulk Cargo", "Safety Protocols"],
                experience: 10,
                rating: 4.8,
                hourlyRate: 65.00,
                location: "Fremantle, WA",
                availability: .busy,
                certifications: ["Slewing Crane License", "Port Authority Clearance", "Maritime Safety", "MSIC Card"],
                lastActive: Date().addingTimeInterval(-10800)
            ),
            Worker(
                id: UUID(),
                name: "Jennifer Walsh",
                specialization: "Safety Officer",
                email: "jennifer.walsh@safety.com.au",
                phone: "+61 400 555 666",
                skills: ["Safety Auditing", "Risk Assessment", "Incident Investigation", "Training Delivery"],
                experience: 7,
                rating: 4.6,
                hourlyRate: 68.00,
                location: "Perth, WA",
                availability: .available,
                certifications: ["Work Health & Safety", "Auditor Training", "Investigation Certified", "First Aid"],
                lastActive: Date().addingTimeInterval(-28800)
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
