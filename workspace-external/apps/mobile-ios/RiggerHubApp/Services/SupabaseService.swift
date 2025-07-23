import Foundation

class SupabaseService {
    static let shared = SupabaseService()
    
    private let baseURL = SupabaseConfig.url
    private let apiKey = SupabaseConfig.anonKey
    private var accessToken: String?
    private var currentUserId: String?
    
    private init() {}
    
    // MARK: - Authentication
    
    func signUp(email: String, password: String) async throws -> AuthResponse {
        try SupabaseConfig.validateConfiguration()
        
        let url = URL(string: "\(baseURL)/auth/v1/signup")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = [
            "email": email,
            "password": password
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.authenticationFailed
        }
        
        if httpResponse.statusCode == 200 {
            let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
            self.accessToken = authResponse.accessToken
            self.currentUserId = authResponse.user?.id
            return authResponse
        } else {
            // Try to decode error message
            if let errorData = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let message = errorData["message"] as? String {
                print("Supabase signup error: \(message)")
            }
            throw SupabaseError.authenticationFailed
        }
    }
    
    func signIn(email: String, password: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/v1/token?grant_type=password")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = [
            "email": email,
            "password": password
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.authenticationFailed
        }
        
        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
        self.accessToken = authResponse.accessToken
        return authResponse
    }
    
    func signOut() async throws {
        let url = URL(string: "\(baseURL)/auth/v1/logout")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 204 else {
            throw SupabaseError.signOutFailed
        }
        
        self.accessToken = nil
    }
    
    func resetPassword(email: String) async throws {
        let url = URL(string: "\(baseURL)/auth/v1/recover")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = ["email": email]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.passwordResetFailed
        }
    }
    
    func isSignedIn() async -> Bool {
        return accessToken != nil
    }
    
    // MARK: - Worker Profile Management
    
    func createWorkerProfile(worker: Worker) async throws -> Worker {
        let url = URL(string: "\(baseURL)/rest/v1/workers")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        request.httpBody = try encoder.encode(worker)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 201 else {
            throw SupabaseError.profileCreationFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let createdWorkers = try decoder.decode([Worker].self, from: data)
        
        guard let createdWorker = createdWorkers.first else {
            throw SupabaseError.profileCreationFailed
        }
        
        return createdWorker
    }
    
    func getWorkerProfile() async throws -> Worker {
        let url = URL(string: "\(baseURL)/rest/v1/workers?select=*")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.profileFetchFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let workers = try decoder.decode([Worker].self, from: data)
        
        guard let worker = workers.first else {
            throw SupabaseError.profileNotFound
        }
        
        return worker
    }
    
    func updateWorkerProfile(worker: Worker) async throws -> Worker {
        let url = URL(string: "\(baseURL)/rest/v1/workers?id=eq.\(worker.id.uuidString)")!
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        request.httpBody = try encoder.encode(worker)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.profileUpdateFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let updatedWorkers = try decoder.decode([Worker].self, from: data)
        
        guard let updatedWorker = updatedWorkers.first else {
            throw SupabaseError.profileUpdateFailed
        }
        
        return updatedWorker
    }
    
    // MARK: - Job Management
    
    func fetchJobs(filters: JobFilters? = nil) async throws -> [JobListing] {
        var urlString = "\(baseURL)/rest/v1/job_listings?select=*&order=posted_date.desc"
        
        if let filters = filters {
            // Add filter parameters
            if !filters.location.isEmpty {
                urlString += "&location.ilike.*\(filters.location)*"
            }
            if let jobType = filters.jobType {
                urlString += "&job_type=eq.\(jobType.rawValue)"
            }
            if let industry = filters.industry {
                urlString += "&industry=eq.\(industry.rawValue)"
            }
        }
        
        let url = URL(string: urlString)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.jobsFetchFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode([JobListing].self, from: data)
    }
    
    func applyForJob(jobId: UUID, workerId: UUID, application: JobApplication) async throws -> JobApplication {
        let url = URL(string: "\(baseURL)/rest/v1/job_applications")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        request.httpBody = try encoder.encode(application)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 201 else {
            throw SupabaseError.applicationFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let createdApplications = try decoder.decode([JobApplication].self, from: data)
        
        guard let createdApplication = createdApplications.first else {
            throw SupabaseError.applicationFailed
        }
        
        return createdApplication
    }
    
    func fetchWorkerApplications(workerId: UUID) async throws -> [JobApplication] {
        let url = URL(string: "\(baseURL)/rest/v1/job_applications?worker_id=eq.\(workerId.uuidString)&select=*")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken ?? apiKey)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw SupabaseError.applicationsFetchFailed
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode([JobApplication].self, from: data)
    }
}

// MARK: - Supporting Models

struct AuthResponse: Codable {
    let accessToken: String
    let tokenType: String
    let expiresIn: Int
    let refreshToken: String
    let user: AuthUser?
    
    private enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case tokenType = "token_type"
        case expiresIn = "expires_in"
        case refreshToken = "refresh_token"
        case user
    }
}

struct AuthUser: Codable {
    let id: String
    let email: String?
    let emailConfirmedAt: String?
    let createdAt: String
    let updatedAt: String
    
    private enum CodingKeys: String, CodingKey {
        case id
        case email
        case emailConfirmedAt = "email_confirmed_at"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct JobFilters {
    var location: String = ""
    var jobType: JobType?
    var industry: Industry?
    var experienceLevel: ExperienceLevel?
    var salaryMin: Double?
    var salaryMax: Double?
    var isRemote: Bool?
    var isUrgent: Bool?
}

enum SupabaseError: Error, LocalizedError {
    case authenticationFailed
    case signOutFailed
    case passwordResetFailed
    case profileCreationFailed
    case profileFetchFailed
    case profileNotFound
    case profileUpdateFailed
    case jobsFetchFailed
    case applicationFailed
    case applicationsFetchFailed
    
    var errorDescription: String? {
        switch self {
        case .authenticationFailed:
            return "Authentication failed. Please check your credentials."
        case .signOutFailed:
            return "Failed to sign out. Please try again."
        case .passwordResetFailed:
            return "Password reset failed. Please try again."
        case .profileCreationFailed:
            return "Failed to create profile. Please try again."
        case .profileFetchFailed:
            return "Failed to fetch profile. Please try again."
        case .profileNotFound:
            return "Profile not found. Please create a profile first."
        case .profileUpdateFailed:
            return "Failed to update profile. Please try again."
        case .jobsFetchFailed:
            return "Failed to fetch jobs. Please try again."
        case .applicationFailed:
            return "Failed to submit application. Please try again."
        case .applicationsFetchFailed:
            return "Failed to fetch applications. Please try again."
        }
    }
}
