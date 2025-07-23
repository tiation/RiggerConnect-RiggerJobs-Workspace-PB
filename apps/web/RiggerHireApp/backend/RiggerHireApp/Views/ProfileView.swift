import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var isEditingProfile = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Profile Header
                    ProfileHeaderView()
                    
                    // Quick Stats
                    StatsView()
                    
                    // Main Content
                    VStack(spacing: 16) {
                        // Certifications Section
                        NavigationLink(destination: CertificationsScreen()) {
                            ProfileSectionCard(
                                title: "Certifications",
                                icon: "certificate.fill",
                                count: "5 Active"
                            )
                        }
                        
                        // Skills Section
                        NavigationLink(destination: SkillsScreen()) {
                            ProfileSectionCard(
                                title: "Skills & Experience",
                                icon: "star.fill",
                                count: "12 Skills"
                            )
                        }
                        
                        // Documents Section
                        NavigationLink(destination: DocumentsScreen()) {
                            ProfileSectionCard(
                                title: "Documents",
                                icon: "doc.fill",
                                count: "8 Files"
                            )
                        }
                        
                        // Reviews Section
                        NavigationLink(destination: ReviewsScreen()) {
                            ProfileSectionCard(
                                title: "Reviews",
                                icon: "star.bubble.fill",
                                count: "4.8 ★"
                            )
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .background(ThemeManager.backgroundGradient)
            .navigationTitle("My Profile")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { isEditingProfile.toggle() }) {
                        Image(systemName: "pencil.circle.fill")
                            .foregroundColor(ThemeManager.primaryCyan)
                    }
                }
            }
            .sheet(isPresented: $isEditingProfile) {
                EditProfileView()
            }
        }
    }
}

// MARK: - Profile Header View
struct ProfileHeaderView: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Profile Image
            ZStack {
                Circle()
                    .fill(ThemeManager.neonGradient)
                    .frame(width: 120, height: 120)
                
                if let imageURL = authManager.currentUser?.profileImageURL {
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Image(systemName: "person.fill")
                            .font(.system(size: 40))
                            .foregroundColor(.white)
                    }
                    .frame(width: 110, height: 110)
                    .clipShape(Circle())
                } else {
                    Image(systemName: "person.fill")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                }
            }
            
            // Name and Title
            VStack(spacing: 4) {
                Text(authManager.currentUser?.name ?? "John Doe")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(ThemeManager.textPrimary)
                
                Text("Senior Rigger")
                    .font(.subheadline)
                    .foregroundColor(ThemeManager.textSecondary)
            }
            
            // Verification Badge
            HStack {
                Image(systemName: "checkmark.shield.fill")
                    .foregroundColor(ThemeManager.primaryCyan)
                Text("Verified Professional")
                    .font(.caption)
                    .foregroundColor(ThemeManager.primaryCyan)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(ThemeManager.primaryCyan.opacity(0.1))
            .cornerRadius(20)
        }
        .padding()
    }
}

// MARK: - Stats View
struct StatsView: View {
    var body: some View {
        HStack(spacing: 20) {
            StatCard(title: "Jobs", value: "28", subtitle: "Completed")
            StatCard(title: "Years", value: "5+", subtitle: "Experience")
            StatCard(title: "Rating", value: "4.8", subtitle: "Average")
        }
        .padding(.horizontal)
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let subtitle: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundColor(ThemeManager.textSecondary)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(ThemeManager.primaryCyan)
            
            Text(subtitle)
                .font(.caption)
                .foregroundColor(ThemeManager.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(ThemeManager.backgroundSecondary)
        .cornerRadius(12)
    }
}

// MARK: - Profile Section Card
struct ProfileSectionCard: View {
    let title: String
    let icon: String
    let count: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(ThemeManager.primaryCyan)
                .frame(width: 40, height: 40)
                .background(ThemeManager.primaryCyan.opacity(0.1))
                .cornerRadius(12)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundColor(ThemeManager.textPrimary)
                
                Text(count)
                    .font(.subheadline)
                    .foregroundColor(ThemeManager.textSecondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundColor(ThemeManager.textSecondary)
        }
        .padding()
        .background(ThemeManager.backgroundSecondary)
        .cornerRadius(16)
    }
}

// MARK: - Edit Profile View
struct EditProfileView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var title = ""
    @State private var about = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Basic Information")) {
                    TextField("Name", text: $name)
                    TextField("Professional Title", text: $title)
                    TextEditor(text: $about)
                        .frame(height: 100)
                }
                
                Section(header: Text("Profile Picture")) {
                    Button(action: {
                        // Handle image picker
                    }) {
                        Text("Change Profile Picture")
                            .foregroundColor(ThemeManager.primaryCyan)
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        // Save changes
                        dismiss()
                    }
                    .fontWeight(.bold)
                }
            }
        }
    }
}
