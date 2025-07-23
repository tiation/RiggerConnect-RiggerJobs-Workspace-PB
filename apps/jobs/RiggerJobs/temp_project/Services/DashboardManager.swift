import SwiftUI
import Combine

@MainActor
class DashboardManager: ObservableObject {
    @Published var activeJobs: [JobPosting] = []
    @Published var recentApplications: [JobApplication] = []
    @Published var workerPool: [Worker] = []
    @Published var dashboardStats: DashboardStats?
    @Published var recentActivity: [ActivityItem] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    func loadDashboardData() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await Task.sleep(nanoseconds: 1_000_000_000)
                
                // Load mock dashboard data
                await loadDashboardStats()
                await loadRecentActivity()
                await loadActiveJobsSummary()
                await loadRecentApplicationsSummary()
                
                isLoading = false
            } catch {
                errorMessage = "Failed to load dashboard data: \(error.localizedDescription)"
                isLoading = false
            }
        }
    }
    
    func refreshDashboard() {
        loadDashboardData()
    }
    
    // MARK: - Private Methods
    
    private func loadDashboardStats() async {
        // Mock dashboard statistics
        dashboardStats = DashboardStats(
            totalActiveJobs: 12,
            totalApplications: 87,
            totalWorkers: 245,
            applicationRate: 7.2,
            averageTimeToHire: 5.3,
            workerRetentionRate: 92.5
        )
    }
    
    private func loadRecentActivity() async {
        // Mock recent activity
        recentActivity = [
            ActivityItem(
                id: UUID(),
                type: .newApplication,
                message: "New application for Senior Rigger position",
                timestamp: Date().addingTimeInterval(-3600), // 1 hour ago
                priority: .high
            ),
            ActivityItem(
                id: UUID(),
                type: .jobPosted,
                message: "Job posted: Crane Operator - Pilbara Mine Site",
                timestamp: Date().addingTimeInterval(-7200), // 2 hours ago
                priority: .medium
            ),
            ActivityItem(
                id: UUID(),
                type: .workerHired,
                message: "Worker hired: John Smith (Dogger)",
                timestamp: Date().addingTimeInterval(-14400), // 4 hours ago
                priority: .low
            ),
            ActivityItem(
                id: UUID(),
                type: .jobCompleted,
                message: "Job completed: Equipment Installation - Perth",
                timestamp: Date().addingTimeInterval(-86400), // 1 day ago
                priority: .low
            )
        ]
    }
    
    private func loadActiveJobsSummary() async {
        // This would typically load from your API
        // For now, we'll use mock data
        activeJobs = Array(JobPosting.mockJobs.prefix(5))
    }
    
    private func loadRecentApplicationsSummary() async {
        // Mock recent applications
        recentApplications = Array(JobApplication.mockApplications.prefix(5))
    }
}

// MARK: - Dashboard Models

struct DashboardStats {
    let totalActiveJobs: Int
    let totalApplications: Int
    let totalWorkers: Int
    let applicationRate: Double // applications per day
    let averageTimeToHire: Double // days
    let workerRetentionRate: Double // percentage
}

struct ActivityItem: Identifiable {
    let id: UUID
    let type: ActivityType
    let message: String
    let timestamp: Date
    let priority: Priority
    
    enum ActivityType {
        case newApplication
        case jobPosted
        case workerHired
        case jobCompleted
        case workerReview
        case paymentProcessed
        
        var icon: String {
            switch self {
            case .newApplication: return "person.fill.badge.plus"
            case .jobPosted: return "briefcase.fill"
            case .workerHired: return "checkmark.circle.fill"
            case .jobCompleted: return "flag.checkered"
            case .workerReview: return "star.fill"
            case .paymentProcessed: return "dollarsign.circle.fill"
            }
        }
        
        var color: Color {
            switch self {
            case .newApplication: return .cyan
            case .jobPosted: return .blue
            case .workerHired: return .green
            case .jobCompleted: return .purple
            case .workerReview: return .yellow
            case .paymentProcessed: return .orange
            }
        }
    }
    
    enum Priority {
        case low, medium, high
        
        var color: Color {
            switch self {
            case .low: return .gray
            case .medium: return .yellow
            case .high: return .red
            }
        }
    }
}

// MARK: - Mock Data Extensions

extension JobPosting {
    static var mockJobs: [JobPosting] {
        return [
            JobPosting(
                id: UUID(),
                title: "Senior Rigger - Mining Operations",
                company: "BHP Billiton",
                location: "Pilbara, WA",
                salary: 120000,
                jobType: .fullTime,
                experienceLevel: .senior,
                description: "Senior rigger position for large-scale mining operations...",
                requirements: ["5+ years rigging experience", "Mining industry background", "WA drivers license"],
                postedDate: Date().addingTimeInterval(-86400)
            ),
            JobPosting(
                id: UUID(),
                title: "Crane Operator",
                company: "Rio Tinto",
                location: "Karratha, WA",
                salary: 95000,
                jobType: .contract,
                experienceLevel: .intermediate,
                description: "Experienced crane operator for construction projects...",
                requirements: ["HR/HC License", "Crane operator certification", "Safety training"],
                postedDate: Date().addingTimeInterval(-172800)
            )
        ]
    }
}

extension JobApplication {
    static var mockApplications: [JobApplication] {
        return [
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Mike Thompson",
                applicantEmail: "mike.thompson@email.com",
                status: .pending,
                appliedDate: Date().addingTimeInterval(-3600),
                experience: "8 years in mining rigging operations"
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Sarah Wilson",
                applicantEmail: "sarah.wilson@email.com",
                status: .reviewed,
                appliedDate: Date().addingTimeInterval(-7200),
                experience: "5 years crane operations, certified operator"
            )
        ]
    }
}
