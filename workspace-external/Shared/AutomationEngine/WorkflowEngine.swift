import Foundation

// MARK: - Workflow Protocols

protocol WorkflowStep {
    associatedtype Input
    associatedtype Output
    
    func execute(input: Input) async throws -> Output
    func rollback(input: Input) async throws
    var name: String { get }
}

protocol Workflow {
    associatedtype WorkflowData
    var steps: [any WorkflowStep] { get }
    var currentStepIndex: Int { get }
    var status: WorkflowStatus { get }
    var workflowData: WorkflowData { get set }
}

// MARK: - Workflow Status

enum WorkflowStatus {
    case notStarted
    case inProgress(step: String)
    case completed
    case failed(error: Error)
    case rollingBack(step: String)
}

enum WorkflowError: Error {
    case stepExecutionFailed(step: String, error: Error)
    case rollbackFailed(step: String, error: Error)
    case invalidWorkflowState
    case workflowDataError
}

// MARK: - WorkflowEngine

final class WorkflowEngine<T> {
    private(set) var status: WorkflowStatus = .notStarted
    private var workflowHistory: [(step: String, timestamp: Date)] = []
    
    func execute<W: Workflow>(workflow: W) async throws where W.WorkflowData == T {
        status = .inProgress(step: workflow.steps[0].name)
        
        for (index, step) in workflow.steps.enumerated() {
            do {
                let stepStart = Date()
                if let typedStep = step as? any WorkflowStep {
                    status = .inProgress(step: typedStep.name)
                    // Execute step and update workflow data
                    // Implementation depends on specific workflow data type
                    workflowHistory.append((step: typedStep.name, timestamp: stepStart))
                }
            } catch {
                status = .failed(error: error)
                try await rollback(workflow: workflow, fromStep: index)
                throw WorkflowError.stepExecutionFailed(step: step.name, error: error)
            }
        }
        
        status = .completed
    }
    
    private func rollback<W: Workflow>(workflow: W, fromStep: Int) async throws {
        for index in (0...fromStep).reversed() {
            let step = workflow.steps[index]
            status = .rollingBack(step: step.name)
            do {
                if let typedStep = step as? any WorkflowStep {
                    try await typedStep.rollback(input: workflow.workflowData)
                }
            } catch {
                throw WorkflowError.rollbackFailed(step: step.name, error: error)
            }
        }
    }
    
    func getWorkflowStatus() -> WorkflowStatus {
        return status
    }
    
    func getWorkflowHistory() -> [(step: String, timestamp: Date)] {
        return workflowHistory
    }
}

// MARK: - Example Workflow Implementations

// Worker Onboarding Workflow
struct WorkerOnboardingData {
    var workerId: String
    var personalInfo: [String: Any]
    var documentIds: [String]
    var verificationStatus: Bool
}

class WorkerOnboardingWorkflow: Workflow {
    typealias WorkflowData = WorkerOnboardingData
    
    var steps: [any WorkflowStep]
    var currentStepIndex: Int = 0
    var status: WorkflowStatus = .notStarted
    var workflowData: WorkerOnboardingData
    
    init(workerId: String) {
        self.workflowData = WorkerOnboardingData(
            workerId: workerId,
            personalInfo: [:],
            documentIds: [],
            verificationStatus: false
        )
        
        self.steps = [
            DocumentVerificationStep(),
            BackgroundCheckStep(),
            ComplianceVerificationStep(),
            WorkerActivationStep()
        ]
    }
}

// Compliance Audit Workflow
struct ComplianceAuditData {
    var auditId: String
    var targetEntity: String
    var findings: [String: Any]
    var recommendations: [String]
    var completed: Bool
}

class ComplianceAuditWorkflow: Workflow {
    typealias WorkflowData = ComplianceAuditData
    
    var steps: [any WorkflowStep]
    var currentStepIndex: Int = 0
    var status: WorkflowStatus = .notStarted
    var workflowData: ComplianceAuditData
    
    init(auditId: String, targetEntity: String) {
        self.workflowData = ComplianceAuditData(
            auditId: auditId,
            targetEntity: targetEntity,
            findings: [:],
            recommendations: [],
            completed: false
        )
        
        self.steps = [
            InitialAssessmentStep(),
            DocumentReviewStep(),
            ComplianceCheckStep(),
            ReportGenerationStep()
        ]
    }
}

// Example Step Implementation
class DocumentVerificationStep: WorkflowStep {
    typealias Input = WorkerOnboardingData
    typealias Output = WorkerOnboardingData
    
    var name: String { "Document Verification" }
    
    func execute(input: WorkerOnboardingData) async throws -> WorkerOnboardingData {
        // Implement document verification logic
        var updatedData = input
        // ... verification logic ...
        return updatedData
    }
    
    func rollback(input: WorkerOnboardingData) async throws {
        // Implement rollback logic
        // e.g., remove verified documents, reset verification status
    }
}

