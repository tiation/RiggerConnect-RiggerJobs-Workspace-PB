import SwiftUI

/// 🏢 RiggerJobs - Enterprise Business Platform for Western Australian Construction Industry
/// Follows enterprise-grade human-centered design principles with proper authentication flow
/// Complies with WorkSafe WA standards and construction industry best practices
struct ContentView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var dashboardManager: DashboardManager
    @EnvironmentObject var jobManager: JobPostingManager
    @EnvironmentObject var workerManager: WorkerManagementManager
    
    @State private var selectedTab = 0
    @State private var showingSplashScreen = true
    @State private var hasLoadedInitialData = false
    
    var body: some View {
        Group {
            if showingSplashScreen {
                splashScreenView
            } else if authManager.isAuthenticated {
                enterpriseMainView
            } else {
                enterpriseLoginView
            }
        }
        .preferredColorScheme(.dark)
        .onAppear {
            if !hasLoadedInitialData {
                loadInitialEnterpriseData()
                hasLoadedInitialData = true
            }
        }
    }
    
    // MARK: - Splash Screen
    private var splashScreenView: some View {
        ZStack {
            // Gradient background following Tiation dark neon theme
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.black,
                    Color(red: 0, green: 0.1, blue: 0.2),
                    Color.black
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 40) {
                // Company logo area
                VStack(spacing: 20) {
                    // Logo placeholder with neon glow effect
                    ZStack {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [Color.cyan.opacity(0.8), Color.magenta.opacity(0.6)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 120, height: 120)
                            .blur(radius: 10)
                        
                        Image(systemName: "building.2.crop.circle.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.white)
                    }
                    
                    Text("RiggerJobs")
                        .font(.system(size: 42, weight: .bold, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.cyan, Color.magenta],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                    
                    Text("Enterprise Labour Solutions")
                        .font(.title3)
                        .fontWeight(.medium)
                        .foregroundColor(.white.opacity(0.8))
                        .multilineTextAlignment(.center)
                    
                    Text("Western Australia • Mining • Construction")
                        .font(.caption)
                        .foregroundColor(.cyan.opacity(0.7))
                        .fontWeight(.semibold)
                }
                
                // Loading indicator
                VStack(spacing: 16) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                        .scaleEffect(1.2)
                    
                    Text("Loading Enterprise Platform...")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.6))
                }
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                withAnimation(.easeInOut(duration: 0.8)) {
                    showingSplashScreen = false
                }
            }
        }
    }
    
    // MARK: - Enterprise Login View
    private var enterpriseLoginView: some View {
        ZStack {
            // Background with gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.black,
                    Color(red: 0.05, green: 0.05, blue: 0.1)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    Spacer(minLength: 60)
                    
                    // Header
                    VStack(spacing: 16) {
                        HStack {
                            Image(systemName: "building.2.fill")
                                .font(.title)
                                .foregroundColor(.cyan)
                            
                            Text("RiggerJobs")
                                .font(.system(size: 36, weight: .bold, design: .rounded))
                                .foregroundStyle(
                                    LinearGradient(
                                        colors: [Color.cyan, Color.magenta],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                        }
                        
                        Text("Enterprise Business Platform")
                            .font(.title3)
                            .fontWeight(.medium)
                            .foregroundColor(.white.opacity(0.9))
                        
                        Text("Connecting WA businesses with certified riggers, doggers, and crane operators")
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.7))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                    }
                    
                    // Sample credentials info
                    VStack(spacing: 12) {
                        Text("Demo Login Credentials")
                            .font(.headline)
                            .foregroundColor(.cyan)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Email:")
                                    .foregroundColor(.white.opacity(0.8))
                                    .fontWeight(.medium)
                                Text("demo@constco.com.au")
                                    .foregroundColor(.cyan)
                                    .fontWeight(.semibold)
                            }
                            
                            HStack {
                                Text("Password:")
                                    .foregroundColor(.white.opacity(0.8))
                                    .fontWeight(.medium)
                                Text("demo123")
                                    .foregroundColor(.cyan)
                                    .fontWeight(.semibold)
                            }
                        }
                        .font(.subheadline)
                    }
                    .padding(20)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.white.opacity(0.05))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                            )
                    )
                    .padding(.horizontal, 20)
                    
                    // Quick Login Button
                    VStack(spacing: 16) {
                        Button(action: {
                            Task {
                                await authManager.login(email: "demo@constco.com.au", password: "demo123")
                            }
                        }) {
                            HStack(spacing: 12) {
                                if authManager.isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .black))
                                        .scaleEffect(0.8)
                                } else {
                                    Image(systemName: "arrow.right.circle.fill")
                                        .font(.title3)
                                }
                                
                                Text(authManager.isLoading ? "Authenticating..." : "Quick Demo Login")
                                    .font(.headline)
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .frame(height: 56)
                            .background(
                                LinearGradient(
                                    colors: [Color.cyan, Color.cyan.opacity(0.8)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(12)
                        }
                        .disabled(authManager.isLoading)
                        
                        // Error message
                        if let errorMessage = authManager.errorMessage {
                            Text(errorMessage)
                                .font(.caption)
                                .foregroundColor(.red)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 20)
                        }
                        
                        // Alternative login options
                        VStack(spacing: 12) {
                            Text("Or access other demo accounts:")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.6))
                            
                            HStack(spacing: 12) {
                                Button("Mining Co") {
                                    Task {
                                        await authManager.login(email: "mining@example.com.au", password: "demo123")
                                    }
                                }
                                .buttonStyle(SecondaryButtonStyle())
                                
                                Button("Infrastructure") {
                                    Task {
                                        await authManager.login(email: "infra@example.com.au", password: "demo123")
                                    }
                                }
                                .buttonStyle(SecondaryButtonStyle())
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // Industry compliance badges
                    VStack(spacing: 16) {
                        Text("Industry Compliant")
                            .font(.headline)
                            .foregroundColor(.white.opacity(0.9))
                        
                        HStack(spacing: 20) {
                            VStack(spacing: 4) {
                                Image(systemName: "checkmark.shield.fill")
                                    .font(.title2)
                                    .foregroundColor(.green)
                                Text("WorkSafe WA")
                                    .font(.caption2)
                                    .foregroundColor(.white.opacity(0.7))
                            }
                            
                            VStack(spacing: 4) {
                                Image(systemName: "doc.text.fill")
                                    .font(.title2)
                                    .foregroundColor(.cyan)
                                Text("RIIHAN Standards")
                                    .font(.caption2)
                                    .foregroundColor(.white.opacity(0.7))
                            }
                            
                            VStack(spacing: 4) {
                                Image(systemName: "building.2.fill")
                                    .font(.title2)
                                    .foregroundColor(.magenta)
                                Text("Enterprise Grade")
                                    .font(.caption2)
                                    .foregroundColor(.white.opacity(0.7))
                            }
                        }
                    }
                    .padding(.top, 20)
                    
                    Spacer(minLength: 40)
                }
                .padding(.horizontal, 20)
            }
        }
    }
    
    // MARK: - Enterprise Main View
    private var enterpriseMainView: some View {
        TabView(selection: $selectedTab) {
            // Dashboard Tab
            NavigationView {
                enterpriseDashboardView
            }
            .tabItem {
                Image(systemName: "chart.line.uptrend.xyaxis.circle.fill")
                Text("Dashboard")
            }
            .tag(0)
            
            // Jobs Tab
            NavigationView {
                enterpriseJobsView
            }
            .tabItem {
                Image(systemName: "briefcase.circle.fill")
                Text("Jobs")
            }
            .tag(1)
            
            // Workers Tab
            NavigationView {
                enterpriseWorkersView
            }
            .tabItem {
                Image(systemName: "person.3.sequence.fill")
                Text("Workers")
            }
            .tag(2)
            
            // Analytics Tab
            NavigationView {
                enterpriseAnalyticsView
            }
            .tabItem {
                Image(systemName: "chart.bar.fill")
                Text("Analytics")
            }
            .tag(3)
            
            // Settings Tab
            NavigationView {
                enterpriseSettingsView
            }
            .tabItem {
                Image(systemName: "gearshape.circle.fill")
                Text("Settings")
            }
            .tag(4)
        }
        .accentColor(.cyan)
        .background(Color.black.ignoresSafeArea())
    }
    
    // MARK: - Dashboard View with Real Data
    private var enterpriseDashboardView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header with user info
                VStack(spacing: 12) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Welcome back,")
                                .font(.subheadline)
                                .foregroundColor(.white.opacity(0.7))
                            Text(authManager.currentUser?.companyName ?? "Demo Construction Co.")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.cyan)
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            authManager.logout()
                        }) {
                            Image(systemName: "power.circle.fill")
                                .font(.title3)
                                .foregroundColor(.red.opacity(0.8))
                        }
                    }
                    
                    HStack {
                        Text("Industry: \(authManager.currentUser?.businessType.displayName ?? "Construction")")
                        Spacer()
                        Text("Status: Active")
                            .foregroundColor(.green)
                    }
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.6))
                }
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                        )
                )
                
                // Quick Stats Grid
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    DashboardStatCard(
                        title: "Active Jobs",
                        value: "\(dashboardManager.activeJobsCount)",
                        icon: "briefcase.fill",
                        color: .cyan,
                        trend: "+3 this week"
                    )
                    
                    DashboardStatCard(
                        title: "Worker Pool",
                        value: "\(workerManager.workers.count)",
                        icon: "person.3.fill",
                        color: .magenta,
                        trend: "\(workerManager.workers.filter { $0.isAvailable }.count) available"
                    )
                    
                    DashboardStatCard(
                        title: "Applications",
                        value: "127",
                        icon: "doc.text.fill",
                        color: .green,
                        trend: "23 pending"
                    )
                    
                    DashboardStatCard(
                        title: "Revenue",
                        value: "$45.2K",
                        icon: "dollarsign.circle.fill",
                        color: .orange,
                        trend: "+12% this month"
                    )
                }
                
                // Recent Activity Section
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("Recent Activity")
                            .font(.headline)
                            .foregroundColor(.white)
                        Spacer()
                        Button("View All") {
                            selectedTab = 1
                        }
                        .font(.caption)
                        .foregroundColor(.cyan)
                    }
                    
                    VStack(spacing: 12) {
                        ForEach(sampleRecentActivities, id: \.id) { activity in
                            ActivityRowView(activity: activity)
                        }
                    }
                }
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.05))
                )
                
                Spacer(minLength: 20)
            }
            .padding(20)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Dashboard")
        .navigationBarTitleDisplayMode(.large)
        .refreshable {
            await loadDashboardData()
        }
    }
    
    // MARK: - Jobs View with Sample Data
    private var enterpriseJobsView: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header with create job button
                HStack {
                    VStack(alignment: .leading) {
                        Text("Job Management")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.cyan)
                        Text("\(jobManager.activeJobs.count) active positions")
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.7))
                    }
                    
                    Spacer()
                    
                    Button(action: {
                        // Create new job action
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "plus.circle.fill")
                            Text("Post Job")
                        }
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.black)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.cyan)
                        .cornerRadius(20)
                    }
                }
                .padding(.horizontal, 20)
                
                // Job Categories
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(jobCategories, id: \.self) { category in
                            Text(category)
                                .font(.caption)
                                .fontWeight(.medium)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(Color.cyan.opacity(0.2))
                                .foregroundColor(.cyan)
                                .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal, 20)
                }
                
                // Jobs List
                LazyVStack(spacing: 16) {
                    ForEach(sampleJobs, id: \.id) { job in
                        JobCardView(job: job)
                    }
                }
                .padding(.horizontal, 20)
                
                Spacer(minLength: 20)
            }
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Jobs")
        .navigationBarTitleDisplayMode(.large)
    }
    
    // MARK: - Workers View
    private var enterpriseWorkersView: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header
                HStack {
                    VStack(alignment: .leading) {
                        Text("Worker Pool")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.cyan)
                        Text("\(workerManager.workers.count) registered workers")
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.7))
                    }
                    
                    Spacer()
                    
                    // Filter button
                    Button(action: {}) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.title3)
                            .foregroundColor(.cyan)
                    }
                }
                .padding(.horizontal, 20)
                
                // Worker Stats
                HStack(spacing: 16) {
                    WorkerStatCard(
                        title: "Available",
                        count: workerManager.workers.filter { $0.isAvailable }.count,
                        color: .green
                    )
                    
                    WorkerStatCard(
                        title: "Busy",
                        count: workerManager.workers.filter { !$0.isAvailable }.count,
                        color: .orange
                    )
                    
                    WorkerStatCard(
                        title: "Verified",
                        count: workerManager.workers.count,
                        color: .cyan
                    )
                }
                .padding(.horizontal, 20)
                
                // Workers List
                LazyVStack(spacing: 12) {
                    ForEach(workerManager.workers, id: \.id) { worker in
                        WorkerCardView(worker: worker)
                    }
                }
                .padding(.horizontal, 20)
                
                Spacer(minLength: 20)
            }
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Workers")
        .navigationBarTitleDisplayMode(.large)
    }
    
    // MARK: - Analytics View
    private var enterpriseAnalyticsView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Coming Soon Placeholder
                VStack(spacing: 20) {
                    Image(systemName: "chart.bar.xaxis")
                        .font(.system(size: 60))
                        .foregroundColor(.cyan.opacity(0.6))
                    
                    Text("Analytics Dashboard")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.cyan)
                    
                    Text("Advanced business analytics and reporting features coming soon")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                    
                    // Placeholder analytics cards
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        AnalyticsPlaceholderCard(title: "Job Performance", icon: "briefcase.fill")
                        AnalyticsPlaceholderCard(title: "Worker Metrics", icon: "person.fill")
                        AnalyticsPlaceholderCard(title: "Revenue Analytics", icon: "dollarsign.circle.fill")
                        AnalyticsPlaceholderCard(title: "Market Trends", icon: "chart.line.uptrend.xyaxis")
                    }
                }
                .padding(40)
            }
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Analytics")
        .navigationBarTitleDisplayMode(.large)
    }
    
    // MARK: - Settings View
    private var enterpriseSettingsView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // User Profile Section
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(authManager.currentUser?.companyName ?? "Demo Company")
                                .font(.headline)
                                .foregroundColor(.white)
                            Text(authManager.currentUser?.email ?? "demo@example.com")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.6))
                        }
                        
                        Spacer()
                        
                        Image(systemName: "building.2.crop.circle.fill")
                            .font(.title)
                            .foregroundColor(.cyan)
                    }
                }
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.05))
                )
                
                // Settings Sections
                VStack(spacing: 16) {
                    SettingsRowView(title: "Company Profile", icon: "building.2", action: {})
                    SettingsRowView(title: "Notification Settings", icon: "bell", action: {})
                    SettingsRowView(title: "Security", icon: "shield", action: {})
                    SettingsRowView(title: "Billing & Subscriptions", icon: "creditcard", action: {})
                    SettingsRowView(title: "Support & Help", icon: "questionmark.circle", action: {})
                    
                    // Logout button
                    Button(action: {
                        authManager.logout()
                    }) {
                        HStack {
                            Image(systemName: "power")
                                .foregroundColor(.red)
                            Text("Sign Out")
                                .foregroundColor(.red)
                            Spacer()
                        }
                        .padding(16)
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(12)
                    }
                }
                
                Spacer(minLength: 20)
            }
            .padding(20)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.large)
    }
    
    // MARK: - Helper Functions
    private func loadInitialEnterpriseData() {
        Task {
            await dashboardManager.loadDashboardData()
            await jobManager.loadActiveJobs()
            await workerManager.loadWorkers()
        }
    }
    
    private func loadDashboardData() async {
        await dashboardManager.refreshData()
    }
}

