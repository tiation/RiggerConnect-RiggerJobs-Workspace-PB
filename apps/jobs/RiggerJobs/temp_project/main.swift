import SwiftUI
import UserNotifications
import Combine

// MARK: - Main App Entry Point
@main
struct RiggerJobsApp: App {
    @StateObject private var authManager = AuthenticationManager()
    @StateObject private var dashboardManager = DashboardManager()
    @StateObject private var jobManager = JobPostingManager()
    @StateObject private var workerManager = WorkerManagementManager()
    
    init() {
        configureAppearance()
        requestNotificationPermissions()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(dashboardManager)
                .environmentObject(jobManager)
                .environmentObject(workerManager)
                .preferredColorScheme(.dark)
        }
    }
    
    private func configureAppearance() {
        // Configure dark neon theme for employer app
        UINavigationBar.appearance().largeTitleTextAttributes = [
            .foregroundColor: UIColor.systemCyan
        ]
        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor.white
        ]
        UITabBar.appearance().tintColor = UIColor.systemCyan
        UITabBar.appearance().unselectedItemTintColor = UIColor.systemGray
        UITabBar.appearance().backgroundColor = UIColor.black
        
        // Configure accent colors
        UIView.appearance(whenContainedInInstancesOf: [UIAlertController.self]).tintColor = UIColor.systemCyan
    }
    
    private func requestNotificationPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                print("✅ RiggerJobs: Notification permissions granted")
            }
        }
    }
}

// Include all the service files and views here...
// MARK: - ContentView

