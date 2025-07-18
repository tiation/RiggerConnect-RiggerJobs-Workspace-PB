import Foundation
import SwiftUI

class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var authToken: String?
    
    private let keychain = KeychainService()
    private let apiService = APIService()
    
    init() {
        checkAuthenticationStatus()
    }
    
    func checkAuthenticationStatus() {
        if let token = keychain.getToken() {
            authToken = token
            // Verify token with backend and load user
            Task {
                await loadCurrentUser()
            }
        }
    }
    
    func login(email: String, password: String) async throws {
        // Simulate API call
        try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second delay
        
        // Mock successful login
        authToken = "mock-jwt-token-\(UUID().uuidString)"
        keychain.saveToken(authToken!)
        
        // Create mock user
        currentUser = User(
            id: UUID(),
            email: email,
            name: "John Rigger",
            userType: .rigger,
            phoneNumber: "+61 400 123 456",
            profileImageURL: nil,
            certifications: [
                Certification(
                    id: UUID(),
                    name: "Basic Rigging",
                    issuer: "WorkSafe WA",
                    issueDate: Date().addingTimeInterval(-365*24*60*60),
                    expiryDate: Date().addingTimeInterval(365*24*60*60),
                    documentURL: nil,
                    isVerified: true
                )
            ],
            rating: 4.8,
            reviewCount: 45,
            isVerified: true,
            insuranceDetails: InsuranceDetails(
                provider: "RiggerSafe Insurance",
                policyNumber: "RS-2024-001",
                coverageAmount: 5000000,
                expiryDate: Date().addingTimeInterval(180*24*60*60),
                documentURL: nil
            ),
            equipment: [],
            createdAt: Date().addingTimeInterval(-730*24*60*60),
            updatedAt: Date()
        )
        
        await MainActor.run {
            isAuthenticated = true
        }
    }
    
    func logout() {
        keychain.deleteToken()
        authToken = nil
        currentUser = nil
        isAuthenticated = false
    }
    
    func register(email: String, password: String, name: String, userType: UserType) async throws {
        // Simulate API call
        try await Task.sleep(nanoseconds: 1_500_000_000) // 1.5 second delay
        
        // After registration, automatically log in
        try await login(email: email, password: password)
    }
    
    private func loadCurrentUser() async {
        // Simulate loading user from API
        try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 second delay
        
        // For demo purposes, we'll create a mock user if token exists
        if authToken != nil {
            await MainActor.run {
                isAuthenticated = true
            }
        }
    }
}

// Simple Keychain service mock
class KeychainService {
    private let tokenKey = "RiggerConnectAuthToken"
    
    func saveToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: tokenKey)
    }
    
    func getToken() -> String? {
        UserDefaults.standard.string(forKey: tokenKey)
    }
    
    func deleteToken() {
        UserDefaults.standard.removeObject(forKey: tokenKey)
    }
}

// API Service mock
class APIService {
    let baseURL = "https://api.riggerconnect.com.au"
    
    // Add API methods here
}
