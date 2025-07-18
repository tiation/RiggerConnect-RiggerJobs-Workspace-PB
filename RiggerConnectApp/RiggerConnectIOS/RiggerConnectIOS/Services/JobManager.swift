import Foundation
import CoreLocation

class JobManager: ObservableObject {
    @Published var jobs: [Job] = []
    @Published var myJobs: [Job] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let locationManager = CLLocationManager()
    
    init() {
        loadMockJobs()
    }
    
    func loadJobs() async {
        await MainActor.run {
            isLoading = true
            errorMessage = nil
        }
        
        // Simulate API call
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        await MainActor.run {
            loadMockJobs()
            isLoading = false
        }
    }
    
    func applyForJob(_ job: Job) async throws {
        // Simulate API call
        try await Task.sleep(nanoseconds: 500_000_000)
        
        // Add to my jobs
        await MainActor.run {
            if let index = jobs.firstIndex(where: { $0.id == job.id }) {
                jobs[index].status = .assigned
                myJobs.append(jobs[index])
            }
        }
    }
    
    func updateJobStatus(_ jobId: UUID, status: JobStatus) async throws {
        // Simulate API call
        try await Task.sleep(nanoseconds: 500_000_000)
        
        await MainActor.run {
            if let index = myJobs.firstIndex(where: { $0.id == jobId }) {
                myJobs[index].status = status
            }
        }
    }
    
    private func loadMockJobs() {
        jobs = [
            Job(
                title: "Crane Rigging - Mine Site A",
                description: "Heavy machinery rigging for mining equipment installation. Requires experienced rigger with mining site credentials.",
                location: Location(
                    address: "Mine Site A",
                    city: "Port Hedland",
                    state: "WA",
                    postcode: "6721",
                    country: "Australia",
                    coordinate: Coordinate(latitude: -20.3104, longitude: 118.5741)
                ),
                rate: 85.50,
                requiredCertifications: ["Basic Rigging", "Intermediate Rigging", "Working at Heights"],
                experienceLevel: .advanced,
                startDate: Date().addingTimeInterval(2*24*60*60),
                clientId: UUID()
            ),
            Job(
                title: "Tower Construction Support",
                description: "Assist with telecommunications tower construction. Must have experience with tower rigging and safety protocols.",
                location: Location(
                    address: "Industrial Area",
                    city: "Karratha",
                    state: "WA",
                    postcode: "6714",
                    country: "Australia",
                    coordinate: Coordinate(latitude: -20.7367, longitude: 116.8464)
                ),
                rate: 78.00,
                requiredCertifications: ["Basic Rigging", "Tower Climbing", "RF Awareness"],
                experienceLevel: .intermediate,
                startDate: Date().addingTimeInterval(5*24*60*60),
                endDate: Date().addingTimeInterval(7*24*60*60),
                clientId: UUID()
            ),
            Job(
                title: "Port Equipment Maintenance",
                description: "Rigging support for port crane maintenance. Experience with marine equipment preferred.",
                location: Location(
                    address: "Port Terminal",
                    city: "Dampier",
                    state: "WA",
                    postcode: "6713",
                    country: "Australia",
                    coordinate: Coordinate(latitude: -20.6633, longitude: 116.7081)
                ),
                rate: 82.50,
                requiredCertifications: ["Basic Rigging", "Dogman License"],
                experienceLevel: .intermediate,
                startDate: Date().addingTimeInterval(1*24*60*60),
                clientId: UUID()
            ),
            Job(
                title: "Wind Turbine Installation",
                description: "Specialized rigging for wind turbine component installation. Height work certification required.",
                location: Location(
                    address: "Renewable Energy Site",
                    city: "Newman",
                    state: "WA",
                    postcode: "6753",
                    country: "Australia",
                    coordinate: Coordinate(latitude: -23.3591, longitude: 119.7329)
                ),
                rate: 95.00,
                requiredCertifications: ["Advanced Rigging", "Working at Heights", "Wind Turbine Certification"],
                experienceLevel: .expert,
                startDate: Date().addingTimeInterval(10*24*60*60),
                endDate: Date().addingTimeInterval(20*24*60*60),
                clientId: UUID()
            ),
            Job(
                title: "Emergency Equipment Move",
                description: "Urgent: Need experienced rigger for emergency equipment relocation at processing plant.",
                location: Location(
                    address: "Processing Plant B",
                    city: "Tom Price",
                    state: "WA",
                    postcode: "6751",
                    country: "Australia",
                    coordinate: Coordinate(latitude: -22.6950, longitude: 117.7935)
                ),
                rate: 120.00,
                requiredCertifications: ["Basic Rigging", "Confined Space"],
                experienceLevel: .advanced,
                startDate: Date(),
                clientId: UUID()
            )
        ]
    }
    
    func filterJobsByDistance(from location: CLLocation, maxDistance: Double) -> [Job] {
        return jobs.filter { job in
            guard let coordinate = job.location.coordinate else { return false }
            let jobLocation = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
            let distance = location.distance(from: jobLocation) / 1000 // Convert to km
            return distance <= maxDistance
        }
    }
}
