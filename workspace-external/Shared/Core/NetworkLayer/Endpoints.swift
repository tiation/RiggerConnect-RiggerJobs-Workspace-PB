import Foundation

struct Endpoint {
    let path: String
    let method: HTTPMethod
    let headers: [String: String]?
    let body: [String: Any]?
    
    var url: URL? {
        URL(string: "https://api.riggerconnect.com\(path)")
    }
}

enum HTTPMethod: String {
    case GET
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
    case patch = "PATCH"
}

protocol APIEndpoint {
    var path: String { get }
    var method: HTTPMethod { get }
    var headers: [String: String]? { get }
    var queryItems: [URLQueryItem]? { get }
    var body: Data? { get }
}

enum APIEndpoints {
    struct Jobs: APIEndpoint {
        let path = "/api/v1/jobs"
        let method: HTTPMethod = .get
        let headers: [String: String]? = nil
        let queryItems: [URLQueryItem]?
        let body: Data? = nil
        
        init(status: String? = nil, limit: Int = 20) {
            var items: [URLQueryItem] = []
            if let status = status {
                items.append(URLQueryItem(name: "status", value: status))
            }
            items.append(URLQueryItem(name: "limit", value: "\(limit)"))
            self.queryItems = items
        }
    }
    
    struct CreateJob: APIEndpoint {
        let path = "/api/v1/jobs"
        let method: HTTPMethod = .post
        let headers: [String: String]? = ["Content-Type": "application/json"]
        let queryItems: [URLQueryItem]? = nil
        let body: Data?
        
        init(job: Job) throws {
            self.body = try JSONEncoder().encode(job)
        }
    }
    
    // Add more endpoint definitions as needed
}

