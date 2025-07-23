import SwiftUI
import Combine

@MainActor
class WorkerManagementManager: ObservableObject {
    @Published var workers: [Worker] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        loadMockWorkers()
    }
    
    // MARK: - Worker Management Methods
    
    func loadWorkers() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await Task.sleep(nanoseconds: 500_000_000) // 0.5 second delay
            loadMockWorkers()
        } catch {
            errorMessage = "Failed to load workers: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func addWorker(_ worker: Worker) {
        workers.append(worker)
    }
    
    func removeWorker(id: UUID) {
        workers.removeAll { $0.id == id }
    }
    
    // MARK: - Private Methods
    
    private func loadMockWorkers() {
        workers = [
            Worker(
                id: UUID(),
                name: "John Smith",
                specialization: "Tower Crane Operator",
                experience: 8,
                rating: 4.8,
                isAvailable: true,
                certifications: ["CPCS", "CITB"],
                hourlyRate: 65.0
            ),
            Worker(
                id: UUID(),
                name: "Sarah Johnson",
                specialization: "Rigger",
                experience: 5,
                rating: 4.6,
                isAvailable: true,
                certifications: ["RIIHAN301E", "CPCCLRG3001"],
                hourlyRate: 58.0
            ),
            Worker(
                id: UUID(),
                name: "Mike Williams",
                specialization: "Dogger",
                experience: 12,
                rating: 4.9,
                isAvailable: false,
                certifications: ["RIIHAN308E", "White Card"],
                hourlyRate: 62.0
            )
        ]
    }
}

// MARK: - Models

struct Worker: Identifiable, Codable {
    let id: UUID
    let name: String
    let specialization: String
    let experience: Int
    let rating: Double
    let isAvailable: Bool
    let certifications: [String]
    let hourlyRate: Double
    let createdAt: Date
    
    init(id: UUID, name: String, specialization: String, experience: Int, rating: Double, isAvailable: Bool, certifications: [String], hourlyRate: Double) {
        self.id = id
        self.name = name
        self.specialization = specialization
        self.experience = experience
        self.rating = rating
        self.isAvailable = isAvailable
        self.certifications = certifications
        self.hourlyRate = hourlyRate
        self.createdAt = Date()
    }
}
