import SwiftUI

struct DashboardOverview: View {
    @EnvironmentObject var dashboardManager: DashboardManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    headerSection
                    
                    // Dashboard Stats
                    dashboardStatsSection
                    
                    // Recent Activity
                    recentActivitySection
                    
                    // Quick Actions
                    quickActionsSection
                    
                    // Active Jobs Summary
                    activeJobsSummary
                }
                .padding(.horizontal)
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        dashboardManager.refreshDashboard()
                    } label: {
                        Image(systemName: "arrow.clockwise")
                            .foregroundColor(.cyan)
                    }
                }
            }
        }
        .onAppear {
            if dashboardManager.dashboardStats == nil {
                dashboardManager.loadDashboardData()
            }
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Welcome back,")
                    .font(.callout)
                    .foregroundColor(.gray)
                
                Text(authManager.currentUser?.companyName ?? "Company")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            // Notification Badge
            Button {
                // Handle notifications
            } label: {
                ZStack {
                    Image(systemName: "bell")
                        .font(.title2)
                        .foregroundColor(.white)
                    
                    // Notification badge
                    Circle()
                        .fill(Color.red)
                        .frame(width: 8, height: 8)
                        .offset(x: 8, y: -8)
                }
            }
        }
        .padding(.top)
    }
    
    // MARK: - Dashboard Stats Section
    
    private var dashboardStatsSection: some View {
        Group {
            if let stats = dashboardManager.dashboardStats {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    StatCard(
                        title: "Active Jobs",
                        value: "\(stats.totalActiveJobs)",
                        icon: "briefcase.fill",
                        color: .cyan
                    )
                    
                    StatCard(
                        title: "Applications",
                        value: "\(stats.totalApplications)",
                        icon: "person.fill.badge.plus",
                        color: .blue
                    )
                    
                    StatCard(
                        title: "Workers",
                        value: "\(stats.totalWorkers)",
                        icon: "person.3.sequence.fill",
                        color: .green
                    )
                    
                    StatCard(
                        title: "Retention Rate",
                        value: "\(stats.workerRetentionRate, specifier: "%.1f")%",
                        icon: "chart.line.uptrend.xyaxis",
                        color: .purple
                    )
                }
            } else if dashboardManager.isLoading {
                ProgressView("Loading dashboard...")
                    .foregroundColor(.white)
            }
        }
    }
    
    // MARK: - Recent Activity Section
    
    private var recentActivitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Recent Activity")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Spacer()
                
                Button("View All") {
                    // Navigate to full activity log
                }
                .font(.callout)
                .foregroundColor(.cyan)
            }
            
            LazyVStack(spacing: 8) {
                ForEach(Array(dashboardManager.recentActivity.prefix(3))) { activity in
                    ActivityRow(activity: activity)
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
        )
    }
    
    // MARK: - Quick Actions Section
    
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)
                .foregroundColor(.white)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                QuickActionButton(
                    title: "Post Job",
                    icon: "plus.circle.fill",
                    color: .cyan
                ) {
                    // Navigate to job creation
                }
                
                QuickActionButton(
                    title: "Find Workers",
                    icon: "person.crop.circle.badge.plus",
                    color: .blue
                ) {
                    // Navigate to worker search
                }
                
                QuickActionButton(
                    title: "View Applications",
                    icon: "doc.text.fill",
                    color: .green
                ) {
                    // Navigate to applications
                }
                
                QuickActionButton(
                    title: "Analytics",
                    icon: "chart.bar.fill",
                    color: .purple
                ) {
                    // Navigate to analytics
                }
            }
        }
    }
    
    // MARK: - Active Jobs Summary
    
    private var activeJobsSummary: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Active Jobs")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Spacer()
                
                Button("View All") {
                    // Navigate to all jobs
                }
                .font(.callout)
                .foregroundColor(.cyan)
            }
            
            LazyVStack(spacing: 8) {
                ForEach(Array(dashboardManager.activeJobs.prefix(3))) { job in
                    JobSummaryRow(job: job)
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

// MARK: - Supporting Views

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(height: 100)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct ActivityRow: View {
    let activity: ActivityItem
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: activity.type.icon)
                .font(.callout)
                .foregroundColor(activity.type.color)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(activity.message)
                    .font(.callout)
                    .foregroundColor(.white)
                    .lineLimit(2)
                
                Text(activity.timestamp, style: .relative)
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Circle()
                .fill(activity.priority.color)
                .frame(width: 8, height: 8)
        }
        .padding(.vertical, 4)
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Text(title)
                    .font(.callout)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
            .padding()
            .frame(height: 80)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(color.opacity(0.3), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct JobSummaryRow: View {
    let job: JobPosting
    
    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(job.title)
                    .font(.callout)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                Text(job.location)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("$\(job.salary, specifier: "%.0f")")
                    .font(.callout)
                    .fontWeight(.semibold)
                    .foregroundColor(.cyan)
                
                Text("5 applications")
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    DashboardOverview()
        .environmentObject(AuthenticationManager())
        .environmentObject(DashboardManager())
        .preferredColorScheme(.dark)
}
