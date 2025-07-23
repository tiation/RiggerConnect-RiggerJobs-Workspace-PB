import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var dashboardManager: DashboardManager
    @EnvironmentObject var jobManager: JobPostingManager
    @State private var selectedTab = 0
    @State private var isAuthenticated = true // For demo purposes
    
    var body: some View {
        Group {
            if isAuthenticated {
                mainTabView
            } else {
                loginView
            }
        }
        .onAppear {
            loadInitialData()
        }
    }
    
    private var loginView: some View {
        VStack(spacing: 20) {
            Text("RiggerJobs")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.cyan)
            
            Text("Employer Platform")
                .font(.title2)
                .foregroundColor(.gray)
            
            Button("Login") {
                isAuthenticated = true
            }
            .padding()
            .background(Color.cyan)
            .foregroundColor(.black)
            .cornerRadius(10)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black.ignoresSafeArea())
    }
    
    private var mainTabView: some View {
        TabView(selection: $selectedTab) {
            dashboardView
                .tabItem {
                    Image(systemName: "chart.line.uptrend.xyaxis.circle.fill")
                    Text("Dashboard")
                }
                .tag(0)
            
            jobsView
                .tabItem {
                    Image(systemName: "briefcase.circle.fill")
                    Text("Jobs")
                }
                .tag(1)
            
            workersView
                .tabItem {
                    Image(systemName: "person.3.sequence.fill")
                    Text("Workers")
                }
                .tag(2)
            
            analyticsView
                .tabItem {
                    Image(systemName: "chart.bar.fill")
                    Text("Analytics")
                }
                .tag(3)
            
            settingsView
                .tabItem {
                    Image(systemName: "gearshape.circle.fill")
                    Text("Settings")
                }
                .tag(4)
        }
        .accentColor(.cyan)
        .background(Color.black.ignoresSafeArea())
    }
    
    private var dashboardView: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Dashboard")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Active Jobs: 12")
                    .foregroundColor(.white)
                
                Text("Worker Pool: 45")
                    .foregroundColor(.white)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var jobsView: some View {
        NavigationView {
            VStack {
                Text("Job Management")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Manage your job postings")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var workersView: some View {
        NavigationView {
            VStack {
                Text("Worker Management")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("Manage your worker pool")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var analyticsView: some View {
        NavigationView {
            VStack {
                Text("Analytics")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("View business analytics")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private var settingsView: some View {
        NavigationView {
            VStack {
                Text("Settings")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.cyan)
                
                Text("App settings and preferences")
                    .foregroundColor(.gray)
                
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black.ignoresSafeArea())
        }
    }
    
    private func loadInitialData() {
        // Load initial data for employer dashboard
        print("Loading initial data...")
    }
}

// MARK: - Preview
#Preview {
    ContentView()
        .environmentObject(AuthenticationManager())
        .environmentObject(DashboardManager())
        .environmentObject(JobPostingManager())
        .preferredColorScheme(.dark)
}
