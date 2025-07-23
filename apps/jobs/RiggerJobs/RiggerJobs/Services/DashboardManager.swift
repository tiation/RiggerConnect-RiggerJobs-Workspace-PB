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
    
    // Additional properties for enterprise ContentView
    @Published var activeJobsCount: Int = 12
    @Published var totalRevenue: Double = 45200.0
    @Published var totalApplications: Int = 127
    @Published var pendingApplications: Int = 23
    
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
    
    func refreshData() async {
        await loadDashboardData()
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
                description: "Senior rigger position for large-scale mining operations in the Pilbara region. Work with heavy machinery and oversee complex lifting operations. FIFO 2/1 roster available with excellent accommodation.",
                requirements: ["5+ years rigging experience", "RIIHAN301E Advanced Rigging", "Mining industry background", "WA drivers license", "Height safety certification"],
                postedDate: Date().addingTimeInterval(-86400)
            ),
            JobPosting(
                id: UUID(),
                title: "Tower Crane Operator - Perth CBD",
                company: "Multiplex Construction",
                location: "Perth CBD, WA",
                salary: 98000,
                jobType: .contract,
                experienceLevel: .intermediate,
                description: "Experienced tower crane operator needed for high-rise residential development. 18-month contract with potential extension. Must have current HC license and tower crane endorsement.",
                requirements: ["HC License with crane endorsement", "Tower crane experience 3+ years", "Height safety training", "Perth metro availability"],
                postedDate: Date().addingTimeInterval(-172800)
            ),
            JobPosting(
                id: UUID(),
                title: "Dogger/Spotter - Port Operations",
                company: "Fremantle Ports",
                location: "Fremantle Port, WA",
                salary: 85000,
                jobType: .fullTime,
                experienceLevel: .intermediate,
                description: "Port operations dogger required for container and bulk cargo handling. Work with mobile and fixed cranes in busy port environment. Shift work including nights and weekends.",
                requirements: ["RIIHAN308E Dogger certification", "Port industry experience preferred", "Load calculation skills", "Maritime security clearance eligible"],
                postedDate: Date().addingTimeInterval(-259200)
            ),
            JobPosting(
                id: UUID(),
                title: "Mobile Crane Operator - Infrastructure",
                company: "John Holland Group",
                location: "Mandurah, WA",
                salary: 92000,
                jobType: .contract,
                experienceLevel: .senior,
                description: "Mobile crane operator for major infrastructure project. Work with 100T+ mobile cranes on bridge construction. Excellent rates and accommodation provided.",
                requirements: ["CN License (100T+)", "Bridge construction experience", "Clean driving record", "CPCS certification preferred"],
                postedDate: Date().addingTimeInterval(-345600)
            ),
            JobPosting(
                id: UUID(),
                title: "Scaffolder - Mining Site",
                company: "Worley",
                location: "Kalgoorlie, WA",
                salary: 78000,
                jobType: .contract,
                experienceLevel: .entry,
                description: "Entry to intermediate scaffolder for gold mine maintenance projects. Training provided for the right candidate. FIFO arrangements available.",
                requirements: ["Basic scaffolding ticket", "Mining induction ready", "Height safety certification", "Team player attitude"],
                postedDate: Date().addingTimeInterval(-432000)
            ),
            JobPosting(
                id: UUID(),
                title: "Crane Supervisor - LNG Project",
                company: "Chevron Australia",
                location: "Barrow Island, WA",
                salary: 135000,
                jobType: .fullTime,
                experienceLevel: .expert,
                description: "Lead crane supervisor for LNG facility maintenance. Manage team of 8+ crane operators and riggers. Offshore work with excellent benefits package.",
                requirements: ["Crane supervisor certification", "LNG/Oil & Gas experience", "Leadership skills 5+ years", "Medical clearance for offshore work"],
                postedDate: Date().addingTimeInterval(-518400)
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
                applicantName: "Alex Parker",
                applicantEmail: "alex.parker@rigworkers.com.au",
                status: .pending,
                appliedDate: Date().addingTimeInterval(-21600), // 6 hours ago
                experience: "5 years tower crane operations at major Perth construction sites. Advanced rigging certification holder with experience in complex multi-crane lifts."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Jessica Chen",
                applicantEmail: "jessica.chen@constructionpro.com.au",
                status: .reviewed,
                appliedDate: Date().addingTimeInterval(-86400), // 1 day ago
                experience: "8 years specialized rigging for mining operations in Kalgoorlie and Port Hedland. Team leader certification and safety training instructor."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Marcus Thompson",
                applicantEmail: "marcus.thompson@craneops.net.au",
                status: .interviewed,
                appliedDate: Date().addingTimeInterval(-172800), // 2 days ago
                experience: "12 years mobile crane operations across WA resources sector. Expertise in All Terrain cranes up to 500t capacity. HRWL and multiple endorsements."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Sarah Williams",
                applicantEmail: "sarah.williams@scaffoldexperts.com.au",
                status: .pending,
                appliedDate: Date().addingTimeInterval(-43200), // 12 hours ago
                experience: "6 years scaffolding and access solutions for industrial projects. Advanced scaffolding ticket and working at heights certification."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "David Rodriguez",
                applicantEmail: "david.rodriguez@doggers.com.au",
                status: .hired,
                appliedDate: Date().addingTimeInterval(-432000), // 5 days ago
                experience: "10 years dogging and crane spotting for major infrastructure projects. Advanced rigging qualification and team coordination experience."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Emma Foster",
                applicantEmail: "emma.foster@portsafety.com.au",
                status: .reviewed,
                appliedDate: Date().addingTimeInterval(-64800), // 18 hours ago
                experience: "7 years port operations and slewing crane work at Fremantle. Container handling specialist with maritime safety clearances."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Michael Anderson",
                applicantEmail: "michael.anderson@supervisors.net.au",
                status: .interviewed,
                appliedDate: Date().addingTimeInterval(-259200), // 3 days ago
                experience: "15 years crane supervision and project management. VET qualified trainer with extensive safety leadership background."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Lisa Chang",
                applicantEmail: "lisa.chang@towercrane.pro",
                status: .pending,
                appliedDate: Date().addingTimeInterval(-14400), // 4 hours ago
                experience: "4 years tower crane operations for high-rise construction. Recently completed advanced load chart certification and height safety training."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Robert Phillips",
                applicantEmail: "robert.phillips@miningcranes.com.au",
                status: .rejected,
                appliedDate: Date().addingTimeInterval(-518400), // 6 days ago
                experience: "9 years rough terrain crane operations in remote mining sites. Pilbara experience with heavy lift operations up to 300 tonnes."
            ),
            JobApplication(
                id: UUID(),
                jobId: UUID(),
                applicantName: "Jennifer Walsh",
                applicantEmail: "jennifer.walsh@safetyfirst.com.au",
                status: .reviewed,
                appliedDate: Date().addingTimeInterval(-108000), // 30 hours ago
                experience: "11 years safety management in construction and resources. Work Health & Safety degree and certified incident investigator."
            )
        ]
    }
}
