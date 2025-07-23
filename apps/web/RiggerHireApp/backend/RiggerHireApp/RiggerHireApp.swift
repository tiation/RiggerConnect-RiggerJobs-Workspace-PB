import SwiftUI

@main
struct RiggerHireApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(themeManager)
                .preferredColorScheme(.dark) // Dark neon theme
        }
    }
}

// MARK: - Theme Manager
class ThemeManager: ObservableObject {
    // Dark neon theme colors
    static let primaryCyan = Color(red: 0.0, green: 0.83, blue: 1.0) // #00d4ff
    static let primaryMagenta = Color(red: 1.0, green: 0.0, blue: 0.5) // #ff0080
    static let backgroundPrimary = Color(red: 0.04, green: 0.04, blue: 0.04) // #0a0a0a
    static let backgroundSecondary = Color(red: 0.1, green: 0.1, blue: 0.1) // #1a1a1a
    static let textPrimary = Color.white
    static let textSecondary = Color.gray
    
    // Gradient definitions
    static let neonGradient = LinearGradient(
        colors: [primaryCyan, primaryMagenta],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let backgroundGradient = LinearGradient(
        colors: [backgroundPrimary, backgroundSecondary],
        startPoint: .top,
        endPoint: .bottom
    )
}

// MARK: - Auth Manager
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    
    func signIn(email: String, password: String) async {
        isLoading = true
        // TODO: Implement authentication logic
        await MainActor.run {
            isLoading = false
            isAuthenticated = true
        }
    }
    
    func signOut() {
        isAuthenticated = false
        currentUser = nil
    }
}

// MARK: - User Model
struct User: Identifiable, Codable {
    let id: UUID
    var name: String
    var email: String
    var profileImageURL: String?
    var skills: [String]
    var certifications: [Certification]
    
    init(id: UUID = UUID(), name: String, email: String, profileImageURL: String? = nil, skills: [String] = [], certifications: [Certification] = []) {
        self.id = id
        self.name = name
        self.email = email
        self.profileImageURL = profileImageURL
        self.skills = skills
        self.certifications = certifications
    }
}

// MARK: - Certification Model
struct Certification: Identifiable, Codable {
    let id: UUID
    var name: String
    var issuedBy: String
    var issueDate: Date
    var expiryDate: Date?
    var documentURL: String?
    
    init(id: UUID = UUID(), name: String, issuedBy: String, issueDate: Date, expiryDate: Date? = nil, documentURL: String? = nil) {
        self.id = id
        self.name = name
        self.issuedBy = issuedBy
        self.issueDate = issueDate
        self.expiryDate = expiryDate
        self.documentURL = documentURL
    }
}
