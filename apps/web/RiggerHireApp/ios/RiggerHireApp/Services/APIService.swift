import Foundation

class APIService {
    private let baseURL = "https://api.riggerhire.tiation.com/v1"
    private let session = URLSession.shared
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    
    init() {
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601
    }
    
    // MARK: - Generic HTTP Methods
    
    func get<T: Codable>(_ endpoint: String, responseType: T.Type) async throws -> T {
        let url = try buildURL(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        addAuthHeaders(to: &request)
        
        let (data, response) = try await session.data(for: request)
        try handleResponse(response)
        
        return try decoder.decode(T.self, from: data)
    }
    
    func post<T: Codable, U: Codable>(_ endpoint: String, body: T, responseType: U.Type) async throws -> U {
        let url = try buildURL(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        addAuthHeaders(to: &request)
        
        request.httpBody = try encoder.encode(body)
        
        let (data, response) = try await session.data(for: request)
        try handleResponse(response)
        
        return try decoder.decode(U.self, from: data)
    }
    
    func put<T: Codable, U: Codable>(_ endpoint: String, body: T, responseType: U.Type) async throws -> U {
        let url = try buildURL(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        addAuthHeaders(to: &request)
        
        request.httpBody = try encoder.encode(body)
        
        let (data, response) = try await session.data(for: request)
        try handleResponse(response)
        
        return try decoder.decode(U.self, from: data)
    }
    
    func delete(_ endpoint: String) async throws {
        let url = try buildURL(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        addAuthHeaders(to: &request)
        
        let (_, response) = try await session.data(for: request)
        try handleResponse(response)
    }
    
    func uploadImage<T: Codable>(_ endpoint: String, imageData: Data, responseType: T.Type) async throws -> T {
        let url = try buildURL(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        addAuthHeaders(to: &request)
        
        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"image\"; filename=\"profile.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        let (data, response) = try await session.data(for: request)
        try handleResponse(response)
        
        return try decoder.decode(T.self, from: data)
    }
    
    // MARK: - Private Helpers
    
    private func buildURL(_ endpoint: String) throws -> URL {
        guard let url = URL(string: baseURL + endpoint) else {
            throw APIError.invalidURL
        }
        return url
    }
    
    private func addAuthHeaders(to request: inout URLRequest) {
        if let token = getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("RiggerHire iOS/1.0", forHTTPHeaderField: "User-Agent")
    }
    
    private func getAuthToken() -> String? {
        return KeychainService().get("auth_token")
    }
    
    private func handleResponse(_ response: URLResponse) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        switch httpResponse.statusCode {
        case 200...299:
            return
        case 401:
            throw APIError.unauthorized
        case 403:
            throw APIError.forbidden
        case 404:
            throw APIError.notFound
        case 422:
            throw APIError.validationError
        case 429:
            throw APIError.rateLimited
        case 500...599:
            throw APIError.serverError
        default:
            throw APIError.unknown(httpResponse.statusCode)
        }
    }
}

// MARK: - API Errors

enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case unauthorized
    case forbidden
    case notFound
    case validationError
    case rateLimited
    case serverError
    case unknown(Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .unauthorized:
            return "Authentication required. Please sign in again."
        case .forbidden:
            return "Access denied"
        case .notFound:
            return "Resource not found"
        case .validationError:
            return "Please check your input and try again"
        case .rateLimited:
            return "Too many requests. Please try again later."
        case .serverError:
            return "Server error. Please try again later."
        case .unknown(let code):
            return "Unknown error (Status: \(code))"
        }
    }
}

// MARK: - Location Manager

import CoreLocation
import Combine

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    static let shared = LocationManager()
    
    @Published var currentLocation: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    
    let locationUpdatePublisher = PassthroughSubject<CLLocation, Never>()
    
    private let locationManager = CLLocationManager()
    private var jobTrackingTimer: Timer?
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 10 // Update every 10 meters
    }
    
    func requestLocationPermission() {
        locationManager.requestWhenInUseAuthorization()
    }
    
    func startLocationUpdates() {
        guard authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways else {
            requestLocationPermission()
            return
        }
        
        locationManager.startUpdatingLocation()
    }
    
    func stopLocationUpdates() {
        locationManager.stopUpdatingLocation()
    }
    
    func startJobTracking(for jobId: UUID) {
        startLocationUpdates()
        
        // Send location updates every 30 seconds during job
        jobTrackingTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { _ in
            Task {
                await self.sendJobLocationUpdate(jobId: jobId)
            }
        }
    }
    
    func stopJobTracking() {
        jobTrackingTimer?.invalidate()
        jobTrackingTimer = nil
        stopLocationUpdates()
    }
    
