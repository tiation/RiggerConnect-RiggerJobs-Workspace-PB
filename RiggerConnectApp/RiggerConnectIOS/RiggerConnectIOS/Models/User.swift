import Foundation

struct User: Identifiable, Codable {
    let id: UUID
    var email: String
    var name: String
    var userType: UserType
    var phoneNumber: String
    var profileImageURL: String?
    var certifications: [Certification]
    var rating: Double
    var reviewCount: Int
    var isVerified: Bool
    var insuranceDetails: InsuranceDetails?
    var equipment: [Equipment]
    var createdAt: Date
    var updatedAt: Date
}

enum UserType: String, Codable {
    case rigger = "rigger"
    case client = "client"
    case admin = "admin"
}

struct Certification: Identifiable, Codable {
    let id: UUID
    var name: String
    var issuer: String
    var issueDate: Date
    var expiryDate: Date
    var documentURL: String?
    var isVerified: Bool
}

struct InsuranceDetails: Codable {
    var provider: String
    var policyNumber: String
    var coverageAmount: Double
    var expiryDate: Date
    var documentURL: String?
}

struct Equipment: Identifiable, Codable {
    let id: UUID
    var name: String
    var type: String
    var available: Bool
}
