import SwiftUI
import UserNotifications
import Foundation

class ThemeManager: ObservableObject {
    @Published var primaryColor = Color.cyan
    @Published var secondaryColor = Color(red: 1.0, green: 0.0, blue: 1.0) // Magenta
    @Published var accentColor = Color(red: 0.0, green: 0.8, blue: 1.0) // Bright cyan
    
    // Background colors
    @Published var backgroundColor = Color(red: 0.05, green: 0.05, blue: 0.1)
    @Published var cardBackground = Color(red: 0.1, green: 0.1, blue: 0.15)
    @Published var surfaceColor = Color(red: 0.15, green: 0.15, blue: 0.2)
    
    // Text colors
    @Published var primaryTextColor = Color.white
    @Published var secondaryTextColor = Color(white: 0.8)
    @Published var mutedTextColor = Color(white: 0.6)
    
    // Status colors
    @Published var successColor = Color(red: 0.0, green: 1.0, blue: 0.5)
    @Published var warningColor = Color(red: 1.0, green: 0.8, blue: 0.0)
    @Published var errorColor = Color(red: 1.0, green: 0.3, blue: 0.3)
    
    // Shadow color
    @Published var shadowColor = Color.black.opacity(0.2)
    
    // Gradient definitions
    var primaryGradient: LinearGradient {
        LinearGradient(
            colors: [primaryColor, secondaryColor],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [backgroundColor, cardBackground],
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    var neonGlow: LinearGradient {
        LinearGradient(
            colors: [
                accentColor.opacity(0.8),
                primaryColor.opacity(0.6),
                secondaryColor.opacity(0.4)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

@main
struct RiggerHireApp: App {
@StateObject private var authManager = AuthenticationManager()
    @StateObject private var jobManager = JobManager()
    @StateObject private var themeManager = ThemeManager()
    
    init() {
        configureAppearance()
        requestNotificationPermissions()
    }
    
    var body: some Scene {
        WindowGroup {
ContentView()
                .environmentObject(authManager)
                .environmentObject(jobManager)
                .environmentObject(themeManager)
                .preferredColorScheme(.dark)
        }
    }
    
    private func configureAppearance() {
        // Configure dark neon theme
        UINavigationBar.appearance().largeTitleTextAttributes = [
            .foregroundColor: UIColor.systemCyan
        ]
        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor.white
        ]
        UITabBar.appearance().tintColor = UIColor.systemCyan
        UITabBar.appearance().unselectedItemTintColor = UIColor.systemGray
    }
    
    private func requestNotificationPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { _, _ in }
    }
}
