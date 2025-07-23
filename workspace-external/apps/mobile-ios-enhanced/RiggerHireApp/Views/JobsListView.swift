import SwiftUI
import MapKit

struct JobsListView: View {
    @EnvironmentObject var jobManager: JobManager
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var searchText = ""
    @State private var showingFilters = false
    @State private var showingJobDetail = false
    @State private var selectedJob: Job?
    @State private var viewMode: ViewMode = .list
    
    enum ViewMode: CaseIterable {
        case list, map
        
        var displayName: String {
            switch self {
            case .list: return "List"
            case .map: return "Map"
            }
        }
        
        var icon: String {
            switch self {
            case .list: return "list.bullet"
            case .map: return "map"
            }
        }
    }
    
    var filteredJobs: [Job] {
        let jobs = searchText.isEmpty ? jobManager.availableJobs : 
                   jobManager.availableJobs.filter { job in
                       job.title.localizedCaseInsensitiveContains(searchText) ||
                       job.description.localizedCaseInsensitiveContains(searchText) ||
                       job.location.city.localizedCaseInsensitiveContains(searchText)
                   }
        return jobs
    }
    
    var urgentJobsCount: Int {
        filteredJobs.filter { $0.isUrgent }.count
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                // Dark background
                Color.black.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Search and Filter Header
                    headerSection
                    
                    // View Mode Picker
                    viewModeSection
                    
                    // Job Content
                    if jobManager.isLoading {
                        loadingView
                    } else if filteredJobs.isEmpty {
                        emptyStateView
                    } else {
                        switch viewMode {
                        case .list:
                            jobsListView
                        case .map:
                            jobsMapView
                        }
                    }
                }
            }
            .navigationTitle("Available Jobs")
            .navigationBarTitleDisplayMode(.large)
            .preferredColorScheme(.dark)
            .refreshable {
                jobManager.refreshJobs()
            }
            .sheet(isPresented: $showingFilters) {
                JobFiltersView()
            }
            .sheet(item: $selectedJob) { job in
                JobDetailView(job: job)
            }
        }
        .onAppear {
            if jobManager.availableJobs.isEmpty {
                jobManager.loadJobs()
            }
        }
    }
    
    private var headerSection: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                // Search Field
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.cyan)
                    
                    TextField("Search jobs...", text: $searchText)
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(Color.black.opacity(0.3))
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
                
                // Filter Button
                Button {
                    showingFilters = true
                } label: {
                    ZStack {
                        Image(systemName: "slider.horizontal.3")
                            .font(.title2)
                            .foregroundColor(.cyan)
                        
                        if jobManager.jobFilters.hasActiveFilters {
                            Circle()
                                .fill(Color.red)
                                .frame(width: 8, height: 8)
                                .offset(x: 8, y: -8)
                        }
                    }
                }
                .padding()
                .background(Color.black.opacity(0.3))
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
            }
            .padding(.horizontal)
            
            // Job Count and Stats
            HStack {
                Text("\(filteredJobs.count) jobs available")
                    .foregroundColor(.gray)
                    .font(.subheadline)
                
                Spacer()
                
                if urgentJobsCount > 0 {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.orange)
                        Text("\(urgentJobsCount) urgent")
                            .foregroundColor(.orange)
                    }
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.orange.opacity(0.1))
                    .cornerRadius(8)
                }
            }
            .padding(.horizontal)
        }
        .padding(.top, 8)
        .background(Color.black.opacity(0.8))
    }
    
    private var viewModeSection: some View {
        Picker("View Mode", selection: $viewMode) {
            ForEach(ViewMode.allCases, id: \.self) { mode in
                Label(mode.displayName, systemImage: mode.icon)
                    .tag(mode)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
        .padding(.horizontal)
        .padding(.bottom, 10)
        .background(Color.black.opacity(0.8))
    }
    
    private var jobsListView: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredJobs) { job in
                    JobCardView(job: job) {
                        selectedJob = job
                    }
                }
            }
            .padding(.horizontal)
            .padding(.bottom, 20)
        }
    }
    
    private var jobsMapView: some View {
        JobsMapView(jobs: filteredJobs) { job in
            selectedJob = job
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                .scaleEffect(1.5)
            
            Text("Loading jobs...")
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
                    Text(searchText.isEmpty ? "No Jobs Available" : "No Matching Jobs")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                    
                    Text(searchText.isEmpty ? 
                         "Check back later for new opportunities" : 
                         "Try adjusting your search or filters")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
            }
            
            if !searchText.isEmpty || jobManager.jobFilters.hasActiveFilters {
                Button("Clear Filters") {
                    searchText = ""
                    jobManager.applyFilters(JobFilters())
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
}

struct JobCardView: View {
    let job: Job
    let onTap: () -> Void
    @EnvironmentObject var jobManager: JobManager
    @State private var isApplying = false
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                // Header with job type and urgency
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
                    
                    if job.isUrgent {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.caption)
                            Text(job.urgencyLevel.displayName)
                                .font(.caption)
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.orange)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.orange.opacity(0.1))
                        .cornerRadius(6)
                    }
                }
                
                // Job title and company
                VStack(alignment: .leading, spacing: 4) {
                    Text(job.title)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.leading)
                    
                    Text(job.description)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .lineLimit(2)
                }
                
                // Location and site type
                HStack {
                    Image(systemName: job.location.siteType.icon)
                        .foregroundColor(.cyan)
                        .font(.caption)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(job.location.siteType.displayName)
                            .font(.caption)
                            .foregroundColor(.cyan)
                        
                        Text("\(job.location.city), \(job.location.state)")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    if let distance = job.distanceFromCurrentLocation {
                        Text(String(format: "%.1f km", distance))
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
                
                // Job details
                HStack {
                    Label(job.experienceLevel.displayName, systemImage: "star.fill")
                        .font(.caption)
                        .foregroundColor(.yellow)
                    
                    Spacer()
                    
                    Label(job.shiftPattern.displayName, systemImage: "clock.fill")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                
                // Rate and apply button
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(job.formattedRate)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(.green)
                        
                        Text("Start: \(DateFormatter.short.string(from: job.startDate))")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    Button {
                        isApplying = true
                        Task {
                            let success = await jobManager.applyForJob(job)
                            isApplying = false
                        }
                    } label: {
                        if isApplying {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .scaleEffect(0.8)
                        } else {
                            Text("Apply")
                                .fontWeight(.semibold)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(
                        LinearGradient(
                            colors: [.cyan, .blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .disabled(isApplying)
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
}

struct JobsMapView: View {
    let jobs: [Job]
    let onJobTap: (Job) -> Void
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: -31.9505, longitude: 115.8605), // Perth
        span: MKCoordinateSpan(latitudeDelta: 2.0, longitudeDelta: 2.0)
    )
    
    var body: some View {
        Map(coordinateRegion: $region, annotationItems: jobs) { job in
            MapAnnotation(coordinate: job.location.coordinate?.clLocation ?? CLLocationCoordinate2D()) {
                Button {
                    onJobTap(job)
                } label: {
                    VStack {
                        ZStack {
                            Circle()
                                .fill(job.isUrgent ? Color.orange : Color.cyan)
                                .frame(width: 30, height: 30)
                            
                            Image(systemName: job.jobType.icon)
                                .foregroundColor(.white)
                                .font(.caption)
                        }
                        .shadow(color: .black.opacity(0.3), radius: 3)
                        
                        Text(job.formattedRate)
                            .font(.caption2)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.black.opacity(0.7))
                            .cornerRadius(4)
                    }
                }
            }
        }
        .mapStyle(.standard(elevation: .realistic))
        .onAppear {
            if let firstJob = jobs.first,
               let coordinate = firstJob.location.coordinate {
                region = MKCoordinateRegion(
                    center: coordinate.clLocation,
                    span: MKCoordinateSpan(latitudeDelta: 0.5, longitudeDelta: 0.5)
                )
            }
        }
    }
}

#Preview {
    JobsListView()
        .environmentObject(JobManager())
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
