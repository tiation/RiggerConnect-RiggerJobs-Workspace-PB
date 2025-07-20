import Foundation

enum JobApplicationStatus: String, Codable {
    case notApplied = "not_applied"
    case pending = "pending"
    case underReview = "under_review"
    case shortlisted = "shortlisted"
    case accepted = "accepted"
    case rejected = "rejected"
    case withdrawn = "withdrawn"
    
    var displayName: String {
        switch self {
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
