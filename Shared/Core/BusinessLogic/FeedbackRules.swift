import Foundation

protocol FeedbackRule {
    var id: UUID { get }
    var description: String { get }
    func evaluate(feedback: Feedback) -> Bool
}

struct Feedback {
    let score: Int
    let comments: String
}

struct ScoreRule: FeedbackRule {
    let id = UUID()
    let description = "Ensure feedback score is above threshold"

    func evaluate(feedback: Feedback) -> Bool {
        return feedback.score >= 4
    }
}

import Foundation

/// Protocol defining feedback management requirements
protocol FeedbackManaging {
    func calculateRating(_ reviews: [Review]) -> Double
    func validateFeedback(_ feedback: Feedback) -> Bool
    func assessEligibility(rating: Double) -> Bool
}

/// Manages feedback and scoring system for workers and clients
final class FeedbackRules: FeedbackManaging {
    
    private let minimumRating: Double
    private let maximumRating: Double = 5.0
    private let minimumEligibilityRating: Double
    
    init(minimumRating: Double = 1.0,
        minimumEligibilityRating: Double = 4.0) {
        self.minimumRating = minimumRating
        self.minimumEligibilityRating = minimumEligibilityRating
    }
    
    func calculateRating(_ reviews: [Review]) -> Double {
        guard !reviews.isEmpty else { return 0.0 }
        
        let weightedSum = reviews.reduce(0.0) { sum, review in
            sum + (review.rating * review.weight)
        }
        
        let totalWeight = reviews.reduce(0.0) { $0 + $1.weight }
        return weightedSum / totalWeight
    }
    
    func validateFeedback(_ feedback: Feedback) -> Bool {
        guard feedback.rating >= minimumRating,
            feedback.rating <= maximumRating,
            !feedback.comment.isEmpty else {
            return false
        }
        return true
    }
    
    func assessEligibility(rating: Double) -> Bool {
        return rating >= minimumEligibilityRating
    }
}

// MARK: - Supporting Types

struct Review {
    let rating: Double
    let weight: Double
    let date: Date
}

struct Feedback {
    let rating: Double
    let comment: String
    let timestamp: Date
    let authorId: UUID
}

