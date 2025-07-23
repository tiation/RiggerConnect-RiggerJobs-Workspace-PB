import SwiftUI

struct JobAlertsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var alerts: [JobAlert] = []
    @State private var isLoading = false
    @State private var showCreateAlert = false
    @State private var alertToEdit: JobAlert?
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    if isLoading {
                        loadingView
                    } else if alerts.isEmpty {
                        emptyStateView
                    } else {
                        alertsList
                    }
                }
            }
            .navigationTitle("Job Alerts")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showCreateAlert = true }) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(themeManager.accentColor)
                            .font(.title2)
                    }
                }
            }
            .onAppear {
                loadAlerts()
            }
            .refreshable {
                loadAlerts()
            }
        }
        .sheet(isPresented: $showCreateAlert) {
            CreateJobAlertView { newAlert in
                alerts.append(newAlert)
            }
        }
        .sheet(item: $alertToEdit) { alert in
            EditJobAlertView(alert: alert) { updatedAlert in
                if let index = alerts.firstIndex(where: { $0.id == alert.id }) {
                    alerts[index] = updatedAlert
                }
            }
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(themeManager.accentColor)
            Text("Loading alerts...")
                .foregroundColor(themeManager.secondaryTextColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Image(systemName: "bell.badge")
                .font(.system(size: 60))
                .foregroundColor(themeManager.mutedTextColor)
            
            VStack(spacing: 8) {
                Text("No Job Alerts Set")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text("Create alerts to get notified about new jobs that match your preferences")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(themeManager.secondaryTextColor)
                    .padding(.horizontal, 40)
            }
            
            Button("Create First Alert") {
                showCreateAlert = true
            }
            .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var alertsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                // Quick Stats
                quickStatsSection
                
                // Alert Cards
                ForEach(alerts, id: \.id) { alert in
                    JobAlertCard(alert: alert) { action in
                        handleAlertAction(action, for: alert)
                    }
                }
            }
            .padding()
        }
    }
    
    private var quickStatsSection: some View {
        HStack(spacing: 16) {
            StatCard(
                title: "Active Alerts",
                value: "\(alerts.filter { $0.isActive }.count)",
                icon: "bell.fill",
                color: themeManager.successColor
            )
            
            StatCard(
                title: "Total Matches",
                value: "\(alerts.reduce(0) { $0 + $1.matchCount })",
                icon: "target",
                color: themeManager.accentColor
            )
            
            StatCard(
                title: "This Week",
                value: "\(alerts.reduce(0) { $0 + $1.weeklyMatches })",
                icon: "calendar",
                color: Color.magenta
            )
        }
        .padding(.bottom, 8)
    }
    
    private func handleAlertAction(_ action: JobAlertAction, for alert: JobAlert) {
        switch action {
        case .edit:
            alertToEdit = alert
        case .toggle:
            toggleAlert(alert)
        case .delete:
            deleteAlert(alert)
        case .viewMatches:
            viewMatches(for: alert)
        }
    }
    
    private func toggleAlert(_ alert: JobAlert) {
        if let index = alerts.firstIndex(where: { $0.id == alert.id }) {
            alerts[index].isActive.toggle()
        }
    }
    
    private func deleteAlert(_ alert: JobAlert) {
        alerts.removeAll { $0.id == alert.id }
    }
    
    private func viewMatches(for alert: JobAlert) {
        // TODO: Navigate to job matches for this alert
        print("Viewing matches for alert: \(alert.title)")
    }
    
    private func loadAlerts() {
        guard let user = authManager.currentUser else { return }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            alerts = generateSampleAlerts()
            isLoading = false
        }
    }
    
    private func generateSampleAlerts() -> [JobAlert] {
        return [
            JobAlert(
                id: "1",
                title: "Crane Operator Jobs",
                keywords: ["crane operator", "tower crane", "mobile crane"],
                location: "Perth, WA",
                radius: 50,
                minSalary: 40,
                maxSalary: 60,
                jobTypes: [.fullTime, .contract],
                isActive: true,
                createdAt: Date().addingTimeInterval(-86400 * 7),
                matchCount: 24,
                weeklyMatches: 6,
                lastMatchDate: Date().addingTimeInterval(-86400 * 2)
            ),
            JobAlert(
                id: "2",
                title: "Rigging Specialist",
                keywords: ["rigging", "lifting", "heavy machinery"],
                location: "Fremantle, WA",
                radius: 25,
                minSalary: 35,
                maxSalary: 50,
                jobTypes: [.contract, .casual],
                isActive: true,
                createdAt: Date().addingTimeInterval(-86400 * 14),
                matchCount: 18,
                weeklyMatches: 3,
                lastMatchDate: Date().addingTimeInterval(-86400 * 1)
            ),
            JobAlert(
                id: "3",
                title: "High-Paying Construction",
                keywords: ["construction", "site supervisor"],
                location: "Perth Metro",
                radius: 75,
                minSalary: 50,
                maxSalary: 80,
                jobTypes: [.fullTime],
                isActive: false,
                createdAt: Date().addingTimeInterval(-86400 * 30),
                matchCount: 9,
                weeklyMatches: 0,
                lastMatchDate: Date().addingTimeInterval(-86400 * 10)
            )
        ]
    }
}

