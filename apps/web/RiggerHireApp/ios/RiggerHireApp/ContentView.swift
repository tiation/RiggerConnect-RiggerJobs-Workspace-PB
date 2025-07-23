import SwiftUI

// Import required views
import Foundation


struct ContentView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var selectedTab = 0
    @State private var showOnboarding = false
    
    var body: some View {
        Group {
            if authManager.isAuthenticated {
                TabView(selection: $selectedTab) {
                    JobsListView()
                        .tabItem {
                            Image(systemName: "magnifyingglass")
                            Text("Find Jobs")
                        }
                        .tag(0)
                    
                    MyJobsView()
                        .tabItem {
                            Image(systemName: "doc.text")
                            Text("Applications")
                        }
                        .tag(1)
                    
                    PaymentsView()
                        .tabItem {
                            Image(systemName: "dollarsign.circle")
                            Text("Earnings")
                        }
                        .tag(2)
                    
                    Text("Notifications")
                        .tabItem {
                            Image(systemName: "bell")
                            Text("Notifications")
                        }
                        .tag(3)
                    
                    ProfileView()
                        .tabItem {
                            Image(systemName: "person.circle")
                            Text("Profile")
                        }
                        .tag(4)
                }
                .accentColor(themeManager.primaryColor)
                .background(themeManager.backgroundColor)
                .onAppear {
                    // Show onboarding for first-time users
                    if authManager.isFirstTimeUser {
                        showOnboarding = true
                    }
                }
            } else {
                LoginView()
            }
        }
        .background(
            LinearGradient(
                colors: [themeManager.backgroundColor, themeManager.secondaryColor],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
        )
        .fullScreenCover(isPresented: $showOnboarding) {
            Text("Welcome to RiggerHire!")
                .font(.largeTitle)
                .foregroundColor(themeManager.primaryTextColor)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AuthenticationManager())
            .environmentObject(ThemeManager())
    }
}
