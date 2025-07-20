import SwiftUI

struct JobDetailView: View {
    let job: JobListing
    
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var showApplicationForm = false
    @State private var isBookmarked = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Job Header
                        jobHeaderView
                        
                        // Job Details
                        jobDetailsView
                        
                        // Requirements
                        requirementsView
                        
                        // Responsibilities
                        responsibilitiesView
                        
                        // Benefits
                        if !job.benefits.isEmpty {
                            benefitsView
                        }
                        
                        // Company Info
                        companyInfoView
                        
                        Spacer(minLength: 80)
                    }
                    .padding()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                            .foregroundColor(themeManager.accentColor)
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        isBookmarked.toggle()
                    } label: {
                        Image(systemName: isBookmarked ? "bookmark.fill" : "bookmark")
                            .foregroundColor(themeManager.accentColor)
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                applyButtonView
            }
        }
        .sheet(isPresented: $showApplicationForm) {
            JobApplicationView(job: job)
        }
    }
    
    private var jobHeaderView: some View {
        VStack(spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(job.title)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text(job.companyName)
                        .font(.title3)
                        .foregroundColor(themeManager.accentColor)
                    
                    HStack {
                        Label(job.location.displayLocation, systemImage: "location")
                            .font(.subheadline)
                            .foregroundColor(themeManager.secondaryTextColor)
                        
                        Spacer()
                        
                        if job.isUrgent {
                            Text("URGENT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(themeManager.errorColor)
                                .cornerRadius(6)
                        }
                    }
                }
                
                Spacer()
            }
            
            // Salary and job type
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Salary")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text(job.formattedSalary)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.successColor)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Job Type")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text(job.jobType.rawValue)
                        .font(.headline)
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.primaryColor)
                }
            }
            
            // Posted date and applications
            HStack {
                Text("Posted \(job.timePosted)")
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
                
                Spacer()
                
                Text("\(job.currentApplications) applications")
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
            }
        }
        .cardStyle(themeManager)
    }
    
    private var jobDetailsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Job Description")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            Text(job.description)
                .font(.body)
                .foregroundColor(themeManager.secondaryTextColor)
                .fixedSize(horizontal: false, vertical: true)
            
            if !job.equipmentProvided.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Equipment Provided")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    ForEach(job.equipmentProvided, id: \.self) { equipment in
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(themeManager.successColor)
                                .font(.caption)
                            
                            Text(equipment)
                                .font(.subheadline)
                                .foregroundColor(themeManager.secondaryTextColor)
                        }
                    }
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var requirementsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Requirements")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(alignment: .leading, spacing: 12) {
                if !job.requirements.isEmpty {
                    ForEach(job.requirements, id: \.self) { requirement in
                        HStack(alignment: .top) {
                            Image(systemName: "checkmark")
                                .foregroundColor(themeManager.accentColor)
                                .font(.caption)
                                .padding(.top, 2)
                            
                            Text(requirement)
                                .font(.subheadline)
                                .foregroundColor(themeManager.secondaryTextColor)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                }
                
                if !job.requiredSkills.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Required Skills")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.primaryTextColor)
                        
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 8) {
                            ForEach(job.requiredSkills, id: \.self) { skill in
                                Text(skill)
                                    .font(.caption)
                                    .foregroundColor(themeManager.primaryTextColor)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(themeManager.accentColor.opacity(0.2))
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
                
                if !job.requiredCertifications.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Required Certifications")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.primaryTextColor)
                        
                        ForEach(job.requiredCertifications, id: \.self) { cert in
                            HStack {
                                Image(systemName: "rosette")
                                    .foregroundColor(themeManager.warningColor)
                                    .font(.caption)
                                
                                Text(cert)
                                    .font(.subheadline)
                                    .foregroundColor(themeManager.secondaryTextColor)
                            }
                        }
                    }
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var responsibilitiesView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Key Responsibilities")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            ForEach(job.responsibilities, id: \.self) { responsibility in
                HStack(alignment: .top) {
                    Image(systemName: "arrow.right")
                        .foregroundColor(themeManager.accentColor)
                        .font(.caption)
                        .padding(.top, 2)
                    
                    Text(responsibility)
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var benefitsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Benefits & Perks")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            ForEach(job.benefits, id: \.self) { benefit in
                HStack {
                    Image(systemName: "star.fill")
                        .foregroundColor(themeManager.successColor)
                        .font(.caption)
                    
                    Text(benefit)
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var companyInfoView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("About \(job.companyName)")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Industry:")
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    Text(job.industry.rawValue)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
                
                if let phone = job.contactPhone {
                    HStack {
                        Text("Phone:")
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.primaryTextColor)
                        
                        Spacer()
                        
                        Button(phone) {
                            if let url = URL(string: "tel:\(phone)") {
                                UIApplication.shared.open(url)
                            }
                        }
                        .foregroundColor(themeManager.accentColor)
                    }
                }
                
                HStack {
                    Text("Email:")
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Spacer()
                    
                    Button(job.contactEmail) {
                        if let url = URL(string: "mailto:\(job.contactEmail)") {
                            UIApplication.shared.open(url)
                        }
                    }
                    .foregroundColor(themeManager.accentColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var applyButtonView: some View {
        VStack(spacing: 12) {
            if job.isExpired {
                Text("Application deadline has passed")
                    .font(.caption)
                    .foregroundColor(themeManager.errorColor)
                    .padding(.horizontal)
            } else if job.applicationStatus != .open {
                Text("This position is no longer accepting applications")
                    .font(.caption)
                    .foregroundColor(themeManager.warningColor)
                    .padding(.horizontal)
            }
            
            HStack(spacing: 16) {
                Button("Share Job") {
                    // Share functionality
                    shareJob()
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(themeManager.surfaceColor)
                .foregroundColor(themeManager.primaryTextColor)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
                )
                
                Button("Apply Now") {
                    showApplicationForm = true
                }
                .neonButtonStyle(themeManager)
                .frame(maxWidth: .infinity)
                .disabled(job.isExpired || job.applicationStatus != .open)
            }
            .padding()
        }
        .background(themeManager.backgroundColor.opacity(0.95))
    }
    
    private func shareJob() {
        let shareText = "Check out this job: \(job.title) at \(job.companyName)"
        
        let activityController = UIActivityViewController(
            activityItems: [shareText],
            applicationActivities: nil
        )
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            window.rootViewController?.present(activityController, animated: true)
        }
    }
}

struct JobDetailView_Previews: PreviewProvider {
    static var previews: some View {
        JobDetailView(job: JobListing())
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