struct JobAlertCard: View {
    let alert: JobAlert
    let onAction: (JobAlertAction) -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(alert.title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text("Created \(formatDate(alert.createdAt))")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                }
                
                Spacer()
                
                // Status Toggle
                Toggle("", isOn: Binding(
                    get: { alert.isActive },
                    set: { _ in onAction(.toggle) }
                ))
                .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
            }
            
            // Alert Details
            VStack(alignment: .leading, spacing: 8) {
                // Keywords
                if !alert.keywords.isEmpty {
                    HStack {
                        Image(systemName: "tag")
                            .foregroundColor(themeManager.accentColor)
                            .frame(width: 16)
                        Text(alert.keywords.joined(separator: ", "))
                            .font(.caption)
                            .foregroundColor(themeManager.secondaryTextColor)
                            .lineLimit(2)
                    }
                }
                
                // Location
                HStack {
                    Image(systemName: "location")
                        .foregroundColor(themeManager.accentColor)
                        .frame(width: 16)
                    Text("\(alert.location) (within \(alert.radius)km)")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
                
                // Salary Range
                HStack {
                    Image(systemName: "dollarsign")
                        .foregroundColor(themeManager.successColor)
                        .frame(width: 16)
                    Text("$\(Int(alert.minSalary))-\(Int(alert.maxSalary))/hour")
                        .font(.caption)
                        .foregroundColor(themeManager.successColor)
                }
                
                // Job Types
                HStack {
                    Image(systemName: "briefcase")
                        .foregroundColor(themeManager.accentColor)
                        .frame(width: 16)
                    Text(alert.jobTypes.map { $0.rawValue }.joined(separator: ", "))
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
            }
            
            // Statistics
            HStack(spacing: 24) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(alert.matchCount)")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.primaryTextColor)
                    Text("Total Matches")
                        .font(.caption2)
                        .foregroundColor(themeManager.mutedTextColor)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(alert.weeklyMatches)")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.accentColor)
                    Text("This Week")
                        .font(.caption2)
                        .foregroundColor(themeManager.mutedTextColor)
                }
                
                Spacer()
                
                if let lastMatch = alert.lastMatchDate {
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("Last Match")
                            .font(.caption2)
                            .foregroundColor(themeManager.mutedTextColor)
                        Text(formatRelativeDate(lastMatch))
                            .font(.caption)
                            .foregroundColor(themeManager.secondaryTextColor)
                    }
                }
            }
            
            // Action Buttons
            HStack(spacing: 12) {
                Button("View Matches") {
                    onAction(.viewMatches)
                }
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(themeManager.accentColor.opacity(0.2))
                .foregroundColor(themeManager.accentColor)
                .cornerRadius(8)
                
                Button("Edit") {
                    onAction(.edit)
                }
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(themeManager.surfaceColor)
                .foregroundColor(themeManager.primaryTextColor)
                .cornerRadius(8)
                
                Spacer()
                
                Button(action: { onAction(.delete) }) {
                    Image(systemName: "trash")
                        .foregroundColor(themeManager.errorColor)
                        .font(.caption)
                }
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(alert.isActive ? themeManager.accentColor.opacity(0.3) : themeManager.mutedTextColor.opacity(0.2), lineWidth: 1)
        )
        .opacity(alert.isActive ? 1.0 : 0.7)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter.string(from: date)
    }
    
    private func formatRelativeDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.title3)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text(title)
                .font(.caption)
                .foregroundColor(themeManager.secondaryTextColor)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(color.opacity(0.3), lineWidth: 1)
        )
    }
}

struct CreateJobAlertView: View {
    let onSave: (JobAlert) -> Void
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    @State private var title = ""
    @State private var keywords = ""
    @State private var location = ""
    @State private var radius: Double = 25
    @State private var minSalary: Double = 30
    @State private var maxSalary: Double = 60
    @State private var selectedJobTypes: Set<JobType> = []
    @State private var notificationFrequency: NotificationFrequency = .immediate
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Basic Information
                        basicInfoSection
                        
                        // Location & Range
                        locationSection
                        
                        // Salary Range
                        salarySection
                        
                        // Job Types
                        jobTypesSection
                        
