import SwiftUI

struct ApplicationHistoryView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var applications: [JobApplicationWithJob] = []
    @State private var isLoading = false
    @State private var selectedFilter: ApplicationFilter = .all
    @State private var searchText = ""
    @State private var showFilterSheet = false
    
    var filteredApplications: [JobApplicationWithJob] {
        var filtered = applications
        
        // Filter by status
        if selectedFilter != .all {
            filtered = filtered.filter { $0.application.status == selectedFilter.status }
        }
        
        // Filter by search text
        if !searchText.isEmpty {
            filtered = filtered.filter { 
                $0.job.title.localizedCaseInsensitiveContains(searchText) ||
                $0.job.companyName.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        return filtered.sorted { $0.application.submittedAt > $1.application.submittedAt }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Search and Filter Bar
                    searchFilterBar
                    
                    // Content
                    if isLoading {
                        loadingView
                    } else if applications.isEmpty {
                        emptyStateView
                    } else if filteredApplications.isEmpty {
                        noResultsView
                    } else {
                        applicationsList
                    }
                }
            }
            .navigationTitle("My Applications")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                loadApplications()
            }
            .refreshable {
                loadApplications()
            }
            .sheet(isPresented: $showFilterSheet) {
                FilterSheet(selectedFilter: $selectedFilter)
            }
        }
    }
    
    private var searchFilterBar: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    TextField("Search applications...", text: $searchText)
                        .foregroundColor(themeManager.primaryTextColor)
                }
                .padding()
                .background(themeManager.surfaceColor)
                .cornerRadius(10)
                
                // Filter Button
                Button(action: { showFilterSheet = true }) {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                        .font(.title2)
                        .foregroundColor(themeManager.accentColor)
                }
            }
            
            // Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(ApplicationFilter.allCases, id: \.self) { filter in
                        FilterChip(
                            title: filter.displayName,
                            isSelected: selectedFilter == filter,
                            action: { selectedFilter = filter }
                        )
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding()
        .background(themeManager.backgroundColor.opacity(0.8))
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(themeManager.accentColor)
            Text("Loading applications...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "doc.text.magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            Text("No Applications Yet")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text("Start applying for jobs to see your application history here")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(themeManager.secondaryTextColor)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var noResultsView: some View {
        VStack(spacing: 20) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            Text("No Results Found")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text("Try adjusting your search or filter criteria")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var applicationsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(filteredApplications, id: \.application.id) { item in
                    ApplicationCard(applicationWithJob: item)
                        .onTapGesture {
                            // Navigate to application details
                        }
                }
            }
            .padding()
        }
    }
    
    private func loadApplications() {
        guard let user = authManager.currentUser else { return }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            applications = generateSampleApplications(for: user.id)
            isLoading = false
        }
    }
    
    private func generateSampleApplications(for userId: String) -> [JobApplicationWithJob] {
        let sampleApplications: [JobApplicationWithJob] = [
            JobApplicationWithJob(
                application: JobApplication(
                    id: "1",
                    jobId: "job1",
                    workerId: userId,
                    status: .reviewing,
                    coverLetter: "I am very interested in this position...",
                    proposedRate: 45.0,
                    availableStartDate: Date(),
                    attachedDocuments: ["resume.pdf"],
                    submittedAt: Date().addingTimeInterval(-86400 * 3),
                    updatedAt: Date().addingTimeInterval(-86400 * 2)
                ),
                job: Job(
                    id: "job1",
                    title: "Senior Crane Operator",
                    companyName: "Perth Construction Co.",
                    description: "Experienced crane operator needed...",
                    location: Location(suburb: "Perth", state: "WA", country: "Australia", postalCode: "6000"),
                    jobType: .fullTime,
                    payRange: PayRange(min: 40, max: 50),
                    requiredSkills: [],
                    benefits: [],
                    postedDate: Date(),
                    applicationDeadline: Date().addingTimeInterval(86400 * 30),
                    isActive: true
                )
            ),
            JobApplicationWithJob(
                application: JobApplication(
                    id: "2",
                    jobId: "job2",
                    workerId: userId,
                    status: .shortlisted,
                    coverLetter: "My experience in rigging makes me perfect...",
                    proposedRate: 42.0,
                    availableStartDate: Date().addingTimeInterval(86400 * 7),
                    attachedDocuments: ["resume.pdf", "certification.pdf"],
                    submittedAt: Date().addingTimeInterval(-86400 * 7),
                    updatedAt: Date().addingTimeInterval(-86400 * 1)
                ),
                job: Job(
                    id: "job2",
                    title: "Rigging Specialist",
                    companyName: "Heavy Lift Solutions",
                    description: "Specialized rigging work...",
                    location: Location(suburb: "Fremantle", state: "WA", country: "Australia", postalCode: "6160"),
                    jobType: .contract,
                    payRange: PayRange(min: 38, max: 46),
                    requiredSkills: [],
                    benefits: [],
                    postedDate: Date(),
                    applicationDeadline: Date().addingTimeInterval(86400 * 30),
                    isActive: true
                )
            ),
            JobApplicationWithJob(
                application: JobApplication(
                    id: "3",
                    jobId: "job3",
                    workerId: userId,
                    status: .rejected,
                    coverLetter: "I would love to work for your company...",
                    proposedRate: 35.0,
                    availableStartDate: Date(),
                    attachedDocuments: ["resume.pdf"],
                    submittedAt: Date().addingTimeInterval(-86400 * 14),
                    updatedAt: Date().addingTimeInterval(-86400 * 10)
                ),
                job: Job(
                    id: "job3",
                    title: "General Laborer",
                    companyName: "Build Right Construction",
                    description: "General construction work...",
                    location: Location(suburb: "Rockingham", state: "WA", country: "Australia", postalCode: "6168"),
                    jobType: .casual,
                    payRange: PayRange(min: 30, max: 38),
                    requiredSkills: [],
                    benefits: [],
                    postedDate: Date(),
                    applicationDeadline: Date().addingTimeInterval(86400 * 30),
                    isActive: true
                )
            )
        ]
        
        return sampleApplications
    }
}

