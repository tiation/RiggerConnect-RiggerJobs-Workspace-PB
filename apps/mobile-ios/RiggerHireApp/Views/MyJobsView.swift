import SwiftUI

struct MyJobsView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var selectedFilter: JobFilter = .all
    @State private var selectedJob: Job?
    @State private var showingJobActions = false
    
    enum JobFilter: String, CaseIterable {
        case all = "All"
        case assigned = "Assigned"
        case inProgress = "In Progress"
        case completed = "Completed"
        
        var color: Color {
            switch self {
            case .all: return .white
            case .assigned: return .orange
            case .inProgress: return .green
            case .completed: return .blue
            }
        }
    }
    
    var filteredJobs: [Job] {
        let jobs = jobManager.myJobs
        
        switch selectedFilter {
        case .all:
            return jobs
        case .assigned:
            return jobs.filter { $0.status == .assigned }
        case .inProgress:
            return jobs.filter { $0.status == .inProgress }
        case .completed:
            return jobs.filter { $0.status == .completed }
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Filter Header
                    filterSection
                    
                    // Jobs List
                    if jobManager.isLoading {
                        loadingView
                    } else if filteredJobs.isEmpty {
                        emptyStateView
                    } else {
                        jobsList
                    }
                }
            }
            .navigationTitle("My Jobs")
            .navigationBarTitleDisplayMode(.large)
            .preferredColorScheme(.dark)
            .refreshable {
                jobManager.refreshJobs()
            }
            .sheet(item: $selectedJob) { job in
                JobDetailView(job: job)
            }
            .confirmationDialog("Job Actions", isPresented: $showingJobActions, presenting: selectedJob) { job in
                jobActionsDialog(for: job)
            }
        }
        .onAppear {
            if jobManager.myJobs.isEmpty {
                jobManager.loadJobs()
            }
        }
    }
    
    private var filterSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(JobFilter.allCases, id: \.self) { filter in
                    FilterButton(
                        title: filter.rawValue,
                        count: countForFilter(filter),
                        isSelected: selectedFilter == filter,
                        color: filter.color
                    ) {
                        selectedFilter = filter
                    }
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 12)
        .background(Color.black.opacity(0.8))
    }
    
    private var jobsList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredJobs) { job in
                    MyJobCard(job: job) { action in
                        handleJobAction(job: job, action: action)
                    } onTap: {
                        selectedJob = job
                    }
                }
            }
            .padding(.horizontal)
            .padding(.bottom, 20)
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                .scaleEffect(1.5)
            
            Text("Loading your jobs...")
                .foregroundColor(.gray)
                .font(.subheadline)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 30) {
            VStack(spacing: 20) {
                Image(systemName: "briefcase.circle")
                    .font(.system(size: 80))
                    .foregroundColor(.cyan.opacity(0.6))
                
                VStack(spacing: 8) {
                    Text(emptyStateTitle)
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                    
                    Text(emptyStateSubtitle)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
            }
            
            if selectedFilter != .all {
                Button("View All Jobs") {
                    selectedFilter = .all
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(Color.cyan.opacity(0.2))
                .foregroundColor(.cyan)
                .cornerRadius(8)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
    
    private var emptyStateTitle: String {
        switch selectedFilter {
        case .all: return "No Jobs Yet"
        case .assigned: return "No Assigned Jobs"
        case .inProgress: return "No Active Jobs"
        case .completed: return "No Completed Jobs"
        }
    }
    
    private var emptyStateSubtitle: String {
        switch selectedFilter {
        case .all: return "Apply for jobs from the Available Jobs tab to see them here"
        case .assigned: return "Jobs you've been assigned will appear here"
        case .inProgress: return "Jobs you're currently working on will appear here"
        case .completed: return "Your completed jobs will appear here"
        }
    }
    
    private func countForFilter(_ filter: JobFilter) -> Int {
        switch filter {
        case .all:
            return jobManager.myJobs.count
        case .assigned:
            return jobManager.myJobs.filter { $0.status == .assigned }.count
        case .inProgress:
            return jobManager.myJobs.filter { $0.status == .inProgress }.count
        case .completed:
            return jobManager.myJobs.filter { $0.status == .completed }.count
        }
    }
    
    private func handleJobAction(job: Job, action: MyJobCard.JobAction) {
        Task {
            switch action {
            case .start:
                await jobManager.startJob(job)
            case .complete:
                await jobManager.completeJob(job)
            case .cancel:
                await jobManager.cancelJob(job, reason: "Cancelled by rigger")
            case .viewDetails:
                selectedJob = job
            }
        }
    }
    
    @ViewBuilder
    private func jobActionsDialog(for job: Job) -> some View {
        Button("View Details") {
            selectedJob = job
        }
        
        if job.status == .assigned {
            Button("Start Job") {
                Task {
                    await jobManager.startJob(job)
                }
            }
            
            Button("Cancel Job", role: .destructive) {
                Task {
                    await jobManager.cancelJob(job, reason: "Cancelled by rigger")
                }
            }
        } else if job.status == .inProgress {
            Button("Complete Job") {
                Task {
                    await jobManager.completeJob(job)
                }
            }
        }
        
        Button("Cancel", role: .cancel) {}
    }
}

struct FilterButton: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                if count > 0 {
                    Text("\(count)")
                        .font(.caption)
                        .fontWeight(.bold)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(
                            Circle()
                                .fill(isSelected ? Color.black.opacity(0.3) : color.opacity(0.3))
                        )
                }
            }
            .foregroundColor(isSelected ? .black : color)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(isSelected ? color : Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(color.opacity(0.5), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct MyJobCard: View {
    let job: Job
    let onAction: (JobAction) -> Void
    let onTap: () -> Void
    
    enum JobAction {
        case start, complete, cancel, viewDetails
    }
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    HStack {
                        Image(systemName: job.jobType.icon)
                            .foregroundColor(.cyan)
                        Text(job.jobType.displayName)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.cyan)
                    }
                    
                    Spacer()
                    
                    StatusBadge(status: job.status)
                }
                
                // Job Details
                VStack(alignment: .leading, spacing: 6) {
                    Text(job.title)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.leading)
                    
                    HStack {
                        Image(systemName: job.location.siteType.icon)
                            .foregroundColor(.gray)
                            .font(.caption)
                        
                        Text("\(job.location.city), \(job.location.state)")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        Spacer()
                        
                        Text(job.formattedRate)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.green)
                    }
                }
                
                // Timeline
                TimelineView(job: job)
                
                // Action Buttons
                if job.status != .completed && job.status != .cancelled {
                    actionButtons
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                    )
            )
            .shadow(color: .cyan.opacity(0.1), radius: 5)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var actionButtons: some View {
        HStack(spacing: 12) {
            if job.status == .assigned {
                ActionButton(
                    title: "Start Job",
                    icon: "play.circle.fill",
                    color: .green
                ) {
                    onAction(.start)
                }
                
                ActionButton(
                    title: "Cancel",
                    icon: "xmark.circle.fill",
                    color: .red
                ) {
                    onAction(.cancel)
                }
            } else if job.status == .inProgress {
                ActionButton(
                    title: "Complete",
                    icon: "checkmark.circle.fill",
                    color: .blue
                ) {
                    onAction(.complete)
                }
            }
            
            Spacer()
        }
    }
}

struct TimelineView: View {
    let job: Job
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Image(systemName: "calendar")
                        .foregroundColor(.blue)
                        .font(.caption)
                    
                    Text("Start: \(DateFormatter.short.string(from: job.startDate))")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                
                if let endDate = job.endDate {
                    HStack {
                        Image(systemName: "calendar.badge.minus")
                            .foregroundColor(.orange)
                            .font(.caption)
                        
                        Text("End: \(DateFormatter.short.string(from: endDate))")
                            .font(.caption)
                            .foregroundColor(.white)
                    }
                }
            }
            
            Spacer()
            
            // Progress indicator
            if job.status == .inProgress {
                HStack {
                    Image(systemName: "clock.fill")
                        .foregroundColor(.green)
                        .font(.caption)
                    
                    Text("In Progress")
                        .font(.caption)
                        .foregroundColor(.green)
                }
            }
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 8)
        .background(Color.black.opacity(0.2))
        .cornerRadius(6)
    }
}

struct ActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.caption)
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(color.opacity(0.2))
        .foregroundColor(color)
        .cornerRadius(6)
    }
}

#Preview {
    MyJobsView()
        .environmentObject(JobManager())
        .preferredColorScheme(.dark)
}
