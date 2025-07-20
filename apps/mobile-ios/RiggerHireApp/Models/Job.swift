import Foundation
import CoreLocation
import SwiftUI

enum JobApplicationStatus: String, Codable {
case open = "open"
    case notApplied = "not_applied"
    case pending = "pending"
    case underReview = "under_review"
    case shortlisted = "shortlisted"
    case accepted = "accepted"
    case rejected = "rejected"
    case withdrawn = "withdrawn"
    
    var displayName: String {
        switch self {
        case .open:
            return "Open"
        case .notApplied:
            return "Not Applied"
        case .pending:
            return "Application Pending"
        case .underReview:
            return "Under Review"
        case .shortlisted:
            return "Shortlisted"
        case .accepted:
            return "Accepted"
        case .rejected:
            return "Rejected"
        case .withdrawn:
            return "Withdrawn"
        }
    }
    
    var color: String {
        switch self {
        case .open:
            return "green"
        case .notApplied:
            return "gray"
        case .pending:
            return "blue"
        case .underReview:
            return "orange"
        case .shortlisted:
            return "purple"
        case .accepted:
            return "green"
        case .rejected:
            return "red"
        case .withdrawn:
            return "gray"
        }
    }
}

struct Job: Identifiable, Codable {
    let id: UUID
    var title: String
    var description: String
    var location: Location
    var status: JobStatus
    var rate: Double
    var currency: String
    var requiredCertifications: [String]
    var experienceLevel: ExperienceLevel
    var jobType: JobType
    var equipmentRequired: [String]
    var safetyRequirements: [String]
    var shiftPattern: ShiftPattern
    var duration: Duration
    var startDate: Date
    var endDate: Date?
    var clientId: UUID
    var assignedRiggerId: UUID?
    var urgencyLevel: UrgencyLevel
    var weatherDependency: Bool
    var heightWork: Bool
    var insuranceRequired: Double
    var createdAt: Date
    var updatedAt: Date
    
    // Additional computed properties for JobDetailView
    var companyName: String { "Company Name" } // TODO: Add actual company name
    var isExpired: Bool { endDate != nil && endDate! < Date() }
    var applicationStatus: JobApplicationStatus { .notApplied } // TODO: Add actual status
    var industry: Industry { .construction } // TODO: Add actual industry
    var contactPhone: String? { "1234567890" } // TODO: Add actual phone
    var contactEmail: String { "contact@example.com" } // TODO: Add actual email
    var benefits: [String] { ["Health Insurance", "Superannuation"] } // TODO: Add actual benefits
    var currentApplications: Int { 0 } // TODO: Add actual count
    var timePosted: String { "2 days ago" } // TODO: Add actual time
    var responsibilities: [String] { ["Safety compliance", "Equipment operation"] } // TODO: Add actual responsibilities
    var equipmentProvided: [String] { ["Safety gear", "Tools"] } // TODO: Add actual equipment
    var requirements: [String] { ["5+ years experience", "Valid certifications"] } // TODO: Add actual requirements
    var requiredSkills: [String] { ["Heavy lifting", "Team coordination"] } // TODO: Add actual skills
    
