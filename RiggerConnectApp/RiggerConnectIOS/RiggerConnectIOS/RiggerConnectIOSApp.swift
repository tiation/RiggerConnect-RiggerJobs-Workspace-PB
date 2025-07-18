import SwiftUI

@main
struct RiggerConnectIOSApp: App {
    @StateObject private var authManager = AuthenticationManager()
    @StateObject private var jobManager = JobManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(jobManager)
        }
    }
}