struct ApplicationCard: View {
    let applicationWithJob: JobApplicationWithJob
    @EnvironmentObject var themeManager: ThemeManager
    
    private var application: JobApplication { applicationWithJob.application }
    private var job: Job { applicationWithJob.job }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(job.title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    StatusBadge(status: application.status)
                }
                
                Text(job.companyName)
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
            
            // Details
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "location")
                        .foregroundColor(themeManager.accentColor)
                        .frame(width: 16)
                    Text("\(job.location.suburb), \(job.location.state)")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    Image(systemName: "dollarsign")
                        .foregroundColor(themeManager.successColor)
                        .frame(width: 16)
                    Text("$\(Int(application.proposedRate))/hr")
                        .font(.caption)
                        .foregroundColor(themeManager.successColor)
                }
                
                HStack {
                    Image(systemName: "calendar")
                        .foregroundColor(themeManager.accentColor)
                        .frame(width: 16)
                    Text("Applied \(formatDate(application.submittedAt))")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    if application.submittedAt != application.updatedAt {
                        Text("Updated \(formatDate(application.updatedAt))")
                            .font(.caption)
                            .foregroundColor(themeManager.mutedTextColor)
                    }
                }
            }
            
            // Progress Indicator (for active applications)
            if application.status != .rejected && application.status != .withdrawn {
                ProgressIndicatorView(status: application.status)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(statusBorderColor, lineWidth: 1)
        )
    }
    
    private var statusBorderColor: Color {
        switch application.status {
        case .accepted:
            return themeManager.successColor.opacity(0.5)
        case .rejected:
            return themeManager.errorColor.opacity(0.5)
        case .reviewing, .shortlisted, .interviewed:
            return themeManager.accentColor.opacity(0.5)
        case .submitted, .withdrawn:
            return Color.clear
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct StatusBadge: View {
    let status: ApplicationStatus
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(statusBackgroundColor)
            .foregroundColor(statusTextColor)
            .cornerRadius(8)
    }
    
    private var statusBackgroundColor: Color {
        switch status {
        case .submitted:
            return themeManager.mutedTextColor.opacity(0.2)
        case .reviewing:
            return Color.orange.opacity(0.2)
        case .shortlisted, .interviewed:
            return themeManager.accentColor.opacity(0.2)
        case .accepted:
            return themeManager.successColor.opacity(0.2)
        case .rejected, .withdrawn:
            return themeManager.errorColor.opacity(0.2)
        }
    }
    
    private var statusTextColor: Color {
        switch status {
        case .submitted:
            return themeManager.mutedTextColor
        case .reviewing:
            return Color.orange
        case .shortlisted, .interviewed:
            return themeManager.accentColor
        case .accepted:
            return themeManager.successColor
        case .rejected, .withdrawn:
            return themeManager.errorColor
        }
    }
}

struct ProgressIndicatorView: View {
    let status: ApplicationStatus
    @EnvironmentObject var themeManager: ThemeManager
    
    private var progressSteps: [ApplicationStatus] {
        [.submitted, .reviewing, .shortlisted, .interviewed, .accepted]
    }
    
    private var currentStepIndex: Int {
        progressSteps.firstIndex(of: status) ?? 0
    }
    
    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<progressSteps.count, id: \.self) { index in
                Rectangle()
                    .fill(index <= currentStepIndex ? themeManager.accentColor : themeManager.mutedTextColor.opacity(0.3))
                    .frame(height: 3)
                    .cornerRadius(1.5)
            }
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? themeManager.accentColor : themeManager.surfaceColor)
                .foregroundColor(isSelected ? .black : themeManager.primaryTextColor)
                .cornerRadius(20)
        }
    }
}

