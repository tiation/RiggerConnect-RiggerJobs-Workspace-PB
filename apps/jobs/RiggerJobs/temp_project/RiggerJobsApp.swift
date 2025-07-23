import SwiftUI
import UserNotifications

@main
struct RiggerJobsApp: App {
    @StateObject private var authManager = AuthenticationManager()
    @StateObject private var dashboardManager = DashboardManager()
    @StateObject private var jobManager = JobPostingManager()
    @StateObject private var workerManager = WorkerManagementManager()
    
    init() {
        configureAppearance()
        requestNotificationPermissions()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(dashboardManager)
                .environmentObject(jobManager)
                .environmentObject(workerManager)
                .preferredColorScheme(.dark)
        }
    }
    
    private func configureAppearance() {
        // Configure dark neon theme for employer app
        UINavigationBar.appearance().largeTitleTextAttributes = [
            .foregroundColor: UIColor.systemCyan
        ]
        UINavigationBar.appearance().titleTextAttributes = [
            .foregroundColor: UIColor.white
        ]
        UITabBar.appearance().tintColor = UIColor.systemCyan
        UITabBar.appearance().unselectedItemTintColor = UIColor.systemGray
        UITabBar.appearance().backgroundColor = UIColor.black
        
        // Configure accent colors
        UIView.appearance(whenContainedInInstancesOf: [UIAlertController.self]).tintColor = UIColor.systemCyan
    }
    
    private func requestNotificationPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                print("✅ RiggerJobs: Notification permissions granted")
            }
        }
    }
}

// MARK: - Preview
#Preview {
    ContentView()
        .environmentObject(AuthenticationManager())
        .environmentObject(DashboardManager())
        .environmentObject(JobPostingManager())
        .environmentObject(WorkerManagementManager())
        .preferredColorScheme(.dark)
}