    init(
        id: UUID = UUID(),
        title: String,
        description: String,
        location: Location,
        status: JobStatus = .posted,
        rate: Double,
        currency: String = "AUD",
        requiredCertifications: [String] = [],
        experienceLevel: ExperienceLevel = .intermediate,
        jobType: JobType,
        equipmentRequired: [String] = [],
        safetyRequirements: [String] = [],
        shiftPattern: ShiftPattern = .dayShift,
        duration: Duration,
        startDate: Date,
        endDate: Date? = nil,
        clientId: UUID,
        assignedRiggerId: UUID? = nil,
        urgencyLevel: UrgencyLevel = .standard,
        weatherDependency: Bool = false,
        heightWork: Bool = false,
        insuranceRequired: Double = 10000000.0,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.location = location
        self.status = status
        self.rate = rate
        self.currency = currency
        self.requiredCertifications = requiredCertifications
        self.experienceLevel = experienceLevel
        self.jobType = jobType
        self.equipmentRequired = equipmentRequired
        self.safetyRequirements = safetyRequirements
        self.shiftPattern = shiftPattern
        self.duration = duration
        self.startDate = startDate
        self.endDate = endDate
        self.clientId = clientId
        self.assignedRiggerId = assignedRiggerId
        self.urgencyLevel = urgencyLevel
        self.weatherDependency = weatherDependency
        self.heightWork = heightWork
        self.insuranceRequired = insuranceRequired
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
    
    var distanceFromCurrentLocation: Double? {
        guard let userLocation = LocationManager.shared.currentLocation else { return nil }
        let jobLocation = CLLocation(latitude: location.coordinate?.latitude ?? 0, 
                                   longitude: location.coordinate?.longitude ?? 0)
        return userLocation.distance(from: jobLocation) / 1000 // in km
    }
    
var formattedSalary: String {
        let rateStr = String(format: "%.2f", rate)
        switch duration {
        case .hourly:
            return "$\(rateStr)/hr \(currency)"
        case .daily:
            return "$\(rateStr)/day \(currency)"
        case .weekly:
            return "$\(rateStr)/week \(currency)"
        case .monthly:
            return "$\(rateStr)/month \(currency)"
        case .contract:
            return "$\(rateStr) \(currency)"
        }
    }
    
    var formattedRate: String {
        return "$\(String(format: "%.2f", rate))/hr \(currency)"
    }
    
    var isUrgent: Bool {
        return urgencyLevel == .urgent || urgencyLevel == .emergency
    }
}

struct Location: Codable {
    var displayLocation: String {
        return "\(city), \(state) \(postcode)"
    }
    
    var address: String
    var city: String
    var state: String
    var postcode: String
    var country: String
    var siteType: SiteType
    var coordinate: Coordinate?
    
    enum SiteType: String, Codable, CaseIterable {
        case miningsite = "mining_site"
        case construction = "construction"
        case industrial = "industrial"
        case port = "port"
        case offshore = "offshore"
        case urban = "urban"
        
        var displayName: String {
            switch self {
            case .miningsite: return "Mining Site"
            case .construction: return "Construction Site"
            case .industrial: return "Industrial Site"
            case .port: return "Port/Marine"
            case .offshore: return "Offshore"
            case .urban: return "Urban/City"
            }
        }
        
        var icon: String {
            switch self {
            case .miningsite: return "pickaxe"
            case .construction: return "hammer.fill"
            case .industrial: return "gear"
            case .port: return "ferry.fill"
            case .offshore: return "water.waves"
            case .urban: return "building.2.fill"
            }
        }
    }
}

struct Coordinate: Codable {
    var latitude: Double
    var longitude: Double
    
    var clLocation: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

enum JobStatus: String, Codable, CaseIterable {
    case posted = "posted"
    case assigned = "assigned"
    case inProgress = "in_progress"
    case completed = "completed"
    case cancelled = "cancelled"
    case onHold = "on_hold"
    
    var displayName: String {
        switch self {
        case .posted: return "Posted"
        case .assigned: return "Assigned"
        case .inProgress: return "In Progress"
        case .completed: return "Completed"
        case .cancelled: return "Cancelled"
        case .onHold: return "On Hold"
        }
    }
    
    var color: String {
        switch self {
        case .posted: return "cyan"
        case .assigned: return "orange"
        case .inProgress: return "green"
        case .completed: return "blue"
        case .cancelled: return "red"
        case .onHold: return "yellow"
        }
    }
}

enum ExperienceLevel: String, Codable, CaseIterable {
    case entry = "entry"
    case intermediate = "intermediate"
    case advanced = "advanced"
    case expert = "expert"
    