struct FilterSheet: View {
    @Binding var selectedFilter: ApplicationFilter
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(alignment: .leading, spacing: 20) {
                    Text("Filter Applications")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                        .padding(.top)
                    
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(ApplicationFilter.allCases, id: \.self) { filter in
                            HStack {
                                Text(filter.displayName)
                                    .foregroundColor(themeManager.primaryTextColor)
                                
                                Spacer()
                                
                                if selectedFilter == filter {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(themeManager.accentColor)
                                }
                            }
                            .padding()
                            .background(selectedFilter == filter ? themeManager.accentColor.opacity(0.1) : themeManager.surfaceColor)
                            .cornerRadius(10)
                            .onTapGesture {
                                selectedFilter = filter
                            }
                        }
                    }
                    
                    Spacer()
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
    }
}

enum ApplicationFilter: CaseIterable {
    case all
    case submitted
    case reviewing
    case shortlisted
    case interviewed
    case accepted
    case rejected
    
    var displayName: String {
        switch self {
        case .all: return "All Applications"
        case .submitted: return "Submitted"
        case .reviewing: return "Under Review"
        case .shortlisted: return "Shortlisted"
        case .interviewed: return "Interviewed"
        case .accepted: return "Accepted"
        case .rejected: return "Rejected"
        }
    }
    
    var status: ApplicationStatus? {
        switch self {
        case .all: return nil
        case .submitted: return .submitted
        case .reviewing: return .reviewing
        case .shortlisted: return .shortlisted
        case .interviewed: return .interviewed
        case .accepted: return .accepted
        case .rejected: return .rejected
        }
    }
}

struct JobApplicationWithJob {
    let application: JobApplication
    let job: Job
}

struct ApplicationHistoryView_Previews: PreviewProvider {
    static var previews: some View {
        ApplicationHistoryView()
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