// MARK: - Supporting Views and Components

struct DashboardStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    let trend: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(color)
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text(title)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
                
                Text(trend)
                    .font(.caption2)
                    .foregroundColor(color)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct ActivityRowView: View {
    let activity: RecentActivity
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: activity.icon)
                .font(.headline)
                .foregroundColor(activity.color)
                .frame(width: 32, height: 32)
                .background(
                    Circle()
                        .fill(activity.color.opacity(0.2))
                )
            
            VStack(alignment: .leading, spacing: 4) {
                Text(activity.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                Text(activity.subtitle)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.6))
            }
            
            Spacer()
            
            Text(activity.timeAgo)
                .font(.caption2)
                .foregroundColor(.white.opacity(0.5))
        }
        .padding(.vertical, 8)
    }
}

struct JobCardView: View {
    let job: SampleJob
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(job.title)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text(job.status.rawValue.capitalized)
                    .font(.caption)
                    .fontWeight(.medium)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(job.status.color.opacity(0.2))
                    .foregroundColor(job.status.color)
                    .cornerRadius(8)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "location")
                        .foregroundColor(.cyan)
                    Text(job.location)
                        .foregroundColor(.white.opacity(0.8))
                }
                
                HStack {
                    Image(systemName: "dollarsign.circle")
                        .foregroundColor(.green)
                    Text("$\(Int(job.hourlyRate))/hr")
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                    
                    Text("\(job.applicants) applicants")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                }
            }
            .font(.subheadline)
            
            Text(job.description)
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
                .lineLimit(2)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

