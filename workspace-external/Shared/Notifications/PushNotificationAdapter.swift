import Foundation
import UserNotifications

class PushNotificationAdapter {
    private let center = UNUserNotificationCenter.current()
    
    func requestAuthorization() async throws -> Bool {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        return try await center.requestAuthorization(options: options)
    }
    
    func sendNotification(to deviceToken: String, title: String, body: String) async throws {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString,
                                        content: content,
                                        trigger: trigger)
        
        try await center.add(request)
    }
    
    func handleAPNSToken(_ deviceToken: Data) -> String {
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        return tokenParts.joined()
    }
}