    var displayName: String {
        switch self {
        case .entry: return "Entry Level"
        case .intermediate: return "Intermediate"
        case .advanced: return "Advanced"
        case .expert: return "Expert"
        }
    }
    
    var minimumRate: Double {
        switch self {
        case .entry: return 45.0
        case .intermediate: return 65.0
        case .advanced: return 85.0
        case .expert: return 110.0
        }
    }
}

enum JobType: String, Codable, CaseIterable {
    case craneOperator = "crane_operator"
    case rigger = "rigger"
    case dogger = "dogger"
    case scaffolder = "scaffolder"
    case mobileCraneOperator = "mobile_crane_operator"
    case towerCraneOperator = "tower_crane_operator"
    case signaller = "signaller"
    
    var displayName: String {
        switch self {
        case .craneOperator: return "Crane Operator"
        case .rigger: return "Rigger"
        case .dogger: return "Dogger/Slinger"
        case .scaffolder: return "Scaffolder"
        case .mobileCraneOperator: return "Mobile Crane Operator"
        case .towerCraneOperator: return "Tower Crane Operator"
        case .signaller: return "Crane Signaller"
        }
    }
    
    var icon: String {
        switch self {
        case .craneOperator: return "arrow.up.and.down.and.arrow.left.and.right"
        case .rigger: return "link"
        case .dogger: return "hands.sparkles.fill"
        case .scaffolder: return "building.columns.fill"
        case .mobileCraneOperator: return "truck.box.fill"
        case .towerCraneOperator: return "building.2.crop.circle.fill"
        case .signaller: return "hand.raised.fill"
        }
    }
    
    var requiredCertifications: [String] {
        switch self {
        case .craneOperator:
            return ["High Risk Work License - Crane", "White Card", "Valid Medical Certificate"]
        case .rigger:
            return ["High Risk Work License - Rigging", "White Card", "First Aid Certificate"]
        case .dogger:
            return ["High Risk Work License - Dogging", "White Card"]
        case .scaffolder:
            return ["High Risk Work License - Scaffolding", "White Card", "Height Safety Training"]
        case .mobileCraneOperator:
            return ["High Risk Work License - Mobile Crane", "Heavy Vehicle License", "White Card"]
        case .towerCraneOperator:
            return ["High Risk Work License - Tower Crane", "White Card", "Height Safety Training"]
        case .signaller:
            return ["Crane Signaller Certification", "White Card", "Traffic Management"]
        }
    }
}

enum ShiftPattern: String, Codable, CaseIterable {
    case dayShift = "day_shift"
    case nightShift = "night_shift"
    case swingShift = "swing_shift"
    case fifo = "fifo"
    case continuous = "continuous"
    
    var displayName: String {
        switch self {
        case .dayShift: return "Day Shift (6AM-6PM)"
        case .nightShift: return "Night Shift (6PM-6AM)"
        case .swingShift: return "Swing Shift"
        case .fifo: return "FIFO (Fly-In Fly-Out)"
        case .continuous: return "24/7 Continuous"
        }
    }
}

enum Duration: String, Codable, CaseIterable {
    case hourly = "hourly"
    case daily = "daily"
    case weekly = "weekly"
    case monthly = "monthly"
    case contract = "contract"
    
    var displayName: String {
        switch self {
        case .hourly: return "Hourly"
        case .daily: return "Daily"
        case .weekly: return "Weekly"
        case .monthly: return "Monthly"
        case .contract: return "Contract"
        }
    }
}

enum UrgencyLevel: String, Codable, CaseIterable {
    case standard = "standard"
    case priority = "priority"
    case urgent = "urgent"
    case emergency = "emergency"
    
    var displayName: String {
        switch self {
        case .standard: return "Standard"
        case .priority: return "Priority"
        case .urgent: return "Urgent"
        case .emergency: return "Emergency"
        }
    }
    
    var color: String {
        switch self {
        case .standard: return "gray"
        case .priority: return "yellow"
        case .urgent: return "orange"
        case .emergency: return "red"
        }
    }
}
