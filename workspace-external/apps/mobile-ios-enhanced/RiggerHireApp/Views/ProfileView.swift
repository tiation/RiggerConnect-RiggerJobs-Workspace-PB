import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var showingEditProfile = false
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 20) {
                    if let user = authManager.currentUser {
                        profileHeader(user: user)
                        statsSection
                        actionsSection
                    }
                    
                    Spacer(minLength: 50)
                }
                .padding(.horizontal)
                .padding(.top, 20)
            }
        }
        .navigationTitle("Profile")
        .navigationBarTitleDisplayMode(.large)
        .preferredColorScheme(.dark)
        .sheet(isPresented: $showingEditProfile) {
            NavigationStack {
                EditProfileView()
            }
        }
    }
    
    private func profileHeader(user: User) -> some View {
        VStack(spacing: 15) {
            // Profile Image
            AsyncImage(url: URL(string: user.profileImageURL ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .foregroundColor(.cyan)
            }
            .frame(width: 100, height: 100)
            .clipShape(Circle())
            .overlay(
                Circle()
                    .stroke(Color.cyan, lineWidth: 3)
            )
            
            VStack(spacing: 6) {
                Text(user.fullName)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text(user.userType.displayName)
                    .font(.subheadline)
                    .foregroundColor(.cyan)
                
                if user.isVerified {
                    HStack {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.green)
                        Text("Verified")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }
            }
            
            Button("Edit Profile") {
                showingEditProfile = true
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 8)
            .background(Color.cyan.opacity(0.2))
            .foregroundColor(.cyan)
            .cornerRadius(8)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.2), lineWidth: 1)
                )
        )
    }
    
    private var statsSection: some View {
        HStack(spacing: 15) {
            StatItem(title: "Jobs Completed", value: "12", color: .green)
            StatItem(title: "Average Rating", value: "4.8", color: .yellow)
            StatItem(title: "On Time Rate", value: "98%", color: .blue)
        }
    }
    
    private var actionsSection: some View {
        VStack(spacing: 12) {
            NavigationLink(destination: DocumentsView()) {
                ProfileActionRow(
                    icon: "doc.text.fill",
                    title: "Documents",
                    subtitle: "Manage your documents and files"
                )
            }
            
            NavigationLink(destination: CertificationsView()) {
                ProfileActionRow(
                    icon: "award.fill",
                    title: "Certifications",
                    subtitle: "View and manage certifications"
                )
            }
            
            NavigationLink(destination: ReviewsView()) {
                ProfileActionRow(
                    icon: "star.fill",
                    title: "Reviews",
                    subtitle: "View your ratings and feedback"
                )
            }
            
            NavigationLink(destination: SkillsManagementView()) {
                ProfileActionRow(
                    icon: "wrench.and.screwdriver.fill",
                    title: "Skills",
                    subtitle: "Manage your skills and expertise"
                )
            }
            
            NavigationLink(destination: ExperienceView()) {
                ProfileActionRow(
                    icon: "briefcase.fill",
                    title: "Experience",
                    subtitle: "Your work history and projects"
                )
            }
            
            NavigationLink(destination: PortfolioView()) {
                ProfileActionRow(
                    icon: "photo.on.rectangle.fill",
                    title: "Portfolio",
                    subtitle: "Showcase your work"
                )
            }
            
            NavigationLink(destination: SupportOverviewView()) {
                ProfileActionRow(
                    icon: "questionmark.circle.fill",
                    title: "Help & Support",
                    subtitle: "Get help or contact support"
                )
            }
            
            ProfileActionItem(
                icon: "arrow.right.square.fill",
                title: "Sign Out",
                subtitle: "Sign out of your account",
                isDestructive: true,
                action: {
                    authManager.signOut()
                }
            )
        }
    }
}

struct StatItem: View {
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 6) {
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct ProfileActionRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(.cyan)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

struct ProfileActionItem: View {
    let icon: String
    let title: String
    let subtitle: String
    var isDestructive: Bool = false
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(isDestructive ? .red : .cyan)
                    .frame(width: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(isDestructive ? .red : .white)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct SettingsView: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            Text("Settings")
                .foregroundColor(.white)
                .navigationTitle("Settings")
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Done") {
                            dismiss()
                        }
                        .foregroundColor(.cyan)
                    }
                }
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ProfileView()
        .environmentObject(AuthenticationManager())
        .preferredColorScheme(.dark)
}
