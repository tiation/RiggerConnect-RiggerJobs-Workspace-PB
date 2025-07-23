import SwiftUI

struct CreateJobScreen: View {
    @EnvironmentObject var jobManager: JobsManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var jobTitle = ""
    @State private var jobDescription = ""
    @State private var selectedJobType: JobType = .fullTime
    @State private var selectedExperienceLevel: ExperienceLevel = .midLevel
    @State private var location = ""
    @State private var isRemote = false
    @State private var salaryMin = ""
    @State private var salaryMax = ""
    @State private var requiredSkills: [String] = []
    @State private var newSkill = ""
    @State private var benefits: [String] = []
    @State private var selectedBenefits = Set<String>()
    
    private let availableBenefits = [
        "Health Insurance", "Dental Insurance", "Vision Insurance",
        "401(k) Matching", "Flexible Hours", "Remote Work",
        "Paid Time Off", "Professional Development", "Stock Options",
        "Gym Membership", "Free Meals", "Transportation"
    ]
    
    var body: some View {
        NavigationView {
            Form {
                Section("Job Details") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Job Title")
                            .font(.headline)
                            .foregroundColor(.white)
                        TextField("e.g. Senior iOS Developer", text: $jobTitle)
                            .textFieldStyle(NeonTextFieldStyle())
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Job Type")
                            .font(.headline)
                            .foregroundColor(.white)
                        Picker("Job Type", selection: $selectedJobType) {
                            ForEach(JobType.allCases, id: \.self) { type in
                                Text(type.displayName).tag(type)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Experience Level")
                            .font(.headline)
                            .foregroundColor(.white)
                        Picker("Experience Level", selection: $selectedExperienceLevel) {
                            ForEach(ExperienceLevel.allCases, id: \.self) { level in
                                Text(level.displayName).tag(level)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                    }
                }
                .listRowBackground(Color.gray.opacity(0.1))
                
                Section("Location & Compensation") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Location")
                            .font(.headline)
                            .foregroundColor(.white)
                        TextField("e.g. San Francisco, CA", text: $location)
                            .textFieldStyle(NeonTextFieldStyle())
                    }
                    
                    Toggle("Remote Work Available", isOn: $isRemote)
                        .foregroundColor(.white)
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Min Salary")
                                .font(.subheadline)
                                .foregroundColor(.white)
                            TextField("$80,000", text: $salaryMin)
                                .textFieldStyle(NeonTextFieldStyle())
                                .keyboardType(.numberPad)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Max Salary")
                                .font(.subheadline)
                                .foregroundColor(.white)
                            TextField("$120,000", text: $salaryMax)
                                .textFieldStyle(NeonTextFieldStyle())
                                .keyboardType(.numberPad)
                        }
                    }
                }
                .listRowBackground(Color.gray.opacity(0.1))
                
                Section("Job Description") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Description")
                            .font(.headline)
                            .foregroundColor(.white)
                        TextEditor(text: $jobDescription)
                            .frame(minHeight: 120)
                            .padding(8)
                            .background(Color.gray.opacity(0.2))
                            .cornerRadius(8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                            )
                    }
                }
                .listRowBackground(Color.gray.opacity(0.1))
                
                Section("Required Skills") {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            TextField("Add skill", text: $newSkill)
                                .textFieldStyle(NeonTextFieldStyle())
                            Button("Add") {
                                if !newSkill.isEmpty && !requiredSkills.contains(newSkill) {
                                    requiredSkills.append(newSkill)
                                    newSkill = ""
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color.cyan)
                            .foregroundColor(.black)
                            .cornerRadius(8)
                        }
                        
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
                            ForEach(requiredSkills, id: \.self) { skill in
                                HStack {
                                    Text(skill)
                                        .font(.caption)
                                        .foregroundColor(.white)
                                    Button(action: {
                                        requiredSkills.removeAll { $0 == skill }
                                    }) {
                                        Image(systemName: "xmark.circle.fill")
                                            .font(.caption)
                                            .foregroundColor(.red)
                                    }
                                }
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.3))
                                .cornerRadius(12)
                            }
                        }
                    }
                }
                .listRowBackground(Color.gray.opacity(0.1))
                
                Section("Benefits") {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))], spacing: 8) {
                        ForEach(availableBenefits, id: \.self) { benefit in
                            Button(action: {
                                if selectedBenefits.contains(benefit) {
                                    selectedBenefits.remove(benefit)
                                } else {
                                    selectedBenefits.insert(benefit)
                                }
                            }) {
                                HStack {
                                    Image(systemName: selectedBenefits.contains(benefit) ? "checkmark.circle.fill" : "circle")
                                    Text(benefit)
                                        .font(.caption)
                                }
                                .foregroundColor(selectedBenefits.contains(benefit) ? .cyan : .white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(selectedBenefits.contains(benefit) ? Color.cyan : Color.gray, lineWidth: 1)
                                )
                            }
                        }
                    }
                }
                .listRowBackground(Color.gray.opacity(0.1))
            }
            .background(Color.black)
            .scrollContentBackground(.hidden)
            .navigationTitle("Create Job Posting")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.cyan),
                trailing: Button("Post Job") {
                    createJob()
                }
                .foregroundColor(.cyan)
                .disabled(!isFormValid)
            )
        }
    }
    
    private var isFormValid: Bool {
        !jobTitle.isEmpty && !jobDescription.isEmpty && !location.isEmpty
    }
    
    private func createJob() {
        let job = Job(
            id: UUID().uuidString,
            title: jobTitle,
            description: jobDescription,
            type: selectedJobType,
            experienceLevel: selectedExperienceLevel,
            location: location,
            isRemote: isRemote,
            salaryRange: SalaryRange(
                min: Int(salaryMin) ?? 0,
                max: Int(salaryMax) ?? 0
            ),
            requiredSkills: requiredSkills,
            benefits: Array(selectedBenefits),
            postedDate: Date(),
            status: .active,
            applicantCount: 0
        )
        
        Task {
            await jobManager.createJob(job)
            if jobManager.errorMessage == nil {
                dismiss()
            }
        }
    }
}

enum JobType: String, CaseIterable {
    case fullTime = "full-time"
    case partTime = "part-time"
    case contract = "contract"
    case intern = "intern"
    
    var displayName: String {
        switch self {
        case .fullTime: return "Full Time"
        case .partTime: return "Part Time"
        case .contract: return "Contract"
        case .intern: return "Intern"
        }
    }
}

enum ExperienceLevel: String, CaseIterable {
    case entry = "entry"
    case midLevel = "mid-level"
    case senior = "senior"
    case lead = "lead"
    
    var displayName: String {
        switch self {
        case .entry: return "Entry Level"
        case .midLevel: return "Mid Level"
        case .senior: return "Senior"
        case .lead: return "Lead"
        }
    }
}

#Preview {
    CreateJobScreen()
        .environmentObject(JobsManager())
        .preferredColorScheme(.dark)
}
