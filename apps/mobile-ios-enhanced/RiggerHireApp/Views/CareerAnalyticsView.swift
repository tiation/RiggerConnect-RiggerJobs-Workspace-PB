import SwiftUI

struct CareerAnalyticsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var careerStats: CareerStats = CareerStats(jobsCompleted: 0, highScore: 0, skillsAcquired: 0, yearsExperience: 0)
    @State private var isLoading = false
    @State private var selectedMetric: MetricPeriod = .allTime
    @State private var userGoals: [UserGoal] = []
    @State private var showGoals = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Career Summary
                        careerSummarySection
                        
                        // Metric Selector
                        metricSelectorSection
                        
                        // Performance Metrics
                        performanceMetricsSection
                        
                        // User Goals
                        userGoalsSection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Career Analytics")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                loadCareerStats()
            }
            .refreshable {
                loadCareerStats()
            }
        }
        .sheet(isPresented: $showGoals) {
            UserGoalsView(goals: $userGoals)
        }
    }
    
    private var careerSummarySection: some View {
        VStack(spacing: 16) {
            HStack(spacing: 16) {
                SummaryCard(
                    title: "Jobs Completed",
                    value: "\(careerStats.jobsCompleted)",
                    icon: "checkmark.square.fill",
                    color: themeManager.successColor
                )
                
                SummaryCard(
                    title: "High Score",
                    value: "\(careerStats.highScore)",
                    icon: "star.fill",
                    color: themeManager.accentColor
                )
            }
            
            HStack(spacing: 16) {
                SummaryCard(
                    title: "Skills Acquired",
                    value: "\(careerStats.skillsAcquired)",
                    icon: "hammer.fill",
                    color: Color.magenta
                )
                
                SummaryCard(
                    title: "Years Experience",
                    value: "\(careerStats.yearsExperience)",
                    icon: "calendar.fill",
                    color: Color.orange
                )
            }
        }
    }
    
    private var metricSelectorSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Metrics Period")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
                .padding(.horizontal)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(MetricPeriod.allCases, id: \.self) { period in
                        MetricChip(period: period, isSelected: selectedMetric == period) {
                            selectedMetric = period
                            loadCareerStats()
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
    }
    
    private var performanceMetricsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Performance Over Time")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            RoundedRectangle(cornerRadius: 12)
                .fill(themeManager.surfaceColor)
                .frame(height: 200)
                .overlay(
                    Text("Performance chart to be implemented")
                        .foregroundColor(themeManager.secondaryTextColor)
                )
        }
        .cardStyle(themeManager)
    }
    
    private var userGoalsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Your Goals")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("Edit Goals") {
                    showGoals = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if userGoals.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "target")
                        .font(.largeTitle)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("You haven't set any goals yet")
                        .foregroundColor(themeManager.mutedTextColor)
                        .font(.body)
                    
                    Text("Define your career objectives and track your progress")
                        .foregroundColor(themeManager.secondaryTextColor)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 24)
            } else {
                LazyVStack(spacing: 8) {
                    ForEach(userGoals, id: \.id) { goal in
                        GoalRowView(goal: goal)
                    }
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private func loadCareerStats() {
        guard let user = authManager.currentUser else { return }
        
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            careerStats = CareerStats(jobsCompleted: 95, highScore: 4, skillsAcquired: 12, yearsExperience: 8)
            userGoals = generateSampleGoals()
            isLoading = false
        }
    }
    
    private func generateSampleGoals() -e [UserGoal] {
        return [
            UserGoal(id: "1", description: "Complete 100 jobs", isAchieved: false),
            UserGoal(id: "2", description: "Acquire 15 skills", isAchieved: false),
            UserGoal(id: "3", description: "Achieve a high score of 5", isAchieved: false)
        ]
    }
}

struct SummaryCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.title2)
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text(title)
                .font(.caption)
                .foregroundColor(themeManager.secondaryTextColor)
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

struct MetricChip: View {
    let period: MetricPeriod
    let isSelected: Bool
    let action: () -e Void
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            Text(period.displayName)
                .font(.subheadline)
                .fontWeight(.medium)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? themeManager.accentColor : themeManager.surfaceColor)
                .foregroundColor(isSelected ? .black : themeManager.primaryTextColor)
                .cornerRadius(20)
        }
    }
}

struct GoalRowView: View {
    let goal: UserGoal
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(goal.description)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(goal.isAchieved ? "Achieved" : "In Progress")
                    .font(.caption)
                    .foregroundColor(goal.isAchieved ? themeManager.successColor : themeManager.mutedTextColor)
            }
            
            Spacer()
            
            if goal.isAchieved {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(themeManager.successColor)
            }
        }
        .padding()
        .background(themeManager.surfaceColor)
        .cornerRadius(8)
    }
}

struct UserGoalsView: View {
    @Binding var goals: [UserGoal]
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 16) {
                        ForEach(goals, id: \.id) { goal in
                            GoalRowView(goal: goal)
                        }
                        .onDelete(perform: deleteGoal)
                        
                        Button("Add New Goal") {
                            addNewGoal()
                        }
                        .buttonStyle(PrimaryButtonStyle(themeManager: themeManager))
                        .padding(.top, 20)
                    }
                    .padding()
                }
            }
            .navigationTitle("Edit Goals")
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
    
    private func deleteGoal(at offsets: IndexSet) {
        goals.remove(atOffsets: offsets)
    }
    
    private func addNewGoal() {
        let newGoal = UserGoal(id: UUID().uuidString, description: "Sample goal", isAchieved: false)
        goals.append(newGoal)
    }
}

// MARK: - Data Models

struct CareerStats {
    let jobsCompleted: Int
    let highScore: Int
    let skillsAcquired: Int
    let yearsExperience: Int
}

struct UserGoal: Identifiable {
    let id: String
    let description: String
    let isAchieved: Bool
}

enum MetricPeriod: CaseIterable {
    case thisWeek
    case thisMonth
    case thisYear
    case allTime
    
    var displayName: String {
        switch self {
        case .thisWeek: return "This Week"
        case .thisMonth: return "This Month"
        case .thisYear: return "This Year"
        case .allTime: return "All Time"
        }
    }
}

struct CareerAnalyticsView_Previews: PreviewProvider {
    static var previews: some View {
        CareerAnalyticsView()
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
