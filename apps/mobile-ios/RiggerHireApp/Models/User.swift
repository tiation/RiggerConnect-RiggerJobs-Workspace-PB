import Foundation
import CoreLocation

struct User: Identifiable, Codable {
    let id: UUID
    var firstName: String
    var lastName: String
    var email: String
    var phoneNumber: String
    var profileImageURL: String?
    var userType: UserType
    var riggerProfile: RiggerProfile?
    var clientProfile: ClientProfile?
    var isVerified: Bool
    var isActive: Bool
    var createdAt: Date
    var updatedAt: Date
    
    var fullName: String {
        return "\(firstName) \(lastName)"
    }
    
    var displayName: String {
        return fullName.isEmpty ? email : fullName
    }
    
    init(
        id: UUID = UUID(),
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        profileImageURL: String? = nil,
        userType: UserType,
        riggerProfile: RiggerProfile? = nil,
        clientProfile: ClientProfile? = nil,
        isVerified: Bool = false,
        isActive: Bool = true,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.phoneNumber = phoneNumber
        self.profileImageURL = profileImageURL
        self.userType = userType
        self.riggerProfile = riggerProfile
        self.clientProfile = clientProfile
        self.isVerified = isVerified
        self.isActive = isActive
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

enum UserType: String, Codable, CaseIterable {
    case rigger = "rigger"
    case client = "client"
    case admin = "admin"
    
    var displayName: String {
        switch self {
        case .rigger: return "Rigger/Operator"
        case .client: return "Client/Business"
        case .admin: return "Administrator"
        }
    }
}

struct RiggerProfile: Codable {
    var specializations: [JobType]
    var experienceLevel: ExperienceLevel
    var yearsExperience: Int
    var certifications: [Certification]
    var availability: Availability
    var preferredLocations: [String]
    var maximumTravelDistance: Double // in km
    var hourlyRate: Double
    var rating: Double
    var completedJobs: Int
    var insuranceCoverage: Double
    var equipmentOwned: [String]
    var safetyRecord: SafetyRecord
    var languages: [String]
    var fifoAvailable: Bool
    var nightShiftAvailable: Bool
    var emergencyAvailable: Bool
    
    var averageRating: String {
        return String(format: "%.1f", rating)
    }
    
    var experienceBadge: String {
        switch yearsExperience {
        case 0...2: return "Apprentice"
        case 3...5: return "Tradesperson"
        case 6...10: return "Experienced"
        case 11...15: return "Senior"
        default: return "Expert"
        }
    }
}

struct ClientProfile: Codable {
    var companyName: String
    var abn: String
    var industry: Industry
    var companySize: CompanySize
    var primaryLocation: String
    var operatingLocations: [String]
    var paymentMethod: PaymentMethod
    var rating: Double
    var totalJobsPosted: Int
    var activeJobs: Int
    var companyDescription: String
    var website: String?
    var establishedYear: Int?
    var safetyRating: SafetyRating
    
    var averageRating: String {
        return String(format: "%.1f", rating)
    }
}

struct Certification: Codable, Identifiable {
    let id: UUID = UUID()
    var name: String
    var issuingAuthority: String
    var licenseNumber: String
    var issueDate: Date
    var expiryDate: Date
    var isValid: Bool
    var documentURL: String?
    
    var isExpiringSoon: Bool {
        let thirtyDaysFromNow = Calendar.current.date(byAdding: .day, value: 30, to: Date()) ?? Date()
        return expiryDate <= thirtyDaysFromNow
    }
    
    var isExpired: Bool {
        return expiryDate < Date()
    }
    
    var validityStatus: String {
        if isExpired {
            return "Expired"
        } else if isExpiringSoon {
            return "Expiring Soon"
        } else {
            return "Valid"
        }
    }
    
    var validityColor: String {
        if isExpired {
            return "red"
        } else if isExpiringSoon {
            return "orange"
        } else {
            return "green"
        }
    }
}

struct Availability: Codable {
    var status: AvailabilityStatus
    var startDate: Date?
    var endDate: Date?
    var preferredShifts: [ShiftPattern]
    var maximumHoursPerWeek: Int
    var minimumJobDuration: Duration
    var notes: String?
    
    enum AvailabilityStatus: String, Codable, CaseIterable {
        case available = "available"
        case busy = "busy"
        case vacation = "vacation"
        case unavailable = "unavailable"
        
        var displayName: String {
            switch self {
            case .available: return "Available Now"
            case .busy: return "Currently Busy"
            case .vacation: return "On Vacation"
            case .unavailable: return "Unavailable"
            }
        }
        
        var color: String {
            switch self {
            case .available: return "green"
            case .busy: return "orange"
            case .vacation: return "blue"
            case .unavailable: return "red"
            }
        }
    }
}

struct SafetyRecord: Codable {
    var incidentFreeHours: Int
    var lastIncidentDate: Date?
    var safetyTrainingDate: Date?
    var safetyRating: SafetyRating
    var incidentHistory: [SafetyIncident]
    
    var incidentFreeDays: Int {
        guard let lastIncident = lastIncidentDate else {
            return Int(Date().timeIntervalSince(Date())) // Very large number if no incidents
        }
        return Int(Date().timeIntervalSince(lastIncident) / 86400)
    }
}

struct SafetyIncident: Codable, Identifiable {
    let id: UUID = UUID()
    var date: Date
    var severity: IncidentSeverity
    var description: String
    var preventiveMeasures: String
    
    enum IncidentSeverity: String, Codable, CaseIterable {
        case minor = "minor"
        case moderate = "moderate"
        case serious = "serious"
        case critical = "critical"
        
        var displayName: String {
            switch self {
            case .minor: return "Minor"
            case .moderate: return "Moderate"
            case .serious: return "Serious"
            case .critical: return "Critical"
            }
        }
    }
}

enum SafetyRating: String, Codable, CaseIterable {
    case excellent = "excellent"
    case good = "good"
    case fair = "fair"
    case poor = "poor"
    
    var displayName: String {
        switch self {
        case .excellent: return "Excellent"
        case .good: return "Good"
        case .fair: return "Fair"
        case .poor: return "Poor"
        }
    }
    
    var color: String {
        switch self {
        case .excellent: return "green"
        case .good: return "cyan"
        case .fair: return "orange"
        case .poor: return "red"
        }
    }
}

enum Industry: String, Codable, CaseIterable {
    case construction = "construction"
    case mining = "mining"
    case oil = "oil"
    case gas = "gas"
    case marine = "marine"
    case logistics = "logistics"
    case manufacturing = "manufacturing"
    case utilities = "utilities"
    case other = "other"
    
    var displayName: String {
        switch self {
        case .construction: return "Construction"
        case .mining: return "Mining"
        case .oil: return "Oil"
        case .gas: return "Gas"
        case .marine: return "Marine"
        case .logistics: return "Logistics"
        case .manufacturing: return "Manufacturing"
        case .utilities: return "Utilities"
        case .other: return "Other"
        }
    }
}

enum CompanySize: String, Codable, CaseIterable {
    case startup = "startup"
    case small = "small"
    case medium = "medium"
    case large = "large"
    case enterprise = "enterprise"
    
    var displayName: String {
        switch self {
        case .startup: return "Startup (1-10)"
        case .small: return "Small (11-50)"
        case .medium: return "Medium (51-200)"
        case .large: return "Large (201-1000)"
        case .enterprise: return "Enterprise (1000+)"
        }
    }
}

enum PaymentMethod: String, Codable, CaseIterable {
    case creditCard = "credit_card"
    case bankTransfer = "bank_transfer"
    case invoice = "invoice"
    case cryptocurrency = "cryptocurrency"
    
    var displayName: String {
        switch self {
        case .creditCard: return "Credit Card"
        case .bankTransfer: return "Bank Transfer"
        case .invoice: return "Invoice (Net 30)"
        case .cryptocurrency: return "Cryptocurrency"
        }
    }
}
