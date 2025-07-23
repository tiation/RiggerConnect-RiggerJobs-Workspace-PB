import SwiftUI

struct JobFiltersView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    
    @Binding var filters: JobFilters
    let onApply: (JobFilters) -> Void
    
    @State private var workingFilters: JobFilters
    
    init(filters: Binding<JobFilters>, onApply: @escaping (JobFilters) -> Void) {
        self._filters = filters
        self.onApply = onApply
        self._workingFilters = State(initialValue: filters.wrappedValue)
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Location filter
                        FilterSection(title: "Location") {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Image(systemName: "location")
                                        .foregroundColor(themeManager.accentColor)
                                    Text("City or State")
                                        .font(.caption)
                                        .foregroundColor(themeManager.secondaryTextColor)
                                }
                                
                                TextField("Enter location", text: $workingFilters.location)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                            }
                        }
                        
                        // Job Type filter
                        FilterSection(title: "Job Type") {
                            LazyVGrid(columns: [
                                GridItem(.flexible()),
                                GridItem(.flexible())
                            ], spacing: 12) {
                                ForEach(JobType.allCases, id: \.self) { jobType in
                                    SelectableChip(
                                        title: jobType.rawValue,
                                        isSelected: workingFilters.jobType == jobType
                                    ) {
                                        if workingFilters.jobType == jobType {
                                            workingFilters.jobType = nil
                                        } else {
                                            workingFilters.jobType = jobType
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Industry filter
                        FilterSection(title: "Industry") {
                            LazyVGrid(columns: [
                                GridItem(.flexible()),
                                GridItem(.flexible())
                            ], spacing: 12) {
                                ForEach(Industry.allCases, id: \.self) { industry in
                                    SelectableChip(
                                        title: industry.rawValue,
                                        isSelected: workingFilters.industry == industry
                                    ) {
                                        if workingFilters.industry == industry {
                                            workingFilters.industry = nil
                                        } else {
                                            workingFilters.industry = industry
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Experience Level filter
                        FilterSection(title: "Experience Level") {
                            LazyVGrid(columns: [
                                GridItem(.flexible()),
                                GridItem(.flexible())
                            ], spacing: 12) {
                                ForEach(ExperienceLevel.allCases, id: \.self) { level in
                                    SelectableChip(
                                        title: level.rawValue,
                                        isSelected: workingFilters.experienceLevel == level
                                    ) {
                                        if workingFilters.experienceLevel == level {
                                            workingFilters.experienceLevel = nil
                                        } else {
                                            workingFilters.experienceLevel = level
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Salary Range filter
                        FilterSection(title: "Salary Range (AUD/hour)") {
                            VStack(spacing: 16) {
                                HStack {
                                    VStack(alignment: .leading) {
                                        Text("Minimum")
                                            .font(.caption)
                                            .foregroundColor(themeManager.secondaryTextColor)
                                        
                                        TextField("0", value: $workingFilters.salaryMin, format: .number)
                                            .keyboardType(.decimalPad)
                                            .textFieldStyle(RoundedBorderTextFieldStyle())
                                    }
                                    
                                    VStack(alignment: .leading) {
                                        Text("Maximum")
                                            .font(.caption)
                                            .foregroundColor(themeManager.secondaryTextColor)
                                        
                                        TextField("1000", value: $workingFilters.salaryMax, format: .number)
                                            .keyboardType(.decimalPad)
                                            .textFieldStyle(RoundedBorderTextFieldStyle())
                                    }
                                }
                                
                                if let min = workingFilters.salaryMin, let max = workingFilters.salaryMax {
                                    Text("$\(Int(min)) - $\(Int(max)) per hour")
                                        .font(.caption)
                                        .foregroundColor(themeManager.accentColor)
                                }
                            }
                        }
                        
                        // Additional options
                        FilterSection(title: "Additional Options") {
                            VStack(spacing: 12) {
                                ToggleRow(
                                    title: "Remote Work Available",
                                    isOn: Binding(
                                        get: { workingFilters.isRemote ?? false },
                                        set: { workingFilters.isRemote = $0 ? true : nil }
                                    )
                                )
                                
                                ToggleRow(
                                    title: "Urgent Jobs Only",
                                    isOn: Binding(
                                        get: { workingFilters.isUrgent ?? false },
                                        set: { workingFilters.isUrgent = $0 ? true : nil }
                                    )
                                )
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Filter Jobs")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear All") {
                        workingFilters = JobFilters()
                    }
                    .foregroundColor(themeManager.errorColor)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Apply") {
                        filters = workingFilters
                        onApply(workingFilters)
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

struct FilterSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            content
        }
        .cardStyle(themeManager)
    }
}

struct SelectableChip: View {
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
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity)
                .background(
                    isSelected ? themeManager.accentColor : themeManager.surfaceColor
                )
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(
                            isSelected ? themeManager.accentColor : themeManager.accentColor.opacity(0.3),
                            lineWidth: 1
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ToggleRow: View {
    let title: String
    @Binding var isOn: Bool
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(themeManager.primaryTextColor)
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
        }
        .padding(.vertical, 4)
    }
}

struct JobFiltersView_Previews: PreviewProvider {
    static var previews: some View {
        JobFiltersView(filters: .constant(JobFilters())) { _ in }
            .environmentObject(ThemeManager())
    }
}
