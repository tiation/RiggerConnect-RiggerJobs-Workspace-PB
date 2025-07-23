import SwiftUI

struct JobDetailsScreen: View {
    let job: Job
    @EnvironmentObject var jobManager: JobsManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var showingEditSheet = false
    @State private var showingDeleteAlert = false
    @State private var showingApplicationsSheet = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(job.title)
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            HStack {
                                Image(systemName: "location")
                                    .foregroundColor(.cyan)
                                Text(job.location)
                                    .foregroundColor(.gray)
                                
                                if job.isRemote {
                                    Text("• Remote")
                                        .foregroundColor(.green)
                                }
                            }
                            .font(.subheadline)
                        }
                        
                        Spacer()
                        
                        VStack {
                            statusBadge
                            Text("\(job.applicantCount) applicants")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                    
                    HStack(spacing: 16) {
                        InfoChip(icon: "briefcase", text: job.type.displayName)
                        InfoChip(icon: "star", text: job.experienceLevel.displayName)
                        InfoChip(icon: "calendar", text: formatDate(job.postedDate))
                    }
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.gray.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                        )
                )
                
                // Salary Range
                if job.salaryRange.min > 0 || job.salaryRange.max > 0 {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Compensation")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        HStack {
                            Image(systemName: "dollarsign.circle")
                                .foregroundColor(.green)
                            Text(salaryRangeText)
                                .font(.title2)
                                .fontWeight(.semibold)
                                .foregroundColor(.green)
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.green.opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.green.opacity(0.3), lineWidth: 1)
                            )
                    )
                }
                
                // Job Description
                VStack(alignment: .leading, spacing: 8) {
                    Text("Job Description")
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Text(job.description)
                        .font(.body)
                        .foregroundColor(.gray)
                        .lineSpacing(4)
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                )
                
                // Required Skills
                if !job.requiredSkills.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Required Skills")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
                            ForEach(job.requiredSkills, id: \.self) { skill in
                                Text(skill)
                                    .font(.caption)
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(
                                        RoundedRectangle(cornerRadius: 16)
                                            .fill(Color.blue.opacity(0.3))
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 16)
                                                    .stroke(Color.blue, lineWidth: 1)
                                            )
                                    )
                            }
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Benefits
                if !job.benefits.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Benefits")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))], spacing: 8) {
                            ForEach(job.benefits, id: \.self) { benefit in
                                HStack {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.green)
                                        .font(.caption)
                                    Text(benefit)
                                        .font(.caption)
                                        .foregroundColor(.white)
                                }
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.green.opacity(0.1))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(Color.green.opacity(0.3), lineWidth: 1)
                                        )
                                )
                            }
                        }
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                }
                
                // Action Buttons
                VStack(spacing: 12) {
                    Button(action: { showingApplicationsSheet = true }) {
                        HStack {
                            Image(systemName: "person.3.fill")
                            Text("View Applications (\(job.applicantCount))")
                        }
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            LinearGradient(
                                colors: [.cyan, .blue],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(12)
                        .shadow(color: .cyan.opacity(0.3), radius: 8)
                    }
                    
                    HStack(spacing: 12) {
                        Button(action: { showingEditSheet = true }) {
                            HStack {
                                Image(systemName: "pencil")
                                Text("Edit")
                            }
                            .font(.subheadline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.gray.opacity(0.3))
                            .cornerRadius(8)
                        }
                        
                        Button(action: { showingDeleteAlert = true }) {
                            HStack {
                                Image(systemName: "trash")
                                Text("Delete")
                            }
                            .font(.subheadline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.red.opacity(0.6))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding(.top)
            }
            .padding()
        }
        .background(Color.black)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingEditSheet) {
            // EditJobScreen(job: job)
            Text("Edit Job Screen - Coming Soon")
                .foregroundColor(.white)
        }
        .sheet(isPresented: $showingApplicationsSheet) {
            // JobApplicationsScreen(job: job)
            Text("Job Applications Screen - Coming Soon")
                .foregroundColor(.white)
        }
        .alert("Delete Job Posting", isPresented: $showingDeleteAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                deleteJob()
            }
        } message: {
            Text("Are you sure you want to delete this job posting? This action cannot be undone.")
        }
    }
    
    private var statusBadge: some View {
        Text(job.status.rawValue.capitalized)
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(statusColor)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(statusColor.opacity(0.2))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(statusColor, lineWidth: 1)
                    )
            )
    }
    
    private var statusColor: Color {
        switch job.status {
        case .active: return .green
        case .paused: return .orange
        case .closed: return .red
        case .draft: return .gray
        }
    }
    
    private var salaryRangeText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.maximumFractionDigits = 0
        
        if job.salaryRange.min > 0 && job.salaryRange.max > 0 {
            let minString = formatter.string(from: NSNumber(value: job.salaryRange.min)) ?? "$0"
            let maxString = formatter.string(from: NSNumber(value: job.salaryRange.max)) ?? "$0"
            return "\(minString) - \(maxString)"
        } else if job.salaryRange.min > 0 {
            return formatter.string(from: NSNumber(value: job.salaryRange.min)) ?? "$0"
        } else if job.salaryRange.max > 0 {
            return "Up to " + (formatter.string(from: NSNumber(value: job.salaryRange.max)) ?? "$0")
        }
        return "Competitive"
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
        return formatter.localizedString(for: date, relativeTo: Date())
    }
    
    private func deleteJob() {
        Task {
            await jobManager.deleteJob(jobId: job.id)
            if jobManager.errorMessage == nil {
                dismiss()
            }
        }
    }
}

struct InfoChip: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(.cyan)
            Text(text)
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.2))
        )
    }
}

#Preview {
    NavigationView {
        JobDetailsScreen(job: Job(
            id: "1",
            title: "Senior iOS Developer",
            description: "We are looking for a talented Senior iOS Developer to join our growing team. You will be responsible for developing and maintaining high-quality mobile applications using Swift and SwiftUI.",
            type: .fullTime,
            experienceLevel: .senior,
            location: "San Francisco, CA",
            isRemote: true,
            salaryRange: SalaryRange(min: 120000, max: 160000),
            requiredSkills: ["Swift", "SwiftUI", "UIKit", "Core Data", "REST APIs"],
            benefits: ["Health Insurance", "401(k) Matching", "Remote Work", "Professional Development"],
            postedDate: Date(),
            status: .active,
            applicantCount: 23
        ))
    }
    .environmentObject(JobsManager())
    .preferredColorScheme(.dark)
}
