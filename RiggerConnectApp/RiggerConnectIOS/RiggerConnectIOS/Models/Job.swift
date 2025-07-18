import Foundation
import CoreLocation

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
    var startDate: Date
    var endDate: Date?
    var clientId: UUID
    var assignedRiggerId: UUID?
    var createdAt: Date
    var updatedAt: Date
    
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
        startDate: Date,
        endDate: Date? = nil,
        clientId: UUID,
        assignedRiggerId: UUID? = nil,
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
        self.startDate = startDate
        self.endDate = endDate
        self.clientId = clientId
        self.assignedRiggerId = assignedRiggerId
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

struct Location: Codable {
    var address: String
    var city: String
    var state: String
    var postcode: String
    var country: String
    var coordinate: Coordinate?
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
    
    var displayName: String {
        switch self {
        case .posted: return "Posted"
        case .assigned: return "Assigned"
        case .inProgress: return "In Progress"
        case .completed: return "Completed"
        case .cancelled: return "Cancelled"
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
}
