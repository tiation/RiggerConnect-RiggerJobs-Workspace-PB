import SwiftUI
import Combine

@MainActor
class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: EmployerUser?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        checkAuthenticationStatus()
    }
    
    // MARK: - Authentication Methods
    
    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        // Simulate authentication API call
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second delay
            
            // Mock successful login
            if email.contains("@") && !password.isEmpty {
                currentUser = EmployerUser(
                    id: UUID(),
                    email: email,
                    companyName: "Demo Construction Co.",
                    businessType: .construction,
                    isVerified: true
                )
                isAuthenticated = true
                saveAuthenticationState()
            } else {
                errorMessage = "Invalid email or password"
            }
        } catch {
            errorMessage = "Authentication failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func register(email: String, password: String, companyName: String, businessType: BusinessType) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 1_500_000_000) // 1.5 second delay
            
            // Mock successful registration
            currentUser = EmployerUser(
                id: UUID(),
                email: email,
                companyName: companyName,
                businessType: businessType,
                isVerified: false
            )
            isAuthenticated = true
            saveAuthenticationState()
        } catch {
            errorMessage = "Registration failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func logout() {
        currentUser = nil
        isAuthenticated = false
        clearAuthenticationState()
    }
    
    func forgotPassword(email: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 1_000_000_000)
            // Mock password reset
        } catch {
            errorMessage = "Password reset failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - Private Methods
    
    private func checkAuthenticationStatus() {
        // Check for stored authentication state
        if let userData = UserDefaults.standard.data(forKey: "rigger_jobs_user"),
           let user = try? JSONDecoder().decode(EmployerUser.self, from: userData) {
            currentUser = user
            isAuthenticated = true
        }
    }
    
    private func saveAuthenticationState() {
        guard let user = currentUser,
              let userData = try? JSONEncoder().encode(user) else { return }
        
        UserDefaults.standard.set(userData, forKey: "rigger_jobs_user")
    }
    
    private func clearAuthenticationState() {
        UserDefaults.standard.removeObject(forKey: "rigger_jobs_user")
    }
}

// MARK: - Models

struct EmployerUser: Codable, Identifiable {
    let id: UUID
    let email: String
    let companyName: String
    let businessType: BusinessType
    let isVerified: Bool
    let createdAt: Date
    
    init(id: UUID, email: String, companyName: String, businessType: BusinessType, isVerified: Bool) {
        self.id = id
        self.email = email
        self.companyName = companyName
        self.businessType = businessType
        self.isVerified = isVerified
        self.createdAt = Date()
    }
}

enum BusinessType: String, Codable, CaseIterable {
    case mining = "mining"
    case construction = "construction"
    case infrastructure = "infrastructure"
    case industrial = "industrial"
    case energy = "energy"
    case transport = "transport"
    
    var displayName: String {
        switch self {
        case .mining: return "Mining"
        case .construction: return "Construction"
        case .infrastructure: return "Infrastructure"
        case .industrial: return "Industrial"
        case .energy: return "Energy"
        case .transport: return "Transport"
        }
    }
}
