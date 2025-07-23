import Foundation

enum ApplicationStatus: String, Codable {
    case open = "open"
    case closed = "closed"
    case paused = "paused"
    case draft = "draft"
    
    var displayName: String {
        switch self {
        case .open: return "Open"
        case .closed: return "Closed"
        case .paused: return "Paused"
        case .draft: return "Draft"
        }
    }
    
    var color: String {
        switch self {
        case .open: return "green"
        case .closed: return "red"
        case .paused: return "orange"
        case .draft: return "gray"
        }
    }
}