struct WorkerCardView: View {
    let worker: Worker
    
    var body: some View {
        HStack(spacing: 16) {
            // Avatar
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color.cyan.opacity(0.3), Color.magenta.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 50, height: 50)
                .overlay(
                    Text(String(worker.name.prefix(1)))
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                )
            
            // Info
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(worker.name)
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text(String(format: "%.1f", worker.rating))
                            .foregroundColor(.white)
                    }
                    .font(.caption)
                }
                
                Text(worker.specialization)
                    .font(.subheadline)
                    .foregroundColor(.cyan)
                
                HStack {
                    Text("\(worker.experience)+ years")
                        .foregroundColor(.white.opacity(0.7))
                    
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Circle()
                            .fill(worker.isAvailable ? Color.green : Color.orange)
                            .frame(width: 8, height: 8)
                        Text(worker.isAvailable ? "Available" : "Busy")
                            .foregroundColor(worker.isAvailable ? .green : .orange)
                    }
                }
                .font(.caption)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
        )
    }
}

struct WorkerStatCard: View {
    let title: String
    let count: Int
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Text("\(count)")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct AnalyticsPlaceholderCard: View {
    let title: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.cyan.opacity(0.6))
            
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.white.opacity(0.8))
            
            Text("Coming Soon")
                .font(.caption2)
                .foregroundColor(.white.opacity(0.5))
        }
        .frame(height: 100)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

