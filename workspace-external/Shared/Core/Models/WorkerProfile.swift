import Foundation

struct WorkerProfile {
    let id: UUID
    let name: String
    let certifications: [String]
    let equipment: [String]
    let experienceYears: Int
    let availability: [DateInterval]
}
public struct WorkerProfile: Identifiable, Codable {
    public let id: UUID
    public let name: String
    public let contactInfo: ContactInfo
    public let certifications: [Certification]
    public let insurance: InsuranceStatus
    public let ppeInventory: [PPEItem]
    public let hoursWorkedThisWeek: Double
    public let workHistory: [WorkHistoryItem]

    // Dynamic Properties
    public var isEligible: Bool {
        certifications.contains { $0.isValid } && insurance.isActive
    }

    // MARK: - Methods
    public func hasPPE(_ item: PPEItem) -> Bool {
        return ppeInventory.contains { $0.id == item.id && $0.isCertified }
    }

    public func hasCertification(_ type: CertificationType) -> Bool {
        return certifications.contains { $0.type == type && $0.isValid }
    }

    public func totalHoursWorked() -> Double {
        return workHistory.reduce(0) { $0 + $1.hoursWorked }
    }
}

// MARK: - Supporting Types
public struct ContactInfo: Codable {
    public let email: String
    public let phone: String
    public let address: String
}

public enum CertificationType: String, Codable {
    case rigging
    case craneOperation
    case firstAid
    case heavyMachinery
}

public struct Certification: Codable {
    public let id: UUID
    public let type: CertificationType
    public let issuedDate: Date
    public let expiryDate: Date

    public var isValid: Bool {
        return expiryDate > Date()
    }
}

public enum InsuranceStatus: Codable {
    case active(policyNumber: String, provider: String, expiryDate: Date)
    case inactive(reason: String)

    public var isActive: Bool {
        if case .active(let _, let _, let expiry) = self {
            return expiry > Date()
        }
        return false
    }
}

public struct PPEItem: Identifiable, Codable {
    public let id: UUID
    public let name: String
    public let isCertified: Bool
}

public struct WorkHistoryItem: Codable {
    public let jobId: UUID
    public let hoursWorked: Double
    public let dateCompleted: Date
    public let feedback: WorkerFeedback
}

public struct WorkerFeedback: Codable {
    public let rating: Double
    public let comments: String?
}
