import SwiftUI

struct JobsListView: View {
    @EnvironmentObject var jobManager: JobManager
    @State private var selectedJob: Job?
    @State private var searchText = ""
    @State private var selectedExperienceLevel: ExperienceLevel?
    
    var filteredJobs: [Job] {
        jobManager.jobs.filter { job in
            let matchesSearch = searchText.isEmpty || 
                job.title.localizedCaseInsensitiveContains(searchText) ||
                job.description.localizedCaseInsensitiveContains(searchText) ||
                job.location.city.localizedCaseInsensitiveContains(searchText)
            
            let matchesExperience = selectedExperienceLevel == nil || 
                job.experienceLevel == selectedExperienceLevel
            
            return matchesSearch && matchesExperience && job.status == .posted
        }
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                // Filters
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        FilterChip(
                            title: "All Levels",
                            isSelected: selectedExperienceLevel == nil,
                            action: { selectedExperienceLevel = nil }
                        )
                        
                        ForEach(ExperienceLevel.allCases, id: \.self) { level in
                            FilterChip(
                                title: level.displayName,
                                isSelected: selectedExperienceLevel == level,
                                action: { selectedExperienceLevel = level }
                            )
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 5)
                
                // Jobs List
                if filteredJobs.isEmpty {
                    ContentUnavailableView(
                        "No Jobs Available",
                        systemImage: "briefcase",
                        description: Text("Check back later for new opportunities")
                    )
                } else {
                    List(filteredJobs) { job in
                        JobRowView(job: job)
                            .onTapGesture {
                                selectedJob = job
                            }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Available Jobs")
            .searchable(text: $searchText, prompt: "Search jobs...")
            .refreshable {
                await jobManager.loadJobs()
            }
            .sheet(item: $selectedJob) { job in
                JobDetailView(job: job)
            }
        }
    }
}

struct JobRowView: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(job.title)
                    .font(.headline)
                Spacer()
                Text("$\(job.rate, specifier: "%.2f")/hr")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.orange)
            }
            
            HStack {
                Label(job.location.city, systemImage: "location.fill")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text(job.experienceLevel.displayName)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(experienceLevelColor(job.experienceLevel))
                    .foregroundColor(.white)
                    .cornerRadius(4)
            }
            
            Text(job.description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)
            
            HStack {
                Label("Starts \(job.startDate.formatted(date: .abbreviated, time: .omitted))", 
                      systemImage: "calendar")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if !job.requiredCertifications.isEmpty {
                    Label("\(job.requiredCertifications.count) certifications required", 
                          systemImage: "checkmark.shield.fill")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    func experienceLevelColor(_ level: ExperienceLevel) -> Color {
        switch level {
        case .entry: return .green
        case .intermediate: return .blue
        case .advanced: return .orange
        case .expert: return .red
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.orange : Color.gray.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(15)
        }
    }
}
