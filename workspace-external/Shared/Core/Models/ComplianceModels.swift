import Foundation

struct ComplianceResult {
    let ruleId: UUID
    let isPassing: Bool
    let violations: [String]
    let timestamp: Date
}

struct ComplianceViolation: Identifiable {
    let id = UUID()
    let severity: String
    let message: String
    let remedySteps: [String]
    let deadline: Date?
}
public struct ComplianceInfo: Codable {
    public let insuranceStatus: InsuranceStatus
    public let certificationStatus: CertificationStatus
    public let backgroundCheck: BackgroundCheckStatus
    public let safetyTraining: SafetyTrainingStatus
    public let complianceScore: Int
    
    public init(
        insuranceStatus: InsuranceStatus,
        certificationStatus: CertificationStatus,
        backgroundCheck: BackgroundCheckStatus,
        safetyTraining: SafetyTrainingStatus,
        complianceScore: Int
    ) {
        self.insuranceStatus = insuranceStatus
        self.certificationStatus = certificationStatus
        self.backgroundCheck = backgroundCheck
        self.safetyTraining = safetyTraining
        self.complianceScore = complianceScore
    }
}

public struct InsuranceStatus: Codable {
    public let isValid: Bool
    public let coverage: [InsuranceCoverage]
    public let lastVerified: Date
}

public struct InsuranceCoverage: Codable {
    public let type: InsuranceType
    public let provider: String
    public let policyNumber: String
    public let coverage: Decimal
    public let startDate: Date
    public let endDate: Date
    
    public enum InsuranceType: String, Codable {
        case liability, workersComp, equipment
    }
}

public struct CertificationStatus: Codable {
    public let requiredCertifications: [String]
    public let validCertifications: [String]
    public let expiringCertifications: [String]
    public let lastVerified: Date
}

public struct BackgroundCheckStatus: Codable {
    public let status: VerificationStatus
    public let lastChecked: Date
    public let expiryDate: Date
    public let provider: String
    
    public enum VerificationStatus: String, Codable {
        case pending, approved, rejected, expired
    }
}

public struct SafetyTrainingStatus: Codable {
    public let completedTrainings: [SafetyTraining]
    public let requiredTrainings: [SafetyTraining]
    public let lastUpdated: Date
}

public struct SafetyTraining: Codable {
    public let name: String
    public let provider: String
    public let completionDate: Date
    public let expiryDate: Date
    public let certificateId: String
}

