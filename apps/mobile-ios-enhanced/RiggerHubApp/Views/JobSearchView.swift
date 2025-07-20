import SwiftUI

struct JobSearchView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @StateObject private var jobManager = JobManager()
    
    @State private var searchText = ""
    @State private var showFilters = false
    @State private var selectedJob: JobListing?
    @State private var filters = JobFilters()
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Search and filter bar
                    searchAndFilterBar
                    
                    // Job listings
                    if jobManager.isLoading {
                        loadingView
                    } else if jobManager.jobs.isEmpty {
                        emptyStateView
                    } else {
                        jobListView
                    }
                }
            }
            .navigationTitle("Find Jobs")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showFilters.toggle()
                    } label: {
                        Image(systemName: "slider.horizontal.3")
                            .foregroundColor(themeManager.accentColor)
                    }
                }
            }
            .onAppear {
                jobManager.fetchJobs()
            }
            .sheet(isPresented: $showFilters) {
                JobFiltersView(filters: $filters) { newFilters in
                    jobManager.fetchJobs(filters: newFilters)
                }
            }
            .sheet(item: $selectedJob) { job in
                JobDetailView(job: job)
            }
        }
    }
    
    private var searchAndFilterBar: some View {
        VStack(spacing: 12) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(themeManager.mutedTextColor)
                
                TextField("Search jobs, companies, skills...", text: $searchText)
                    .foregroundColor(themeManager.primaryTextColor)
                    .onChange(of: searchText) { newValue in
                        jobManager.searchJobs(query: newValue)
                    }
                
                if !searchText.isEmpty {
                    Button {
                        searchText = ""
                        jobManager.fetchJobs()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(themeManager.mutedTextColor)
                    }
                }
            }
            .padding()
            .background(themeManager.surfaceColor)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(themeManager.accentColor.opacity(0.2), lineWidth: 1)
            )
            
            // Quick filter chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    FilterChip(
                        title: "All Jobs",
                        isSelected: filters.jobType == nil,
                        action: {
                            filters.jobType = nil
                            jobManager.fetchJobs(filters: filters)
                        }
                    )
                    
                    ForEach(JobType.allCases, id: \.self) { jobType in
                        FilterChip(
                            title: jobType.rawValue,
                            isSelected: filters.jobType == jobType,
                            action: {
                                filters.jobType = jobType
                                jobManager.fetchJobs(filters: filters)
                            }
                        )
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }
    
    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: themeManager.accentColor))
                .scaleEffect(1.5)
            
            Text("Finding great jobs for you...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            Text("No Jobs Found")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text("Try adjusting your search criteria or check back later for new opportunities.")
                .font(.body)
                .foregroundColor(themeManager.secondaryTextColor)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            
            Button("Clear Filters") {
                filters = JobFilters()
                searchText = ""
                jobManager.fetchJobs()
            }
            .neonButtonStyle(themeManager)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
    
    private var jobListView: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(filteredJobs) { job in
                    JobCardView(job: job) {
                        selectedJob = job
                    }
                }
            }
            .padding()
        }
        .refreshable {
            jobManager.fetchJobs(filters: filters)
        }
    }
    
    private var filteredJobs: [JobListing] {
        if searchText.isEmpty {
            return jobManager.jobs
        } else {
            return jobManager.jobs.filter { job in
                job.title.localizedCaseInsensitiveContains(searchText) ||
                job.companyName.localizedCaseInsensitiveContains(searchText) ||
                job.location.displayLocation.localizedCaseInsensitiveContains(searchText) ||
                job.requiredSkills.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }
    }
}

struct JobCardView: View {
    let job: JobListing
    let onTap: () -> Void
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(job.title)
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(themeManager.primaryTextColor)
                            .multilineTextAlignment(.leading)
                        
                        Text(job.companyName)
                            .font(.subheadline)
                            .foregroundColor(themeManager.accentColor)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        if job.isUrgent {
                            Text("URGENT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(themeManager.errorColor)
                                .cornerRadius(4)
                        }
                        
                        Text(job.timePosted)
                            .font(.caption)
                            .foregroundColor(themeManager.mutedTextColor)
                    }
                }
                
                // Location and job type
                HStack {
                    Label(job.location.displayLocation, systemImage: "location")
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    Text(job.jobType.rawValue)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.primaryColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(themeManager.primaryColor.opacity(0.2))
                        .cornerRadius(6)
                }
                
                // Salary
                if job.salaryRange.minAmount > 0 {
                    HStack {
                        Image(systemName: "dollarsign.circle")
                            .foregroundColor(themeManager.successColor)
                        
                        Text(job.formattedSalary)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.successColor)
                        
                        Spacer()
                    }
                }
                
                // Required skills (first 3)
                if !job.requiredSkills.isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Required Skills:")
                            .font(.caption)
                            .foregroundColor(themeManager.mutedTextColor)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(Array(job.requiredSkills.prefix(5)), id: \.self) { skill in
                                    Text(skill)
                                        .font(.caption)
                                        .foregroundColor(themeManager.primaryTextColor)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(themeManager.surfaceColor)
                                        .cornerRadius(8)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
                                        )
                                }
                            }
                        }
                    }
                }
                
                // Application status
                HStack {
                    Circle()
                        .fill(statusColor(for: job.applicationStatus))
                        .frame(width: 8, height: 8)
                    
                    Text("\(job.currentApplications) applications")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Spacer()
                    
                    Text("View Details")
                        .font(.caption)
                        .foregroundColor(themeManager.accentColor)
                        .fontWeight(.medium)
                }
            }
            .padding()
        }
        .cardStyle(themeManager)
        .buttonStyle(PlainButtonStyle())
    }
    
    private func statusColor(for status: ApplicationStatus) -> Color {
        switch status {
        case .open:
            return themeManager.successColor
        case .paused:
            return themeManager.warningColor
        case .closed, .filled:
            return themeManager.errorColor
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
                .foregroundColor(isSelected ? themeManager.backgroundColor : themeManager.primaryTextColor)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    isSelected ? themeManager.accentColor : themeManager.surfaceColor
                )
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

class JobManager: ObservableObject {
    @Published var jobs: [JobListing] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let supabaseService = SupabaseService.shared
    
    func fetchJobs(filters: JobFilters? = nil) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let fetchedJobs = try await supabaseService.fetchJobs(filters: filters)
                
                await MainActor.run {
                    self.jobs = fetchedJobs
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func searchJobs(query: String) {
        // Real-time search could be implemented here
        // For now, we'll filter on the client side in the view
    }
}

struct JobSearchView_Previews: PreviewProvider {
    static var previews: some View {
        JobSearchView()
            .environmentObject(ThemeManager())
    }
}
