import SwiftUI

struct ProfileEditView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var worker: Worker
    @State private var isLoading = false
    @State private var showImagePicker = false
    @State private var showSkillsEditor = false
    @State private var showCertificationsEditor = false
    @State private var showWorkHistoryEditor = false
    
    init(worker: Worker) {
        self._worker = State(initialValue: worker)
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Profile Image Section
                        profileImageSection
                        
                        // Basic Information
                        basicInfoSection
                        
                        // Professional Information
                        professionalInfoSection
                        
                        // Location & Availability
                        locationAvailabilitySection
                        
                        // Skills Section
                        skillsSection
                        
                        // Certifications Section
                        certificationsSection
                        
                        // Work History Section
                        workHistorySection
                        
                        Spacer(minLength: 100)
                    }
                    .padding()
                }
            }
            .navigationTitle("Edit Profile")
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
                        saveProfile()
                    }
                    .foregroundColor(themeManager.accentColor)
                    .fontWeight(.semibold)
                    .disabled(isLoading)
                }
            }
        }
        .sheet(isPresented: $showSkillsEditor) {
            SkillsEditorView(skills: $worker.skills)
        }
        .sheet(isPresented: $showCertificationsEditor) {
            CertificationsEditorView(certifications: $worker.certifications)
        }
        .sheet(isPresented: $showWorkHistoryEditor) {
            WorkHistoryEditorView(workHistory: $worker.workHistory)
        }
    }
    
    private var profileImageSection: some View {
        VStack(spacing: 16) {
            Button(action: { showImagePicker = true }) {
                Circle()
                    .fill(themeManager.primaryGradient)
                    .frame(width: 100, height: 100)
                    .overlay(
                        Group {
                            if let imageURL = worker.profileImageURL, !imageURL.isEmpty {
                                AsyncImage(url: URL(string: imageURL)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Text(worker.firstName.prefix(1).uppercased())
                                        .font(.largeTitle)
                                        .fontWeight(.bold)
                                        .foregroundColor(.white)
                                }
                                .clipShape(Circle())
                            } else {
                                Text(worker.firstName.prefix(1).uppercased())
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }
                        }
                    )
                    .overlay(
                        Circle()
                            .stroke(themeManager.accentColor, lineWidth: 2)
                    )
                    .overlay(
                        Image(systemName: "camera.fill")
                            .foregroundColor(.white)
                            .padding(6)
                            .background(themeManager.accentColor)
                            .clipShape(Circle())
                            .offset(x: 30, y: 30)
                    )
            }
            
            Text("Tap to change photo")
                .font(.caption)
                .foregroundColor(themeManager.secondaryTextColor)
        }
    }
    
    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Basic Information")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            HStack(spacing: 12) {
                CustomTextField(
                    title: "First Name",
                    text: $worker.firstName,
                    icon: "person"
                )
                
                CustomTextField(
                    title: "Last Name",
                    text: $worker.lastName,
                    icon: "person"
                )
            }
            
            CustomTextField(
                title: "Phone Number",
                text: Binding(
                    get: { worker.phoneNumber ?? "" },
                    set: { worker.phoneNumber = $0.isEmpty ? nil : $0 }
                ),
                icon: "phone",
                keyboardType: .phonePad
            )
        }
        .cardStyle(themeManager)
    }
    
    private var professionalInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Professional Information")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Years of Experience")
                        .font(.caption)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Picker("Years", selection: $worker.yearsOfExperience) {
                        ForEach(0...50, id: \.self) { year in
                            Text("\(year) years").tag(year)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                    .padding()
                    .background(themeManager.surfaceColor)
                    .cornerRadius(8)
                }
                
                CustomTextField(
                    title: "Hourly Rate (AUD)",
                    text: Binding(
                        get: { String(format: "%.0f", worker.hourlyRate) },
                        set: { worker.hourlyRate = Double($0) ?? 0 }
                    ),
                    icon: "dollarsign",
                    keyboardType: .numberPad
                )
            }
        }
        .cardStyle(themeManager)
    }
    
    private var locationAvailabilitySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Location & Availability")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            CustomTextField(
                title: "City",
                text: Binding(
                    get: { worker.location.city },
                    set: { worker.location.city = $0 }
                ),
                icon: "location"
            )
            
            HStack(spacing: 12) {
                CustomTextField(
                    title: "State",
                    text: Binding(
                        get: { worker.location.state },
                        set: { worker.location.state = $0 }
                    ),
                    icon: "map"
                )
                
                CustomTextField(
                    title: "Postal Code",
                    text: Binding(
                        get: { worker.location.postalCode },
                        set: { worker.location.postalCode = $0 }
                    ),
                    icon: "number",
                    keyboardType: .numberPad
                )
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Availability Type")
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                Picker("Availability", selection: $worker.availability.availabilityType) {
                    ForEach(AvailabilityType.allCases, id: \.self) { type in
                        Text(type.rawValue).tag(type)
                    }
                }
                .pickerStyle(MenuPickerStyle())
                .padding()
                .background(themeManager.surfaceColor)
                .cornerRadius(8)
            }
            
            Toggle("Available for work", isOn: $worker.availability.isAvailable)
                .foregroundColor(themeManager.primaryTextColor)
                .toggleStyle(SwitchToggleStyle(tint: themeManager.accentColor))
        }
        .cardStyle(themeManager)
    }
    
    private var skillsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Skills")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("Edit") {
                    showSkillsEditor = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if worker.skills.isEmpty {
                Text("No skills added yet. Tap 'Edit' to add your skills.")
                    .font(.body)
                    .foregroundColor(themeManager.mutedTextColor)
                    .italic()
            } else {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 8) {
                    ForEach(worker.skills.prefix(6), id: \.id) { skill in
                        SkillChipView(skill: skill)
                    }
                }
                
                if worker.skills.count > 6 {
                    Text("... and \(worker.skills.count - 6) more")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var certificationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Certifications")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("Edit") {
                    showCertificationsEditor = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if worker.certifications.isEmpty {
                Text("No certifications added yet. Tap 'Edit' to add your certifications.")
                    .font(.body)
                    .foregroundColor(themeManager.mutedTextColor)
                    .italic()
            } else {
                ForEach(worker.certifications.prefix(3), id: \.id) { cert in
                    CertificationRowView(certification: cert)
                }
                
                if worker.certifications.count > 3 {
                    Text("... and \(worker.certifications.count - 3) more")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var workHistorySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Work History")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Button("Edit") {
                    showWorkHistoryEditor = true
                }
                .foregroundColor(themeManager.accentColor)
                .fontWeight(.medium)
            }
            
            if worker.workHistory.isEmpty {
                Text("No work history added yet. Tap 'Edit' to add your experience.")
                    .font(.body)
                    .foregroundColor(themeManager.mutedTextColor)
                    .italic()
            } else {
                ForEach(worker.workHistory.prefix(2), id: \.id) { work in
                    WorkHistoryRowView(workExperience: work)
                }
                
                if worker.workHistory.count > 2 {
                    Text("... and \(worker.workHistory.count - 2) more")
                        .font(.caption)
                        .foregroundColor(themeManager.mutedTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private func saveProfile() {
        isLoading = true
        
        // Update profile completeness
        worker.profileCompleteness = calculateProfileCompleteness()
        worker.updatedAt = Date()
        
        authManager.updateProfile(worker)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            isLoading = false
            dismiss()
        }
    }
    
    private func calculateProfileCompleteness() -> Double {
        var completedFields = 0.0
        let totalFields = 10.0
        
        // Basic fields
        if !worker.firstName.isEmpty { completedFields += 1 }
        if !worker.lastName.isEmpty { completedFields += 1 }
        if worker.phoneNumber != nil { completedFields += 1 }
        
        // Professional fields
        if worker.yearsOfExperience > 0 { completedFields += 1 }
        if worker.hourlyRate > 0 { completedFields += 1 }
        
        // Location fields
        if !worker.location.city.isEmpty { completedFields += 1 }
        if !worker.location.state.isEmpty { completedFields += 1 }
        
        // Profile data
        if !worker.skills.isEmpty { completedFields += 1 }
        if !worker.certifications.isEmpty { completedFields += 1 }
        if !worker.workHistory.isEmpty { completedFields += 1 }
        
        return completedFields / totalFields
    }
}

struct SkillChipView: View {
    let skill: Skill
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 4) {
            Text(skill.name)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(themeManager.primaryTextColor)
                .multilineTextAlignment(.center)
            
            Text(skill.proficiencyLevel.rawValue)
                .font(.caption2)
                .foregroundColor(themeManager.mutedTextColor)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
        )
    }
}

