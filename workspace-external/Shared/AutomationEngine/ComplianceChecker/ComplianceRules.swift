import Foundation

// MARK: - Compliance Categories
enum ComplianceCategory: String, Codable {
    case safety, licensing, insurance, certification, legal, workingHours, equipment
}

enum ComplianceLevel: String, Codable {
    case critical    // Must be met, no exceptions
    case required    // Must be met, but temporary waivers allowed
    case recommended // Should be met, but not mandatory
}

// MARK: - Compliance Rule Protocol
protocol ComplianceRule {
    var id: UUID { get }
    var category: ComplianceCategory { get }
    var level: ComplianceLevel { get }
    var description: String { get }
    func validate(context: ComplianceContext) throws -> ComplianceResult
}

// MARK: - Compliance Context
struct ComplianceContext {
    let worker: WorkerProfile
    let job: Job
    let location: Location
    let time: Date
}

struct ComplianceResult {
    let rule: ComplianceRule
    let isPassing: Bool
    let violations: [String]
}

// MARK: - Rule Implementations
struct SafetyEquipmentRule: ComplianceRule {
    let id = UUID()
    let category = .safety
    let level = .critical
    let description = "Ensure all workers have the required PPE for this job."

    func validate(context: ComplianceContext) throws -> ComplianceResult {
        var violations: [String] = []
        let requiredPPE = context.job.safety.requiredPPE

        for item in requiredPPE {
            if !context.worker.hasPPE(item) {
                violations.append("Missing PPE: \(item.name)")
            }
        }

        return ComplianceResult(
            rule: self,
            isPassing: violations.isEmpty,
            violations: violations
        )
    }
}

struct WorkingHoursRule: ComplianceRule {
    let id = UUID()
    let category = .workingHours
    let level = .required
    let description = "Ensure worker has not exceeded maximum working hours in the past week."

    func validate(context: ComplianceContext) throws -> ComplianceResult {
        let maxHours = 40.0 // Weekly limit
        let workedHours = context.worker.hoursWorkedThisWeek

        if workedHours > maxHours {
            return ComplianceResult(
                rule: self,
                isPassing: false,
                violations: ["Worker has exceeded \(maxHours) hours: \(workedHours) hours logged."]
            )
        }

        return ComplianceResult(rule: self, isPassing: true, violations: [])
    }
}

// MARK: - Compliance Manager
class ComplianceManager {
    private var rules: [ComplianceRule]

    init() {
        self.rules = [
            SafetyEquipmentRule(),
            WorkingHoursRule()
        ]
    }

    func validate(context: ComplianceContext) -> [ComplianceResult] {
        var results: [ComplianceResult] = []

        for rule in rules {
            do {
                let result = try rule.validate(context: context)
                results.append(result)
            } catch {
                results.append(
                    ComplianceResult(rule: rule, isPassing: false, violations: ["Validation failed with error: \(error.localizedDescription)"])
                )
            }
        }

        return results
    }
}