                        // Notification Settings
                        notificationSection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Create Job Alert")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveAlert()
                    }
                    .foregroundColor(themeManager.accentColor)
                    .fontWeight(.semibold)
                    .disabled(title.isEmpty || location.isEmpty)
                }
            }
        }
    }
    
    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Alert Details")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            CustomTextField(
                title: "Alert Name",
                text: $title,
                icon: "bell",
                placeholder: "e.g., Crane Operator Jobs"
            )
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Keywords (comma separated)")
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                TextField("e.g., crane operator, rigging, construction", text: $keywords)
                    .padding()
                    .background(themeManager.surfaceColor)
                    .cornerRadius(8)
                    .foregroundColor(themeManager.primaryTextColor)
            }
        }
        .cardStyle(themeManager)
    }
    
    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Location & Range")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            CustomTextField(
                title: "Location",
                text: $location,
                icon: "location",
                placeholder: "e.g., Perth, WA"
            )
            
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Search Radius")
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Spacer()
                    
                    Text("\(Int(radius)) km")
                        .font(.subheadline)
                        .foregroundColor(themeManager.accentColor)
                }
                
                Slider(value: $radius, in: 5...100, step: 5)
                    .tint(themeManager.accentColor)
            }
        }
        .cardStyle(themeManager)
    }
    
    private var salarySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Salary Range (AUD/hour)")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Minimum")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    HStack {
                        Text("$")
                            .foregroundColor(themeManager.successColor)
                        TextField("30", value: $minSalary, format: .number)
                            .keyboardType(.numberPad)
                    }
                    .padding()
                    .background(themeManager.surfaceColor)
                    .cornerRadius(8)
                    .foregroundColor(themeManager.primaryTextColor)
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Maximum")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    HStack {
                        Text("$")
                            .foregroundColor(themeManager.successColor)
                        TextField("60", value: $maxSalary, format: .number)
                            .keyboardType(.numberPad)
                    }
                    .padding()
                    .background(themeManager.surfaceColor)
                    .cornerRadius(8)
                    .foregroundColor(themeManager.primaryTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var jobTypesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Job Types")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(JobType.allCases, id: \.self) { jobType in
                    JobTypeToggle(
                        jobType: jobType,
                        isSelected: selectedJobTypes.contains(jobType),
                        onToggle: {
                            if selectedJobTypes.contains(jobType) {
                                selectedJobTypes.remove(jobType)
                            } else {
                                selectedJobTypes.insert(jobType)
                            }
                        }
                    )
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var notificationSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Notification Settings")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(alignment: .leading, spacing: 12) {
                ForEach(NotificationFrequency.allCases, id: \.self) { frequency in
                    HStack {
                        Button(action: { notificationFrequency = frequency }) {
                            Image(systemName: notificationFrequency == frequency ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(notificationFrequency == frequency ? themeManager.accentColor : themeManager.mutedTextColor)
                        }
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text(frequency.displayName)
                                .font(.subheadline)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            Text(frequency.description)
                                .font(.caption)
                                .foregroundColor(themeManager.secondaryTextColor)
                        }
                        
                        Spacer()
                    }
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private func saveAlert() {
        let keywordArray = keywords.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        
        let newAlert = JobAlert(
            id: UUID().uuidString,
            title: title,
            keywords: keywordArray,
            location: location,
            radius: Int(radius),
            minSalary: minSalary,
            maxSalary: maxSalary,
            jobTypes: Array(selectedJobTypes),
            isActive: true,
            createdAt: Date(),
            matchCount: 0,
            weeklyMatches: 0,
            lastMatchDate: nil
        )
        
        onSave(newAlert)
        dismiss()
    }
}

struct JobTypeToggle: View {
    let jobType: JobType
    let isSelected: Bool
    let onToggle: () -> Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: onToggle) {
            HStack {
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? themeManager.accentColor : themeManager.mutedTextColor)
                
                Text(jobType.rawValue)
                    .font(.subheadline)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
            }
            .padding()
            .background(isSelected ? themeManager.accentColor.opacity(0.1) : themeManager.surfaceColor)
            .cornerRadius(8)
        }
    }
}

struct EditJobAlertView: View {
    let alert: JobAlert
    let onSave: (JobAlert) -> Void
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        // Implementation would be similar to CreateJobAlertView but pre-populated with alert data
        Text("Edit Alert: \(alert.title)")
            .onTapGesture {
                dismiss()
            }
    }
}

// MARK: - Data Models

struct JobAlert: Identifiable {
    let id: String
    let title: String
    let keywords: [String]
    let location: String
    let radius: Int
    let minSalary: Double
    let maxSalary: Double
    let jobTypes: [JobType]
    var isActive: Bool
    let createdAt: Date
    let matchCount: Int
    let weeklyMatches: Int
    let lastMatchDate: Date?
}

enum JobAlertAction {
    case edit, toggle, delete, viewMatches
}

enum NotificationFrequency: CaseIterable {
    case immediate, daily, weekly
    
    var displayName: String {
        switch self {
        case .immediate: return "Immediate"
        case .daily: return "Daily Digest"
        case .weekly: return "Weekly Summary"
        }
    }
    
    var description: String {
        switch self {
        case .immediate: return "Get notified as soon as new jobs are posted"
        case .daily: return "Receive a daily summary of new matches"
        case .weekly: return "Get a weekly roundup of all matches"
        }
    }
}

struct JobAlertsView_Previews: PreviewProvider {
    static var previews: some View {
        JobAlertsView()
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
