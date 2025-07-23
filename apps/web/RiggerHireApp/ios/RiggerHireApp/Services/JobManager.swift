import Foundation
import Combine
import CoreLocation

@MainActor
class JobManager: ObservableObject {
    @Published var availableJobs: [Job] = []
    @Published var myJobs: [Job] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var selectedJob: Job?
    @Published var jobFilters = JobFilters()
    
    private let apiService = APIService()
    private let locationManager = LocationManager.shared
    private var cancellables = Set<AnyCancellable>()
    
    // Demo mode flag
    private let isDemoMode = true // Set to true to enable demo mode
    
    init() {
        setupLocationUpdates()
    }
    
    // MARK: - Job Loading
    
    func loadJobs() {
        Task {
            await fetchAvailableJobs()
            await fetchMyJobs()
        }
    }
    
    func fetchAvailableJobs() async {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            availableJobs = sortJobsByRelevance(createDemoAvailableJobs())
            isLoading = false
            return
        }
        
        do {
            let queryParams = buildQueryParams()
            let jobs = try await apiService.get("/jobs/available?\(queryParams)", responseType: [Job].self)
            
            // Sort jobs by urgency, distance, and rate
            availableJobs = sortJobsByRelevance(jobs)
        } catch {
            errorMessage = "Failed to load jobs: \(error.localizedDescription)"
            availableJobs = []
        }
        
