import Foundation

struct SupabaseConfig {
    // MARK: - Configuration
    // Replace these with your actual Supabase project values
    static let url = "https://ekerxpltgkxerpxsuowm.supabase.co" // e.g., "https://your-project.supabase.co"
    static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZXJ4cGx0Z2t4ZXJweHN1b3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTQxMTcsImV4cCI6MjA2ODQ3MDExN30.wFNVr53phxB2lQfu-3durvkPxduFtIBJwmIs99n0o8s" // Your public anon key from Supabase dashboard
    
    // MARK: - API Endpoints
    struct Endpoints {
        static let auth = "\(url)/auth/v1"
        static let rest = "\(url)/rest/v1"
        static let storage = "\(url)/storage/v1"
        static let realtime = "\(url)/realtime/v1"
    }
    
    // MARK: - Table Names
    struct Tables {
        static let workers = "workers"
        static let employers = "employers"
        static let jobListings = "job_listings"
        static let jobApplications = "job_applications"
        static let skills = "skills"
        static let certifications = "certifications"
        static let workExperience = "work_experience"
        static let ratings = "ratings"
        static let messages = "messages"
    }
    
    // MARK: - Storage Buckets
    struct Buckets {
        static let profileImages = "profile-images"
        static let certificationDocs = "certification-documents"
        static let companyLogos = "company-logos"
    }
    
    // MARK: - Validation
    static func isConfigured() -> Bool {
        return !url.contains("YOUR_SUPABASE") && !anonKey.contains("YOUR_SUPABASE")
    }
    
    static func validateConfiguration() throws {
        guard isConfigured() else {
            throw SupabaseConfigError.missingConfiguration
        }
        
        guard URL(string: url) != nil else {
            throw SupabaseConfigError.invalidURL
        }
        
        guard !anonKey.isEmpty else {
            throw SupabaseConfigError.missingAnonKey
        }
    }
}

enum SupabaseConfigError: Error, LocalizedError {
    case missingConfiguration
    case invalidURL
    case missingAnonKey
    
    var errorDescription: String? {
        switch self {
        case .missingConfiguration:
            return "Supabase configuration is missing. Please update SupabaseConfig.swift with your project details."
        case .invalidURL:
            return "Invalid Supabase URL. Please check your project URL."
        case .missingAnonKey:
            return "Missing Supabase anon key. Please add your public anon key."
        }
    }
}
