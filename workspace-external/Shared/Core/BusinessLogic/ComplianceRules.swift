import Foundation

protocol ComplianceRule {
    var id: UUID { get }
    var description: String { get }
    func validate(context: ComplianceContext) throws -> Bool
}

struct ComplianceContext {
    let certifications: [String]
    let insuranceStatus: String
    let workingHours: Int
}

struct CertificationRule: ComplianceRule {
    let id = UUID()
    let description = "Ensure worker has required certifications"

    func validate(context: ComplianceContext) throws -> Bool {
        return !context.certifications.isEmpty
    }
}

struct InsuranceRule: ComplianceRule {
    let id = UUID()
    let description = "Ensure valid insurance coverage"

    func validate(context: ComplianceContext) throws -> Bool {
        return context.insuranceStatus == "Valid"
    }
}

import Foundation

/// Protocol defining core compliance validation requirements
protocol ComplianceValidating {
    func validateCertifications(_ certifications: [Certification]) -> Bool
    func validateInsurance(_ insurance: Insurance) -> Bool 
    func validateLicenses(_ licenses: [License]) -> Bool
}

/// Manages compliance rules and validation logic for the platform
final class ComplianceRules: ComplianceValidating {
    
    private let minimumInsuranceCoverage: Decimal
    private let requiredCertifications: Set<CertificationType>
    
    init(minimumInsuranceCoverage: Decimal = 1_000_000,
        requiredCertifications: Set<CertificationType> = []) {
        self.minimumInsuranceCoverage = minimumInsuranceCoverage
        self.requiredCertifications = requiredCertifications
    }
    
    func validateCertifications(_ certifications: [Certification]) -> Bool {
        let activeCertifications = certifications.filter { !$0.isExpired }
        let certificationTypes = Set(activeCertifications.map { $0.type })
        return requiredCertifications.isSubset(of: certificationTypes)
    }
    
    func validateInsurance(_ insurance: Insurance) -> Bool {
        guard !insurance.isExpired else { return false }
        return insurance.coverage >= minimumInsuranceCoverage
    }
    
    func validateLicenses(_ licenses: [License]) -> Bool {
        return licenses.allSatisfy { license in
            !license.isExpired && license.isVerified
        }
    }
}

// MARK: - Supporting Types

struct Certification {
    let type: CertificationType
    let expirationDate: Date
    
    var isExpired: Bool {
        return Date() > expirationDate
    }
}

enum CertificationType: String {
    case rigging
    case safety
    case operation
    case specializedEquipment
}

struct Insurance {
    let coverage: Decimal
    let expirationDate: Date
    
    var isExpired: Bool {
        return Date() > expirationDate
    }
}

struct License {
    let type: String
    let expirationDate: Date
    let isVerified: Bool
    
    var isExpired: Bool {
        return Date() > expirationDate
    }
}

