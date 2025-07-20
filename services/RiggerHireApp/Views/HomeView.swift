import SwiftUI

struct HomeView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            JobsView()
                .tabItem {
                    Image(systemName: "briefcase.fill")
                    Text("Jobs")
                }
                .tag(0)
            
            ProfileView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
                }
                .tag(1)
            
            PaymentsView()
                .tabItem {
                    Image(systemName: "creditcard.fill")
                    Text("Payments")
                }
                .tag(2)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Settings")
                }
                .tag(3)
        }
        .accentColor(ThemeManager.primaryCyan)
        .background(ThemeManager.backgroundPrimary)
    }
}

// MARK: - Jobs View
struct JobsView: View {
    @State private var jobs: [Job] = []
    @State private var showingFilters = false
    
    var body: some View {
        NavigationView {
            VStack {
                // Search and Filter Bar
                HStack {
                    TextField("Search jobs...", text: .constant(""))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(ThemeManager.backgroundSecondary)
                        .cornerRadius(25)
                        .foregroundColor(ThemeManager.textPrimary)
                    
                    Button(action: { showingFilters.toggle() }) {
                        Image(systemName: "line.3.horizontal.decrease.circle.fill")
                            .foregroundColor(ThemeManager.primaryCyan)
                            .font(.title2)
                    }
                }
                .padding(.horizontal)
                
                // Jobs List
                List(jobs) { job in
                    JobCardView(job: job)
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                }
                .listStyle(PlainListStyle())
                .background(ThemeManager.backgroundPrimary)
            }
            .navigationTitle("Available Jobs")
            .navigationBarTitleDisplayMode(.large)
            .background(ThemeManager.backgroundGradient)
            .sheet(isPresented: $showingFilters) {
                JobFiltersView()
            }
        }
    }
}

// MARK: - Job Card View
struct JobCardView: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(job.title)
                        .font(.headline)
                        .foregroundColor(ThemeManager.textPrimary)
                    
                    Text(job.company)
                        .font(.subheadline)
                        .foregroundColor(ThemeManager.textSecondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text("$\(job.hourlyRate, specifier: "%.0f")/hr")
                        .font(.headline)
                        .foregroundColor(ThemeManager.primaryCyan)
                    
                    Text(job.location)
                        .font(.caption)
                        .foregroundColor(ThemeManager.textSecondary)
                }
            }
            
            HStack {
                ForEach(job.requiredSkills.prefix(3), id: \.self) { skill in
                    Text(skill)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(ThemeManager.primaryCyan.opacity(0.2))
                        .foregroundColor(ThemeManager.primaryCyan)
                        .cornerRadius(12)
                }
                
                if job.requiredSkills.count > 3 {
                    Text("+\(job.requiredSkills.count - 3)")
                        .font(.caption)
                        .foregroundColor(ThemeManager.textSecondary)
                }
            }
        }
        .padding()
        .background(ThemeManager.backgroundSecondary)
        .cornerRadius(16)
        .shadow(color: ThemeManager.primaryCyan.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Job Filters View
struct JobFiltersView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedJobTypes: Set<String> = []
    @State private var minHourlyRate: Double = 0
    @State private var maxHourlyRate: Double = 150
    @State private var selectedLocations: Set<String> = []
    
    let jobTypes = ["Rigging", "Crane Operation", "Dogging", "Construction", "Mining"]
    let locations = ["Perth", "Kalgoorlie", "Port Hedland", "Karratha", "Pilbara"]
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Filter Jobs")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(ThemeManager.textPrimary)
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Job Types")
                        .font(.headline)
                        .foregroundColor(ThemeManager.textPrimary)
                    
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                        ForEach(jobTypes, id: \.self) { jobType in
                            Button(action: {
                                if selectedJobTypes.contains(jobType) {
                                    selectedJobTypes.remove(jobType)
                                } else {
                                    selectedJobTypes.insert(jobType)
                                }
                            }) {
                                Text(jobType)
                                    .font(.subheadline)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(selectedJobTypes.contains(jobType) ? ThemeManager.neonGradient : Color.clear)
                                    .foregroundColor(selectedJobTypes.contains(jobType) ? .white : ThemeManager.textPrimary)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 20)
                                            .stroke(ThemeManager.primaryCyan, lineWidth: 1)
                                    )
                                    .cornerRadius(20)
                            }
                        }
                    }
                }
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Hourly Rate Range")
                        .font(.headline)
                        .foregroundColor(ThemeManager.textPrimary)
                    
                    HStack {
                        Text("$\(minHourlyRate, specifier: "%.0f")")
                            .foregroundColor(ThemeManager.textSecondary)
                        Spacer()
                        Text("$\(maxHourlyRate, specifier: "%.0f")")
                            .foregroundColor(ThemeManager.textSecondary)
                    }
                    
                    // Custom range slider would go here
                    Slider(value: $minHourlyRate, in: 0...150)
                        .accentColor(ThemeManager.primaryCyan)
                }
                
                Spacer()
                
                HStack {
                    Button("Reset") {
                        selectedJobTypes.removeAll()
                        minHourlyRate = 0
                        maxHourlyRate = 150
                        selectedLocations.removeAll()
                    }
                    .foregroundColor(ThemeManager.textSecondary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(ThemeManager.textSecondary, lineWidth: 1)
                    )
                    
                    Button("Apply Filters") {
                        // Apply filters logic
                        dismiss()
                    }
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(ThemeManager.neonGradient)
                    .cornerRadius(10)
                }
            }
            .padding()
            .background(ThemeManager.backgroundGradient)
        }
    }
}

// MARK: - Job Model
struct Job: Identifiable, Codable {
    let id: UUID
    var title: String
    var company: String
    var location: String
    var hourlyRate: Double
    var requiredSkills: [String]
    var description: String
    var postedDate: Date
    
    init(id: UUID = UUID(), title: String, company: String, location: String, hourlyRate: Double, requiredSkills: [String], description: String, postedDate: Date = Date()) {
        self.id = id
        self.title = title
        self.company = company
        self.location = location
        self.hourlyRate = hourlyRate
        self.requiredSkills = requiredSkills
        self.description = description
        self.postedDate = postedDate
    }
}