struct ContentView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var dashboardManager: DashboardManager
    @EnvironmentObject var jobManager: JobPostingManager
    @State private var selectedTab = 0
    @State private var isAuthenticated = true // For demo purposes
    
    var body: some View {
        Group {
            if isAuthenticated {
                mainTabView
            } else {
                loginView
            }
        }
        .onAppear {
            loadInitialData()
        }
    }
    
    private var loginView: some View {
        VStack(spacing: 20) {
            Text("RiggerJobs")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.cyan)
            
            Text("Employer Platform")
                .font(.title2)
                .foregroundColor(.gray)
            
            Button("Login") {
                isAuthenticated = true
            }
            .padding()
            .background(Color.cyan)
            .foregroundColor(.black)
            .cornerRadius(10)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black.ignoresSafeArea())
    }
    
    private var mainTabView: some View {
        TabView(selection: $selectedTab) {
            dashboardView
                .tabItem {
                    Image(systemName: "chart.line.uptrend.xyaxis.circle.fill")
                    Text("Dashboard")
                }
                .tag(0)
            
            jobsView
                .tabItem {
                    Image(systemName: "briefcase.circle.fill")
                    Text("Jobs")
                }
                .tag(1)
            
            workersView
                .tabItem {
                    Image(systemName: "person.3.sequence.fill")
                    Text("Workers")
                }
                .tag(2)
            
            analyticsView
                .tabItem {
                    Image(systemName: "chart.bar.fill")
                    Text("Analytics")
                }
                .tag(3)
            
            settingsView
                .tabItem {
                    Image(systemName: "gearshape.circle.fill")
                    Text("Settings")
                }
                .tag(4)
        }
        .accentColor(.cyan)
        .background(Color.black.ignoresSafeArea())
    }
    
    private var dashboardView: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Dashboard")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Active Jobs: 12")
                    .foregroundColor(.white)
                
                Text("Worker Pool: 45")
                    .foregroundColor(.white)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var jobsView: some View {
        NavigationView {
            VStack {
                Text("Job Management")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Manage your job postings")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var workersView: some View {
        NavigationView {
            VStack {
                Text("Worker Management")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Manage your worker pool")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var analyticsView: some View {
        NavigationView {
            VStack {
                Text("Analytics")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("View business analytics")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var settingsView: some View {
        NavigationView {
            VStack {
                Text("Settings")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("App settings and preferences")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private func loadInitialData() {
        // Load initial data for employer dashboard
        print("Loading initial data...")
    }
}

// MARK: - Preview
#Preview {
    ContentView()
        .environmentObject(AuthenticationManager())
        .environmentObject(DashboardManager())
        .environmentObject(JobPostingManager())
        .preferredColorScheme(.dark)
}

// MARK: - AuthenticationManager

@MainActor
class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: EmployerUser?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        checkAuthenticationStatus()
    }
    
    // MARK: - Authentication Methods
    
    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        // Simulate authentication API call
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second delay
            
            // Mock successful login
            if email.contains("@") && !password.isEmpty {
                currentUser = EmployerUser(
                    id: UUID(),
                    email: email,
                    companyName: "Demo Construction Co.",
                    businessType: .construction,
                    isVerified: true
                )
                isAuthenticated = true
                saveAuthenticationState()
            } else {
                errorMessage = "Invalid email or password"
            }
        } catch {
            errorMessage = "Authentication failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func register(email: String, password: String, companyName: String, businessType: BusinessType) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 1_500_000_000) // 1.5 second delay
            
            // Mock successful registration
            currentUser = EmployerUser(
                id: UUID(),
                email: email,
                companyName: companyName,
                businessType: businessType,
                isVerified: false
            )
            isAuthenticated = true
            saveAuthenticationState()
        } catch {
            errorMessage = "Registration failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func logout() {
        currentUser = nil
        isAuthenticated = false
        clearAuthenticationState()
    }
    
    func forgotPassword(email: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            // Mock password reset
        } catch {
            errorMessage = "Password reset failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - Private Methods
    
    private func checkAuthenticationStatus() {
        // Check for stored authentication state
        if let userData = UserDefaults.standard.data(forKey: "rigger_jobs_user"),
           let user = try? JSONDecoder().decode(EmployerUser.self, from: userData) {
            currentUser = user
            isAuthenticated = true
        }
    }
    
    private func saveAuthenticationState() {
        guard let user = currentUser,
              let userData = try? JSONEncoder().encode(user) else { return }
        
        UserDefaults.standard.set(userData, forKey: "rigger_jobs_user")
    }
    
    private func clearAuthenticationState() {
        UserDefaults.standard.removeObject(forKey: "rigger_jobs_user")
    }
}

// MARK: - Models

struct EmployerUser: Codable, Identifiable {
    let id: UUID
    let email: String
    let companyName: String
    let businessType: BusinessType
    let isVerified: Bool
    let createdAt: Date
    
    init(id: UUID, email: String, companyName: String, businessType: BusinessType, isVerified: Bool) {
        self.id = id
        self.email = email
        self.companyName = companyName
        self.businessType = businessType
        self.isVerified = isVerified
        self.createdAt = Date()
    }
}

enum BusinessType: String, Codable, CaseIterable {
    case mining = "mining"
    case construction = "construction"
    case infrastructure = "infrastructure"
    case industrial = "industrial"
    case energy = "energy"
    case transport = "transport"
    
    var displayName: String {
        switch self {
        case .mining: return "Mining"
        case .construction: return "Construction"
        case .infrastructure: return "Infrastructure"
        case .industrial: return "Industrial"
        case .energy: return "Energy"
        case .transport: return "Transport"
        }
    }
}

// MARK: - DashboardManager

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

// MARK: - JobPostingManager

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

// MARK: - WorkerManagementManager

@MainActor
class WorkerManagementManager: ObservableObject {
    @Published var workers: [Worker] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        loadMockWorkers()
    }
    
    // MARK: - Worker Management Methods
    
    func loadWorkers() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000) // 0.5 second delay
            loadMockWorkers()
        } catch {
            errorMessage = "Failed to load workers: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func addWorker(_ worker: Worker) {
        workers.append(worker)
    }
    
    func removeWorker(id: UUID) {
        workers.removeAll { $0.id == id }
    }
    
    // MARK: - Private Methods
    
    private func loadMockWorkers() {
        workers = [
            Worker(
                id: UUID(),
                name: "John Smith",
                specialization: "Tower Crane Operator",
                experience: 8,
                rating: 4.8,
                isAvailable: true,
                certifications: ["CPCS", "CITB"],
                hourlyRate: 65.0
            ),
            Worker(
                id: UUID(),
                name: "Sarah Johnson",
                specialization: "Rigger",
                experience: 5,
                rating: 4.6,
                isAvailable: true,
                certifications: ["RIIHAN301E", "CPCCLRG3001"],
                hourlyRate: 58.0
            ),
            Worker(
                id: UUID(),
                name: "Mike Williams",
                specialization: "Dogger",
                experience: 12,
                rating: 4.9,
                isAvailable: false,
                certifications: ["RIIHAN308E", "White Card"],
                hourlyRate: 62.0
            )
        ]
    }
}

// MARK: - Models

struct Worker: Identifiable, Codable {
    let id: UUID
    let name: String
    let specialization: String
    let experience: Int
    let rating: Double
    let isAvailable: Bool
    let certifications: [String]
    let hourlyRate: Double
    let createdAt: Date
    
    init(id: UUID, name: String, specialization: String, experience: Int, rating: Double, isAvailable: Bool, certifications: [String], hourlyRate: Double) {
        self.id = id
        self.name = name
        self.specialization = specialization
        self.experience = experience
        self.rating = rating
        self.isAvailable = isAvailable
        self.certifications = certifications
        self.hourlyRate = hourlyRate
        self.createdAt = Date()
    }
}
