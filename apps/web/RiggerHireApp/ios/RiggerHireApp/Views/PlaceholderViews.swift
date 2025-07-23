import SwiftUI
import SwiftUI

// Placeholder View for missing components
struct PlaceholderView: View {
    var body: some View {
        Text("Placeholder View")
            .font(.largeTitle)
            .foregroundColor(.gray)
            .padding()
    }
}
// MARK: - My Applications View
struct MyApplicationsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 20) {
                    Image(systemName: "doc.text.magnifyingglass")
                        .font(.system(size: 60))
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("Your Applications")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text("Track your job applications and their status here.")
                        .font(.body)
                        .foregroundColor(themeManager.secondaryTextColor)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
            }
            .navigationTitle("Applications")
        }
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Profile Header
                        profileHeader
                        
                        // Profile Completion
                        profileCompletion
                        
                        // Quick Actions
                        quickActions
                        
                        // Account Settings
                        accountSettings
                        
                        Spacer()
                    }
                    .padding()
                }
            }
            .navigationTitle("Profile")
        }
    }
    
    private var profileHeader: some View {
        VStack(spacing: 16) {
            // Profile Image
            Circle()
                .fill(themeManager.primaryGradient)
                .frame(width: 100, height: 100)
                .overlay(
                    Text(authManager.currentWorker?.firstName.prefix(1).uppercased() ?? "U")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                )
            
            VStack(spacing: 8) {
                Text(authManager.currentWorker?.fullName ?? "Worker Name")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Text(authManager.currentWorker?.email ?? "email@example.com")
                    .font(.subheadline)
                    .foregroundColor(themeManager.secondaryTextColor)
                
                HStack {
                    Image(systemName: "star.fill")
                        .foregroundColor(themeManager.warningColor)
                    
                    Text("\(String(format: "%.1f", authManager.currentWorker?.averageRating ?? 0.0)) Rating")
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                    
                    Text("•")
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("\(authManager.currentWorker?.yearsOfExperience ?? 0) years exp.")
                        .font(.subheadline)
                        .foregroundColor(themeManager.secondaryTextColor)
                }
            }
        }
        .cardStyle(themeManager)
    }
    
    private var profileCompletion: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Profile Completion")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.primaryTextColor)
                
                Spacer()
                
                Text("\(Int((authManager.currentWorker?.profileCompleteness ?? 0.0) * 100))%")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.accentColor)
            }
            
            ProgressView(value: authManager.currentWorker?.profileCompleteness ?? 0.0, total: 1.0)
                .progressViewStyle(LinearProgressViewStyle(tint: themeManager.accentColor))
            
            Text("Complete your profile to increase your chances of getting hired")
                .font(.caption)
                .foregroundColor(themeManager.mutedTextColor)
        }
        .cardStyle(themeManager)
    }
    
    private var quickActions: some View {
        VStack(spacing: 16) {
            Text("Quick Actions")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                NavigationLink(destination: ProfileEditView(worker: authManager.currentWorker ?? Worker())) {
                    ActionButtonContent(
                        title: "Edit Profile",
                        icon: "person.crop.circle"
                    )
                }
                .buttonStyle(PlainButtonStyle())
                
                NavigationLink(destination: SkillsDevelopmentView()) {
                    ActionButtonContent(
                        title: "Skills & Certs",
                        icon: "rosette"
                    )
                }
                .buttonStyle(PlainButtonStyle())
                
                NavigationLink(destination: CareerAnalyticsView()) {
                    ActionButtonContent(
                        title: "Career Analytics",
                        icon: "chart.line.uptrend.xyaxis"
                    )
                }
                .buttonStyle(PlainButtonStyle())
                
                NavigationLink(destination: JobAlertsView()) {
                    ActionButtonContent(
                        title: "Job Alerts",
                        icon: "bell.badge"
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .cardStyle(themeManager)
    }
    
    private var accountSettings: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Account")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(themeManager.primaryTextColor)
            
            VStack(spacing: 12) {
                SettingsRow(title: "Notifications", icon: "bell", hasChevron: true) {
                    // Navigate to notifications
                }
                
                SettingsRow(title: "Privacy & Security", icon: "lock.shield", hasChevron: true) {
                    // Navigate to privacy
                }
                
                SettingsRow(title: "Help & Support", icon: "questionmark.circle", hasChevron: true) {
                    // Navigate to help
                }
                
                SettingsRow(title: "Sign Out", icon: "arrow.right.square", hasChevron: false) {
                    authManager.signOut()
                }
                .foregroundColor(themeManager.errorColor)
            }
        }
        .cardStyle(themeManager)
    }
}

struct ActionButton: View {
    let title: String
    let icon: String
    let action: () -> Void
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            ActionButtonContent(title: title, icon: icon)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ActionButtonContent: View {
    let title: String
    let icon: String
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(themeManager.accentColor)
            
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(themeManager.primaryTextColor)
                .multilineTextAlignment(.center)
        }
        .frame(height: 80)
        .frame(maxWidth: .infinity)
        .background(themeManager.surfaceColor)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
        )
    }
}

