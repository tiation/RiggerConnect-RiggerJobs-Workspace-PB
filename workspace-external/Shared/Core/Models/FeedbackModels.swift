import Foundation

struct Feedback {
    let id: UUID
    let jobId: UUID
    let workerId: UUID
    let score: Int
    let comments: String?
    let timestamp: Date
}

enum FeedbackCategory: String, Codable {
    case jobQuality
    case safety
    case communication
    case reliability
    case professionalism
    case timeliness
}

struct FeedbackSummary {
    let workerId: UUID
    let averageScore: Double
    let totalFeedbacks: Int
    let categoryBreakdown: [FeedbackCategory: Int]
}
public struct Feedback: Identifiable, Codable {
    public let id: UUID
    public let jobId: UUID
    public let workerId: UUID
    public let clientId: UUID
    public let rating: Rating
    public let review: Review
    public let metrics: PerformanceMetrics
    public let createdAt: Date
    
    public init(
        id: UUID = UUID(),
        jobId: UUID,
        workerId: UUID,
        clientId: UUID,
        rating: Rating,
        review: Review,
        metrics: PerformanceMetrics,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.jobId = jobId
        self.workerId = workerId
        self.clientId = clientId
        self.rating = rating
        self.review = review
        self.metrics = metrics
        self.createdAt = createdAt
    }
}

public struct Rating: Codable {
    public let overall: Int
    public let safety: Int
    public let professionalism: Int
    public let skillLevel: Int
    public let communication: Int
    public let reliability: Int
}

public struct Review: Codable {
    public let content: String
    public let highlights: [String]
    public let improvements: [String]
    public let isPublic: Bool
}

public struct PerformanceMetrics: Codable {
    public let onTimeArrival: Bool
    public let completedOnSchedule: Bool
    public let followedSafetyProtocols: Bool
    public let metRequirements: Bool
    public let wouldHireAgain: Bool
}

public struct FeedbackSummary: Codable {
    public let averageRating: Double
    public let totalReviews: Int
    public let ratingDistribution: [Int: Int]
    public let topHighlights: [String]
    public let recentReviews: [Feedback]
}