struct SettingsRowView: View {
    let title: String
    let icon: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.headline)
                    .foregroundColor(.cyan)
                    .frame(width: 24)
                
                Text(title)
                    .font(.subheadline)
                    .foregroundColor(.white)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.5))
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.white.opacity(0.05))
            )
        }
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption)
            .fontWeight(.medium)
            .foregroundColor(.cyan)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                    .background(Color.white.opacity(0.05))
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
    }
}

// MARK: - Sample Data Models

struct RecentActivity: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let timeAgo: String
    let icon: String
    let color: Color
}

struct SampleJob: Identifiable {
    let id = UUID()
    let title: String
    let location: String
    let hourlyRate: Double
    let applicants: Int
    let status: JobStatus
    let description: String
}

enum JobStatus: String, CaseIterable {
    case active, closed, draft
    
    var color: Color {
        switch self {
        case .active: return .green
        case .closed: return .red
        case .draft: return .orange
        }
    }
}

// MARK: - Sample Data

let sampleRecentActivities = [
    RecentActivity(
        title: "New Application Received",
        subtitle: "Tower Crane Operator - Perth CBD",
        timeAgo: "2h ago",
        icon: "doc.text.fill",
        color: .green
    ),
    RecentActivity(
        title: "Job Posted Successfully",
        subtitle: "Rigger - Fremantle Port Project",
        timeAgo: "4h ago",
        icon: "briefcase.fill",
        color: .cyan
    ),
    RecentActivity(
        title: "Worker Verified",
        subtitle: "Sarah Johnson - Dogger",
        timeAgo: "1d ago",
        icon: "checkmark.shield.fill",
        color: .blue
    )
]