struct SettingsRow: View {
    let title: String
    let icon: String
    let hasChevron: Bool
    let action: () -> Void
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            SettingsRowContent(title: title, icon: icon, hasChevron: hasChevron)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct SettingsRowContent: View {
    let title: String
    let icon: String
    var hasChevron: Bool = true
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(themeManager.accentColor)
                .frame(width: 24)
            
            Text(title)
                .foregroundColor(themeManager.primaryTextColor)
            
            Spacer()
            
            if hasChevron {
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(themeManager.mutedTextColor)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Messages View
struct MessagesView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                VStack(spacing: 20) {
                    Image(systemName: "message.circle")
                        .font(.system(size: 60))
                        .foregroundColor(themeManager.mutedTextColor)
                    
                    Text("Messages")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(themeManager.primaryTextColor)
                    
                    Text("Communication with employers and recruiters will appear here.")
                        .font(.body)
                        .foregroundColor(themeManager.secondaryTextColor)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
            }
            .navigationTitle("Messages")
        }
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // App Settings
                        VStack(alignment: .leading, spacing: 16) {
                            Text("App Settings")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            VStack(spacing: 12) {
                                SettingsRow(title: "Notifications", icon: "bell", hasChevron: true) {
                                    // Navigate to notifications settings
                                }
                                
                                SettingsRow(title: "Job Alerts", icon: "bell.badge", hasChevron: true) {
                                    // Navigate to job alerts settings
                                }
                                
                                SettingsRow(title: "Language", icon: "globe", hasChevron: true) {
                                    // Navigate to language settings
                                }
                            }
                        }
                        .cardStyle(themeManager)
                        
                        // Privacy & Security
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Privacy & Security")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            VStack(spacing: 12) {
                                SettingsRow(title: "Privacy Policy", icon: "doc.text", hasChevron: true) {
                                    // Open privacy policy
                                }
                                
                                SettingsRow(title: "Terms of Service", icon: "doc.plaintext", hasChevron: true) {
                                    // Open terms of service
                                }
                                
                                SettingsRow(title: "Data & Privacy", icon: "lock.shield", hasChevron: true) {
                                    // Navigate to data settings
                                }
                            }
                        }
                        .cardStyle(themeManager)
                        
                        // Community
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Community")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            VStack(spacing: 12) {
                                NavigationLink(destination: CommunityEngagementView()) {
                                    SettingsRowContent(title: "Community Hub", icon: "person.3")
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                NavigationLink(destination: SkillsDevelopmentView()) {
                                    SettingsRowContent(title: "Skills Development", icon: "lightbulb")
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .cardStyle(themeManager)
                        
                        // Support
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Support")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            VStack(spacing: 12) {
                                SettingsRow(title: "Help Center", icon: "questionmark.circle", hasChevron: true) {
                                    // Navigate to help center
                                }
                                
                                SettingsRow(title: "Contact Us", icon: "envelope", hasChevron: true) {
                                    // Navigate to contact
                                }
                                
                                SettingsRow(title: "Rate App", icon: "star", hasChevron: true) {
                                    // Open app store rating
                                }
                            }
                        }
                        .cardStyle(themeManager)
                        
                        // App Info
                        VStack(spacing: 8) {
                            Text("RiggerHub v1.0.0")
                                .font(.caption)
                                .foregroundColor(themeManager.mutedTextColor)
                            
                            Text("Made with ❤️ for the rigging industry")
                                .font(.caption)
                                .foregroundColor(themeManager.mutedTextColor)
                        }
                        .padding()
                    }
                    .padding()
                }
            }
            .navigationTitle("Settings")
        }
    }
}

// MARK: - Job Application View
struct JobApplicationView: View {
    let job: JobListing
    
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @EnvironmentObject var authManager: AuthenticationManager
    
    @State private var coverLetter = ""
    @State private var proposedRate = ""
    @State private var availability = ""
    @State private var isSubmitting = false
    
    var body: some View {
        NavigationView {
            ZStack {
                themeManager.backgroundGradient.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Job info header
                        VStack(spacing: 8) {
                            Text(job.title)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            Text(job.companyName)
                                .font(.headline)
                                .foregroundColor(themeManager.accentColor)
                        }
                        .cardStyle(themeManager)
                        
                        // Application form
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Application Details")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(themeManager.primaryTextColor)
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Cover Letter")
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                                    .foregroundColor(themeManager.primaryTextColor)
                                
                                TextEditor(text: $coverLetter)
                                    .frame(minHeight: 120)
                                    .padding(12)
                                    .background(themeManager.surfaceColor)
                                    .cornerRadius(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(themeManager.accentColor.opacity(0.3), lineWidth: 1)
                                    )
                            }
                            
                            CustomTextField(
                                title: "Your Rate (per hour)",
                                text: $proposedRate,
                                icon: "dollarsign",
                                keyboardType: .decimalPad
                            )
                            
                            CustomTextField(
                                title: "Availability",
                                text: $availability,
                                icon: "calendar"
                            )
                        }
                        .cardStyle(themeManager)
                    }
                    .padding()
                }
            }
            .navigationTitle("Apply for Job")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(themeManager.accentColor)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Submit") {
                        submitApplication()
                    }
                    .foregroundColor(themeManager.accentColor)
                    .fontWeight(.semibold)
                    .disabled(coverLetter.isEmpty || isSubmitting)
                }
            }
        }
    }
    
    private func submitApplication() {
        isSubmitting = true
        
        // Simulate application submission
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isSubmitting = false
            dismiss()
        }
    }
}

// MARK: - Preview Providers
struct PlaceholderViews_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            MyApplicationsView()
                .environmentObject(ThemeManager())
                .environmentObject(AuthenticationManager())
            
            ProfileView()
                .environmentObject(ThemeManager())
                .environmentObject(AuthenticationManager())
            
            MessagesView()
                .environmentObject(ThemeManager())
            
            SettingsView()
                .environmentObject(ThemeManager())
                .environmentObject(AuthenticationManager())
        }
    }
}
