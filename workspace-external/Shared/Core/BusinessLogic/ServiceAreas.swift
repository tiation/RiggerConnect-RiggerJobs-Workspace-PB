import Foundation

struct ServiceArea {
    let id: UUID
    let name: String
    let supportedJobTypes: [String]
    let restrictions: [String]
}

import Foundation
import CoreLocation

/// Protocol defining service area management requirements
protocol ServiceAreaManaging {
    func isLocationInServiceArea(_ location: CLLocation, area: ServiceArea) -> Bool
    func calculateDistance(from: CLLocation, to: CLLocation) -> CLLocationDistance
    func validateServiceArea(_ area: ServiceArea) -> Bool
}

/// Manages service areas and location verification
final class ServiceAreaManager: ServiceAreaManaging {
    
    private let minimumAreaSize: Double
    private let maximumAreaSize: Double
    
    init(minimumAreaSize: Double = 1000, // 1km
        maximumAreaSize: Double = 100000) { // 100km
        self.minimumAreaSize = minimumAreaSize
        self.maximumAreaSize = maximumAreaSize
    }
    
    func isLocationInServiceArea(_ location: CLLocation, area: ServiceArea) -> Bool {
        let areaLocation = CLLocation(latitude: area.latitude,
                                    longitude: area.longitude)
        let distance = calculateDistance(from: location, to: areaLocation)
        return distance <= area.radius
    }
    
    func calculateDistance(from: CLLocation, to: CLLocation) -> CLLocationDistance {
        return from.distance(from: to)
    }
    
    func validateServiceArea(_ area: ServiceArea) -> Bool {
        return area.radius >= minimumAreaSize && 
            area.radius <= maximumAreaSize &&
            area.isActive
    }
}

// MARK: - Supporting Types

struct ServiceArea {
    let id: UUID
    let name: String
    let latitude: Double
    let longitude: Double
    let radius: Double // in meters
    let isActive: Bool
    
    var center: CLLocation {
        CLLocation(latitude: latitude, longitude: longitude)
    }
}

