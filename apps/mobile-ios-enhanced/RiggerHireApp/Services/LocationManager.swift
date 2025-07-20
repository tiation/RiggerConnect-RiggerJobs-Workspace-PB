import Foundation
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate, ObservableObject {
    static let shared = LocationManager()
    private let manager = CLLocationManager()
    
    @Published var currentLocation: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus
    @Published var lastError: Error?
    
    override init() {
        authorizationStatus = .notDetermined
        
        super.init()
        
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.distanceFilter = 10 // Update location every 10 meters
    }
    
    func requestLocationPermission() {
        manager.requestWhenInUseAuthorization()
    }
    
    func startUpdatingLocation() {
        manager.startUpdatingLocation()
    }
    
    func stopUpdatingLocation() {
        manager.stopUpdatingLocation()
    }
    
    // MARK: - CLLocationManagerDelegate
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        currentLocation = locations.last
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        lastError = error
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        authorizationStatus = status
        
        switch status {
        case .authorizedAlways, .authorizedWhenInUse:
            startUpdatingLocation()
        case .denied, .restricted:
            stopUpdatingLocation()
            lastError = NSError(domain: "LocationManager",
                              code: 1,
                              userInfo: [NSLocalizedDescriptionKey: "Location access denied"])
        case .notDetermined:
            break
        @unknown default:
            break
        }
    }
    
    // MARK: - Utility Methods
    
    func calculateDistance(to location: CLLocation) -> CLLocationDistance? {
        guard let currentLocation = currentLocation else { return nil }
        return currentLocation.distance(from: location)
    }
    
    func geocode(address: String, completion: @escaping (CLLocation?, Error?) -> Void) {
        let geocoder = CLGeocoder()
        geocoder.geocodeAddressString(address) { placemarks, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let location = placemarks?.first?.location else {
                completion(nil, NSError(domain: "LocationManager",
                                     code: 2,
                                     userInfo: [NSLocalizedDescriptionKey: "No location found"]))
                return
            }
            
            completion(location, nil)
        }
    }
    
    func reverseGeocode(location: CLLocation, completion: @escaping (CLPlacemark?, Error?) -> Void) {
        let geocoder = CLGeocoder()
        geocoder.reverseGeocodeLocation(location) { placemarks, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let placemark = placemarks?.first else {
                completion(nil, NSError(domain: "LocationManager",
                                     code: 3,
                                     userInfo: [NSLocalizedDescriptionKey: "No placemark found"]))
                return
            }
            
            completion(placemark, nil)
        }
    }
}
