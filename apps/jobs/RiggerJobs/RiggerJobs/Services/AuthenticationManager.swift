import SwiftUI
import Combine

@MainActor
class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: EmployerUser?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let backendService = RiggerJobsBackendService()
    
    init() {
        checkAuthenticationStatus()
    }
    
    // MARK: - Authentication Methods
    
    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await backendService.login(email: email, password: password)
            
            if let user = response.user, let session = response.session {
                // Store session token
                await backendService.setSession(session)
                
                // Fetch complete user profile
                let profile = try await backendService.fetchUserProfile(userId: user.id)
                
                currentUser = EmployerUser(
                    id: UUID(uuidString: user.id) ?? UUID(),
                    email: user.email,
                    companyName: profile.companyName,
                    businessType: BusinessType(rawValue: profile.businessType) ?? .construction,
                    isVerified: profile.isVerified
                )
                isAuthenticated = true
                saveAuthenticationState()
            }
        } catch {
            handleError(error)
        }
        
        isLoading = false
    }
    
    func register(email: String, password: String, companyName: String, businessType: BusinessType) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await backendService.register(
                email: email,
                password: password,
                companyName: companyName,
                businessType: businessType.rawValue
            )
            
            if let user = response.user {
                // Send email verification
                try await backendService.sendEmailVerification()
                
                currentUser = EmployerUser(
                    id: UUID(uuidString: user.id) ?? UUID(),
                    email: user.email,
                    companyName: companyName,
                    businessType: businessType,
                    isVerified: false // Will be true after email verification
                )
                isAuthenticated = true
                saveAuthenticationState()
            }
        } catch {
            handleError(error)
        }
        
        isLoading = false
    }
    
    func logout() async {
        do {
            try await backendService.logout()
        } catch {
            print("⚠️ Logout error: \(error.localizedDescription)")
        }
        
        currentUser = nil
        isAuthenticated = false
        clearAuthenticationState()
    }
    
    func forgotPassword(email: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await backendService.resetPassword(email: email)
            // Show success message to user
        } catch {
            handleError(error)
        }
        
        isLoading = false
    }
    
    // MARK: - Private Methods
    
    private func checkAuthenticationStatus() {
        Task {
            do {
                // Check for existing session
                if let session = await backendService.getCurrentSession() {
                    // Validate session and get current user
                    let user = try await backendService.getCurrentUser()
                    let profile = try await backendService.fetchUserProfile(userId: user.id)
                    
                    await MainActor.run {
                        currentUser = EmployerUser(
                            id: UUID(uuidString: user.id) ?? UUID(),
                            email: user.email,
                            companyName: profile.companyName,
                            businessType: BusinessType(rawValue: profile.businessType) ?? .construction,
                            isVerified: profile.isVerified
                        )
                        isAuthenticated = true
                    }
                } else {
                    // Check for locally stored user data as fallback
                    if let userData = UserDefaults.standard.data(forKey: "rigger_jobs_user"),
                       let user = try? JSONDecoder().decode(EmployerUser.self, from: userData) {
                        currentUser = user
                        isAuthenticated = true
                    }
                }
            } catch {
                print("⚠️ Session check failed: \(error.localizedDescription)")
                // Clear any invalid local data
                clearAuthenticationState()
            }
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
    
    private func handleError(_ error: Error) {
        if let backendError = error as? RiggerJobsBackendError {
            switch backendError {
            case .invalidCredentials:
                errorMessage = "Invalid email or password. Please check your credentials."
            case .userNotFound:
                errorMessage = "No account found with this email address."
            case .emailAlreadyExists:
                errorMessage = "An account with this email already exists."
            case .weakPassword:
                errorMessage = "Password must be at least 8 characters long."
            case .networkError:
                errorMessage = "Network connection failed. Please check your internet connection."
            case .serverError(let message):
                errorMessage = "Server error: \(message)"
            case .sessionExpired:
                errorMessage = "Your session has expired. Please log in again."
            case .unauthorized:
                errorMessage = "Access denied. Please check your permissions."
            }
        } else {
            errorMessage = "Authentication failed: \(error.localizedDescription)"
        }
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
