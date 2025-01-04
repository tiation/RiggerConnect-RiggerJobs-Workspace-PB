import Foundation

enum JobStatus: String, Codable {
    case draft
    case pending
    case assigned
    case inProgress
    case completed
    case cancelled
}

struct Job {
    let id: UUID
    let title: String
    let description: String
    let location: String
    let schedule: DateInterval
    let status: JobStatus
    let clientId: UUID
    let assignedWorkerId: UUID?
}

/// Represents a rigging job posting in the system
public struct Job: Identifiable, Codable {
    public let id: UUID
    public let title: String
    public let description: String
    public let location: LocationInfo
    public let schedule: JobSchedule
    public let requirements: JobRequirements
    public let pricing: JobPricing
    public let status: JobStatus
    public let createdAt: Date
    public let updatedAt: Date
    
    public init(
        id: UUID = UUID(),
        title: String,
        description: String,
        location: LocationInfo,
        schedule: JobSchedule,
        requirements: JobRequirements,
        pricing: JobPricing,
        status: JobStatus = .draft,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.location = location
        self.schedule = schedule
        self.requirements = requirements
        self.pricing = pricing
        self.status = status
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

public struct LocationInfo: Codable {
    public let address: String
    public let coordinates: CLLocationCoordinate2D
    public let serviceArea: String
    
    private enum CodingKeys: String, CodingKey {
        case address, coordinates, serviceArea
    }
}

public struct JobSchedule: Codable {
    public let startDate: Date
    public let endDate: Date
    public let estimatedDuration: TimeInterval
    public let flexibility: FlexibilityOption
    
    public enum FlexibilityOption: String, Codable {
        case fixed, flexible, negotiable
    }
}

public struct JobRequirements: Codable {
    public let certifications: [String]
    public let experience: ExperienceLevel
    public let insurance: InsuranceRequirement
    public let equipment: [String]
    
    public enum ExperienceLevel: String, Codable {
        case entry, intermediate, expert
    }
}

public struct JobPricing: Codable {
    public let type: PricingType
    public let amount: Decimal
    public let currency: String
    
    public enum PricingType: String, Codable {
        case hourly, fixed, negotiable
    }
}

public enum JobStatus: String, Codable {
    case draft, posted, inProgress, completed, cancelled
}