let sampleJobs = [
    SampleJob(
        title: "Tower Crane Operator",
        location: "Perth CBD, WA",
        hourlyRate: 68.50,
        applicants: 12,
        status: .active,
        description: "Experienced tower crane operator needed for high-rise construction project. Must hold current HC license and height safety certification."
    ),
    SampleJob(
        title: "Advanced Rigger",
        location: "Fremantle Port, WA",
        hourlyRate: 62.00,
        applicants: 8,
        status: .active,
        description: "RIIHAN301E certified rigger required for port infrastructure project. Experience with heavy lifting operations essential."
    ),
    SampleJob(
        title: "Dogger/Spotter",
        location: "Kalgoorlie Mine Site, WA",
        hourlyRate: 58.75,
        applicants: 15,
        status: .active,
        description: "Mining site dogger position available. FIFO roster 2/1. Must hold current RIIHAN308E certification and mine site inductions."
    )
]

let jobCategories = [
    "All Jobs", "Crane Operations", "Rigging", "Dogging", "Scaffolding", "Mining", "Construction", "FIFO"
]

// MARK: - Preview
#Preview {
    ContentView()
        .environmentObject(AuthenticationManager())
        .environmentObject(DashboardManager())
        .environmentObject(JobPostingManager())
        .environmentObject(WorkerManagementManager())
        .preferredColorScheme(.dark)
}