        isLoading = false
    }
    
    func fetchMyJobs() async {
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 500_000_000)
            
            myJobs = createDemoMyJobs().sorted { $0.startDate < $1.startDate }
            return
        }
        
        do {
            let jobs = try await apiService.get("/jobs/my-jobs", responseType: [Job].self)
            myJobs = jobs.sorted { $0.startDate < $1.startDate }
        } catch {
            print("Failed to load my jobs: \(error.localizedDescription)")
            myJobs = []
        }
    }
    
    func refreshJobs() {
        Task {
            await fetchAvailableJobs()
            await fetchMyJobs()
        }
    }
    
    // MARK: - Job Actions
    
    func applyForJob(_ job: Job) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_500_000_000)
            
            // Simulate successful application
            updateJobStatus(job.id, to: .assigned)
            
            // Move job to my jobs
            var updatedJob = job
            updatedJob.status = .assigned
            myJobs.append(updatedJob)
            
            // Remove from available jobs
            availableJobs.removeAll { $0.id == job.id }
            
            isLoading = false
            return true
        }
        
        do {
            let application = JobApplication(
                jobId: job.id,
                message: "I'm interested in this position and meet all requirements.",
                proposedRate: nil
            )
            
            let response = try await apiService.post(
                "/jobs/\(job.id)/apply",
                body: application,
                responseType: JobApplicationResponse.self
            )
            
            if response.success {
                // Update job status locally
                updateJobStatus(job.id, to: .assigned)
                await fetchMyJobs() // Refresh my jobs list
                
                // Send notification
                NotificationManager.shared.scheduleJobApplicationNotification(for: job)
                return true
            }
        } catch {
            errorMessage = "Failed to apply for job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    func acceptJobOffer(_ job: Job) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            updateJobStatus(job.id, to: .assigned)
            isLoading = false
            return true
        }
        
        do {
            try await apiService.post("/jobs/\(job.id)/accept", body: EmptyRequest(), responseType: EmptyResponse.self)
            updateJobStatus(job.id, to: .assigned)
            await fetchMyJobs()
            
            NotificationManager.shared.scheduleJobAcceptedNotification(for: job)
            return true
        } catch {
            errorMessage = "Failed to accept job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    func startJob(_ job: Job) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            updateJobStatus(job.id, to: .inProgress)
            isLoading = false
            return true
        }
        
        do {
            let startRequest = StartJobRequest(
                startTime: Date(),
                location: locationManager.currentLocation?.coordinate
            )
            
            try await apiService.post(
                "/jobs/\(job.id)/start",
                body: startRequest,
                responseType: EmptyResponse.self
            )
            
            updateJobStatus(job.id, to: .inProgress)
            await fetchMyJobs()
            
            // Start location tracking for safety
            locationManager.startJobTracking(for: job.id)
            
            return true
        } catch {
            errorMessage = "Failed to start job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    func completeJob(_ job: Job, notes: String? = nil) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            updateJobStatus(job.id, to: .completed)
            isLoading = false
            return true
        }
        
        do {
            let completion = JobCompletion(
                endTime: Date(),
                notes: notes,
                location: locationManager.currentLocation?.coordinate
            )
            
            try await apiService.post(
                "/jobs/\(job.id)/complete",
                body: completion,
                responseType: EmptyResponse.self
            )
            
            updateJobStatus(job.id, to: .completed)
            await fetchMyJobs()
            
            // Stop location tracking
            locationManager.stopJobTracking()
            
            // Process payment
            PaymentManager.shared.processJobPayment(for: job)
            
            return true
        } catch {
            errorMessage = "Failed to complete job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    func cancelJob(_ job: Job, reason: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            updateJobStatus(job.id, to: .cancelled)
            isLoading = false
            return true
        }
        
        do {
            let cancellation = JobCancellation(
                reason: reason,
                timestamp: Date()
            )
            
            try await apiService.post(
                "/jobs/\(job.id)/cancel",
                body: cancellation,
                responseType: EmptyResponse.self
            )
            
            updateJobStatus(job.id, to: .cancelled)
            await fetchMyJobs()
            
            return true
        } catch {
            errorMessage = "Failed to cancel job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    // MARK: - Job Filtering and Sorting
    
    func applyFilters(_ filters: JobFilters) {
        jobFilters = filters
        Task {
            await fetchAvailableJobs()
        }
    }
    
    func searchJobs(query: String) {
        Task {
            if query.isEmpty {
                await fetchAvailableJobs()
            } else {
                await searchJobsWithQuery(query)
            }
        }
    }
    
    private func searchJobsWithQuery(_ query: String) async {
        isLoading = true
        
        if isDemoMode {
            // Simulate network delay
            try? await Task.sleep(nanoseconds: 800_000_000)
            
            // Filter demo jobs by query
            let allDemoJobs = createDemoAvailableJobs()
            let filteredJobs = allDemoJobs.filter { job in
                job.title.lowercased().contains(query.lowercased()) ||
                job.description.lowercased().contains(query.lowercased())
            }
            
            availableJobs = sortJobsByRelevance(filteredJobs)
            isLoading = false
            return
        }
        
        do {
            let searchRequest = JobSearchRequest(
                query: query,
                filters: jobFilters
            )
            
            let jobs = try await apiService.post(
                "/jobs/search",
                body: searchRequest,
                responseType: [Job].self
            )
            
            availableJobs = sortJobsByRelevance(jobs)
        } catch {
            errorMessage = "Search failed: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    private func sortJobsByRelevance(_ jobs: [Job]) -> [Job] {
        return jobs.sorted { job1, job2 in
            // Sort by urgency first
            if job1.urgencyLevel != job2.urgencyLevel {
                return job1.urgencyLevel.rawValue > job2.urgencyLevel.rawValue
            }
            
            // Then by rate (higher rate first)
            if job1.rate != job2.rate {
                return job1.rate > job2.rate
            }
            
            // Then by distance (closer first)
            let distance1 = job1.distanceFromCurrentLocation ?? Double.greatestFiniteMagnitude
            let distance2 = job2.distanceFromCurrentLocation ?? Double.greatestFiniteMagnitude
            
            return distance1 < distance2
        }
    }
    
    // MARK: - Helper Methods
    
    private func buildQueryParams() -> String {
        var params: [String] = []
        
        if !jobFilters.jobTypes.isEmpty {
            let types = jobFilters.jobTypes.map { $0.rawValue }.joined(separator: ",")
            params.append("jobTypes=\(types)")
        }
        
        if !jobFilters.experienceLevels.isEmpty {
            let levels = jobFilters.experienceLevels.map { $0.rawValue }.joined(separator: ",")
            params.append("experienceLevels=\(levels)")
        }
        
        if !jobFilters.siteTypes.isEmpty {
            let sites = jobFilters.siteTypes.map { $0.rawValue }.joined(separator: ",")
            params.append("siteTypes=\(sites)")
        }
        
        if jobFilters.minRate > 0 {
            params.append("minRate=\(jobFilters.minRate)")
        }
        
        if jobFilters.maxRate > 0 {
            params.append("maxRate=\(jobFilters.maxRate)")
        }
        
        if jobFilters.maxDistance > 0 {
            params.append("maxDistance=\(jobFilters.maxDistance)")
        }
        
        if let location = locationManager.currentLocation {
            params.append("lat=\(location.coordinate.latitude)")
            params.append("lng=\(location.coordinate.longitude)")
        }
        
        return params.joined(separator: "&")
    }
    
    private func updateJobStatus(_ jobId: UUID, to status: JobStatus) {
        // Update in available jobs
        if let index = availableJobs.firstIndex(where: { $0.id == jobId }) {
            availableJobs[index].status = status
        }
        
        // Update in my jobs
        if let index = myJobs.firstIndex(where: { $0.id == jobId }) {
            myJobs[index].status = status
        }
    }
    
    private func setupLocationUpdates() {
        locationManager.locationUpdatePublisher
            .sink { [weak self] _ in
                // Refresh jobs when location updates to get better distance calculations
                self?.refreshJobs()
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Job Creation (for clients)
    
    func createJob(_ job: Job) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let createdJob = try await apiService.post("/jobs", body: job, responseType: Job.self)
            
            // Add to available jobs if user is viewing them
            availableJobs.insert(createdJob, at: 0)
            
            return true
        } catch {
            errorMessage = "Failed to create job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    func updateJob(_ job: Job) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let updatedJob = try await apiService.put("/jobs/\(job.id)", body: job, responseType: Job.self)
            
            // Update local arrays
            updateJobInArrays(updatedJob)
            
            return true
        } catch {
            errorMessage = "Failed to update job: \(error.localizedDescription)"
        }
        
        isLoading = false
        return false
    }
    
    private func updateJobInArrays(_ job: Job) {
        if let index = availableJobs.firstIndex(where: { $0.id == job.id }) {
            availableJobs[index] = job
        }
        
        if let index = myJobs.firstIndex(where: { $0.id == job.id }) {
            myJobs[index] = job
        }
    }
    
    // MARK: - Demo Data Creation
    
    private func createDemoAvailableJobs() -> [Job] {
        let calendar = Calendar.current
        let now = Date()
        let clientId = UUID() // Sample client ID
        
        return [
            Job(
                title: "Crane Operator - High Rise Construction",
                description: "Experienced crane operator needed for high-rise construction project. Must have current tickets and 3+ years experience operating tower cranes.",
                location: Location(
                    address: "123 Collins Street",
                    city: "Melbourne",
                    state: "VIC",
                    postcode: "3000",
                    country: "Australia",
                    siteType: .construction,
                    coordinate: Coordinate(latitude: -37.8136, longitude: 144.9631)
                ),
                status: .posted,
                rate: 65.0,
                requiredCertifications: [
                    "Current High Risk Work Licence (Crane)",
                    "3+ years tower crane experience",
                    "Construction White Card",
                    "Clean driving record"
                ],
                experienceLevel: .advanced,
                jobType: .craneOperator,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 2, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 6, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .priority
            ),
            Job(
                title: "Scaffolder - CBD Commercial Project",
                description: "Seeking experienced scaffolders for major CBD commercial development. Immediate start available for the right candidates.",
                location: Location(
                    address: "456 Flinders Street",
                    city: "Melbourne",
                    state: "VIC",
                    postcode: "3000",
                    country: "Australia",
                    siteType: .construction,
                    coordinate: Coordinate(latitude: -37.8183, longitude: 144.9671)
                ),
                status: .posted,
                rate: 45.0,
                requiredCertifications: [
                    "Current scaffolding tickets",
                    "2+ years commercial experience",
                    "Construction White Card",
                    "Own PPE and tools"
                ],
                experienceLevel: .intermediate,
                jobType: .scaffolder,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 1, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 4, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .urgent
            ),
            Job(
                title: "Dogman/Rigger - Mining Project",
                description: "Experienced dogman/rigger required for mining operation. FIFO opportunity with excellent rates and accommodation provided.",
                location: Location(
                    address: "789 Mining Road",
                    city: "Kalgoorlie",
                    state: "WA",
                    postcode: "6430",
                    country: "Australia",
                    siteType: .miningsite,
                    coordinate: Coordinate(latitude: -30.7494, longitude: 121.4656)
                ),
                status: .posted,
                rate: 75.0,
                requiredCertifications: [
                    "High Risk Work Licence (Dogging)",
                    "High Risk Work Licence (Rigging)",
                    "Mining induction completed",
                    "5+ years mining experience"
                ],
                experienceLevel: .advanced,
                jobType: .rigger,
                shiftPattern: .fifo,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 7, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 12, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .standard
            ),
            Job(
                title: "Rigger - Residential Complex",
                description: "Riggers needed for large residential development. Great rates and steady work for experienced tradespeople.",
                location: Location(
                    address: "321 Chapel Street",
                    city: "South Yarra",
                    state: "VIC",
                    postcode: "3141",
                    country: "Australia",
                    siteType: .construction,
                    coordinate: Coordinate(latitude: -37.8467, longitude: 144.9898)
                ),
                status: .posted,
                rate: 42.0,
                requiredCertifications: [
                    "2+ years rigging experience",
                    "Construction White Card",
                    "Own tools",
                    "Reliable transport"
                ],
                experienceLevel: .intermediate,
                jobType: .rigger,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 3, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 8, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .standard
            ),
            Job(
                title: "Signaller - Infrastructure Project",
                description: "Crane signaller required for major infrastructure project. Entry level position with training provided.",
                location: Location(
                    address: "654 Spencer Street",
                    city: "West Melbourne",
                    state: "VIC",
                    postcode: "3003",
                    country: "Australia",
                    siteType: .industrial,
                    coordinate: Coordinate(latitude: -37.8067, longitude: 144.9532)
                ),
                status: .posted,
                rate: 52.0,
                requiredCertifications: [
                    "Construction White Card",
                    "Physical fitness",
                    "Willingness to learn",
                    "Safety-focused attitude"
                ],
                experienceLevel: .entry,
                jobType: .signaller,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 5, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 3, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .standard
            )
        ]
    }
    
    private func createDemoMyJobs() -> [Job] {
        let calendar = Calendar.current
        let now = Date()
        let clientId = UUID()
        
        return [
            Job(
                title: "Tower Crane Operator - Southbank",
                description: "Operating tower crane for luxury apartment development in Southbank.",
                location: Location(
                    address: "88 Southbank Boulevard",
                    city: "Southbank",
                    state: "VIC",
                    postcode: "3006",
                    country: "Australia",
                    siteType: .construction,
                    coordinate: Coordinate(latitude: -37.8229, longitude: 144.9645)
                ),
                status: .inProgress,
                rate: 68.0,
                experienceLevel: .advanced,
                jobType: .towerCraneOperator,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: -10, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 3, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .standard
            ),
            Job(
                title: "Scaffolding Team Lead - Richmond",
                description: "Leading scaffolding crew for mixed-use development project.",
                location: Location(
                    address: "25 Bridge Road",
                    city: "Richmond",
                    state: "VIC",
                    postcode: "3121",
                    country: "Australia",
                    siteType: .construction,
                    coordinate: Coordinate(latitude: -37.8197, longitude: 145.0022)
                ),
                status: .assigned,
                rate: 52.0,
                experienceLevel: .advanced,
                jobType: .scaffolder,
                duration: .contract,
                startDate: calendar.date(byAdding: .day, value: 2, to: now) ?? now,
                endDate: calendar.date(byAdding: .month, value: 2, to: now) ?? now,
                clientId: clientId,
                urgencyLevel: .standard
            )
        ]
    }
}

// MARK: - Supporting Models

struct JobFilters: Codable {
    var jobTypes: [JobType] = []
    var experienceLevels: [ExperienceLevel] = []
    var siteTypes: [Location.SiteType] = []
    var minRate: Double = 0
    var maxRate: Double = 0
    var maxDistance: Double = 0 // in km
    var urgentOnly: Bool = false
    var fifoOnly: Bool = false
    var nightShiftAvailable: Bool = false
    
    var hasActiveFilters: Bool {
        return !jobTypes.isEmpty || !experienceLevels.isEmpty || !siteTypes.isEmpty ||
               minRate > 0 || maxRate > 0 || maxDistance > 0 || urgentOnly || fifoOnly || nightShiftAvailable
    }
}

struct JobApplication: Codable {
    let jobId: UUID
    let message: String
    let proposedRate: Double?
}

struct JobApplicationResponse: Codable {
    let success: Bool
    let message: String
}

struct StartJobRequest: Codable {
    let startTime: Date
    let location: CLLocationCoordinate2D?
}

struct JobCompletion: Codable {
    let endTime: Date
    let notes: String?
    let location: CLLocationCoordinate2D?
}

struct JobCancellation: Codable {
    let reason: String
    let timestamp: Date
}

struct JobSearchRequest: Codable {
    let query: String
    let filters: JobFilters
}

struct EmptyRequest: Codable {}

// MARK: - CLLocationCoordinate2D Extension

extension CLLocationCoordinate2D: Codable {
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(latitude, forKey: .latitude)
        try container.encode(longitude, forKey: .longitude)
    }
    
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let latitude = try container.decode(Double.self, forKey: .latitude)
        let longitude = try container.decode(Double.self, forKey: .longitude)
        self.init(latitude: latitude, longitude: longitude)
    }
    
    private enum CodingKeys: String, CodingKey {
        case latitude, longitude
    }
}
