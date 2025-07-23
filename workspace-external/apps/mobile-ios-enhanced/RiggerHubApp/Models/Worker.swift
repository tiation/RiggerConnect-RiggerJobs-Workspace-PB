import Foundation

struct Worker: Codable, Identifiable {
    let id: UUID
    var firstName: String
    var lastName: String
    var email: String
    var phoneNumber: String
    var profileImageURL: String?
    
    // Professional Information
    var yearsOfExperience: Int
    var hourlyRate: Double
    var availability: Availability
    var location: Location
    
    // Skills and Certifications
    var skills: [Skill]
    var certifications: [Certification]
    var specializations: [Specialization]
    
    // Work History
    var workHistory: [WorkExperience]
    var ratings: [Rating]
    var averageRating: Double
    
    // Profile Status
    var isActive: Bool
    var isVerified: Bool
    var profileCompleteness: Double
    var createdAt: Date
    var updatedAt: Date
    
    init() {
        self.id = UUID()
        self.firstName = ""
        self.lastName = ""
        self.email = ""
        self.phoneNumber = ""
        self.profileImageURL = nil
        self.yearsOfExperience = 0
        self.hourlyRate = 0.0
        self.availability = Availability()
        self.location = Location()
        self.skills = []
        self.certifications = []
        self.specializations = []
        self.workHistory = []
        self.ratings = []
        self.averageRating = 0.0
        self.isActive = true
        self.isVerified = false
        self.profileCompleteness = 0.0
        self.createdAt = Date()
        self.updatedAt = Date()
    }
    
    var fullName: String {
        return "\(firstName) \(lastName)"
    }
    
    var displayRate: String {
        return String(format: "$%.2f/hour", hourlyRate)
    }
}

struct Availability: Codable {
    var isAvailable: Bool = true
    var availabilityType: AvailabilityType = .fullTime
    var preferredShifts: [ShiftType] = []
    var availableDays: [WeekDay] = []
    var availableFromDate: Date = Date()
    var maxTravelDistance: Double = 50.0 // kilometers
    var willingToRelocate: Bool = false
}

struct Location: Codable {
    var address: String = ""
    var city: String = ""
    var state: String = ""
    var postalCode: String = ""
    var country: String = "Australia"
    var latitude: Double? = nil
    var longitude: Double? = nil
}

struct Skill: Codable, Identifiable {
    let id: UUID = UUID()
    var name: String
    var category: SkillCategory
    var proficiencyLevel: ProficiencyLevel
    var yearsOfExperience: Int
    var isVerified: Bool = false
}

struct Certification: Codable, Identifiable {
    let id: UUID = UUID()
    var name: String
    var issuingAuthority: String
    var certificateNumber: String
    var issueDate: Date
    var expiryDate: Date?
    var isActive: Bool
    var documentURL: String?
    
    var isExpired: Bool {
        guard let expiryDate = expiryDate else { return false }
        return Date() > expiryDate
    }
}

struct Specialization: Codable, Identifiable {
    let id: UUID = UUID()
    var name: String
    var category: SpecializationCategory
    var description: String
    var isVerified: Bool = false
}

struct WorkExperience: Codable, Identifiable {
    let id: UUID = UUID()
    var companyName: String
    var jobTitle: String
    var description: String
    var startDate: Date
    var endDate: Date?
    var isCurrentPosition: Bool
    var location: String
    var achievements: [String] = []
}

struct Rating: Codable, Identifiable {
    let id: UUID = UUID()
    var rating: Int // 1-5 stars
    var review: String
    var reviewerName: String
    var companyName: String
    var jobId: UUID?
    var createdAt: Date
}

// MARK: - Enums

enum AvailabilityType: String, CaseIterable, Codable {
    case fullTime = "Full Time"
    case partTime = "Part Time"
    case contract = "Contract"
    case casual = "Casual"
    case emergency = "Emergency Call-out"
}

enum ShiftType: String, CaseIterable, Codable {
    case day = "Day Shift"
    case night = "Night Shift"
    case swing = "Swing Shift"
    case weekend = "Weekend"
    case onCall = "On-call"
}

enum WeekDay: String, CaseIterable, Codable {
    case monday = "Monday"
    case tuesday = "Tuesday"
    case wednesday = "Wednesday"
    case thursday = "Thursday"
    case friday = "Friday"
    case saturday = "Saturday"
    case sunday = "Sunday"
}

enum SkillCategory: String, CaseIterable, Codable {
    case rigging = "Rigging"
    case craneOperation = "Crane Operation"
    case safety = "Safety"
    case equipment = "Equipment Operation"
    case technical = "Technical Skills"
    case soft = "Soft Skills"
}

enum ProficiencyLevel: String, CaseIterable, Codable {
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case advanced = "Advanced"
    case expert = "Expert"
}

enum SpecializationCategory: String, CaseIterable, Codable {
    case mining = "Mining"
    case construction = "Construction"
    case industrial = "Industrial"
    case marine = "Marine"
    case entertainment = "Entertainment"
    case emergency = "Emergency Response"
}