    private func sendJobLocationUpdate(jobId: UUID) async {
        guard let location = currentLocation else { return }
        
        let update = JobLocationUpdate(
            jobId: jobId,
            location: JobLocationUpdate.Location(coordinate: location.coordinate),
            timestamp: Date(),
            accuracy: location.horizontalAccuracy
        )
        
        do {
            try await APIService().post("/jobs/\(jobId)/location", body: update, responseType: EmptyResponse.self)
        } catch {
            print("Failed to send location update: \(error)")
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        currentLocation = location
        locationUpdatePublisher.send(location)
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        authorizationStatus = status
        
        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            startLocationUpdates()
        case .denied, .restricted:
            stopLocationUpdates()
        case .notDetermined:
            requestLocationPermission()
        @unknown default:
            break
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location manager failed with error: \(error)")
    }
}

struct JobLocationUpdate: Codable {
    struct Location: Codable {
        let latitude: Double
        let longitude: Double
        
        init(coordinate: CLLocationCoordinate2D) {
            self.latitude = coordinate.latitude
            self.longitude = coordinate.longitude
        }
    }
    
    let jobId: UUID
    let location: Location
    let timestamp: Date
    let accuracy: Double
}

// MARK: - Notification Manager

import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()
    
    private init() {}
    
    func scheduleJobApplicationNotification(for job: Job) {
        let content = UNMutableNotificationContent()
        content.title = "Application Submitted"
        content.body = "Your application for \(job.title) has been submitted successfully."
        content.sound = .default
        content.badge = 1
        
        let request = UNNotificationRequest(
            identifier: "job_application_\(job.id)",
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func scheduleJobAcceptedNotification(for job: Job) {
        let content = UNMutableNotificationContent()
        content.title = "Job Accepted"
        content.body = "You've been selected for \(job.title). Job starts \(DateFormatter.short.string(from: job.startDate))."
        content.sound = .default
        content.badge = 1
        
        let request = UNNotificationRequest(
            identifier: "job_accepted_\(job.id)",
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func scheduleJobReminderNotification(for job: Job) {
        let calendar = Calendar.current
        let reminderTime = calendar.date(byAdding: .hour, value: -2, to: job.startDate) ?? job.startDate
        
        let content = UNMutableNotificationContent()
        content.title = "Job Starting Soon"
        content.body = "\(job.title) starts in 2 hours. Location: \(job.location.address)"
        content.sound = .default
        content.badge = 1
        
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: calendar.dateComponents([.year, .month, .day, .hour, .minute], from: reminderTime),
            repeats: false
        )
        
        let request = UNNotificationRequest(
            identifier: "job_reminder_\(job.id)",
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request)
    }
}

// MARK: - Payment Manager

class PaymentManager {
    static let shared = PaymentManager()
    
    private init() {}
    
    func processJobPayment(for job: Job) {
        Task {
            await processPaymentAsync(for: job)
        }
    }
    
    private func processPaymentAsync(for job: Job) async {
        do {
            let paymentRequest = PaymentProcessRequest(
                jobId: job.id,
                amount: calculateJobPayment(job),
                currency: job.currency
            )
            
            try await APIService().post(
                "/payments/process-job",
                body: paymentRequest,
                responseType: PaymentResponse.self
            )
            
            NotificationManager.shared.schedulePaymentProcessedNotification(for: job)
        } catch {
            print("Payment processing failed: \(error)")
        }
    }
    
    private func calculateJobPayment(_ job: Job) -> Double {
        // Calculate based on job duration and rate
        let hours = job.endDate?.timeIntervalSince(job.startDate) ?? (8 * 3600) // Default 8 hours
        let hoursWorked = hours / 3600
        return job.rate * hoursWorked
    }
}

struct PaymentProcessRequest: Codable {
    let jobId: UUID
    let amount: Double
    let currency: String
}

struct PaymentResponse: Codable {
    let success: Bool
    let paymentId: String
    let amount: Double
    let processingFee: Double
}

extension NotificationManager {
    func schedulePaymentProcessedNotification(for job: Job) {
        let content = UNMutableNotificationContent()
        content.title = "Payment Processed"
        content.body = "Payment for \(job.title) has been processed and will be deposited within 2-3 business days."
        content.sound = .default
        content.badge = 1
        
        let request = UNNotificationRequest(
            identifier: "payment_processed_\(job.id)",
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        )
        
        UNUserNotificationCenter.current().add(request)
    }
}

// MARK: - Date Formatter Extension

extension DateFormatter {
    static let short: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        return formatter
    }()
}
