import Foundation
import Combine

class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var currentWorker: Worker?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let supabaseService = SupabaseService.shared
    
    init() {
        // Check for existing authentication on app launch
        checkAuthenticationStatus()
    }
    
    // MARK: - Authentication Methods
    
    func signUp(email: String, password: String, firstName: String, lastName: String) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let authResult = try await supabaseService.signUp(email: email, password: password)
                
                // Create worker profile
                var newWorker = Worker()
                newWorker.email = email
                newWorker.firstName = firstName
                newWorker.lastName = lastName
                
                let savedWorker = try await supabaseService.createWorkerProfile(worker: newWorker)
                
                await MainActor.run {
                    self.currentWorker = savedWorker
                    self.isAuthenticated = true
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func signIn(email: String, password: String) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let authResult = try await supabaseService.signIn(email: email, password: password)
                let worker = try await supabaseService.getWorkerProfile()
                
                await MainActor.run {
                    self.currentWorker = worker
                    self.isAuthenticated = true
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func signOut() {
        Task {
            try await supabaseService.signOut()
            
            await MainActor.run {
                self.currentWorker = nil
                self.isAuthenticated = false
                self.errorMessage = nil
            }
        }
    }
    
    func resetPassword(email: String) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await supabaseService.resetPassword(email: email)
                
                await MainActor.run {
                    self.isLoading = false
                    // Success handled in UI
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func updateProfile(_ worker: Worker) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let updatedWorker = try await supabaseService.updateWorkerProfile(worker: worker)
                
                await MainActor.run {
                    self.currentWorker = updatedWorker
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    // MARK: - Private Methods
    
    private func checkAuthenticationStatus() {
        Task {
            do {
                let isSignedIn = await supabaseService.isSignedIn()
                
                if isSignedIn {
                    let worker = try await supabaseService.getWorkerProfile()
                    
                    await MainActor.run {
                        self.currentWorker = worker
                        self.isAuthenticated = true
                    }
                }
            } catch {
                await MainActor.run {
                    self.isAuthenticated = false
                    self.currentWorker = nil
                }
            }
        }
    }
    
    // MARK: - Validation Helpers
    
    func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    func isValidPassword(_ password: String) -> Bool {
        return password.count >= 8
    }
    
    func passwordStrength(_ password: String) -> PasswordStrength {
        if password.count < 6 {
            return .weak
        } else if password.count < 8 {
            return .fair
        } else if password.count >= 8 && password.rangeOfCharacter(from: .decimalDigits) != nil {
            return .good
        } else if password.count >= 10 &&
                  password.rangeOfCharacter(from: .decimalDigits) != nil &&
                  password.rangeOfCharacter(from: .symbols) != nil {
            return .strong
        }
        return .fair
    }
}

enum PasswordStrength {
    case weak
    case fair
    case good
    case strong
    
    var color: String {
        switch self {
        case .weak: return "red"
        case .fair: return "orange"
        case .good: return "yellow"
        case .strong: return "green"
        }
    }
    
    var text: String {
        switch self {
        case .weak: return "Weak"
        case .fair: return "Fair"
        case .good: return "Good"
        case .strong: return "Strong"
        }
    }
}