struct CertificationRowView: View {
    let certification: Certification
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Image(systemName: "rosette")
                .foregroundColor(themeManager.warningColor)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(certification.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(certification.issuingAuthority)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
            }
            
            Spacer()
            
            if certification.isExpired {
                Text("EXPIRED")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.errorColor)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(themeManager.errorColor.opacity(0.2))
                    .cornerRadius(4)
            } else {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(themeManager.successColor)
            }
        }
        .padding(.vertical, 4)
    }
}

struct WorkHistoryRowView: View {
    let workExperience: WorkExperience
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Image(systemName: "briefcase")
                .foregroundColor(themeManager.accentColor)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(workExperience.jobTitle)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(workExperience.companyName)
                    .font(.caption)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                Text(formatDateRange())
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
            }
            
            Spacer()
            
            if workExperience.isCurrentPosition {
                Text("CURRENT")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.successColor)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(themeManager.successColor.opacity(0.2))
                    .cornerRadius(4)
            }
        }
        .padding(.vertical, 4)
    }
    
    private func formatDateRange() -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        
        let start = formatter.string(from: workExperience.startDate)
        
        if workExperience.isCurrentPosition {
            return "\(start) - Present"
        } else if let endDate = workExperience.endDate {
            let end = formatter.string(from: endDate)
            return "\(start) - \(end)"
        } else {
            return start
        }
    }
}

struct ProfileEditView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileEditView(worker: Worker())
            .environmentObject(ThemeManager())
            .environmentObject(AuthenticationManager())
    }
}
