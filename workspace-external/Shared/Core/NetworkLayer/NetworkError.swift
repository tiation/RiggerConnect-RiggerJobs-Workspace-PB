import Foundation

enum NetworkError: Error {
    case invalidURL
    case serverError
    case decodingError
    case unknownError
}

extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "The provided URL is invalid."
        case .serverError:
            return "An error occurred on the server."
        case .decodingError:
            return "Failed to decode the response from the server."
        case .unknownError:
            return "An unknown error occurred."
        }
    }
}
    case invalidURL
    case invalidResponse
    case unauthorized
    case forbidden
    case notFound
    case serverError(Int)
    case decodingError(Error)
    case connectionError(Error)
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid server response"
        case .unauthorized:
            return "Unauthorized - Please login again"
        case .forbidden:
            return "Access forbidden"
        case .notFound:
            return "Resource not found"
        case .serverError(let code):
            return "Server error occurred (Code: \(code))"
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .connectionError(let error):
            return "Connection error: \(error.localizedDescription)"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

